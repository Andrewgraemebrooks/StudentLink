// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TextPostSchema = new Schema({
  // Group Handle
  group: {
    type: String,
  },
  // User Handle
  user: {
    type: String,
  },
  // Text of the post
  text: {
    type: String,
    required: true,
  },
  // The likes of the user
  likes: [
    {
      // User Handle
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
module.exports = TextPost = mongoose.model('post', TextPostSchema);
