import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const [searchFilters, setsearchFilters] = useState({
    nationality: "",
    readyInMinutes: 10000,
    dishType: "",
    preparationInMinutes: 0,
    cookingMinutes: 0,
    costFriendly: 0,
    servings: 0,
    allergies: [
      { type: "nuts", value: false },
      { type: "shellfish", value: false },
      { type: "dairy", value: false },
      { type: "soy", value: false },
      { type: "eggs", value: false },
    ],
    dietaryRequirements: [
      { type: "vegeterian", value: false },
      { type: "vegan", value: false },
      { type: "pescatarian", value: false },
      { type: "glutenFree", value: false },
    ],
    dairyFree: false,
    healthy: false,
    ingredients: ["", "", "", "", ""],
  });

  const [recipes, setRecipes] = useState([]);

  const navigate = useNavigate();

  const handleNavigate = (recipes, searchFilters) => {
    navigate("./fetched_recipe", {
      state: { props: recipes, allergies: searchFilters },
    });
  };

  const handleChange = (a, value) => {
    setsearchFilters((prev) => ({
      ...prev,
      [a]: value,
    }));
    console.log("This is a filter " + searchFilters);
  };

  const toggleDietaryBoxes = (type) => {
    setsearchFilters((prev) => ({
      ...prev,
      dietaryRequirements: prev.dietaryRequirements.map((dietaryRequirements) =>
        dietaryRequirements.type === type
          ? { ...dietaryRequirements, value: !dietaryRequirements.value }
          : dietaryRequirements
      ),
    }));
  };

  const toggleAllergyBoxes = (type) => {
    setsearchFilters((prev) => ({
      ...prev,
      allergies: prev.allergies.map((allergy) =>
        allergy.type === type ? { ...allergy, value: !allergy.value } : allergy
      ),
    }));
  };

  const handleIngredients = (iteration, value) => {
    setsearchFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, index) =>
        index === iteration ? value : ingredient
      ),
    }));
  };

  const allergies = () => {
    let allAllergies = "";
    searchFilters.allergies.map((allergy) => {
      if (allergy.value) {
        allAllergies += allergy.type + ",";
      }
    });
    if (allAllergies) {
      allAllergies.slice(0, -1);
    }
    return allAllergies;
  };

  const requirements = () => {
    let allRequirements = "";
    searchFilters.dietaryRequirements.map((req) => {
      if (req.value) {
        allRequirements += req.type + ",";
      }
    });
    if (allRequirements) {
      allRequirements.slice(0, -1);
    }
    return allRequirements;
  };

  const ingredients = () => {
    let allIngredients = "";
    searchFilters.ingredients.map((ingredient) => {
      allIngredients += ingredient + ",";
    });
    if (allIngredients) {
      allIngredients.slice(0, -1);
    }
    return allIngredients;
  };

  const fetchData = async (e) => {
    e.preventDefault();

    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=7982cd69943c489ba349dcd153762e02&query=${
      searchFilters.nationality
    }&type=${searchFilters.dishType}&intolerances=${allergies()}&maxReadyTime=${
      searchFilters.readyInMinutes
    }&includeIngredients=${ingredients()}&minServings=${
      searchFilters.servings
    }&diet=${requirements()}`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.results && Array.isArray(result.results)) {
        setRecipes(result.results);
        console.log(result.results);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Pick your recipe</h1>
      <form onSubmit={fetchData}>
        <div className="row">
          <label className="label">Nationality:</label>
          <input
            className="input"
            type="text"
            value={searchFilters.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            placeholder="Enter nationality"
          />
          <label className="label">Max prep and cook time:</label>
          <input
            className="input"
            type="text"
            value={searchFilters.readyInMinutes}
            onChange={(e) => handleChange("readyInMinutes", e.target.value)}
            placeholder="Enter maximum time for dish to be ready"
          />
          <label className="label">Dish Type:</label>
          <input
            className="input"
            value={searchFilters.dishType}
            onChange={(e) => handleChange("dishType", e.target.value)}
            placeholder="Enter dish type"
          />
        </div>
        <div className="row">
          <label className="label">
            Cost-friendly (1 budge - 5 expensive):
          </label>
          <input
            className="input"
            type="text"
            value={searchFilters.costFriendly}
            onChange={(e) => handleChange("costFriendly", e.target.value)}
            placeholder="Enter maximum price"
          />
          <label className="label">Max servings:</label>
          <input
            className="input"
            type="text"
            value={searchFilters.servings}
            onChange={(e) => handleChange("servings", e.target.value)}
            placeholder="Enter number of servings"
          />
          <label className="label">Max prep time:</label>
          <input
            className="input"
            type="text"
            value={searchFilters.preparationInMinutes}
            onChange={(e) =>
              handleChange("preparationInMinutes", e.target.value)
            }
            placeholder="Enter maximum time for dish preparation"
          />
          <label className="label">Max cooking time:</label>
          <input
            className="input"
            type="text"
            value={searchFilters.cookingMinutes}
            onChange={(e) => handleChange("cookingMinutes", e.target.value)}
            placeholder="Enter maximum cooking time"
          />
        </div>
        <div>
          <p>Dietary requirements</p>

          {searchFilters.dietaryRequirements.map((req) => (
            <label key={req.type}>
              <input
                className="input"
                type="checkbox"
                checked={req.value}
                onChange={() => toggleDietaryBoxes(req.type)}
              />
              {req.type.charAt(0).toUpperCase() + req.type.slice(1)}
            </label>
          ))}
        </div>
        <div>
          <p>Allergies: Check the box to remove items which contain:</p>

          {searchFilters.allergies.map((allergy) => (
            <label key={allergy.type}>
              <input
                className="input"
                type="checkbox"
                checked={allergy.value}
                onChange={() => toggleAllergyBoxes(allergy.type)}
              />
              {allergy.type.charAt(0).toUpperCase() + allergy.type.slice(1)}
            </label>
          ))}
        </div>
        <div>
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients[0]}
            onChange={(e) => handleIngredients(0, e.target.value)}
            placeholder="Enter ingredients"
          />
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients[1]}
            onChange={(e) => handleIngredients(1, e.target.value)}
            placeholder="Enter ingredients"
          />
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients[2]}
            onChange={(e) => handleIngredients(2, e.target.value)}
            placeholder="Enter ingredients"
          />
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients[3]}
            onChange={(e) => handleIngredients(3, e.target.value)}
            placeholder="Enter ingredients"
          />
          <input
            className="input"
            type="text"
            value={searchFilters.ingredients[4]}
            onChange={(e) => handleIngredients(4, e.target.value)}
            placeholder="Enter ingredients"
          />
        </div>
        <button role="submit-button" id="submit" type="submit" value="Submit">
          Search
        </button>
      </form>
      {recipes !== undefined ? (
        recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleNavigate(recipe, searchFilters.allergies)}
          >
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="recipe photo" />
          </div>
        ))
      ) : (
        <div>search for a recipe</div>
      )}
    </div>
  );
};

export default CreatePage;
