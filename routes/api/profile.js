const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

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
      // Populate the name and avatar fields
      .populate('user', ['name, avatar'])
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
// @access  Public
router.get('/all', (req, res) => {
  // Create an errors object to contain any errors.
  const errors = {};
  // Use the find method to get all users
  Profile.find()
    .populate('user', ['name', 'avatar'])
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
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  // Search the database for the user by their handle
  Profile.findOne({ handle: req.params.handle })
    // Populate the fields
    .populate('user', ['name, avatar'])
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
    // Populate the user's name and avatar with the right information
    .populate('user', ['name, avatar'])
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
    if (req.body.handle) profileFields.handle = req.body.handle;
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

module.exports = router;
