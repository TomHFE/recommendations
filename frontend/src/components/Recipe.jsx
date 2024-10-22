import "./post.css";
import { FavouriteButton } from "./FavouriteButton";
import { CommentButton } from "./CommentButton";
import { useNavigate } from "react-router-dom";
import "./recipe.css";
function Recipe(props) {
  //console.log("props: ", props)
  const navigate = useNavigate();
  console.log(props.recipe)
  return (
    <>
      <div className="whole-card">
        <article className="card" key={props.recipe._id}>
          <div className="individual-card">
            <h3 className="card-title"> {props.recipe.title}</h3>

            {props.recipe.image && (
              <img src={props.recipe.image} alt="Recipe visual" />
            )}
            <p className="card-text">{props.recipe.summary}</p>
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
                number={props.recipe.favourites.length}
                recipeId={props.recipe._id}
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
