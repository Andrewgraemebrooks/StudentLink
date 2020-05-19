const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login');

// Load user model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  // Get the errors object and the boolean value of whether the input is valid.
  const { errors, isValid } = validateRegisterInput(req.body);

  // If the input is not valid: send a 400 status and return the error object.
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find the user using the user's email.
  User.findOne({ email: req.body.email }).then((user) => {
    // If the user's email has been found then that means the account already exists
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      // Grab their avatar from gravatar (default if not avaliable)
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      // Create a new user with the request's information
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // Hash the password and set the user's password to the new hashed password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // Save the new user to the document
          newUser
            .save()
            // Return the user as a json object
            .then((user) => res.json(user))
            // Catch any errors
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  // Get the errors object and the boolean value of whether the input is valid.
  const { errors, isValid } = validateLoginInput(req.body);

  // If the input is not valid: send a 400 status and return the error object.
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Create a const containing the email and password of the user.
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // If email is not found than the user does not exist
    if (!user) {
      errors.email = 'User Not Found';
      return res.status(404).json(errors);
    }

    // If the user is found then check the password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // The password is correct.
        // Create the JWT payload for authentication.
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        // Sign the token.
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
        // If password is incorrect, put the status as 400 and return the error.
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
  // Authenticate the user if it passes, return the id, name, and email of the current user.
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;