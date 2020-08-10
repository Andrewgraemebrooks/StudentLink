const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('validator');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateUpdateInput = require('../../validation/update-profile');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works' }));

// @route   POST api/profile
// @desc    Create user's profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check if there were any validation errors
    const { errors, noErrors } = validateProfileInput(req.body);

    // If there were errors, return the errors in a json object with a bad request status code
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Get the user's data from the request
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) {
      // Trim all whitespace from the both ends of the input
      profileFields.handle = validator.trim(req.body.handle);
    }
    if (req.body.university) profileFields.university = req.body.university;
    // Split the groups into an array
    if (typeof req.body.groups !== 'undefined') {
      profileFields.groups = req.body.groups.split(',');
    }
    if (req.body.bio) profileFields.bio = req.body.bio;

    // Find the profile
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // If the profile already exists, then update it
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
        // If the profile doesn't exist, then create it.
      } else {
        // Check to see if handle exists so that two profiles don't have the same handle
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get(
  '/',
  // Authenticate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Create an errors object to store the errors
    const errors = {};
    // Find the user's profile
    Profile.findOne({ user: req.user.id })
      // Populate the name field
      .populate('user', ['name'])
      .then((profile) => {
        // Return an error if the profile was not found
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        // Return the profile
        res.json(profile);
      })
      // Return any errors
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Create an errors object to store errors
    const errors = {};
    // Find the profile
    Profile.find()
      .populate('user', ['name'])
      .then((profiles) => {
        // Return an error if no profiles have been created
        if (!profiles) {
          errors.noprofile = 'There are no profiles';
          return res.status(404).json(errors);
        }
        // Return the profiles
        res.json(profiles);
      })
      // Return any errors
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  // Find the profile using the handle
  Profile.findOne({ handle: req.params.handle })
    // Populate the fields
    .populate('user', ['name'])
    .then((profile) => {
      // Return an error if there aren't any profiles for that handle
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      // Return the profile
      res.json(profile);
    })
    // Return any errors
    .catch((err) => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    D elete profile
// @access  Private
router.delete(
  '/',
  // Authenticate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find the profile and remove it.
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      // Find the user and remove it.
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        // Return a success message.
        res.json({ success: true })
      );
    });
  }
);

// @route   POST api/profile/update
// @desc    Updates current user
// @access  Private
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check if there were any validation errors
    const { errors, noErrors } = validateUpdateInput(req.body);

    // If there were errors, return the errors in a json object with a bad request status code
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Object to contain the new information
    const updatedFields = {};

    // Check to see if handle exists so that two profiles don't have the same handle
    if (req.body.handle) {
      Profile.findOne({ handle: req.body.handle }).then((profile) => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }
      });

      // Add the handle to the updated fields object
      updatedFields.handle = validator.trim(req.body.handle);
    }
    // Add the new university and bio information, if inputted.
    if (req.body.university) updatedFields.university = req.body.university;
    if (req.body.bio) updatedFields.bio = req.body.bio;

    // Update the profile
    Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updatedFields },
      { new: true }
    ).then((profile) => res.json(profile));
  }
);

// @route   POST api/profile/friends/add/:handle
// @desc    Add user as friends
// @access  Private
router.post(
  '/friends/add/:handle',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Need to validate that the friend exists
    Profile.findOne({ handle: req.params.handle })
      .then((profile) => {
        // If no profile is found then the user does not exist, return an error
        if (!profile) {
          res.status(404).json({ usernotfound: 'That user does not exist' });
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));

    // Find the current user's profile
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Verify that the user isn't already friends with the user
        if (profile.friends.includes(req.params.handle)) {
          res
            .status(400)
            .json({ alreadyfriends: 'You are already friends with this user' });
        } else {
          // Add user to friends list
          profile.friends.addToSet(req.params.handle);
          // Save profile
          profile.save();
          // Return updated profile
          res.status(200).json(profile);
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));
  }
);

// @route   POST api/profile/friends/remove/:handle
// @desc    Remove user from friends list
// @access  Private
router.post(
  '/friends/remove/:handle',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Need to validate that the friend exists
    Profile.findOne({ handle: req.params.handle })
      .then((profile) => {
        // If no profile is found then the user does not exist, return an error
        if (!profile) {
          res.status(404).json({ usernotfound: 'That user does not exist' });
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));

    // Find the current user's profile
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Verify that the user is friends with the user
        if (!profile.friends.includes(req.params.handle)) {
          res
            .status(400)
            .json({ arenotfriends: "You aren't friends with this user" });
        } else {
          // Remove friend from friends list
          profile.friends.splice(req.params.handle);
          // Save profile
          profile.save();
          // Return updated profile
          res.status(200).json(profile);
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));
  }
);
// @route   GET api/profile/friends/all
// @desc    Display all friends of current user
// @access  Private
router.get(
  '/friends/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        res.status(200).json(profile.friends);
      })
      .catch((err) => res.json({ profilenotfound: err }));
  }
);

module.exports = router;
