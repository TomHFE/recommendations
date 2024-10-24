import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipesWithUserDetails } from "../../services/recipes/getRecipesWithUserDetails";
import "./profile.css";
import { getUserDetails } from "../../services/getUserDetails";
import RecipeProfile from './recipe'

export function Profile() {
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [clicked, setClicked] = useState(0)
  const navigate = useNavigate();


// maybe fetch usersfavourites directly

console.log(recipes)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getRecipesWithUserDetails(token)
        .then((data) => {
          setRecipes(data.recipes);
          localStorage.setItem("token", data.token);
          return getUserDetails(data.token);
        })
        .then((user) => {
          localStorage.setItem("token", user.token);
          console.log(user);
          setProfile(user.message);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, clicked]);

  const handleFollowers = () => {
    navigate("/user_followers");
  };
  const handleFollowing = () => {
    navigate("/user_following");
  };

  if (!profile || recipes.length === 0) {
    return <div>Loading...</div>;
  }

  const favouritedRecipes = recipes.filter((recipe) =>
    profile[0].favourites.includes(recipe._id)
  );

  return (
    <div>
      <div>
        <h1>{profile[0].username}</h1>
        <img src={profile[0].profilePictureURL} alt="User image" />
        <div className="profile-actions">
          <h3 onClick={handleFollowers}>Followers</h3>
          <h3 onClick={handleFollowing}>Following</h3>
        </div>
      </div>

      <h1>Favourites</h1>
      <div onClick={() => {setClicked(clicked + 1)}}>
        {favouritedRecipes.map((recipe) => (
          <RecipeProfile key={recipe._id} {...recipe} />
        ))}
      </div>
    </div>
  );
}
