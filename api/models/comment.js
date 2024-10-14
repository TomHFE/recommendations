const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  post_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  }
})

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;