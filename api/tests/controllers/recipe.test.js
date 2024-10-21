const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Recipe = require("../../src/models/recipe");
const User = require("../../src/models/user");

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
  });

  describe("PATCH /recipes/toggle_favourites", () => {
    test("toggles favourites for a recipe", async () => {
      const user = new User({
        email: "favourite-test@test.com",
        password: "12345678",
        username: "favouriteTester",
      });
      await user.save();

      const recipe = new Recipe({
        user: user._id,
        title: "Lemon Pie",
        summary: "Tangy lemon pie",
        instructions: "Bake with love.",
      });
      await recipe.save();

      const response = await request(app)
        .patch("/recipes/toggle_favourites") 
        .set("Authorization", `Bearer ${token}`)
        .send({ recipe_id: recipe._id });

      expect(response.status).toBe(201);
      const updatedRecipe = await Recipe.findById(recipe._id);
      expect(updatedRecipe.favourites.length).toBe(1);
    });
  });
});
