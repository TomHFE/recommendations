const Recipe = require("../models/recipe");
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment")
const { ObjectId } = require("mongodb")

// async function getAllPosts(req, res) {
//   const posts = await Post.find().sort({ "created_at" : 1 })
//   const token = generateToken(req.user_id);
//   res.status(200).json({ posts: posts, token: token})
// }


async function getRecipeswithUserDetails(req, res) {
  const recipesWithDetails = await Recipe.find().populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'favourites', select: "user_id"
  }).sort({ "created_at": -1 })

  const token = generateToken(req.user_id);
  res.status(200).json({ posts: recipesWithDetails, token: token })
}

async function getUserRecipes(req, res){
  const recipes = await Recipe.find({user: req.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'favourites', select: "user_id"
  }).sort({ "created_at": -1 })
  console.log(recipes)
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token})
}
async function getUserRecipesById(req, res) {
  const recipes = await Recipe.find({user: req.body.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'favourites', select: "user_id"
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token})
}

async function createRecipe(req, res) {
  const recipe = new Recipe({
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    user: req.user_id
  });
  recipe.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ recipe, token: newToken });
}

async function addCommentToRecipe(comment, recipe_id) {
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipe_id },
    { $addToSet: { comments: comment } },
    { new: true }
  )
}


async function toggleFavourites(req, res) {
  const user_id = req.user_id
  const recipe_id = req.body.recipe_id
  console.log("toggle_likes_user_id: ", user_id)
  console.log("togg_like_post_id: ", recipe_id)
  const resMessage = await addFavouriteToRecipe(user_id, recipe_id)

  const newToken = generateToken(req.user_id);
  res.status(201).json({ resMessage, token: newToken });
}

async function addFavouriteToRecipe(user_id, recipe_id) {
  const recipe = await Recipe.findById(recipe_id);
  if (!recipe) return { error: "Recipe does not exist" };

  if (!user_id) return { error: "No userId Provided"}
  const userIdStr = user_id.toString();
  
  const hasFavourited = recipe.favourites.includes(userIdStr)
  
  if (hasFavourited) {
    recipe.favourites = recipe.favourites.filter(favourite => favourite.toString() !== userIdStr);
    await recipe.save();
    return `${recipe_id} unfavourited`;
  } else {
    recipe.favourites.push(user_id);
    await recipe.save();
    return `${recipe_id} favourited`;
  }
}

const RecipesController = {
  getRecipeswithUserDetails: getRecipeswithUserDetails,
  getUserRecipes: getUserRecipes,
  getUserRecipesById: getUserRecipesById,
  createRecipe: createRecipe,
  addCommentToRecipe: addCommentToRecipe,
  toggleFavourites: toggleFavourites,
  addFavouriteToRecipe: addFavouriteToRecipe
};

module.exports = RecipesController;