// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ImagePostSchema = new Schema({
  // Group Handle
  group: {
    type: String,
  },
  // User Handle
  user: {
    type: String,
  },
  // Image of the post
  image: {
    type: String,
    required: true,
  },
  // The likes of the user
  likes: [
    {
      // User id
      user: {
        type: String,
      },
    },
  ],
  comments: [
    {
      // User Handle
      user: {
        type: String,
      },
      // Text of the comment
      text: {
        type: String,
        required: true,
      },
      // Date of the comment
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Date of the post
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export the post model
module.exports = ImagePost = mongoose.model('post', ImagePostSchema);
