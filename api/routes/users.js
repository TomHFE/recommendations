const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.post("/get_user_by_id", UsersController.getUserById);
router.post("/find_by_username", UsersController.findByUsername)
router.post("/friend_request", UsersController.createFriendRequest);
router.post("/accept_friend_request", UsersController.acceptFriendRequest);
router.post("/decline_friend_request", UsersController.declineFriendRequest);
router.patch("/delete_friend", UsersController.deleteFriend);
router.get("/get_incoming_requests", UsersController.getIncomingRequest);
router.get("/get_friends_list", UsersController.getFriendsList);
router.get("/get_all_friends_data", UsersController.getAllFriendsData);
router.post("/public_details_id", UsersController.getPublicDetailsById)
router.post("/public_details_username", UsersController.getPublicDetailsByUsername)








module.exports = router;
