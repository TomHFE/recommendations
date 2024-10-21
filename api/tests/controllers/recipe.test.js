const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
const Recipe = require("../../src/models/recipe");
const User = require("../../src/models/user");
const { generateToken } = require("../../src/lib/token");

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
      // Clear favourites before each test
      await User.updateOne({ _id: user._id }, { favourites: [] });
    });
    
    test("toggle to favourite a recipe", async () => {
      // First toggle (add to favourites)
      let response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      // Fetch updated user and check if recipe is in favourites
      const updatedUser = await User.findById(user._id);
      const favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).toContain(recipe._id.toString());
    });
    

    test("toggle twice to unfavourite a recipe", async () => {
      // First toggle (add to favourites)
      let response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      // Fetch updated user and check if recipe is in favourites
      let updatedUser = await User.findById(user._id);
      let favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).toContain(recipe._id.toString());
    
      // Second toggle (remove from favourites)
      response = await request(app)
        .patch("/recipes/toggle_favourites")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });
    
      expect(response.status).toBe(201);
    
      // Fetch updated user and check if recipe is removed from favourites
      updatedUser = await User.findById(user._id);
      favouriteIds = updatedUser.favourites.map(fav => fav.toString());
      expect(favouriteIds).not.toContain(recipe._id.toString());
    });
  });