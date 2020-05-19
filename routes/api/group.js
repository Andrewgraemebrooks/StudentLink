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

// @route   POST api/groups/create
// @desc    Create group
// @access  Private
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Get the errors object and the boolean value of whether the input is valid.
  const { errors, isValid } = validateGroupInput(req.body);

  // If the input is not valid: send a 400 status and return the error object.
  if (!isValid) {
    return res.status(400).json(errors);
  }

  
});

