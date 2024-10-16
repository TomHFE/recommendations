const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();


router.post("/get_user_by_id", UsersController.getUserById);









module.exports = router;
