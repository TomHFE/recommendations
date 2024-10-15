const Recipe = require("../models/recipe");
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment")
const { ObjectId } = require("mongodb")
// async function getAllPosts(req, res) {
//   const posts = await Post.find().sort({ "created_at" : 1 })
//   const token = generateToken(req.user_id);
//   res.status(200).json({ posts: posts, token: token})
// }
// feed
async function getRecipesWithUserDetails(req, res) {
  const recipesWithDetails = await Recipe.find().populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "username profilePictureURL" },
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipesWithDetails, token: token })
}
// profile
async function getUserRecipes(req, res){
  const recipes = await Recipe.find({user: req.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "username profilePictureURL" },
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token})
}
// show somebody else's profile
async function getUserRecipesById(req, res) {
  const recipes = await Recipe.find({user: req.body.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "username profilePictureURL" },
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token})
}
// fill it in with tonnnnns of stuff
async function createRecipe(req, res) {
  // await web scrape find
  const recipe = new Recipe({
    user: req.user_id,
    title: req.body.title,
    image: req.body.image,
    summary: req.body.summary,
    instructions: req.body.instructions,
    SearchingParameters: [{
      nationalities: req.body.nationalities,
      dishType: req.body.dishType,
      preparationMinutes: req.body.preparationMinutes,
      cookingMinutes: req.body.cookingMinutes,
      servings: req.body.servings,
      Requirements: [{
        allergies: [{
          nuts: req.body.nuts,
          shellfish: req.body.shellfish,
          dairy: req.body.dairy,
          soy: req.body.soy,
          eggs: req.body.eggs
        },
      ],
      vegeterian: req.body.vegeterian,
      vegan: req.body.vegan,
      pescatarian: req.body.pescatarian,
      glutenFree: req.body.glutenFree,
      dairyFree: req.body.dairyFree,
      healthy: req.body.healthy,
      costFriendly: req.body.costFriendly,
      readyInMinutes: req.body.readyInMinutes
      },
    ],
    ingredients: req.body.ingredients,
    }],
  });
  recipe.save();
  const newToken = generateToken(req.user_id);
  res.status(201).json({ recipe: recipe, token: newToken });
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
  //console.log("toggle_likes_user_id: ", user_id)
  //console.log("togg_like_post_id: ", post_id)
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
  // getAllPosts: getAllPosts,
  getRecipesWithUserDetails: getRecipesWithUserDetails,
  createRecipe: createRecipe,
  addCommentToRecipe: addCommentToRecipe,
  getUserRecipes: getUserRecipes,
  toggleFavourites: toggleFavourites,
  getUserRecipesById: getUserRecipesById
};
module.exports = RecipesController;