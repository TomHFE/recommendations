import { useEffect, useState } from "react";
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
  const [clicked, setClicked] = useState(0);
  const [searchFilters, setsearchFilters] = useState({
    nationality: "",
    readyInMinutes: 0,
    dishType: "",
    preparationInMinutes: 0,
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
    ingredient: "",
  });

  // const filters = useMemo(
  //   () => [
  //     nationality,
  //     readyInMinutes,
  //     dishType,
  //     preparationInMinutes,
  //     cookingMinutes,
  //     costFriendly,
  //     servings,
  //     nuts,
  //     shellfish,
  //     dairy,
  //     soy,
  //     eggs,
  //     vegeterian,
  //     vegan,
  //     pescatarian,
  //     glutenFree,
  //     dairyFree,
  //     healthy,
  //     ingredient,
  //   ],
  //   [
  //     nationality,
  //     readyInMinutes,
  //     dishType,
  //     preparationInMinutes,
  //     cookingMinutes,
  //     costFriendly,
  //     servings,
  //     nuts,
  //     shellfish,
  //     dairy,
  //     soy,
  //     eggs,
  //     vegeterian,
  //     vegan,
  //     pescatarian,
  //     glutenFree,
  //     dairyFree,
  //     healthy,
  //     ingredient,
  //   ]
  // );

  // const handleClicked = () => {
  //   setClicked(clicked + 1);
  // };

  // const fetchData = () => {
  //   useEffect(() => {
  //     // console.log("Current nationality: ", filters.nationality);
  //     // console.log("this is the filtered recipes: " + filteredRecipes);
  //     // setFilteredRecipes(filteredRecipes);
  //     handleSubmit();
  //   }, []);
  // };
  // const fetchData = async () => {
  //   try {
  //     await handleSubmit(); // Fetch data or call another function here
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData(); // Call the fetchData function when the component mounts
  // }, []); // The empty array means this runs once, after the initial render

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // console.log("this is the filtered recipes: " + filters);
      const recipes = await getFilteredRecipes(token, searchFilters);
      localStorage.setItem("token", recipes.token);
      // setFilteredRecipes(filteredRecipes);

      // console.log("this is the filtered recipes: " + filteredRecipes);
      onSearch(recipes.recipes);
      console.log("recipes.recipes is " + recipes.recipes);
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
    console.log("This is a filter " + searchFilters.nationality);
  };

  // function handleNationalities(event) {
  //   setNationality(event.target.value);
  // }

  // function handleDishType(event) {
  //   setDishType(event.target.value);
  // }

  // function handlePreparationInMinutes(event) {
  //   setPreparationInMinutes(event.target.value);
  // }

  // function handleReadyInMinutes(event) {
  //   setReadyInMinutes(event.target.value);
  // }

  // function handleCookingMinutes(event) {
  //   setCookingMinutes(event.target.value);
  // }
  // function handleServings(event) {
  //   setServings(event.target.value);
  // }

  // function handleCostFriendly(event) {
  //   setCostFriendly(event.target.value);
  // }

  // function handleNuts(event) {
  //   setNutFree(event.target.checked);
  // }

  // function handleShellfish(event) {
  //   setShellfishFree(event.target.checked);
  // }

  // function handleDairy(event) {
  //   setDairy(event.target.checked);
  // }
  // function handleVegeterian(event) {
  //   setVegeterian(event.target.checked);
  // }

  // function handleVegan(event) {
  //   setVegan(event.target.checked);
  // }

  // function handlePescatarian(event) {
  //   setPescatarian(event.target.checked);
  // }
  // function handleGlutenFree(event) {
  //   setGlutenFree(event.target.checked);
  // }

  // function handleDairyFree(event) {
  //   setDairyFree(event.target.checked);
  // }
  // function handleHealthy(event) {
  //   setHealthy(event.target.checked);
  // }

  // function handleSoy(event) {
  //   setSoy(event.target.checked);
  // }
  // function handleEggs(event) {
  //   setEggs(event.target.checked);
  // }

  // function handleIngredient(event) {
  //   setIngredient(event.target.value);
  // }

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
          {/* <input
            type="text"
            value={dishType}
            onChange={handleChange}
            placeholder="Enter dish type"
          />
          <input
            type="text"
            value={preparationInMinutes}
            onChange={handleChange}
            placeholder="Enter preparation time"
          />
          <input
            type="text"
            value={cookingMinutes}
            onChange={handleChange}
            placeholder="Enter cooking time"
          />
          <input
            type="text"
            value={readyInMinutes}
            onChange={handleChange}
            placeholder="Enter max time on cooking and prep"
          />
          <input
            type="text"
            value={servings}
            onChange={handleChange}
            placeholder="Enter servings amount"
          />
          <input
            type="text"
            value={costFriendly}
            onChange={handleChange}
            placeholder="1 budget - 5 expensive"
            // put in detailed information in a p tag and on a seperate line so a user knows what to input or change to drop down
          />
          <p>Allergies</p>
          <input type="checkbox" checked={nuts} onChange={handleChange} />
          <label htmlFor="checkbox">Nuts </label>
          <input type="checkbox" checked={shellfish} onChange={handleChange} />
          <label htmlFor="checkbox">Shellfish </label>
          <input type="checkbox" checked={dairy} onChange={handleChange} />
          <label htmlFor="checkbox">Dairy </label>
          <input type="checkbox" checked={soy} onChange={handleChange} />
          <label htmlFor="checkbox">Soy </label>
          <input type="checkbox" checked={eggs} onChange={handleChange} />
          <label htmlFor="checkbox">Eggs </label>
          <p>Dietary requirements</p>
          <input type="checkbox" checked={vegeterian} onChange={handleChange} />
          <label htmlFor="checkbox">Vegeterian</label>
          <input type="checkbox" checked={vegan} onChange={handleChange} />
          <label htmlFor="checkbox">Vegan</label>
          <input
            type="checkbox"
            checked={pescatarian}
            onChange={handleChange}
          />
          <label htmlFor="checkbox">Pescatarian</label>
          <input type="checkbox" checked={glutenFree} onChange={handleChange} />
          <label htmlFor="checkbox">Gluten Free</label>
          <input type="checkbox" checked={dairyFree} onChange={handleChange} />
          <label htmlFor="checkbox">Dairy Free</label>
          e <input type="checkbox" checked={healthy} onChange={handleChange} />
          <label htmlFor="checkbox">Healthy</label>
          <p> Any ingredients?</p>
          <input type="text" value={ingredient} onChange={handleChange} /> */}
          <button
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
