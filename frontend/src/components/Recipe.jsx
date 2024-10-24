import "./recipe.css";
import { FavouriteButton } from "./FavouriteButton";
import { CommentButton } from "./CommentButton";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import DOMPurify from "dompurify";

import "./recipe.css";
function Recipe(props) {
  const [sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState("");
  useEffect(() => {
    setSanitizedHtmlSummary(DOMPurify.sanitize(props.recipe.summary));
  }, []);
  //console.log("props: ", props)
  const navigate = useNavigate();
  const favourites = props.recipe.favourites.length
  console.log(favourites)
  console.log('this is props', props);
  return (
    <>
      <div className="whole-card">
        <article className="card" key={props.recipe._id}>
          <div className="individual-card">
            <h3 className="card-title"> {props.recipe.title}</h3>
            <div className="image-container">
              {props.recipe.image && (
                <img
                  className="image"
                  src={props.recipe.image}
                  alt="Recipe visual"
                  style={{ maxWidth: "250px" }}
                />
              )}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedHtmlSummary }}
              className="card-text"
            />
            <button
              className="card-button"
              onClick={() =>
                navigate(`/recipe_page`, { state: { recipe: props.recipe } })
              }
            >
              Click to See More
            </button>
            <div className="buttons">
              <FavouriteButton
                recipeId={props.recipe._id}
                button={favourites}
              />
              <CommentButton
                comments={props.recipe.comments}
                recipeId={props.recipe._id}
              />
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
export default Recipe;
