const express = require("express");
const router = express.Router();

const SignUp = require("../controllers/users");


router.post("/", SignUp.create);

module.exports = router