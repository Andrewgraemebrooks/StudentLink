const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('validator');

// Load Input Validation
const validateGroupInput = require('../../validation/groups.js');
const validateUpdateInput = require('../../validation/update-groups.js');
const validateMessageInput = require('../../validation/message.js');

// Load models
const Group = require('../../models/Group');
const Profile = require('../../models/Profile');

// @route   GET api/groups/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Groups Works' }));

// @route   POST api/groups
// @desc    The user creates a group
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validateGroupInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Create a new group object with the inputted information
    const newGroup = new Group({
      name: req.body.name,
      handle: req.body.handle,
      description: req.body.description,
      user: req.user.id,
      members: [],
    });

    // Find user's handle to add to the new group's member and moderators arrays
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        newGroup.members.addToSet(profile.handle);
        newGroup.moderators.addToSet(profile.handle);
      })
      .catch((err) => console.log(`Error: ${err}`));

    Group.findOne({ handle: req.body.handle }).then((group) => {
      // If the handle already exists that means the group already exists, return an error
      if (group) {
        errors.handle = 'Group already exists';
        res.status(400).json(errors);
      } else {
        newGroup
          // Save group
          .save()
          // Return the group as a json object
          .then((group) => res.json(group))
          // Catch any errors
          .catch((err) => console.log(err));

        // Add group to user's list of groups
        Profile.findOne({ user: req.user.id }).then((profile) => {
          profile.groups.addToSet(newGroup.handle);
          profile.save().catch((err) => console.log(`Error: ${err}`));
        });
      }
    });
  }
);

// @route   DELETE api/groups/:handle
// @desc    The user deletes a group
// @access  Private
router.delete(
  '/:handle',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find the group
    Group.findOne({ handle: req.params.handle })
      .then((group) => {
        // Delete the group
        Group.findOneAndRemove({ _id: group._id }).then(
          // Remove group from all users' profile
          // Find all profiles
          Profile.find().then((profiles) => {
            // Loop through each profile
            profiles.forEach((profile) => {
              // Loop through each group
              profile.groups.forEach((group) => {
                // If the group is found then remove it
                if (group === req.params.handle) {
                  // Get the index of the group to be deleted
                  const index = profile.groups.indexOf(group);
                  // Remove the group from the profile
                  profile.groups.splice(index, 1);
                  // Save the modified profile and return a success response
                  profile.save().then(res.status(200).json({ success: true }));
                }
              });
            });
          })
        );
      })
      // Catch in case no posts are found with that id.
      .catch(() =>
        res
          .status(404)
          .json({ groupnotfound: 'No group found with that handle' })
      );
  }
);

// @route   GET api/groups/all
// @desc    Get all groups that the user has joined
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Create an errors object to contain any errors.
    const errors = {};
    // Use the find method to get all the groups
    Group.find()
      .then((groups) => {
        // If there aren't any groups, return an error
        if (!groups) {
          errors.nogroups = 'This user has not joined any groups';
          return res.status(404).json(errors);
        }
        // Return the groups as a json object
        res.json(groups);
      })
      // Catch any errors and return them.
      .catch((err) => res.status(404).json(err));
  }
);

// @route   POST api/groups/:handle/update
// @desc    Update the group's information
// @access  Private
router.post(
  '/:handle/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validateUpdateInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Object to contain the new fields
    const updatedFields = {};

    if (req.body.handle) {
      // Clarification: req.params.handle = old handle; req.body.handle = new handle
      // Investigate whether the new handle is already taken.
      Group.findOne({ handle: req.body.handle }).then((group) => {
        if (group) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }
      });

      // Add the handle to the updated fields object
      updatedFields.handle = validator.trim(req.body.handle);

      // Update the group name for all users that are members
      // Search all profiles
      Profile.find()
        .then((profiles) => {
          profiles.forEach((profile) => {
            if (profile.groups.includes(req.params.handle.toString())) {
              profile.groups.splice(req.params.handle);
              profile.groups.addToSet(updatedFields.handle);
              profile.save();
            }
          });
        })
        .catch((err) => res.json({ updateprofileserror: err }));
    }

    // Add the new name and description information, if inputted.
    if (req.body.university) updatedFields.university = req.body.university;
    if (req.body.bio) updatedFields.bio = req.body.bio;

    // Update the group's information
    Group.findOneAndUpdate(
      { handle: req.params.handle },
      { $set: updatedFields },
      { new: true }
    )
      .then((group) => res.json(group))
      .catch((err) => res.json({ updategrouperror: err }));
  }
);

// @route   POST api/groups/:handle/join
// @desc    Logged in user joins a group through the group's handle
// @access  Private
router.post(
  '/:handle/join',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Group.findOne({ handle: req.params.handle })
          .then((group) => {
            // Investigate whether the user is already a member.
            // If the user is, return an error
            if (group.members.includes(profile.handle.toString())) {
              res.json({
                alreadymember: 'The user is already a member of the group',
              });
            } else {
              // Add user to group's member list
              group.members.addToSet(profile.handle);
              // Add group to user's group list
              profile.groups.addToSet(group.handle);
              // Save profile
              profile.save();
              // Save group
              group
                .save()
                // Return group as a json object
                .then((group) => res.json(group))
                // Catch any errors
                .catch((err) => res.json(err));
            }
          })
          .catch(() =>
            // Return an error if the group is not found
            res.json({ nogroupfound: 'No group found with that handle' })
          );
      })
      .catch(() =>
        // Return an error if the profile is not found.
        res.json({ noprofilefound: 'No profile found with that id' })
      );
  }
);

