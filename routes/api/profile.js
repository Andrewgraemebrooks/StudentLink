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
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   POST api/profile
// @desc    Create user's profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validateProfileInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get the request data and put it into the profile fields object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) {
      // Trim all whitespace from the both ends of the input
      profileFields.handle = validator.trim(req.body.handle);
    }
    if (req.body.university) profileFields.university = req.body.university;
    // Groups - Split into an array
    if (typeof req.body.groups !== 'undefined') {
      profileFields.groups = req.body.groups.split(',');
    }
    if (req.body.bio) profileFields.bio = req.body.bio;

    // If the profile already exists, then updated it
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
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
  // Authenticate the user with a token.
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Create an errors object to contain any errors.
    const errors = {};
    // Find the user in the database by the user id
    Profile.findOne({ user: req.user.id })
      // Populate the name field
      .populate('user', ['name'])
      .then((profile) => {
        // If the profile is not found then there is no profile for that user
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        // If the profile is found, return it as a json object
        res.json(profile);
      })
      // Catch any errors and return them.
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
    // Create an errors object to contain any errors.
    const errors = {};
    // Use the find method to get all users
    Profile.find()
      .populate('user', ['name'])
      .then((profiles) => {
        // If there aren't any profiles, return an error
        if (!profiles) {
          errors.noprofile = 'There are no profiles';
          return res.status(404).json(errors);
        }
        // Return the profiles as a json object
        res.json(profiles);
      })
      // Catch any errors and return them.
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  // Search the database for the user by their handle
  Profile.findOne({ handle: req.params.handle })
    // Populate the fields
    .populate('user', ['name'])
    .then((profile) => {
      // If there is no profile found by that handle return an error
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      // Return the profile as a json object
      res.json(profile);
    })
    // Catch any errors and return them as a json object
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  // Search the database for the user by their id
  Profile.findOne({ user: req.params.user_id })
    // Populate the user's name with the right information
    .populate('user', ['name'])
    .then((profile) => {
      // If no profile is found then return an error
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      // Return the profile as a json object
      res.json(profile);
    })
    // Catch any errors and return them as a json object
    .catch((err) => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    delete profile
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
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validateUpdateInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Object to contain the new fields
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

    // Update the profile's information
    Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updatedFields },
      { new: true }
    ).then((profile) => res.json(profile));
  }
);

// We need three routes: Add friends, Delete friends, List all friends
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
          profile.save()
          // Return updated profile
          res.status(200).json(profile);
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));
  }
);

// @route   POST api/profile/friends/remove/:handle
// @desc    Add user as friends
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
            .json({ arenotfriends: 'You aren\'t friends with this user' });
        } else {
          // Remove friend from friends list
          profile.friends.splice(req.params.handle);
          // Save profile
          profile.save()
          // Return updated profile
          res.status(200).json(profile);
        }
      })
      .catch((err) => res.json({ errorsearchingprofiles: err }));
  }
);



module.exports = router;
