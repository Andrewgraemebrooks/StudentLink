// Bring in the mongoose module and the Schema class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({
  // User Id of the user who created the group
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  // Name of the group
  name: {
    type: String,
    required: true,
  },
  // The handle of the group
  handle: {
    type: String,
    required: true,
  },
  // Description of the group
  description: {
    type: String,
    required: true,
  },
});

// Export the group model.
module.exports = Group = mongoose.model('group', GroupSchema);
