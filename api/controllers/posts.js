const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment")
const { ObjectId } = require("mongodb")

// async function getAllPosts(req, res) {
//   const posts = await Post.find().sort({ "created_at" : 1 })
//   const token = generateToken(req.user_id);
//   res.status(200).json({ posts: posts, token: token})
// }


async function getPostsWithUserDetails(req, res) {
  const postsWithDetails = await Post.find().populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'likes', select: "user_id"
  }).sort({ "created_at": -1 })

  const token = generateToken(req.user_id);
  res.status(200).json({ posts: postsWithDetails, token: token })
}

async function getUserPosts(req, res){
  const posts = await Post.find({user: req.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'likes', select: "user_id"
  }).sort({ "created_at": -1 })
  console.log(posts)
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token})
}
async function getUserPostsById(req, res) {
  const posts = await Post.find({user: req.body.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'likes', select: "user_id"
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token})
}

async function createPost(req, res) {
  const post = new Post({
    message: req.body.message,
    pictureURL: req.body.pictureURL,
    user: req.user_id
  });
  post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ post, token: newToken });
}

async function addCommentToPost(comment, post_id) {
  const post = await Post.findOneAndUpdate(
    { _id: post_id },
    { $addToSet: { comments: comment } },
    { new: true }
  )
}


async function toggleLikes(req, res) {
  const user_id = req.user_id
  const post_id = req.body.post_id
  console.log("toggle_likes_user_id: ", user_id)
  console.log("togg_like_post_id: ", post_id)
  const resMessage = await addLikeToPost(user_id, post_id)

  const newToken = generateToken(req.user_id);
  res.status(201).json({ resMessage, token: newToken });
}

async function addLikeToPost(user_id, post_id) {
  const post = await Post.findById(post_id);
  if (!post) return { error: "Post does not exist" };

  if (!user_id) return { error: "No userId Provided"}
  const userIdStr = user_id.toString();
  
  const hasLiked = post.likes.includes(userIdStr)
  
  if (hasLiked) {
    post.likes = post.likes.filter(like => like.toString() !== userIdStr);
    await post.save();
    return `${post_id} unliked`;
  } else {
    post.likes.push(user_id);
    await post.save();
    return `${post_id} liked`;
  }
}

const PostsController = {
  // getAllPosts: getAllPosts,
  getPostsWithUserDetails: getPostsWithUserDetails,
  createPost: createPost,
  addCommentToPost: addCommentToPost,
  getUserPosts: getUserPosts,
  toggleLikes: toggleLikes,
  getUserPostsById: getUserPostsById
};

module.exports = PostsController;