const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateGroupInput = require('../../validation/group.js');

// Load group model
const Group = require('../../models/Group');

// @route   GET api/groups/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Groups Works' }));

// @route   POST api/groups
// @desc    Create group
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
      }
    });
  }
);

module.exports = router;
