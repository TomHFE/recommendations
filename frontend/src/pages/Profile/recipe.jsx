import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavouriteButton } from "../../components/FavouriteButton";
import { CommentButton } from "../../components/CommentButton";

const RecipeProfile = (props) => {
  const navigate = useNavigate();
  const [sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState("");

  console.log('this is props for recipe', props)
  useEffect(() => {
    setSanitizedHtmlSummary(DOMPurify.sanitize(props.summary));
  }, []);

  // const navigateToRecipe = () => {
  //   navigate("/recipe_page", {
  //     state: { recipe: props, summary: sanitizedHtmlSummary },
  //   });
  // };
  
  return (
    <div className="whole-card">
      <article className="card">
        <div className="individual-card">
          <h1 className="card-title">{props.title}</h1>
          <div className="image-container">
            <img className="image" src={props.image} alt="recipe image" />
          </div>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlSummary }}
          />
          <button
            className="card-button"
            onClick={() =>
              navigate(`/recipe_page`, { state: { recipe: props } })
            }
          >
            Click to See More
          </button>
          <div className="buttons">
            <FavouriteButton
              recipeId={props._id} button={props.favourites.length}
            />
            <CommentButton
              comments={props.recipe?.comments || []} // Default to empty array if undefined
              recipeId={props.recipe?._id}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default RecipeProfile;
