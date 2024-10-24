const Recipe = require("../models/recipe");
const User = require("../models/user");
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment");
const { ObjectId } = require("mongodb");
// async function getAllPosts(req, res) {
//   const posts = await Post.find().sort({ "created_at" : 1 })
//   const token = generateToken(req.user_id);
//   res.status(200).json({ posts: posts, token: token})
// }

// feed
async function getRecipesWithUserDetails(req, res) {
  try {
    const recipesWithDetails = await Recipe.find()
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
    res.status(200).json({ recipes: recipesWithDetails, token: token });
  } catch (error) {
    res.status(401).json({ message: "error message: " + error.message });
  }
}
// show filtered recipes
async function getFilteredRecipes(req, res) {
  const nutsIncluded = req.body.nuts === "on";
  const shellfishIncluded = req.body.shellfish === "on";
  const dairyIncluded = req.body.dairy === "on";
  const soyIncluded = req.body.soy === "on";
  const eggsIncluded = req.body.eggs === "on";
  const isVegan = req.body.vegan === "on";
  const isVegeterian = req.body.vegeterian === "on";
  const isPescatarian = req.body.pescatarian === "on";
  const isGlutenFree = req.body.glutenFree === "on";
  const isDairyFree = req.body.dairyFree === "on";
  const isHealthy = req.body.healthy === "on";
  const ingredients = req.body.ingredients;

  //console.log("Received ingredients: ", req.body.ingredients);

  try {
    const filteredRecipes = await Recipe.find({
      // "SearchingParameters.nationalities": req.body.nationality,
      // "SearchingParameters.preparationMinutes": req.body.preparationMinutes,

      // Spred syntax (...) allows you to conditionally add a filter to the query only if it's provided in the request
      ...(req.body.nationality && {
        "SearchingParameters.nationalities": {
          $regex: new RegExp(req.body.nationality, "i"),
        },
      }),
      ...(req.body.dishType && {
        "SearchingParameters.dishType": {
          $regex: new RegExp(req.body.dishType, "i"), // Case-insensitive matching for a single dish type
        },
      }),
      ...(req.body.preparationMinutes && {
        "SearchingParameters.preparationMinutes": {
          $lte: req.body.preparationMinutes,
        },
      }),
      ...(req.body.cookingMinutes && {
        "SearchingParameters.cookingMinutes": { $lte: req.body.cookingMinutes },
      }),
      ...(req.body.readyInMinutes && {
        "SearchingParameters.readyInMinutes": { $lte: req.body.readyInMinutes },
      }),
      ...(req.body.servings && {
        "SearchingParameters.servings": { $lte: req.body.servings },
      }),
      ...(req.body.costFriendly && {
        "SearchingParameters.costFriendly": { $lte: req.body.costFriendly },
      }),
      ...(nutsIncluded ? { "SearchingParameters.nuts": false } : {}),
      ...(shellfishIncluded ? { "SearchingParameters.nuts": false } : {}),
      ...(dairyIncluded ? { "SearchingParameters.dairy": false } : {}),
      ...(soyIncluded ? { "SearchingParameters.soy": false } : {}),
      ...(eggsIncluded ? { "SearchingParameters.dairy": false } : {}),
      ...(isVegan ? { "SearchingParameters.vegeterian": true } : {}),
      ...(isVegeterian ? { "SearchingParameters.vegeterian": true } : {}),
      ...(isPescatarian ? { "SearchingParameters.vegeterian": true } : {}),
      ...(isGlutenFree ? { "SearchingParameters.vegeterian": true } : {}),
      ...(isDairyFree ? { "SearchingParameters.vegeterian": true } : {}),
      ...(isHealthy ? { "SearchingParameters.vegeterian": true } : {}),
      ...(ingredients &&
        ingredients.length > 0 && {
          // "ingredients.name": { $in: ingredients },
          ingredients: {
            $elemMatch: {
              name: {
                $in: ingredients.map((ingredient) => ingredient.toLowerCase()),
              },
            },
          },
        }),
    })
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
    res.status(200).json({
      recipes: filteredRecipes,
      token: token,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  //  console.log(error.message);
  }
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
      SearchingParameters: {
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

      ingredients: recipeList.ingredients,
    });
    recipe.save();
    const newToken = generateToken(req.user_id);
    res.status(201).json({ recipe: recipe, token: newToken });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function addCommentToRecipe(comment, recipe_id) {
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipe_id },
    { $addToSet: { comments: comment } },
    { new: true }
  );
}

