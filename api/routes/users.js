const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.post("/get_user_by_id", UsersController.getUserById);
router.post("/find_by_username", UsersController.findByUsername);
router.post("/public_details_id", UsersController.getPublicDetailsById);
router.post(
  "/public_details_username",
  UsersController.getPublicDetailsByUsername
);
router.get("/get_following_list", UsersController.getFollowingList);
router.get("/get_follower_list", UsersController.getFollowerList);
router.patch("/toggle_following", UsersController.toggleFollowing);

module.exports = router;
