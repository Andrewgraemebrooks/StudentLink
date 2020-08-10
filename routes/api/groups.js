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
const TextPost = require('../../models/TextPost');

// @route   GET api/groups/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Groups Route Works' }));

// @route   POST api/groups
// @desc    The user creates a group
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check if there were any validation errors
    const { errors, noErrors } = validateGroupInput(req.body);

    // If there were errors, return the errors in a json object with a bad request status code
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Create a new group object to contain all of the new information for the group
    const newGroup = new Group({
      name: req.body.name,
      handle: req.body.handle,
      description: req.body.description,
      user: req.user.id,
      members: [],
    });

    // Find the group's creator's profile and add their handle to the list of the group's members and moderators
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        newGroup.members.addToSet(profile.handle);
        newGroup.moderators.addToSet(profile.handle);
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the user's profile: ${err}`,
        })
      );

    Group.findOne({ handle: req.body.handle }).then((group) => {
      // If the handle was already taken by another group, return the error in a json object with a bad request status code
      if (group) {
        errors.handle = 'Handle taken by another group already exists';
        res.status(400).json(errors);
      } else {
        newGroup
          // Save group
          .save()
          // Return the group as a json object
          .then((group) => res.json(group))
          // If there was an error saving the group to the database, return the error in a json object with a bad request status code
          .catch((err) =>
            res.status(400).json({
              savingGroupError: `There was an error saving the new group: ${err}`,
            })
          );

        // Add group to user's list of groups
        Profile.findOne({ user: req.user.id }).then((profile) => {
          profile.groups.addToSet(newGroup.handle);
          profile.save().catch((err) =>
            // If there was an error adding the group's handle to the profile's list of joined groups, return the error in a json object with a bad request status code.
            res.status(400).json({
              addingGroupToProfileError: `There was an error adding the group's handle to the user's profile: ${err}`,
            })
          );
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
        Group.findOneAndRemove({ _id: group._id })
          .then(
            // Remove group from all users' profile
            // Find all profiles
            Profile.find()
              .then((profiles) => {
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
                      profile
                        .save()
                        .then(res.status(200).json({ success: true }))
                        // If there was an error saving the profile, return the error in a json object with a bad request status code.
                        .catch((err) =>
                          res.status(400).json({
                            savingProfileError: `There was an error saving the profile: ${err}`,
                          })
                        );
                    }
                  });
                });
              })
              // If there was an error finding all profiles, return the error in a json object with a not found status code.
              .catch((err) =>
                res.status(404).json({
                  findingAllProfilesError: `There was an error finding all profiles: ${err}`,
                })
              )
          )
          // If there was an error removing the group, return the error in a json object with a bad request status code.
          .catch((err) =>
            res.status(400).json({
              removingGroupError: `There was an error removing the group: ${err}`,
            })
          );
      })
      // If there was an error finding the group, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingGroupError: `There was an error finding the group: ${err}`,
        })
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
        // If the user has not joined any groups, return the error in a json object with a bad request status code.
        if (!groups) {
          errors.nogroups = 'This user has not joined any groups';
          return res.status(400).json(errors);
        }
        // Return the groups as a json object
        res.json(groups);
      })
      // If there was an error finding all groups, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingAllGroupsError: `There was an error finding all groups: ${err}`,
        })
      );
  }
);

