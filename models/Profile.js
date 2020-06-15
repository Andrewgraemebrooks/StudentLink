// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  // References the user id
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  // The handle for the user (a username)
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  // Which university they go to
  university: {
    type: String,
    required: true,
    max: 100,
  },
  // Which groups they belong to
  groups: {
    type: [String],
  },
  // Which friends they have
  friends: {
    type: [String],
  },
  // There bio
  bio: {
    type: String,
    required: true,
    max: 300,
  },
  // The date that their account was created
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export the profile model
module.exports = Profile = mongoose.model('profile', ProfileSchema);