async function getUserFavourites(req, res) {
  const favourites = req.body.favourites
 // console.log(favourites)
  if (favourites) {
    try {
      const favouriteData = await Promise.all(favourites.map((favourite) => {
        if (favourite !== null) {
         return Recipe.find({_id: favourite})
        }
      }))
      const token = generateToken(req.user_id)
       res.status(201).json({ token: token, favourites: favouriteData });
    }
    catch (error){
      return res.status(404).json({ error: error.message });
    }
  }
  else {
    return res.status(500).json({ message: 'no favourites data found'});

  }
}



async function toggleFavourites(req, res) {
  const user_id = req.user_id;
  const recipe_id = req.body.recipe_id;

  try {
    const { updatedRecipe, updatedUser } = await addFavourite(user_id, recipe_id);

    const newToken = generateToken(req.user_id);

    res.status(201).json({ favourites: updatedRecipe.favourites, userFavourites: updatedUser.favourites, token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addFavourite(user_id, recipe_id) {
  if (!user_id || !recipe_id) throw new Error("Invalid user or recipe ID");

  const hasFavourited = await User.findOne({
    _id: user_id,
    favourites: { $in: [recipe_id] },
  });

  let updatedRecipe, updatedUser;

  if (hasFavourited) {
    // Remove from favourites
    await User.updateOne({ _id: user_id }, { $pull: { favourites: recipe_id } });
    await Recipe.updateOne({ _id: recipe_id }, { $pull: { favourites: user_id } });

    // Get updated objects
    updatedRecipe = await Recipe.findById(recipe_id);
    updatedUser = await User.findById(user_id);
  } else {
    // Add to favourites
    await User.updateOne({ _id: user_id }, { $push: { favourites: recipe_id } });
    await Recipe.updateOne({ _id: recipe_id }, { $push: { favourites: user_id } });

    // Get updated objects
    updatedRecipe = await Recipe.findById(recipe_id);
    updatedUser = await User.findById(user_id);
  }

  return { updatedRecipe, updatedUser };
}

// async function toggleFavourites(req, res) {
//   const user_id = req.user_id;
//   const recipe_id = req.body.recipe_id;
//   //console.log("toggle_likes_user_id: ", user_id)
  
//   try{
//     await addFavourite(user_id, recipe_id);

//     const recipe = await Recipe.findById({_id: recipe_id})
//     const user = await User.findById({_id: user_id})

//     const newToken = generateToken(req.user_id);
//     console.log('recipes', recipe.favourites)
//     console.log('user', user.favourites)

//     res.status(201).json({ favourites: recipe.favourites, token: newToken });
//   }
//   catch (error) {
//     res.status(500).json({ error: error.message});
//   }
// }
  // try {
  //   const user = await User.findById(user_id);
  //   if (!user) {
  //     return res.status(404).json({ error: "User not found" });
  //   }
  //   const hasFavourited = user.favourites.includes(recipe_id);
  //   if (hasFavourited) {
  //     user.favourites = user.favourites.filter(
  //       (favRecipeId) => favRecipeId.toString() !== recipe_id
  //     );
  //   } else {
  //     user.favourites.push(recipe_id);
  //   }
  //   await user.save();
  //   res.status(201).json({ resMessage: resMessage, token: newToken });
  // } catch (error) {
  // //  console.error("Cannot udate favourites:", error);
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
// }

// async function addFavourite(id1, id2) {
//   if (!id1) return { error: "id1 does not exist" };
//   if (!id2) return { error: "id2 does not exist" };
//   const hasFavourited = await User.findOne({
//     _id: id1,
//     favourites: { $in: [id2] } 
//   });
//   // console.log(hasFavourited)
  
//   if (hasFavourited) {
//     try{
//       await User.updateOne(
//         { _id: id1 }, 
//         { $pull: { favourites: id2 } }
//       );
//       await Recipe.updateOne(
//         { _id: id2 }, 
//         { $pull: { favourites: id1 } }
//       );
//       // const favouritesList = await Model.findById({_id: id1})
//       // return `${favouritesList.favourites} unfavourited`;
//     }
//     catch (error) {
//       return error.message
//     }
//   } else {
//     try{
//       await User.updateOne(
//         { _id: id1 }, 
//         { $push: { favourites: id2 } }
//       );
//       await Recipe.updateOne(
//         { _id: id2 }, 
//         { $push: { favourites: id1 } }
//       );
//       // const favouritesList = await Model.findById({_id: id1})
//       // return `${favouritesList.favourites} favourited`;
//     }
//     catch (error) {
//       return error.message
//     }
//   }
// }

const RecipesController = {
  getRecipesWithUserDetails: getRecipesWithUserDetails,
  createRecipe: createRecipe,
  addCommentToRecipe: addCommentToRecipe,
  getUserRecipes: getUserRecipes,
  toggleFavourites: toggleFavourites,
  getUserRecipesById: getUserRecipesById,
  getFilteredRecipes: getFilteredRecipes,
  getUserFavourites: getUserFavourites,
};

module.exports = RecipesController;
