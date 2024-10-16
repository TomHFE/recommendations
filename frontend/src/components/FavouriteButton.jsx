import iconlike from "../pictures/iconlikebutton.png";
import { createFavourite } from "../services/recipes/toggleFavourites";

export const FavouriteButton = (props) => {
  const handleFavourite = async () => {
    const token = localStorage.getItem("token");
    //console.log("LikeButtonProps", props);
    const favourited = await createFavourite(token, props.recipeId);
    //console.log(liked);
    window.location.reload();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "4rem",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginRight: "1rem",
      }}
    >
      <p style={{ marginRight: "0.2rem" }}>{props.number}</p>
      <img
        src={iconlike}
        alt="Comments icon"
        style={{ maxWidth: "1.5rem", maxHeight: "1.5rem", cursor: "pointer" }}
        onClick={handleFavourite}
      />
    </div>
  );
};
