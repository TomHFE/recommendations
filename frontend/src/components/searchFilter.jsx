import { useEffect, useState, useMemo } from "react";
import { getFilteredRecipes } from "../services/recipes/getFilteredRecipes";

export function SearchFilter() {
  const [nationality, setNationality] = useState([]);
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [dishType, setDishType] = useState([]);
  const [preparationInMinutes, setPreparationInMinutes] = useState();
  const [cookingMinutes, setCookingMinutes] = useState();
  const [costFriendly, setCostFriendly] = useState();
  const [error, setError] = useState("");
  const [servings, setServings] = useState();
  const [nuts, setNutFree] = useState("");
  const [shellfish, setShellfishFree] = useState("");
  const [dairy, setDairy] = useState("");
  const [soy, setSoy] = useState("");
  const [eggs, setEggs] = useState("");
  const [vegeterian, setVegeterian] = useState("");
  const [vegan, setVegan] = useState("");
  const [pescatarian, setPescatarian] = useState("");
  const [glutenFree, setGlutenFree] = useState("");
  const [dairyFree, setDairyFree] = useState("");
  const [healthy, setHealthy] = useState("");
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
      setFilteredRecipes(filteredRecipes);
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
    setNutFree(event.target.value);
  }

  function handleShellfish(event) {
    setShellfishFree(event.target.value);
  }

  function handleDairy(event) {
    setDairy(event.target.value);
  }
  function handleVegeterian(event) {
    setVegeterian(event.target.value);
  }

  function handleVegan(event) {
    setVegan(event.target.value);
  }

  function handlePescatarian(event) {
    setPescatarian(event.target.value);
  }
  function handleGlutenFree(event) {
    setGlutenFree(event.target.value);
  }

  function handleDairyFree(event) {
    setDairyFree(event.target.value);
  }
  function handleHealthy(event) {
    setHealthy(event.target.value);
  }

  function handleSoy(event) {
    setSoy(event.target.value);
  }
  function handleEggs(event) {
    setEggs(event.target.value);
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
          />
          <input type="text" value={dishType} onChange={handleDishType} />
          <input
            type="text"
            value={preparationInMinutes}
            onChange={handlePreparationInMinutes}
          />
          <input
            type="text"
            value={cookingMinutes}
            onChange={handleCookingMinutes}
          />
          <input
            type="text"
            value={readyInMinutes}
            onChange={handleReadyInMinutes}
          />
          <input type="text" value={servings} onChange={handleServings} />
          <p>
            Cost-friendly - please rate the level of cost. Where 1 is for very
            cost friendly and 5 is expensive
          </p>
          <input
            type="text"
            value={costFriendly}
            onChange={handleCostFriendly}
          />
          <p>Allergies</p>
          <input type="checkbox" value={nuts} onChange={handleNuts} />
          <label htmlFor="checkbox">Nuts </label>
          <input type="checkbox" value={shellfish} onChange={handleShellfish} />
          <label htmlFor="checkbox">Shellfish </label>
          <input type="checkbox" value={dairy} onChange={handleDairy} />
          <label htmlFor="checkbox">Dairy </label>
          <input type="checkbox" value={soy} onChange={handleSoy} />
          <label htmlFor="checkbox">Soy </label>
          <input type="checkbox" value={eggs} onChange={handleEggs} />
          <label htmlFor="checkbox">Eggs </label>
          <p>Dietary requirements</p>
          <input
            type="checkbox"
            value={vegeterian}
            onChange={handleVegeterian}
          />
          <label htmlFor="checkbox">Vegeterian</label>
          <input type="checkbox" value={vegan} onChange={handleVegan} />
          <label htmlFor="checkbox">Vegan</label>
          <input
            type="checkbox"
            value={pescatarian}
            onChange={handlePescatarian}
          />
          <label htmlFor="checkbox">Pescatarian</label>
          <input
            type="checkbox"
            value={glutenFree}
            onChange={handleGlutenFree}
          />
          <label htmlFor="checkbox">Gluten Free</label>
          <input type="checkbox" value={dairyFree} onChange={handleDairyFree} />
          <label htmlFor="checkbox">Dairy Free</label>
          e <input type="checkbox" value={healthy} onChange={handleHealthy} />
          <label htmlFor="checkbox">Healthy</label>
          <p> Any ingredients?</p>
          <input type="text" value={ingredient} onChange={handleIngredient} />
        </form>
        {error && <div id="error">{error}</div>}

        <h3>Your search results</h3>
        {filteredRecipes.length > 0 ? (
          <ul>
            {filteredRecipes.map((recipe, index) => (
              <li key={index}>{recipe.title}</li>
            ))}
          </ul>
        ) : (
          <p>Sorry we couldn`&apos`t find you any recipe</p>
        )}
      </div>
    </>
  );
}
