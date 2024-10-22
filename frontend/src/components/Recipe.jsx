import "./post.css";
import { FavouriteButton } from "./FavouriteButton";
import { CommentButton } from "./CommentButton";
import { useNavigate } from "react-router-dom";

function Recipe(props) {
  //console.log("props: ", props)
  const navigate = useNavigate();
  console.log(props.recipe)
  return (
    <>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "white",
          marginTop: "1rem",
          marginBottom: "1rem",
          borderRadius: "1rem",
        }}
      >
        <article
          key={props.recipe._id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {props.recipe.title}
            {props.recipe.image && (
              <img src={props.recipe.image} alt="Recipe visual" />
            )}
            {props.recipe.summary}
            <button
              onClick={() =>
                navigate(`/recipe_page`, { state: { recipe: props.recipe } })
              }
            >
              Click to See More
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: "5rem",
                justifyContent: "flex-start",
              }}
            >
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
