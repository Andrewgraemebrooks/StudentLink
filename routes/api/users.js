const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validator = require('validator');

// Load Input Validation
const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login');
const validateUpdateInput = require('../../validation/update-user');

// Load user model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Route Works' }));

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  // Get the errors object and the boolean value of whether the input is valid.
  const { errors, noErrors } = validateRegisterInput(req.body);

  // If the input is not valid: send a 400 status and return the error object.
  if (!noErrors) {
    return res.status(400).json(errors);
  }

  // Normalise email
  const email = validator.normalizeEmail(req.body.email, {
    all_lowercase: true,
  });

  // Find the user
  User.findOne({ email: email }).then((user) => {
    // Return an error if the email is already in use
    if (user) {
      res.status(400).json({ emailTakenError: `Email has already been taken` });
    } else {
      // New object to store the user's information
      const newUser = new User({
        name: req.body.name,
        // Normalise the email to all lowercase
        email: email,
        password: req.body.password,
      });

      // Generate an encrypted password for the user
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // Save new user
          newUser
            .save()
            // Return user
            .then((user) => res.json(user))
            // Return any errors
            .catch((err) => res.status(400).json(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  // Get the errors object and the boolean value of whether the input is valid.
  const { errors, noErrors } = validateLoginInput(req.body);

  // If the input is not valid: send a 400 status and return the error object.
  if (!noErrors) {
    return res.status(400).json(errors);
  }

  // Normalise email
  const email = validator.normalizeEmail(req.body.email, {
    all_lowercase: true,
  });
  const password = req.body.password;

  // Find user
  User.findOne({ email }).then((user) => {
    // Return an error if the email is not found
    if (!user) {
      errors.email = 'User Not Found';
      return res.status(404).json(errors);
    }

    // Compare passwords
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // If the password is correct, create the JWT payload for authentication.
        const payload = { id: user.id, name: user.name };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: '1 day' },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        // Return error if password is incorrect
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Returns current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

// @route   POST api/users/update
// @desc    Updates current user
// @access  Private
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, noErrors } = validateUpdateInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Normalise email
    const email = validator.normalizeEmail(req.body.email, {
      all_lowercase: true,
    });

    // Check if email is already taken
    User.findOne({ email: email }).then((user) => {
      if (user) {
        res
          .status(400)
          .json({ emailTakenError: `Email has already been taken` });
      } else {
        const updatedFields = {};
        if (req.body.name) updatedFields.name = req.body.name;
        if (req.body.email) {
          // Normalise email to all lowercase
          updatedFields.email = validator.normalizeEmail(req.body.email, {
            all_lowercase: true,
          });
        }

        if (req.body.password) {
          // Encrypt the new password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              updatedFields.password = hash;
              // Update the user
              User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: updatedFields },
                { new: true }
              ).then((user) => res.json(user));
            });
          });
        } else {
          // Update the user if a password was not included
          User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: updatedFields },
            { new: true }
          ).then((user) => res.json(user));
        }
      }
    });
  }
);

module.exports = router;
