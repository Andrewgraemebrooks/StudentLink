const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import post and profile models
const TextPost = require('../../models/TextPost');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/posts');
const validateUpdateInput = require('../../validation/update-posts');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/:handle',
  // Validate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validatePostInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      // Create a new post object with the inputted information
      const newTextPost = new TextPost({
        text: req.body.text,
        name: req.body.name,
        user: profile.handle,
        group: req.params.handle,
      });

      // Save the new post
      newTextPost
        .save()
        .then(res.status(200).json(newTextPost))
        .catch((err) => res.json(err));
    });
  }
);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  // Get a specific post by its idea
  TextPost.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: 'No posts found with that ID' })
    );
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Find a the profile that created the post
    Profile.findOne({ user: req.user.id }).then((profile) => {
      // Find the post by its id
      TextPost.findById(req.params.id)
        .then((post) => {
          // Check if the post is owned by the user. If not, return an error
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorised: 'User is not authorised' });
          }
          // Delete the posts and return a success message
          post.remove().then(() => res.json({ success: true }));
        })
        // Catch in case no posts are found with that id.
        .catch(
          res.status(404).json({ nopostfound: 'No posts found with that ID' })
        );
    });
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
            .catch((err) => res.json(err));
        })
        .catch((err) =>
          res.status(400).json({ error: `There was an error: ${err}` })
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
      .catch((err) =>
        res.status(400).json({ error: `There was an error: ${err}` })
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
    Profile.findOne({ user: req.user.id }).then((profile) => {
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
          post.save().then((post) => res.json(post));
        })
        // Catch any errors
        .catch((err) =>
          res.status(404).json({ postnotfound: 'No posts found' })
        );
    });
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validatePostInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }
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
        post.save().then((post) => res.json(post));
      })
      .catch(() => res.status(404).json({ postnotfound: 'No posts found' }));
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
    const { errors, isValid } = validateUpdateInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
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
    ).then((post) => res.json(post));
  }
);

module.exports = router;
