const Recipe = require("../models/Recipe");
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment")
const { ObjectId } = require("mongodb")

// async function getAllRecipes(req, res) {
//   const Recipes = await Recipe.find().sort({ "created_at" : 1 })
//   const token = generateToken(req.user_id);
//   res.status(200).json({ Recipes: Recipes, token: token})
// }


async function getRecipesWithUserDetails(req, res) {
  const RecipesWithDetails = await Recipe.find().populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).sort({ "created_at": -1 })

  const token = generateToken(req.user_id);
  res.status(200).json({ Recipes: RecipesWithDetails, token: token })
}

async function getUserRecipes(req, res){
  const Recipes = await Recipe.find({user: req.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'likes', select: "user_id"
  }).sort({ "created_at": -1 })
  console.log(Recipes)
  const token = generateToken(req.user_id);
  res.status(200).json({ Recipes: Recipes, token: token})
}
async function getUserRecipesById(req, res) {
  const Recipes = await Recipe.find({user: req.body.user_id}).populate({
    path: "user",
    select: "username profilePictureURL"
  }).populate({
    path: 'comments',
    populate: { path: 'user', select: "user profilePictureURL" },
  }).populate({
    path: 'likes', select: "user_id"
  }).sort({ "created_at": -1 })
  const token = generateToken(req.user_id);
  res.status(200).json({ Recipes: Recipes, token: token})
}

async function createRecipe(req, res) {
  const Recipe = new Recipe({
    message: req.body.message,
    pictureURL: req.body.pictureURL,
    user: req.user_id
  });
  Recipe.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ Recipe, token: newToken });
}

async function addCommentToRecipe(comment, Recipe_id) {
  const Recipe = await Recipe.findOneAndUpdate(
    { _id: Recipe_id },
    { $addToSet: { comments: comment } },
    { new: true }
  )
}


async function toggleLikes(req, res) {
  const user_id = req.user_id
  const Recipe_id = req.body.Recipe_id
  console.log("toggle_likes_user_id: ", user_id)
  console.log("togg_like_Recipe_id: ", Recipe_id)
  const resMessage = await addLikeToRecipe(user_id, Recipe_id)

  const newToken = generateToken(req.user_id);
  res.status(201).json({ resMessage, token: newToken });
}

async function addLikeToRecipe(user_id, Recipe_id) {
  const Recipe = await Recipe.findById(Recipe_id);
  if (!Recipe) return { error: "Recipe does not exist" };

  if (!user_id) return { error: "No userId Provided"}
  const userIdStr = user_id.toString();
  
  const hasLiked = Recipe.likes.includes(userIdStr)
  
  if (hasLiked) {
    Recipe.likes = Recipe.likes.filter(like => like.toString() !== userIdStr);
    await Recipe.save();
    return `${Recipe_id} unliked`;
  } else {
    Recipe.likes.push(user_id);
    await Recipe.save();
    return `${Recipe_id} liked`;
  }
}

const RecipesController = {
  // getAllRecipes: getAllRecipes,
  getRecipesWithUserDetails: getRecipesWithUserDetails,
  createRecipe: createRecipe,
  addCommentToRecipe: addCommentToRecipe,
  getUserRecipes: getUserRecipes,
  toggleLikes: toggleLikes,
  getUserRecipesById: getUserRecipesById
};

module.exports = RecipesController;