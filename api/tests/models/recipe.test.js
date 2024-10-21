require("../mongodb_helper");
const Recipe = require("../../src/models/recipe");
const ObjectId = require('mongodb').ObjectId;


describe("Recipe model", () => {
  beforeEach(async () => {
    await Recipe.deleteMany({});
  });
  

  it("has a title", () => {
    const recipe = new Recipe({ title: "Test Recipe" });
    expect(recipe.title).toEqual("Test Recipe");
  });

  it("has an image", () => {
    const recipe = new Recipe({ image: "example.com/image.jpg" });
    expect(recipe.image).toEqual("example.com/image.jpg");
  });

  it("has a summary", () => {
    const recipe = new Recipe({ summary: "This is a test recipe summary." });
    expect(recipe.summary).toEqual("This is a test recipe summary.");
  });

  it("has instructions", () => {
    const recipe = new Recipe({ instructions: "Step 1: Test the recipe. Step 2: Enjoy!" });
    expect(recipe.instructions).toEqual(["Step 1: Test the recipe. Step 2: Enjoy!"]);
  });

  it("has a creation date", async () => {
    const fakeUserId = new ObjectId();
    const mockDate = new Date('2024-10-04T12:04:15.024Z');
    const recipe = new Recipe({ 
      title: "Test Recipe", 
      user: fakeUserId, 
      created_at: mockDate 
    });
    expect(recipe.created_at).toEqual(mockDate);
  });

  it("can have ingredients", () => {
    const recipe = new Recipe({ 
      ingredients: [
        { name: "Sugar", quantity: 100, unit: "grams" },
        { name: "Flour", quantity: 200, unit: "grams" }
      ] 
    });
    expect(recipe.ingredients.length).toEqual(2);
    expect(recipe.ingredients[0].name).toEqual("Sugar");
    expect(recipe.ingredients[0].quantity).toEqual(100);
    expect(recipe.ingredients[0].unit).toEqual("grams");
  });

  it("can have searching parameters", () => {
    const recipe = new Recipe({ 
      SearchingParameters: {
        nationalities: "Italian",
        dishType: ["Main Course"],
        preparationMinutes: 30,
        cookingMinutes: 60,
        servings: 4,
        vegeterian: true,
        glutenFree: false,
        readyInMinutes: 90
      }
    });
    expect(recipe.SearchingParameters.nationalities).toEqual("Italian");
    expect(recipe.SearchingParameters.dishType[0]).toEqual("Main Course");
    expect(recipe.SearchingParameters.vegeterian).toBe(true);
    expect(recipe.SearchingParameters.glutenFree).toBe(false);
    expect(recipe.SearchingParameters.readyInMinutes).toEqual(90);
  });

  it("can save a recipe", async () => {
    const fakeUserId = new ObjectId();
    const recipe = new Recipe({ 
      title: "Test Recipe", 
      user: fakeUserId, 
      instructions: "Mix ingredients and cook.", 
      ingredients: [{ name: "Flour", quantity: 200, unit: "grams" }]
    });
    await recipe.save();
    const recipes = await Recipe.find();
    expect(recipes[0].title).toEqual("Test Recipe");
  });

  it("cannot save a recipe without user id", async () => {
    const recipe = new Recipe({ title: "Test Recipe", instructions: "Mix and cook." });
    try {
      await recipe.save();
    } catch(error) {
      expect(error.toString()).toBe('ValidationError: user: Path `user` is required.');
    }
  });

  it("can have comments", async () => {
    const fakeUserId = new ObjectId();
    const fakeCommentId = new ObjectId();
    const recipe = new Recipe({ 
      title: "Test Recipe", 
      user: fakeUserId, 
      comments: [{ comment: "Looks delicious!", _id: fakeCommentId }]
    });
    expect(recipe.comments[0]._id).toEqual(fakeCommentId);
  });

  it("can have favourites", async () => {
    const fakeUserId = new ObjectId();
    const recipe = new Recipe({ 
      title: "Test Recipe", 
      user: fakeUserId, 
      favourites: [fakeUserId]
    });
    expect(recipe.favourites[0]).toEqual(fakeUserId);
  });

});
