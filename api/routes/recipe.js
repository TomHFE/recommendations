const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");
const recipeController = require("../controllers/recipe");

// recipe things here
router.get(
  "/get_recipe_with_user_details",
  recipeController.getRecipesWithUserDetails
);
router.get("/get_user_recipes", recipeController.getUserRecipes);
router.get("/get_user_recipes_by_id", recipeController.getUserRecipesById);
router.post("/create_recipe", recipeController.createRecipe);
// router.patch("/add_comment", recipeController.addCommentToRecipe);
router.patch("/toggle_favourites", recipeController.toggleFavourites);

router.post("/filtered", recipeController.getFilteredRecipes);

router.patch("/comments", CommentsController.createComment);

module.exports = router;
