import { useEffect, useState } from "react";
// import { FavouriteButton } from "../../components/FavouriteButton";
// import { CommentButton } from "../../components/CommentButton";
import { useNavigate } from "react-router-dom";

const Recipe = (props) => {
  const navigate = useNavigate();

  const navigateToRecipe = () => {
    navigate("/recipe_page", { state: { recipe: props } });
  };

  return (
    <div className="whole-card" onClick={navigateToRecipe}>
      <article className="card">
        <div className="individual-card">
          <h1 className="card-title">{props.title}</h1>
          <img src={props.image} alt="recipe image" />
          <p className="card-text">{props.summary}</p>
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
