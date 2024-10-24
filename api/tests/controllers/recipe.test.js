const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
const Recipe = require("../../src/models/recipe");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");
const mongoose = require('mongoose');
require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      user_id: userId,
      iat: Math.floor(Date.now() / 1000) - 5 * 60, // Backdate token by 5 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60, // Expire token in 10 minutes
    },
    secret
  );
}

let token;

describe("/recipes", () => {
  beforeAll(async () => {
    const user = new User({
      email: "recipe-test@test.com",
      password: "12345678",
      username: "recipeTester",
    });
    await user.save();
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Recipe.deleteMany({});
  });

  describe("POST /recipes/create_recipe", () => {
    test("creates a new recipe and responds with a 201", async () => {
      const recipeData = {
        title: "Vegan Pancakes",
        image: "http://example.com/pancake.jpg",
        summary: "Delicious and fluffy vegan pancakes",
        instructions: "Mix all ingredients and cook.",
        SearchingParameters: {
          nationalities: "American",
          dishType: ["breakfast"],
          preparationMinutes: 10,
          cookingMinutes: 15,
          servings: 4,
          vegan: true,
        },
        ingredients: [
          { name: "flour", quantity: 2, unit: "cups" },
          { name: "almond milk", quantity: 1, unit: "cup" },
        ],
      };

      const response = await request(app)
        .post("/recipes/create_recipe") 
        .set("Authorization", `Bearer ${token}`)
        .send({ recipeList: recipeData });

      expect(response.status).toBe(201);
      const recipes = await Recipe.find();
      expect(recipes.length).toBe(1);
      expect(recipes[0].title).toBe("Vegan Pancakes");
    });

    
    test("returns a new token after creating a recipe", async () => {
      const recipeData = {
        title: "Gluten-Free Pizza",
        image: "http://example.com/pizza.jpg",
        summary: "Crispy gluten-free pizza",
        instructions: "Bake the dough and add toppings.",
        SearchingParameters: {
          nationalities: "Italian",
          dishType: ["dinner"],
          preparationMinutes: 20,
          cookingMinutes: 25,
          servings: 2,
          glutenFree: true,
        },
        ingredients: [
          { name: "gluten-free flour", quantity: 2, unit: "cups" },
          { name: "tomato sauce", quantity: 1, unit: "cup" },
        ],
      };

      const response = await request(app)
        .post("/recipes/create_recipe") 
        .set("Authorization", `Bearer ${token}`)
        .send({ recipeList: recipeData });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token, secret);

      expect(newTokenDecoded.iat).toBeGreaterThan(oldTokenDecoded.iat);
    });

    test("returns error for missing title", async () => {
      const recipeData = {
    //no data
      };

      const response = await request(app)
        .post("/recipes/create_recipe") 
        .set("Authorization", `Bearer ${token}`)
        .send({ recipeList: recipeData });

      expect(response.status).toBe(404);
    });
  }); 
  });

  describe("GET /recipes/get_recipe_with_user_details", () => {
    test("returns recipe with user details", async () => {
      const user = new User({
        email: "recipe-detail@test.com",
        password: "12345678",
        username: "recipeDetailer",
      });
      await user.save();

      const recipe = new Recipe({
        user: user._id,
        title: "Chocolate Cake",
        summary: "Rich chocolate cake",
        instructions: "Mix and bake.",
        SearchingParameters: { nationalities: "French", dishType: ["dessert"] },
      });
      await recipe.save();

      const response = await request(app)
        .get("/recipes/get_recipe_with_user_details") 
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.recipes[0].user.username).toBe("recipeDetailer");
      expect(response.body.recipes[0].title).toBe("Chocolate Cake");
    });

    test("returns empty array when no recipes exist", async () => {
        await User.deleteMany({}); 
        await Recipe.deleteMany({});

      const response = await request(app)
        .get("/recipes/get_recipe_with_user_details")
        .set("Authorization", `Bearer ${token}`);
      const recipes = await Recipe.find();

      expect(response.status).toBe(200);
      expect(response.body.recipes).toEqual([]); 
      expect(recipes.length).toBe(0); 
    });
    

    test("returns error on database failure", async () => {
      const user = new User({
        email: "recipe-detail@test.com",
        password: "12345678",
        username: "recipeDetailer",
      });
      await user.save();
    
      const recipe = new Recipe({
        user: user._id,
        title: "Chocolate Cake", 
        summary: "Rich chocolate cake",
        instructions: "Mix and bake.",
        SearchingParameters: { nationalities: "French", dishType: ["dessert"] },
      });
      await recipe.save();
    
      // Mock the find method to throw an error
      jest.spyOn(Recipe, 'find').mockImplementationOnce(() => {
        throw new Error("Database failure");
      });
    
      const response = await request(app)
        .get("/recipes/get_recipe_with_user_details") 
        .set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(401); 
      expect(response.body.message).toContain("error message: Database failure");
    });

    test("returns 401 when trying to access recipe details without token", async () => {
      const response = await request(app)
        .get("/recipes/get_recipe_with_user_details");
      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /recipes/toggle_favourites", () => {
    let user, recipe, token;
  
    beforeAll(async () => {
      user = new User({
        email: "favourite-test@test.com",
        password: "12345678",
        username: "favouriteTester",
      });
      await user.save();

      token = generateToken(user._id);
      recipe = new Recipe({
        user: user._id,
        title: "Lemon Pie",
        summary: "Tangy lemon pie",
        instructions: "Bake with love.",
      });
      await recipe.save();
    });
  
    beforeEach(async () => {
      await User.updateOne({ _id: user._id }, { favourites: [] });
    });
    
    test("toggle to favourite a recipe", async () => {
      // add to favourites
      let response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      // check if recipe is in favourites
      const updatedUser = await User.findById(user._id);
      const favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).toContain(recipe._id.toString());
    });
    

    test("toggle twice to unfavourite a recipe", async () => {
      // add to favourites
      let response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      let updatedUser = await User.findById(user._id);
      let favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).toContain(recipe._id.toString());
    
      // Second toggle (remove from favourites)
      response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      // check if recipe is removed from favourites
      updatedUser = await User.findById(user._id);
      favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).not.toContain(recipe._id.toString());
    });


    test("returns 500 and error message when user is not found in toggleFavourites", async () => {
      // simulating a user not found
      jest.spyOn(User, "findById").mockImplementationOnce(() => null);
    
      const response = await request(app)
      .patch("/recipes/toggle_favourites")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipe_id: new mongoose.Types.ObjectId(), 
      });
    
      expect(response.status).toBe(500);
    });
    

    describe("POST /recipes/get_filtered_recipes", () => {
      let token, userId;
    
      beforeAll(async () => {
        const user = new User({
          email: "filtered-recipes@test.com",
          password: "12345678",
          username: "filterTester",
        });
        await user.save();
        userId = user._id; 
        token = generateToken(userId);
      });
    
      afterEach(async () => {
        await Recipe.deleteMany({});
        await User.deleteMany({});
        jest.restoreAllMocks(); // Reset all mocks after each test

      });
    
      test("returns filtered recipes based on search criteria", async () => {
        const recipe1 = {
          title: "Vegan Pancakes",
          image: "http://example.com/pancake.jpg",
          summary: "Delicious and fluffy vegan pancakes",
          instructions: "Mix all ingredients and cook.",
          SearchingParameters: {
            nationalities: "American",
            dishType: ["breakfast"],
            preparationMinutes: 10,
            cookingMinutes: 15,
            servings: 4,
            vegan: true,
          },
          ingredients: [
            { name: "flour", quantity: 2, unit: "cups" },
            { name: "almond milk", quantity: 1, unit: "cup" },
          ],
        };
    
        const recipe2 = {
          title: "Egg Pancakes",
          image: "http://example.com/pancake.jpg",
          summary: "Delicious pancakes with eggs",
          instructions: "Mix all ingredients and cook.",
          SearchingParameters: {
            nationalities: "American",
            dishType: ["breakfast"],
            preparationMinutes: 10,
            cookingMinutes: 15,
            servings: 4,
            vegan: false,
          },
          ingredients: [
            { name: "eggs", quantity: 2, unit: "pieces" },
            { name: "milk", quantity: 1, unit: "cup" },
          ],
        };
    
        await request(app)
          .post("/recipes/create_recipe")
          .set("Authorization", `Bearer ${token}`)
          .send({ recipeList: recipe1 });
    
        await request(app)
          .post("/recipes/create_recipe")
          .set("Authorization", `Bearer ${token}`)
          .send({ recipeList: recipe2 });
    
        const response = await request(app)
          .post("/recipes/filtered")
          .set("Authorization", `Bearer ${token}`)
          .send({
            vegan: true, 
            nationality: "American",
            ingredients: ["flour", "almond milk"],
          });
          
    
        expect(response.status).toBe(200);
        expect(response.body.recipes.length).toBe(1); // Only one vegan recipe should match
        expect(response.body.recipes[0].title).toBe("Vegan Pancakes");
      });
    });

    test("returns all recipes when no filters are provided", async () => {
      const user = new User({
        email: "user@example.com",
        password: "password123",
        username: "testUser",
      });
      await user.save();
    
      const recipe1 = new Recipe({
        user: user._id, 
        title: "Recipe 1",
        SearchingParameters: { vegan: false },
      });
      const recipe2 = new Recipe({
        user: user._id, 
        title: "Recipe 2",
        SearchingParameters: { vegan: true },
      });
      await recipe1.save();
      await recipe2.save();
    
      const response = await request(app)
        .post("/recipes/filtered")
        .set("Authorization", `Bearer ${token}`)
        .send({});
    
      expect(response.status).toBe(200);
      expect(response.body.recipes.length).toBe(2); // Should return all recipes
    });

    test("returns 401 and error message on database failure in getFilteredRecipes", async () => {
      // Mock the Recipe.find method to throw an error
      jest.spyOn(Recipe, "find").mockImplementationOnce(() => {
        throw new Error("Database query failed");
      });
    
      const response = await request(app)
        .post("/recipes/filtered")
        .set("Authorization", `Bearer ${token}`)
        .send({
          vegan: true,
          ingredients: ["flour", "sugar"]
        });
    
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Database query failed");
    });
    

    

    describe("PATCH /comments", () => {
      let token, userId, recipeId;
    
      beforeAll(async () => {
        const user = new User({
          email: "comment-test@test.com",
          password: "12345678",
          username: "commentTester",
        });
        await user.save();
        userId = user._id; 
        token = generateToken(userId);
    
        const recipe = new Recipe({
          user: userId,
          title: "Test Recipe",
          summary: "Summary of the test recipe",
          instructions: ["Step 1", "Step 2"],
          SearchingParameters: { nationalities: "American", dishType: ["dinner"] },
        });
        await recipe.save();
        recipeId = recipe._id;
      });
    
      afterEach(async () => {
        await Recipe.deleteMany({});
        await User.deleteMany({});
      });
    
      test("adds a comment to the recipe", async () => {
        const commentData = {
          recipe_id: recipeId,
          message: "This recipe is great!", 
        };
      
        const response = await request(app)
          .patch("/recipes/comments") 
          .set("Authorization", `Bearer ${token}`)
          .send(commentData);

        expect(response.status).toBe(201);
        expect(response.body.comment.message).toEqual("This recipe is great!");
        expect(response.body.comment.recipe_id).toBe(recipeId.toString()); 
      });
    
    
      describe("GET /recipes/get_user_recipes_by_id", () => {
        let userId, recipeId, otherUserId;
      
        beforeAll(async () => {
          const user = new User({
            email: "user-test@test.com",
            password: "12345678",
            username: "userTester",
          });
          await user.save();
          userId = user._id; 

          const otherUser = new User({
            email: "other-user@test.com",
            password: "12345678",
            username: "otherUserTester",
          });
          await otherUser.save();
          otherUserId = otherUser._id; 
      
          // Create a recipe for the first user
          const recipe = new Recipe({
            user: userId,
            title: "Pasta Primavera",
            summary: "Delicious pasta with vegetables",
            instructions: ["Boil water", "Add pasta", "Cook vegetables", "Combine"],
            SearchingParameters: { nationalities: "Italian", dishType: ["main course"] },
          });
          await recipe.save();
          recipeId = recipe._id; 
        });
      
        afterEach(async () => {
          await Recipe.deleteMany({});
          await User.deleteMany({});
        });
      
        test("returns recipes by user ID", async () => {
          const response = await request(app)
            .get("/recipes/get_user_recipes_by_id")
            .set("Authorization", `Bearer ${token}`) 
            .send({ user_id: userId }); 
      
          expect(response.status).toBe(200); 
          expect(response.body.recipes.length).toBe(1); // Expect one recipe returned
          expect(response.body.recipes[0].title).toBe("Pasta Primavera"); 
          expect(response.body.recipes[0].user.username).toBe("userTester"); // Check the username of the user associated with the recipe
        });
      
        test("returns an empty array when user has no recipes", async () => {
          const response = await request(app)
            .get("/recipes/get_user_recipes_by_id")
            .set("Authorization", `Bearer ${token}`)
            .send({ user_id: otherUserId }); // Send a different user ID that has no recipes
      
          expect(response.status).toBe(200); 
          expect(response.body.recipes).toEqual([]); 
        });
      });
    })


    describe("GET /recipes/get_user_recipes", () => {
      let userId, token;
    
      beforeAll(async () => {
        const user = new User({
          email: "user-profile@test.com",
          password: "12345678",
          username: "userProfileTester",
        });
        await user.save();
        userId = user._id; 
    
        token = generateToken(userId);
    
        const recipe1 = new Recipe({
          user: userId,
          title: "Apple Pie",
          summary: "Delicious apple pie with a flaky crust.",
          instructions: ["Prepare crust", "Fill with apples", "Bake"],
          SearchingParameters: { nationalities: "American", dishType: ["dessert"] },
        });
        await recipe1.save();
    
        const recipe2 = new Recipe({
          user: userId,
          title: "Caesar Salad",
          summary: "Fresh salad with Caesar dressing.",
          instructions: ["Mix greens", "Add dressing", "Toss"],
          SearchingParameters: { nationalities: "Italian", dishType: ["salad"] },
        });
        await recipe2.save();
      });
    
      afterEach(async () => {
        await Recipe.deleteMany({});
        await User.deleteMany({});
      });
    
      test("returns recipes for the authenticated user", async () => {
        const response = await request(app)
          .get("/recipes/get_user_recipes") 
          .set("Authorization", `Bearer ${token}`);
      
        expect(response.status).toBe(200); 
        expect(response.body.recipes.length).toBe(2); 
      
        const recipeTitles = response.body.recipes.map(recipe => recipe.title);
        expect(recipeTitles).toContain("Apple Pie"); 
        expect(recipeTitles).toContain("Caesar Salad"); 
      
        const applePie = response.body.recipes.find(recipe => recipe.title === "Apple Pie");
        expect(applePie.summary).toBe("Delicious apple pie with a flaky crust.");
        expect(applePie.user.username).toBe("userProfileTester"); 
      
        const caesarSalad = response.body.recipes.find(recipe => recipe.title === "Caesar Salad");
        expect(caesarSalad.summary).toBe("Fresh salad with Caesar dressing.");
        expect(caesarSalad.user.username).toBe("userProfileTester"); 
      });
      
    
      test("returns an empty array when user has no recipes", async () => {
        await Recipe.deleteMany({});
    
        const response = await request(app)
          .get("/recipes/get_user_recipes")
          .set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.recipes).toEqual([]); 
      });
    });
    
  });