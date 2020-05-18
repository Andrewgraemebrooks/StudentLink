const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import post and profile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/posts');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  // Validate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get the errors object and the boolean value of whether the input is valid.
    const { errors, isValid } = validatePostInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Create a new post object with the inputted information
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    // Save the new post
    newPost.save().then();
  }
);

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  // Find all posts
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  // Get a specific post by its idea
  Post.findById(req.params.id)
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
      Post.findById(req.params.id)
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
// @desc    Like Post
// @access  Private
router.post(
  '/like/:id',
  // Authenticate the user
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
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

          // Add user id to the likes array
          posts.likes.unshift({ user: req.user.id });

          // Save the post
          post.save.then((post) => res.json(post));
        })
        // Catch any errors
        .catch(
          res.status(404).json({ nopostfound: 'No posts found with that ID' })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike Post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check if the user has already liked it
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Find the index of the like
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of the likes array
          posts.likes.splice(removeIndex, 1);

          // Save
          posts.save().then((post) => res.json(post));
        })
        // Catch any errors
        .catch(
          res.status(404).json({ nopostfound: 'No posts found with that ID' })
        );
    });
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
    const { errors, isValid } = validatePostInput(req.body);

    // If the input is not valid: send a 400 status and return the error object.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Find the post by its id
    Post.findById(req.params.id)
      .then((post) => {
        // Create a new comment object to hold all of the inputted data
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then((post) => res.json(post));
      })
      // Catch any errors
      .catch((err) => res.status(404).json({ postnotfound: 'No posts found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
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
      .catch((err) => res.status(404).json({ postnotfound: 'No posts found' }));
  }
);

module.exports = router;
