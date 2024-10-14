const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const CommentsController = require("../controllers/comments");


//router.get("/userposts", PostsController.getUserPosts);
// router.get("/", PostsController.getAllPosts);
router.get("/", PostsController.getPostsWithUserDetails);
router.post("/", PostsController.createPost);
router.post("/comments", CommentsController.createComment);
router.post("/likes", PostsController.toggleLikes);
// router.delete("/comments", PostsController.deleteComment);

module.exports = router;
