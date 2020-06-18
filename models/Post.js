// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  // Group ID
  group: {
    type: String,
  },
  // User ID
  user: {
    type: String,
  },
  // Text of the post
  text: {
    type: String,
    required: true,
  },
  // Name of user
  name: {
    type: String,
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
      // User id
      user: {
        type: String,
      },
      // Text of the comment
      text: {
        type: String,
        required: true,
      },
      // Name of commenter (seperate so that if the account is deleted, the comment remains)
      name: {
        type: String,
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
module.exports = Post = mongoose.model('post', PostSchema);
