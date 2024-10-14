const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");


router.get("/", PostsController.getUserPosts);
router.post("/by_id", PostsController.getUserPostsById)


module.exports = router;