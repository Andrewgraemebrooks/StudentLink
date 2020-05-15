// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  // Name of the user
  name: {
    type: String,
    required: true,
  },
  // Email of the user
  email: {
    type: String,
    required: true,
  },
  // Password for the user
  password: {
    type: String,
    required: true,
  },
  // Avatar for the user
  avatar: {
    type: String,
  },
});

// Export the user model.
module.exports = User = mongoose.model('users', UserSchema);
