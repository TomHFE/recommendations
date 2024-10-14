const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();


router.post("/get_user_by_id", UsersController.getUserById);
router.post("/friend_request", UsersController.createFriendRequest);
router.post("/accept_friend_request", UsersController.acceptFriendRequest);
router.post("/decline_friend_request", UsersController.declineFriendRequest);
router.patch("/delete_friend", UsersController.deleteFriend);
router.get("/get_incoming_requests", UsersController.getIncomingRequest);
router.get("/get_friends_list", UsersController.getFriendsList);
router.get("/get_all_friends_data", UsersController.getAllFriendsData);








module.exports = router;
