const express = require("express");
const router = express.Router();

const SearchBarController = require("../controllers/searchbar");


router.post("/", SearchBarController.findUsersAndRecipes);

module.exports = router