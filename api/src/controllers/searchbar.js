const Recipe = require("../models/recipe");
const User = require('../models/user')
const { generateToken } = require("../lib/token");
const Comment = require("../models/comment")
const { ObjectId } = require("mongodb")


// profile
async function findUsersAndRecipes(req, res){
    const search = req.body.searchparam
    //console.log(req.body.searchparam)
    const userExists = await User.exists({username: search})
    const recipeExists = await Recipe.exists({title: search})

    if (!recipeExists && !userExists) {
        res.status(404).json({ message: "search parameters do not exist on the site" });       
    }
    
    else if (userExists && recipeExists) {
        try {
            const recipes = await Recipe.find({title: search})
            const user = await User.find({username: search})
            const token = generateToken(req.user_id);
            res.status(200).json({ recipes: recipes, user: user, token: token})
        }
        catch (error) {
            //    console.log(error);
                res.status(500).json({ message: "Server error" });
              
        }
    }
    else if (!userExists) {
        try {
            const recipes = await Recipe.find({title: search})
            const token = generateToken(req.user_id);
            res.status(200).json({ recipes: recipes, user: 'false', token: token})
        }
        catch (error) {
              //  console.log(error);
                res.status(500).json({ message: "Server error" });
              
        }
    }
    else if (!recipeExists) {
        try {
            const user = await User.find({username: search})
            const token = generateToken(req.user_id);
            res.status(200).json({ recipes: 'false', user: user, token: token})
        }
        catch (error) {
            //    console.log(error);
                res.status(500).json({ message: "Server error" });       
        }
    }
   
}





  const SearchBarController = {
    findUsersAndRecipes: findUsersAndRecipes
  };
  
  module.exports = SearchBarController;