// @route   POST api/groups/:handle/leave
// @desc    Logged in user leaves a group through the group's handle
// @access  Private
router.post(
  '/:handle/leave',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Group.findOne({ handle: req.params.handle })
          .then((group) => {
            // Investigate whether the user is already a member.
            // If the user isn't, return an error
            if (!group.members.includes(profile.handle.toString())) {
              res.json({
                notamember: 'The user is not a member of the group',
              });
            } else {
              // Remove user to group's member list
              group.members.splice(profile.handle);
              // Remove group to user's group list
              profile.groups.splice(group.handle);
              // Save profile
              profile.save();
              // Save group
              group
                .save()
                // Return group as a json object
                .then((group) => res.json(group))
                // Catch any errors
                .catch((err) => res.json(err));
            }
          })
          .catch(() =>
            // Return an error if the group is not found
            res.json({ nogroupfound: 'No group found with that handle' })
          );
      })
      .catch(() =>
        // Return an error if the profile is not found.
        res.json({ noprofilefound: 'No profile found with that id' })
      );
  }
);

// @route   POST api/groups/:handle/chat/
// @desc    Sends a messages to the group's chat
// @access  Private
router.post(
  '/:handle/chat',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validateMessageInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Format the message so that the user's handle is appended to the message
        const formattedMessage = `${profile.handle} : ${req.body.message}`;

        // Find the group and add the message to the group chat
        Group.findOne({ handle: req.params.handle })
          .then((group) => {
            // Make sure that the user is actually a member of the group
            if (!group.members.includes(profile.handle.toString())) {
              res.status(400).json({
                notamember: 'You need to be a member to participate in chat',
              });
            }
            group.chat.push(formattedMessage);
            group.save();
            res.status(200).json(group);
          })
          .catch((err) => res.json({ grouperror: err }));
      })
      .catch((err) => res.json({ profileerror: err }));
  }
);

// @route   GET api/groups/chat/
// @desc    Returns the group chat log
// @access  Private
router.get(
  '/:handle/chat',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find user's profile
    Profile.findOne({ user: req.user.id }).then((profile) => {
      // Find the group chat
      Group.findOne({ handle: req.params.handle })
        .then((group) => {
          // Make sure user is a member of the group
          if (!group.members.includes(profile.handle.toString())) {
            res.status(400).json({
              notamember: 'You need to be a member to view in chat',
            });
          } else {
            res.status(200).json(group.chat);
          }
        })
        .catch((err) => res.status(400).json({ grouperror: err }));
    });
  }
);

// @route   POST api/groups/:handle/moderator
// @desc    Add another user to the list of moderators
// @access  Private
router.post(
  '/:handle/moderators',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find current user's profile.
    Profile.findOne({ user: req.user.id }).then((profile) => {
      // Find group to add new moderator to
      Group.findOne({ handle: req.params.handle }).then((group) => {
        // Current user must be in the moderators list to add someone new
        if (!group.moderators.includes(profile.handle.toString())) {
          res.status(400).json({
            notmoderator: 'You must be a moderator to add other moderators',
          });
        } else {
          // User to be added must be a real user
          Profile.findOne({ handle: req.body.handle }).then((newModerator) => {
            // If user has been found then he is a real user
            if (newModerator) {
              // New moderator must be a member of the group
              if (!group.members.includes(newModerator.handle.toString())) {
                res.status(400).json({
                  notmember: 'The new moderator must be a member of the group',
                });
              } else {
                // New moderator must not already be a moderator
                if (group.moderators.includes(newModerator.handle.toString())) {
                  return res.status(400).json({
                    newmoderatoralreadyone:
                      'The new moderator is already a moderator',
                  });
                } else {
                  // Add moderator to the set of moderators
                  group.moderators.addToSet(req.body.handle);
                  group
                    .save()
                    .then(res.status(200).json(group))
                    .catch((err) => res.json({ newmoderatorerror: err }));
                }
              }
            } else {
              // New moderator could not be found as a new user.
              res.status(400).json({
                cannotfinduser: 'The user to be added cannot be found',
              });
            }
          });
        }
      });
    });
  }
);

// @route   POST api/groups/:handle/kick
// @desc    Kicks a user out of the group
// @access  Private
router.post(
  '/:handle/kick',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find current user's profile
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Find the soon to be kicked user's group
        Group.findOne({ handle: req.params.handle })
          .then((group) => {
            // Make sure user is member of group or not a moderator
            if (
              !group.members.includes(req.body.handle.toString()) ||
              group.moderators.includes(req.body.handle.toString())
            ) {
              res.status(400).json({
                memberormoderator:
                  'The user is either not a member or is a moderator',
              });
            } else {
              // Make sure that current user is a moderator
              if (!group.moderators.includes(profile.handle.toString())) {
                res.status(400).json({
                  currentusernotmod: 'The current user is not a moderator',
                });
              } else {
                // Remove user from the member's list
                group.members.splice(req.body.handle);
                group
                  .save()
                  .then(res.status(200).json(group))
                  .catch((err) =>
                    res.status(400).json({ groupresponseerror: err })
                  );
              }
            }
          })
          .catch((err) => res.status(400).json({ groupfindingerror: err }));
      })
      .catch((err) => res.status(400).json({ profilefindingerror: err }));
  }
);

module.exports = router;
