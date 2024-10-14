const express = require("express");
const router = express.Router();

const SignUp = require("../controllers/users");


//router.get("/userposts", PostsController.getUserPosts);
// router.get("/", PostsController.getAllPosts);
router.post("/", SignUp.create);

module.exports = router