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
  try {
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
  catch (error) {
    res.status(401).json({ message: "error message: " + error.message });
  }
}
// show filtered recipes
async function getFilteredRecipes(req, res) {
  const filters = req.body;

  const query = {}; // Build query dynamically based on filters

  if (filters.nationality) {
    query['SearchingParameters.nationalities'] = { $in: [filters.nationality] };
  }
  if (filters.dishType) {
    query['SearchingParameters.dishType'] = { $in: [filters.dishType] };
  }
  if (filters.readyInMinutes) {
    query['SearchingParameters.readyInMinutes'] = { $lte: filters.readyInMinutes };
  }
  if (filters.preparationMinutes) {
    query['SearchingParameters.preparationMinutes'] = { $lte: filters.preparationMinutes };
  }
  if (filters.cookingMinutes) {
    query['SearchingParameters.cookingMinutes'] = { $lte: filters.cookingMinutes };
  }
  if (filters.costFriendly) {
    query['SearchingParameters.costFriendly'] = { $lte: filters.costFriendly };
  }
  if (filters.servings) {
    query['SearchingParameters.servings'] = { $lte: filters.servings };
  }
  if (filters.dairyFree !== undefined) {
    query['SearchingParameters.dairyFree'] = filters.dairyFree;
  }
  if (filters.nuts !== undefined) {
    query['SearchingParameters.nuts'] = filters.nuts;
  }
  if (filters.shellfish !== undefined) {
    query['SearchingParameters.shellfish'] = filters.shellfish;
  }
  if (filters.dairy !== undefined) {
    query['SearchingParameters.dairy'] = filters.dairy;
  }
  if (filters.soy !== undefined) {
    query['SearchingParameters.soy'] = filters.soy;
  }
  if (filters.eggs !== undefined) {
    query['SearchingParameters.eggs'] = filters.eggs;
  }
  if (filters.vegeterian !== undefined) {
    query['SearchingParameters.vegeterian'] = filters.vegeterian;
  }
  if (filters.vegan !== undefined) {
    query['SearchingParameters.vegan'] = filters.vegan;
  }
  if (filters.pescatarian !== undefined) {
    query['SearchingParameters.pescatarian'] = filters.pescatarian;
  }
  if (filters.dairyFree !== undefined) {
    query['SearchingParameters.dairyFree'] = filters.dairyFree;
  }
  if (filters.glutenFree !== undefined) {
    query['SearchingParameters.glutenFree'] = filters.glutenFree;
  }
  if (filters.healthy !== undefined) {
    query['SearchingParameters.healthy'] = filters.healthy;
  }
  if (filters.ingredients) {
    query['SearchingParameters.ingredients'] = { $in: [filters.ingredients] };
  }
  
  //console.log("this is the query log " + query)

  const filteredRecipes = await Recipe.find(query)
    .populate({
      path: "user",
      select: "username profilePictureURL",
    })
    .populate({
      path: "comments",
      populate: { path: "user", select: "username profilePictureURL" },
    })
    .sort({ created_at: -1 });
  const token = generateToken(req.user_id);
 // console.log("this is the filtered log " + filteredRecipes)
  res.status(200).json({ recipes: Array.isArray(filteredRecipes) ? filteredRecipes : [], token: token });
}

// profile
async function getUserRecipes(req, res) {
  const recipes = await Recipe.find({ user: req.user_id })
    .populate({
      path: "user",
      select: "username profilePictureURL",
    })
    .populate({
      path: "comments",
      populate: { path: "user", select: "username profilePictureURL" },
    })
    .sort({ created_at: -1 });
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token });
}

// show somebody else's profile
async function getUserRecipesById(req, res) {
  const recipes = await Recipe.find({ user: req.body.user_id })
    .populate({
      path: "user",
      select: "username profilePictureURL",
    })
    .populate({
      path: "comments",
      populate: { path: "user", select: "username profilePictureURL" },
    })
    .sort({ created_at: -1 });
  const token = generateToken(req.user_id);
  res.status(200).json({ recipes: recipes, token: token });
}

// fill it in with tonnnnns of stuff
async function createRecipe(req, res) {
  // await web scrape find
  const recipeList = req.body.recipeList;
  const SearchingParameters = req.body.recipeList.SearchingParameters;
  // const Requirements = req.body.recipeList.SearchingParameters.Requirements;
  try {
    const recipe = new Recipe({
      user: req.user_id,
      title: recipeList.title,
      image: recipeList.image,
      summary: recipeList.summary,
      instructions: recipeList.instructions,
      SearchingParameters: [
        {
          nationalities: SearchingParameters.nationalities,
          dishType: SearchingParameters.dishType,
          preparationMinutes: SearchingParameters.preparationMinutes,
          cookingMinutes: SearchingParameters.cookingMinutes,
          servings: SearchingParameters.servings,
          nuts: SearchingParameters.nuts,
          shellfish: SearchingParameters.shellfish,
          dairy: SearchingParameters.dairy,
          soy: SearchingParameters.soy,
          eggs: SearchingParameters.eggs,

          vegeterian: SearchingParameters.vegeterian,
          vegan: SearchingParameters.vegan,
          pescatarian: SearchingParameters.pescatarian,
          glutenFree: SearchingParameters.glutenFree,
          dairyFree: SearchingParameters.dairyFree,
          healthy: SearchingParameters.healthy,
          costFriendly: SearchingParameters.costFriendly,
          readyInMinutes: SearchingParameters.readyInMinutes,
        },
      ],
      ingredients: recipeList.ingredients,
    });
    recipe.save();
    const newToken = generateToken(req.user_id);
    res.status(201).json({ recipe: recipe, token: newToken });

  }
  catch (error) {
    res.status(404).json({ message: error.message});

  }
}

async function addCommentToRecipe(comment, recipe_id) {
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipe_id },
    { $addToSet: { comments: comment } },
    { new: true }
  );
}

async function toggleFavourites(req, res) {
  const user_id = req.user_id;
  const recipe_id = req.body.recipe_id;
  //console.log("toggle_likes_user_id: ", user_id)
  //console.log("togg_like_post_id: ", post_id)
  const resMessage = await addFavouriteToRecipe(user_id, recipe_id);
  const newToken = generateToken(req.user_id);
  res.status(201).json({ resMessage: resMessage, token: newToken });
}

async function addFavouriteToRecipe(user_id, recipe_id) {
  const recipe = await Recipe.findById(recipe_id);
  if (!recipe) return { error: "Recipe does not exist" };
  if (!user_id) return { error: "No userId Provided" };
  const userIdStr = user_id.toString();
  const hasFavourited = recipe.favourites.includes(userIdStr);
  if (hasFavourited) {
    recipe.favourites = recipe.favourites.filter(
      (favourite) => favourite.toString() !== userIdStr
    );
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
  getUserRecipesById: getUserRecipesById,
  getFilteredRecipes: getFilteredRecipes,
};

module.exports = RecipesController

