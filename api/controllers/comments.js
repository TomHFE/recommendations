const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");
const User = require("../models/user");
const { addCommentToPost } = require("./posts");

async function getCommentsWithUserDetails(req, res) {
  const commentsWithDetails = await Comment.find().populate({path: "user", select: "username profilePictureURL"}).sort({ "created_at" : -1})
  const token = generateToken(req.user_id);
  res.status(200).json({ comments: commentsWithDetails, token: token})
}

async function createComment(req, res) {
  const post_id = req.body.post_id
  const comment = new Comment({
    message: req.body.message,
    user: req.user_id,
    post_id: post_id
  });
  console.log("create comment: ", comment)
  comment.save();
  addCommentToPost(comment, post_id)
  const newToken = generateToken(req.user_id);
  res.status(201).json({ comment, token: newToken });
}


const CommentsController = {
  // getAllPosts: getAllPosts,
  // getCommentsWithUserDetails: getCommentsWithUserDetails,
  createComment: createComment,
};

module.exports = CommentsController;
