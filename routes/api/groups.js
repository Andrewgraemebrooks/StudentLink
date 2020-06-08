const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Input Validation
const validateGroupInput = require('../../validation/groups.js');

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
    });

    Group.findOne({ handle: req.body.handle }).then((group) => {
      // If the handle already exists that means the group already exists, return an error
      if (group) {
        errors.handle = 'Group already exists';
        res.status(400).json(errors);
      } else {
        // Save group
        newGroup
          .save()
          // Return the group as a json object
          .then((group) => res.json(group))
          // Catch any errors
          .catch((err) => console.log(err));

        // Add group to user's list of groups
        Profile.findOne({ user: req.user.id }).then((profile) => {
          profile.groups.addToSet(newGroup.handle);
          profile.save().catch((err) => console.log(err));
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

module.exports = router;
