const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

//this is in routes/user.js - so is this file needed???

router.post("/get_user_by_id", UsersController.getUserById);

module.exports = router;
