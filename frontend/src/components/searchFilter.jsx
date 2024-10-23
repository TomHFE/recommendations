import { useState } from "react";
import { getFilteredRecipes } from "../services/recipes/getFilteredRecipes";
import "./searchFilter.css";

export function SearchFilter({ onSearch }) {
  const [error, setError] = useState("");
  const [searchFilters, setsearchFilters] = useState({
    nationality: "",
    readyInMinutes: 0,
    dishType: "",
    preparationMinutes: 0,
    cookingMinutes: 0,
    costFriendly: 0,
    servings: 0,
    nuts: false,
    shellfish: false,
    dairy: false,
    soy: false,
    eggs: false,
    vegeterian: false,
    vegan: false,
    pescatarian: false,
    glutenFree: false,
    dairyFree: false,
    healthy: false,
    ingredients: [],
  });

  const initialFilters = {
    nationality: "",
    readyInMinutes: 0,
    dishType: "",
    preparationMinutes: 0,
    cookingMinutes: 0,
    costFriendly: 0,
    servings: 0,
    nuts: false,
    shellfish: false,
    dairy: false,
    soy: false,
    eggs: false,
    vegeterian: false,
    vegan: false,
    pescatarian: false,
    glutenFree: false,
    dairyFree: false,
    healthy: false,
    ingredients: [],
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // console.log("this is the filtered recipes: " + filters);
      const recipes = await getFilteredRecipes(token, searchFilters);
      localStorage.setItem("token", recipes.token);

      console.log("this is the filtered recipes: " + searchFilters);
      onSearch(recipes.recipes);
      console.log("recipes.recipes is " + JSON.stringify(recipes.recipes));
    } catch (error) {
      console.log(error.message);
      setError("Invalid input, please try again");
    }
  }

  const handleChange = (a, value) => {
    setsearchFilters((prev) => ({
      ...prev,
      [a]: value,
    }));
  };

  const handleReset = async () => {
    setsearchFilters(initialFilters);
    try {
      const token = localStorage.getItem("token");
      const recipes = await getFilteredRecipes(token, {}); // Fetch all recipes without filters
      localStorage.setItem("token", recipes.token);

      onSearch(recipes.recipes); // Display all recipes
    } catch (error) {
      console.log(error.message);
      setError("Failed to reset filters and fetch all recipes");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label className="label">Nationality:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
              placeholder="Enter nationality"
            />
            <label className="label">Dish Type:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.dishType}
              onChange={(e) => handleChange("dishType", e.target.value)}
              placeholder="Enter dish type"
            />
            <label className="label">Max prep time:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.preparationMinutes}
              onChange={(e) =>
                handleChange("preparationMinutes", e.target.value)
              }
              placeholder="Enter preparation time"
            />
          </div>
          <div className="row">
            <label className="label">Max cooking time:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.cookingMinutes}
              onChange={(e) => handleChange("cookingMinutes", e.target.value)}
              placeholder="Enter cooking time"
            />
            <label className="label">Max prep and cook time:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.readyInMinutes}
              onChange={(e) => handleChange("cookingMinutes", e.target.value)}
              placeholder="Enter total cooking and prep time"
            />
            <label className="label">Max servings:</label>
            <input
              className="input"
              type="text"
              value={searchFilters.servings}
              onChange={(e) => handleChange("servings", e.target.value)}
              placeholder="Enter servings amount"
            />
            <label className="label">
              Cost-friendly (1 budget - 5 expensive):
            </label>
            <input
              className="input"
              type="text"
              value={searchFilters.costFriendly}
              onChange={(e) => handleChange("costFriendly", e.target.value)}
              placeholder="1 budget - 5 expensive"
              // put in detailed information in a p tag and on a seperate line so a user knows what to input or change to drop down
            />
          </div>
          <div className="row">
            <p>Allergies: Check the box to remove items which contain:</p>
            <input
              className="input"
              type="checkbox"
              checked={searchFilters.nuts}
              onChange={(e) => handleChange("nuts", e.target.value)}
            />
            <label htmlFor="checkbox">Nuts </label>
            <input
              className="input"
              type="checkbox"
              checked={searchFilters.shellfish}
              onChange={(e) => handleChange("shellfish", e.target.value)}
            />
            <label htmlFor="checkbox">Shellfish </label>
            <input
              className="input"
              type="checkbox"
              checked={searchFilters.dairy}
              onChange={(e) => handleChange("dairy", e.target.value)}
            />
            <label htmlFor="checkbox">Dairy </label>
            <input
              className="input"
              type="checkbox"
              checked={searchFilters.soy}
              onChange={(e) => handleChange("soy", e.target.value)}
            />
            <label htmlFor="checkbox">Soy </label>
            <input
              className="input"
              type="checkbox"
              checked={searchFilters.eggs}
              onChange={(e) => handleChange("eggs", e.target.value)}
            />
            <label htmlFor="checkbox">Eggs </label>
          </div>
          <p>Dietary requirements</p>
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.vegeterian}
            onChange={(e) => handleChange("vegeterian", e.target.value)}
          />
          <label htmlFor="checkbox">Vegeterian</label>
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.vegan}
            onChange={(e) => handleChange("vegan", e.target.value)}
          />
          <label htmlFor="checkbox">Vegan</label>
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.pescatarian}
            onChange={(e) => handleChange("pescatarian", e.target.value)}
          />
          <label htmlFor="checkbox">Pescatarian</label>
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.glutenFree}
            onChange={(e) => handleChange("glutenFree", e.target.value)}
          />
          <label htmlFor="checkbox">Gluten Free</label>
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.dairyFree}
            onChange={(e) => handleChange("dairyFree", e.target.value)}
          />
          <label htmlFor="checkbox">Dairy Free</label>e{" "}
          <input
            className="input"
            type="checkbox"
            checked={searchFilters.healthy}
            onChange={(e) => handleChange("healthy", e.target.value)}
          />
          <label htmlFor="checkbox">Healthy</label>
          <p> Any ingredients?</p>
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients.join(", ")} // Display the ingredients
            onChange={(e) => {
              const values = e.target.value.split(","); // Split the input by commas

              handleChange("ingredients", values); // Update state with trimmed values
            }}
            placeholder="Enter main ingredient"
          />
          <button
            className="ingredient-search-button"
            role="submit-button"
            id="submit"
            type="submit"
            value="Submit"
          >
            Search
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
        {error && <div id="error">{error}</div>}
      </div>
    </>
  );
}
