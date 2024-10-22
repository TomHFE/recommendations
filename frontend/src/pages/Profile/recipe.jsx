import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavouriteButton } from "../../components/FavouriteButton";
import { CommentButton } from "../../components/CommentButton";

const Recipe = (props) => {
  const navigate = useNavigate();
  const [sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState("");

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
              number={props.recipe?.favourites?.length || 0} // Default to 0 if undefined
              recipeId={props.recipe?._id}
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

export default Recipe;
