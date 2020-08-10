const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import post and profile models
const TextPost = require('../../models/TextPost');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/textposts');
const validateUpdateInput = require('../../validation/update-posts');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'text posts Route Works' }));

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/:handle',
  // Validate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Check if there were any validation errors
    const { errors, noErrors } = validatePostInput(req.body);

    // If there were errors, return the errors in a json object with a bad request status code
    if (!noErrors) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Create a new post object with the inputted information
        const newTextPost = new TextPost({
          text: req.body.text,
          user: profile.handle,
          group: req.params.handle,
        });

        // Save the new post
        newTextPost
          .save()
          .then(res.status(200).json(newTextPost))
          // If there was an error saving the text post, return the error in a json object with a bad request status code.
          .catch((err) =>
            res.status(400).json({
              saveTextPostError: `There was an error saving the text post: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findProfileError: `There was an error finding the profile: ${err}`,
        })
      );
  }
);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  // Get a specific post by its idea
  TextPost.findById(req.params.id)
    .then((post) => res.json(post))
    // If there was an error finding the text post, return the error in a json object with a not found status code.
    .catch((err) =>
      res.status(404).json({
        findTextPostError: `There was an error finding the text post: ${err}`,
      })
    );
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find the post by its id
    TextPost.findById(req.params.id)
      // Check if the post is owned by the user. If not, return an error
      .then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorised: 'User is not authorised' });
        }
        // Delete the posts and return a success message
        post
          .remove()
          .then(() => res.json({ success: true }))
          // If there was an error removing the text post, return the error in a json object with a bad request status code.
          .catch((err) =>
            res.status(400).json({
              removeTextPostError: `There was an error removing the text post: ${err}`,
            })
          );
      })
      // If there was an error finding the text post, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findTextPostError: `There was an error finding the text post: ${err}`,
        })
      );
  }
);

// @route   POST api/posts/like/:id
// @desc    Like TextPost
// @access  Private
router.post(
  '/like/:id',
  // Authenticate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find user's profile to get his/her handle
    Profile.findOne({ user: req.user.id }).then((profile) => {
      // Find the post
      TextPost.findOne({ _id: req.params.id })
        .then((post) => {
          // Check if the user has already liked it
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }
          // Add user to likes array
          post.likes.unshift({ user: profile.handle });
          // Save post
          post
            .save()
            .then((post) => res.json(post))
            // If there was an error saving the text post to the database, return the error in a json object with a bad request status code
            .catch((err) =>
              res.status(400).json({
                savingTextPostError: `There was an error saving the new text post: ${err}`,
              })
            );
        })
        // If there was an error finding the text post, return the error in a json object with a not found status code.
        .catch((err) =>
          res.status(404).json({
            findTextPostError: `There was an error finding the text post: ${err}`,
          })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike TextPost
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find the post
    TextPost.findOne({ _id: req.params.id })
      .then((post) => {
        // Check if the user has already liked it
        if (
          (post.likes.filter(
            (like) => like.user.toString() === req.user.id
          ).length = 0)
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User has not liked this post' });
        }
        // Remove user from likes array
        post.likes.splice({ user: req.user.id });
        // Save post
        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.json(err));
      })
      // If there was an error finding the text post, return the error in a json object with a not found status code.
      .catch((err) =>
        res.status(404).json({
          findTextPostError: `There was an error finding the text post: ${err}`,
        })
      );
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, noErrors } = validatePostInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!noErrors) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Find the post by its id
        TextPost.findById(req.params.id)
          .then((post) => {
            // Create a new comment object to hold all of the inputted data
            const newComment = {
              text: req.body.text,
              name: req.body.name,
              user: profile.handle,
            };

            // Add to comments array
            post.comments.unshift(newComment);

            // Save
            post
              .save()
              .then((post) => res.json(post))
              // If there was an error saving the text post to the database, return the error in a json object with a bad request status code
              .catch((err) =>
                res.status(400).json({
                  savingTextPostError: `There was an error saving the new text post: ${err}`,
                })
              );
          })
          // If there was an error finding the text post, return the error in a json object with a not found status code.
          .catch((err) =>
            res.status(404).json({
              findTextPostError: `There was an error finding the text post: ${err}`,
            })
          );
      })
      // If there was an error finding the profile, return the error in a json object with a not found status code
      .catch((err) =>
        res.status(404).json({
          findingProfileError: `There was an error finding the user's profile: ${err}`,
        })
      );
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    TextPost.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item.id_.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of the array
        post.comments.splice(removeIndex, 1);

        // Save
        post
          .save()
          .then((post) => res.json(post))
          // If there was an error saving the text post to the database, return the error in a json object with a bad request status code
          .catch((err) =>
            res.status(400).json({
              savingTextPostError: `There was an error saving the new text post: ${err}`,
            })
          );
      })
      // If there was an error finding the text post, return the error in a json object with a not found status code
      .catch((err) =>
        res.status(404).json({
          findingTextPostError: `There was an error finding the user's text post: ${err}`,
        })
      );
  }
);

// @route   POST api/posts/update
// @desc    Updates current user
// @access  Private
router.post(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, noErrors } = validateUpdateInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!noErrors) {
      return res.status(400).json(errors);
    }

    // Object to contain the new fields
    const updatedFields = {};

    if (req.body.text) updatedFields.text = req.body.text;

    // Update the posts's information
    TextPost.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true }
    )
      .then((post) => res.json(post))
      // If there was an error updating the TextPost, return the error in a json object with a not found status code
      .catch((err) =>
        res.status(404).json({
          updateTextPostError: `There was an error updating the TextPost: ${err}`,
        })
      );
  }
);

module.exports = router;
