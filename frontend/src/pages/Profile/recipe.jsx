import DOMPurify from 'dompurify'; // Import the DOMPurify library
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Recipe = (props) => {
  const navigate = useNavigate();
  const[sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState('')
  
  useEffect(() => {
        setSanitizedHtmlSummary(DOMPurify.sanitize(props.summary)); 

    },[])

  const navigateToRecipe = () => {
        navigate('/recipe_page', {state: {recipe: props, summary: sanitizedHtmlSummary}})
    }

  return (
    <div className="whole-card" onClick={navigateToRecipe}>
      <article className="card">
        <div className="individual-card">
          <h1 className="card-title">{props.title}</h1>
          <img src={props.image} alt="recipe image" />
         <div className="card-text" dangerouslySetInnerHTML={{ __html: sanitizedHtmlSummary }}/>
          {/* <button
            className="card-button"
            onClick={() =>
              navigate(`/recipe_page`, { state: { recipe: props } })
            }
          >
            Click to See More
          </button>
          <div className="buttons">
            <FavouriteButton
              number={props.recipe.favourites.length}
              recipeId={props.recipe._id}
            />
            <CommentButton
              comments={props.recipe.comments}
              recipeId={props.recipe._id}
            />
          </div> */}
        </div>
      </article>
    </div>
  );
};

export default Recipe;