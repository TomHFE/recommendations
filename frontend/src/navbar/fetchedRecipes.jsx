
// API KEY: 7982cd69943c489ba349dcd153762e02

//       user: req.user_id,
// title: recipeList.title,
// image: recipeList.image,
// summary: recipeList.summary,
// instructions: recipeList.instructions,
// SearchingParameters: {
//   nationalities: SearchingParameters.nationalities,
//   dishType: SearchingParameters.dishType,
//   preparationMinutes: SearchingParameters.preparationMinutes,
//   cookingMinutes: SearchingParameters.cookingMinutes,
//   servings: SearchingParameters.servings,
//   nuts: SearchingParameters.nuts,
//   shellfish: SearchingParameters.shellfish,
//   dairy: SearchingParameters.dairy,
//   soy: SearchingParameters.soy,
//   eggs: SearchingParameters.eggs,

//   vegeterian: SearchingParameters.vegeterian,
//   vegan: SearchingParameters.vegan,
//   pescatarian: SearchingParameters.pescatarian,
//   glutenFree: SearchingParameters.glutenFree,
//   dairyFree: SearchingParameters.dairyFree,
//   healthy: SearchingParameters.healthy,
//   costFriendly: SearchingParameters.costFriendly,
//   readyInMinutes: SearchingParameters.readyInMinutes,
// },

// ingredients: recipeList.ingredients,



import DOMPurify from 'dompurify'; // Import the DOMPurify library


import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { createRecipe } from '../services/recipes/createRecipe';
import { useNavigate } from 'react-router-dom';
import cleanData from './cleanData';
import { createFavourite } from '../services/recipes/toggleFavourites';

const FetchedRecipes = () => {
  const location = useLocation();
  const { props, allergies } = location.state || {};
  const [recipe, setRecipe] = useState(null); 
  const [favourite, setFavourite] = useState('Click to mark as Favourite')
  const[sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState('')
  const[sanitizedHtmlRecipe, setSanitizedHtmlRecipe] = useState('')

  const navigate = useNavigate()

  const handleFavourite = async () => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    console.log(allergies)
    console.log(cleanData(recipe, allergies))
    if (loggedIn) {
      await createRecipe(token, cleanData(recipe, allergies))
        .then((data) => {
          createFavourite(data.token, data.recipe._id)
          console.log('this is data.recipe ',   data.recipe)
          localStorage.setItem("token", data.token);
          setFavourite('Favourited!')

        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
      }
  }

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

       setSanitizedHtmlSummary(DOMPurify.sanitize(result.summary)); 
       setSanitizedHtmlRecipe(DOMPurify.sanitize(result.instructions))
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
          <ul>
            <h2>Ingredients</h2>
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>
              <div>{ingredient.nameClean}</div>
              <div>Amount: {ingredient.measures.metric.amount} {ingredient.measures.metric.unitLong}</div>
            </li>
          ))}
          </ul>
          <h2>Summary</h2>

          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlSummary }}/>
          <h2>Recipe</h2>

          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlRecipe }}/>

          <div className='favourited' style={{ fontWeight: 'bold' }} onClick={handleFavourite}>{favourite}</div>
        </div >
      ) : (
        <div>Loading recipe...</div> 
    )}
    </div>
  )
};

export default FetchedRecipes;
