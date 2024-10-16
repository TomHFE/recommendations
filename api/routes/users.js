const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getAllUsers);
router.post("/get_user_by_id", UsersController.getUserById);
router.post("/find_by_username", UsersController.findByUsername)
router.post("/public_details_id", UsersController.getPublicDetailsById)
router.post("/public_details_username", UsersController.getPublicDetailsByUsername)








module.exports = router;
