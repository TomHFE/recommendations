import { useState } from "react";
import { getFilteredRecipes } from "../services/recipes/getFilteredRecipes";

export function SearchFilter({ onSearch }) {
  // const [nationality, setNationality] = useState("");
  // const [readyInMinutes, setReadyInMinutes] = useState("");
  // const [dishType, setDishType] = useState([]);
  // const [preparationInMinutes, setPreparationInMinutes] = useState();
  // const [cookingMinutes, setCookingMinutes] = useState();
  // const [costFriendly, setCostFriendly] = useState();
  const [error, setError] = useState("");
  // const [servings, setServings] = useState();
  // const [nuts, setNutFree] = useState(false);
  // const [shellfish, setShellfishFree] = useState(false);
  // const [dairy, setDairy] = useState(false);
  // const [soy, setSoy] = useState(false);
  // const [eggs, setEggs] = useState(false);
  // const [vegeterian, setVegeterian] = useState(false);
  // const [vegan, setVegan] = useState(false);
  // const [pescatarian, setPescatarian] = useState(false);
  // const [glutenFree, setGlutenFree] = useState(false);
  // const [dairyFree, setDairyFree] = useState(false);
  // const [healthy, setHealthy] = useState(false);
  // const [ingredient, setIngredient] = useState([]);
  // const [clicked, setClicked] = useState(0);
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

  const handleReset = () => {
    setsearchFilters(initialFilters);
  };
  return (
    <>
      <div>
        <h2>Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchFilters.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            placeholder="Enter nationality"
          />
          <input
            type="text"
            value={searchFilters.dishType}
            onChange={(e) => handleChange("dishType", e.target.value)}
            placeholder="Enter dish type"
          />
          <input
            type="text"
            value={searchFilters.preparationMinutes}
            onChange={(e) => handleChange("preparationMinutes", e.target.value)}
            placeholder="Enter preparation time"
          />
          <input
            type="text"
            value={searchFilters.cookingMinutes}
            onChange={(e) => handleChange("cookingMinutes", e.target.value)}
            placeholder="Enter cooking time"
          />
          <input
            type="text"
            value={searchFilters.readyInMinutes}
            onChange={(e) => handleChange("cookingMinutes", e.target.value)}
            placeholder="Enter total cooking and prep time"
          />
          <input
            type="text"
            value={searchFilters.servings}
            onChange={(e) => handleChange("servings", e.target.value)}
            placeholder="Enter servings amount"
          />
          <input
            type="text"
            value={searchFilters.costFriendly}
            onChange={(e) => handleChange("costFriendly", e.target.value)}
            placeholder="1 budget - 5 expensive"
            // put in detailed information in a p tag and on a seperate line so a user knows what to input or change to drop down
          />
          <p>Allergies: Check the box to remove items which contain:</p>
          <input
            type="checkbox"
            checked={searchFilters.nuts}
            onChange={(e) => handleChange("nuts", e.target.value)}
          />
          <label htmlFor="checkbox">Nuts </label>
          <input
            type="checkbox"
            checked={searchFilters.shellfish}
            onChange={(e) => handleChange("shellfish", e.target.value)}
          />
          <label htmlFor="checkbox">Shellfish </label>
          <input
            type="checkbox"
            checked={searchFilters.dairy}
            onChange={(e) => handleChange("dairy", e.target.value)}
          />
          <label htmlFor="checkbox">Dairy </label>
          <input
            type="checkbox"
            checked={searchFilters.soy}
            onChange={(e) => handleChange("soy", e.target.value)}
          />
          <label htmlFor="checkbox">Soy </label>
          <input
            type="checkbox"
            checked={searchFilters.eggs}
            onChange={(e) => handleChange("eggs", e.target.value)}
          />
          <label htmlFor="checkbox">Eggs </label>
          <p>Dietary requirements</p>
          <input
            type="checkbox"
            checked={searchFilters.vegeterian}
            onChange={(e) => handleChange("vegeterian", e.target.value)}
          />
          <label htmlFor="checkbox">Vegeterian</label>
          <input
            type="checkbox"
            checked={searchFilters.vegan}
            onChange={(e) => handleChange("vegan", e.target.value)}
          />
          <label htmlFor="checkbox">Vegan</label>
          <input
            type="checkbox"
            checked={searchFilters.pescatarian}
            onChange={(e) => handleChange("pescatarian", e.target.value)}
          />
          <label htmlFor="checkbox">Pescatarian</label>
          <input
            type="checkbox"
            checked={searchFilters.glutenFree}
            onChange={(e) => handleChange("glutenFree", e.target.value)}
          />
          <label htmlFor="checkbox">Gluten Free</label>
          <input
            type="checkbox"
            checked={searchFilters.dairyFree}
            onChange={(e) => handleChange("dairyFree", e.target.value)}
          />
          <label htmlFor="checkbox">Dairy Free</label>e{" "}
          <input
            type="checkbox"
            checked={searchFilters.healthy}
            onChange={(e) => handleChange("healthy", e.target.value)}
          />
          <label htmlFor="checkbox">Healthy</label>
          <p> Any ingredients?</p>
          <input
            type="text"
            value={searchFilters.ingredients.join(", ")} // Display the ingredients
            onChange={(e) => {
              const values = e.target.value
                .split(",")
                .map((item) => item.trim()); // Split by commas
              handleChange("ingredients", values); // Update state
            }}
            placeholder="Enter main ingredient"
          />
          <button role="submit-button" id="submit" type="submit" value="Submit">
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