// @route   POST api/groups/:handle/update
// @desc    Update the group's information
// @access  Private
router.post(
  '/:handle/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check if there were any validation errors
    const { errors, noErrors } = validateUpdateInput(req.body);

    // If there were errors, return the errors in a json object with a bad request status code
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Object to contain the new fields
    const updatedFields = {};

    if (req.body.handle) {
      // Clarification: req.params.handle = old handle; req.body.handle = new handle
      // Investigate whether the new handle is already taken.
      Group.findOne({ handle: req.body.handle })
        .then((group) => {
          // If a group is found then the handle is already taken, return the error in a json object with a bad request status code.
          if (group) {
            errors.handle = 'That handle is already taken';
            res.status(400).json(errors);
          }
        })
        // If there was an error finding all groups, return the error in a json object with a not found status code.
        .catch((err) =>
          res.status(404).json({
            findingAllGroupsError: `There was an error finding all groups: ${err}`,
          })
        );

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
        // If there was an error finding all profiles, return the error in a json object with a not found status code.
        .catch((err) =>
          res.status(404).json({
            findingAllProfilesError: `There was an error finding all profiles: ${err}`,
          })
        );
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
      // If there was an error updating the group's information, return the error in a json object with a bad request status code.
      .catch((err) =>
        res.status(400).json({
          updatingGroupError: `There was an error finding all groups: ${err}`,
        })
      );
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
            // If the user was already a member of the group, return the error in a json object with a not found status code.
            if (group.members.includes(profile.handle.toString())) {
              res.status(400).json({
                alreadymember: 'The user is already a member of the group',
              });
            } else {
              // Add user to group's member list
              group.members.addToSet(profile.handle);
              // Add group to user's group list
              profile.groups.addToSet(group.handle);
              // Save profile
              profile
                .save()
                // If there was an error saving the profile, return the error in a json object with a bad request status code.
                .catch((err) =>
                  res.status(400).json({
                    savingProfileError: `There was an error saving the profile: ${err}`,
                  })
                );
              // Save group
              group
                .save()
                // Return group as a json object
                .then((group) => res.json(group))
                // If there was an error saving the group, return the error in a json object with a bad request status code.
                .catch((err) =>
                  res.status(400).json({
                    savingGroupError: `There was an error saving the group: ${err}`,
                  })
                );
            }
          })
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
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
            // // If the user is not a member of the group, return the error in a json object with a not found status code.
            if (!group.members.includes(profile.handle.toString())) {
              res.status(400).json({
                notamember: 'The user is not a member of the group',
              });
            } else {
              // Remove user to group's member list
              group.members.splice(profile.handle);
              // Remove group to user's group list
              profile.groups.splice(group.handle);
              // Save profile
              profile
                .save()
                // If there was an error saving the profile, return the error in a json object with a bad request status code.
                .catch((err) =>
                  res.status(400).json({
                    savingProfileError: `There was an error saving the profile: ${err}`,
                  })
                );
              // Save group
              group
                .save()
                // Return group as a json object
                .then((group) => res.json(group))
                // If there was an error saving the group, return the error in a json object with a bad request status code.
                .catch((err) =>
                  res.status(400).json({
                    savingGroupError: `There was an error saving the group: ${err}`,
                  })
                );
            }
          })
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
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
    const { errors, noErrors } = validateMessageInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!noErrors) {
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
            group
              .save() // If there was an error saving the group, return the error in a json object with a bad request status code.
              .catch((err) =>
                res.status(400).json({
                  savingGroupError: `There was an error saving the group: ${err}`,
                })
              );
            res.status(200).json(group);
          })
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
      );
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
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
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
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
      );
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
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Find group to add new moderator to
        Group.findOne({ handle: req.params.handle })
          .then((group) => {
            // Current user must be in the moderators list to add someone new
            if (!group.moderators.includes(profile.handle.toString())) {
              res.status(400).json({
                notmoderator: 'You must be a moderator to add other moderators',
              });
            } else {
              // User to be added must be a real user
              Profile.findOne({ handle: req.body.handle })
                .then((newModerator) => {
                  // If user has been found then he is a real user
                  if (newModerator) {
                    // New moderator must be a member of the group
                    if (
                      !group.members.includes(newModerator.handle.toString())
                    ) {
                      res.status(400).json({
                        notmember:
                          'The new moderator must be a member of the group',
                      });
                    } else {
                      // New moderator must not already be a moderator
                      if (
                        group.moderators.includes(
                          newModerator.handle.toString()
                        )
                      ) {
                        return res.status(400).json({
                          newModeratorAlreadyModeratorError:
                            'The new moderator is already a moderator',
                        });
                      } else {
                        // Add moderator to the set of moderators
                        group.moderators.addToSet(req.body.handle);
                        group
                          .save()
                          .then(res.status(200).json(group))
                          // If there was an error saving the group, return the error in a json object with a bad request status code.
                          .catch((err) =>
                            res.status(400).json({
                              savingGroupError: `There was an error saving the group: ${err}`,
                            })
                          );
                      }
                    }
                  } else {
                    // If there was an error finding the new user's profile, return the error in a json object with a not found status code.
                    res.status(400).json({
                      findingProfileError: `There was an error finding the new user's profile: ${err}`,
                    });
                  }
                })
                // If there was an error finding the profile, return the error in a json object with a not found status code.
                .catch((err) =>
                  res.status(404).json({
                    findingProfileError: `There was an error finding the profile: ${err}`,
                  })
                );
            }
          })
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
      );
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
              // If the new user is already a member or is a moderator, return the error in a json object with a bad request status code.
              res.status(400).json({
                notAMemberOrModeratorError:
                  'The user is either not a member or is a moderator',
              });
            } else {
              // Make sure that current user is a moderator
              // If the current user is not a moderator, return the error in a json object with a bad request status code.
              if (!group.moderators.includes(profile.handle.toString())) {
                res.status(400).json({
                  currentUserNotModeratorError:
                    'The current user is not a moderator',
                });
              } else {
                // Remove user from the member's list
                group.members.splice(req.body.handle);
                group
                  .save()
                  .then(res.status(200).json(group))
                  // If there was an error saving the group, return the error in a json object with a bad request status code.
                  .catch((err) =>
                    res.status(400).json({
                      savingGroupError: `There was an error saving the group: ${err}`,
                    })
                  );
              }
            }
          })
          // If there was an error finding the group, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findingGroupError: `There was an error finding the group: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the profile: ${err}`,
        })
      );
  }
);

// @route   GET api/groups/posts/
// @desc    Gets all of the posts in the group
// @access  Private
router.get(
  '/:handle/posts',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find all the posts from that group
    TextPost.find({ group: req.params.handle })
      .sort({ date: -1 })
      .then((groups) => {
        // If there any posts, return them
        if (groups.length > 0) res.status(200).json(groups);
        // If there aren't any posts, return a useful error response
        else {
          // If there aren't any posts, return the error in a json object with a not found status code.
          res.status(404).json({
            noPosts: `This group has no posts`,
          });
        }
      })
      // If there was an error finding all the group's posts, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findingGroupPosts: `There was an error finding all the group's posts: ${err}`,
        })
      );
  }
);

module.exports = router;
