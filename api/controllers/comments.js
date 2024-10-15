const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");
const User = require("../models/user");
const { addCommentToRecipe } = require("./recipes");

async function getCommentsWithUserDetails(req, res) {
  const commentsWithDetails = await Comment.find().populate({path: "user", select: "username profilePictureURL"}).sort({ "created_at" : -1})
  const token = generateToken(req.user_id);
  res.status(200).json({ comments: commentsWithDetails, token: token})
};

async function createComment(req, res) {
  const recipe_id = req.body.recipe_id
  const comment = new Comment({
    message: req.body.message,
    image: req.body.image,
    user: req.body.user_id,
    recipe_id: req.body.recipe_id,
    rating: req.body.rating_id,
    created_at: req.body.created_at
  });
  console.log("create comment: ", comment)
  comment.save();
  addCommentToRecipe(comment, recipe_id)
  const newToken = generateToken(req.user_id);
  res.status(201).json({ comment, token: newToken });
};


const CommentsController = {
  // getAllPosts: getAllPosts,
  getCommentsWithUserDetails: getCommentsWithUserDetails,
  createComment: createComment,
};

module.exports = CommentsController;
