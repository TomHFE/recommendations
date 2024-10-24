import iconlike from "../pictures/favourite_icon.png";
import { createFavourite } from "../services/recipes/toggleFavourites";
import {useState, useEffect} from 'react'

export const FavouriteButton = (props) => {

  const [clicked, setClicked] = useState(0)
  const[favouriteNumber, setFavouriteNumber] = useState(0)
  console.log(props.button)
  console.log(props.recipeId)

useEffect(() => {
  setFavouriteNumber(props.button)
},[])


  const handleFavourite = async () => {
    const token = localStorage.getItem("token");
    //console.log("LikeButtonProps", props);
    const favourited = await createFavourite(token, props.recipeId).then((data) => {
      console.log(data.favourites)
      setFavouriteNumber(data.favourites.length)
      localStorage.setItem("token", data.token);
    });
    console.log(clicked);
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
      <p style={{ marginRight: "0.2rem" }}>{favouriteNumber}</p>
      <img
        src={iconlike}
        alt="Comments icon"
        style={{ maxWidth: "1.5rem", maxHeight: "1.5rem", cursor: "pointer" }}
        onClick={handleFavourite}
      />
    </div>
  );
};
