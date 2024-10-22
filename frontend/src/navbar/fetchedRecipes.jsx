
// API KEY: 7982cd69943c489ba349dcd153762e02



import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const FetchedRecipes = () => {
  const location = useLocation();
  const { props } = location.state || {};
  const [recipe, setRecipe] = useState(null); 

  useEffect(() => {
    if (props && props.id) {
      fetchData();
    }
  }, [props]); 

  const fetchData = async () => {
    const url = `https://api.spoonacular.com/recipes/${props.id}/information?apiKey=70b7e405dc8142388caa2e187a5c0260`;
    const options = {
      method: 'GET',
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      setRecipe(result); 
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {recipe ? ( 
        <div>
          <h1>{recipe.title}</h1>
          <img src={recipe.image} alt="recipe" />
          <p>{recipe.summary}</p>
          <div>favourite</div>
        </div >
      ) : (
        <div>Loading recipe...</div> 
    )};
    </div>
  )
};

export default FetchedRecipes;
