import { useEffect, useState, useMemo } from "react";
import { getFilteredRecipes } from "../services/recipes/getFilteredRecipes";

export function SearchFilter({ onSearch }) {
  const [nationality, setNationality] = useState([]);
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [dishType, setDishType] = useState([]);
  const [preparationInMinutes, setPreparationInMinutes] = useState();
  const [cookingMinutes, setCookingMinutes] = useState();
  const [costFriendly, setCostFriendly] = useState();
  const [error, setError] = useState("");
  const [servings, setServings] = useState();
  const [nuts, setNutFree] = useState(false);
  const [shellfish, setShellfishFree] = useState(false);
  const [dairy, setDairy] = useState(false);
  const [soy, setSoy] = useState(false);
  const [eggs, setEggs] = useState(false);
  const [vegeterian, setVegeterian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [pescatarian, setPescatarian] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [healthy, setHealthy] = useState(false);
  const [ingredient, setIngredient] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const filters = useMemo(
    () => [
      nationality,
      readyInMinutes,
      dishType,
      preparationInMinutes,
      cookingMinutes,
      costFriendly,
      servings,
      nuts,
      shellfish,
      dairy,
      soy,
      eggs,
      vegeterian,
      vegan,
      pescatarian,
      glutenFree,
      dairyFree,
      healthy,
      ingredient,
    ],
    [
      nationality,
      readyInMinutes,
      dishType,
      preparationInMinutes,
      cookingMinutes,
      costFriendly,
      servings,
      nuts,
      shellfish,
      dairy,
      soy,
      eggs,
      vegeterian,
      vegan,
      pescatarian,
      glutenFree,
      dairyFree,
      healthy,
      ingredient,
    ]
  );

  useEffect(() => {
    setFilteredRecipes(filters);
  }, [filters]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const filteredRecipes = await getFilteredRecipes(token, filters);
      // setFilteredRecipes(filteredRecipes);
      onSearch(filteredRecipes);
    } catch {
      setError("Invalid input, please try again");
    }
  }

  function handleNationalities(event) {
    setNationality(event.target.value);
  }

  function handleDishType(event) {
    setDishType(event.target.value);
  }

  function handlePreparationInMinutes(event) {
    setPreparationInMinutes(event.target.value);
  }

  function handleReadyInMinutes(event) {
    setReadyInMinutes(event.target.value);
  }

  function handleCookingMinutes(event) {
    setCookingMinutes(event.target.value);
  }
  function handleServings(event) {
    setServings(event.target.value);
  }

  function handleCostFriendly(event) {
    setCostFriendly(event.target.value);
  }

  function handleNuts(event) {
    setNutFree(event.target.checked);
  }

  function handleShellfish(event) {
    setShellfishFree(event.target.checked);
  }

  function handleDairy(event) {
    setDairy(event.target.checked);
  }
  function handleVegeterian(event) {
    setVegeterian(event.target.checked);
  }

  function handleVegan(event) {
    setVegan(event.target.checked);
  }

  function handlePescatarian(event) {
    setPescatarian(event.target.checked);
  }
  function handleGlutenFree(event) {
    setGlutenFree(event.target.checked);
  }

  function handleDairyFree(event) {
    setDairyFree(event.target.checked);
  }
  function handleHealthy(event) {
    setHealthy(event.target.checked);
  }

  function handleSoy(event) {
    setSoy(event.target.checked);
  }
  function handleEggs(event) {
    setEggs(event.target.checked);
  }

  function handleIngredient(event) {
    setIngredient(event.target.value);
  }

  return (
    <>
      <div>
        <h2>Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nationality}
            onChange={handleNationalities}
            placeholder="Enter nationality"
          />
          <input
            type="text"
            value={dishType}
            onChange={handleDishType}
            placeholder="Enter dish type"
          />
          <input
            type="text"
            value={preparationInMinutes}
            onChange={handlePreparationInMinutes}
            placeholder="Enter preparation time"
          />
          <input
            type="text"
            value={cookingMinutes}
            onChange={handleCookingMinutes}
            placeholder="Enter cooking time"
          />
          <input
            type="text"
            value={readyInMinutes}
            onChange={handleReadyInMinutes}
            placeholder="Enter max time on cooking and prep"
          />
          <input
            type="text"
            value={servings}
            onChange={handleServings}
            placeholder="Enter servings amount"
          />
          <input
            type="text"
            value={costFriendly}
            onChange={handleCostFriendly}
            placeholder="1 budget - 5 expensive"
            // put in detailed information in a p tag and on a seperate line so a user knows what to input or change to drop down
          />
          <p>Allergies</p>
          <input type="checkbox" checked={nuts} onChange={handleNuts} />
          <label htmlFor="checkbox">Nuts </label>
          <input type="checkbox" checked={shellfish} onChange={handleShellfish} />
          <label htmlFor="checkbox">Shellfish </label>
          <input type="checkbox" checked={dairy} onChange={handleDairy} />
          <label htmlFor="checkbox">Dairy </label>
          <input type="checkbox" checked={soy} onChange={handleSoy} />
          <label htmlFor="checkbox">Soy </label>
          <input type="checkbox" checked={eggs} onChange={handleEggs} />
          <label htmlFor="checkbox">Eggs </label>
          <p>Dietary requirements</p>
          <input
            type="checkbox"
            checked={vegeterian}
            onChange={handleVegeterian}
          />
          <label htmlFor="checkbox">Vegeterian</label>
          <input type="checkbox" checked={vegan} onChange={handleVegan} />
          <label htmlFor="checkbox">Vegan</label>
          <input
            type="checkbox"
            checked={pescatarian}
            onChange={handlePescatarian}
          />
          <label htmlFor="checkbox">Pescatarian</label>
          <input
            type="checkbox"
            checked={glutenFree}
            onChange={handleGlutenFree}
          />
          <label htmlFor="checkbox">Gluten Free</label>
          <input type="checkbox" checked={dairyFree} onChange={handleDairyFree} />
          <label htmlFor="checkbox">Dairy Free</label>
          e <input type="checkbox" checked={healthy} onChange={handleHealthy} />
          <label htmlFor="checkbox">Healthy</label>
          <p> Any ingredients?</p>
          <input type="text" value={ingredient} onChange={handleIngredient} />
          <input
            role="submit-button"
            id="submit"
            type="submit"
            value="Submit"
          />
        </form>
        {error && <div id="error">{error}</div>}
      </div>
    </>
  );
}
