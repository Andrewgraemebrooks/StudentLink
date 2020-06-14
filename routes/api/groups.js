const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('validator');

// Load Input Validation
const validateGroupInput = require('../../validation/groups.js');
const validateUpdateInput = require('../../validation/update-groups.js');

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

    // Find user's handle to add to the new group's member array
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        newGroup.members.addToSet(profile.handle);
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

// @route   POST api/groups/update
// @desc    Update the group's information
// @access  Private
router.post(
  '/update',
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

    // Check to see if handle exists so that two groups don't have the same handle
    if (req.body.handle) {
      Group.findOne({ handle: req.body.handle }).then((group) => {
        if (group) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }
      });

      // Add the handle to the updated fields object
      updatedFields.handle = validator.trim(req.body.handle);
    }

    // Add the new name and description information, if inputted.
    if (req.body.university) updatedFields.university = req.body.university;
    if (req.body.bio) updatedFields.bio = req.body.bio;

    // Update the group's information
    Group.findOneAndUpdate(
      { user: req.user.id },
      { $set: updatedFields },
      { new: true }
    ).then((profile) => res.json(profile));
  }
);

// @route   POST api/groups/join/:handle
// @desc    Logged in user joins a group through the group's handle
// @access  Private
router.post(
  '/join/:handle',
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
module.exports = router;
