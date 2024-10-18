import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./feedpage.css";
import { getRecipesWithUserDetails } from "../../services/recipes/getRecipesWithUserDetails";
import Recipe from "../../components/Recipe";
import LogoutButton from "../../components/LogoutButton";
import NavBar from "../../navbar/navbar";
import { SearchFilter } from "../../components/searchFilter";

export function FeedPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchApplied, setSearchApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getRecipesWithUserDetails(token)
        .then((data) => {
          setRecipes(data.recipes);
          setFilteredRecipes(data.recipes);
          if (filteredRecipes.length === 0) {
            setSearchApplied(true);
          }

          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <>

      <div>
        <h2> What recipe do you fancy?</h2>
        <SearchFilter />

        <h2>Recipes</h2>
        <div className="feed" role="feed">
          {searchApplied ? (
            filteredRecipes.length === 0 ? (
              <p>No recipes available for the selected filters</p>
            ) : (
              filteredRecipes.map((recipe) => (
                <Recipe recipe={recipe} key={recipe._id} />
              ))
            )
          ) : recipes.length === 0 ? (
            <p> Sorry, we could not find you any recipe</p>
          ) : (
            recipes.map((recipe) => <Recipe recipe={recipe} key={recipe._id} />)
          )}
        </div>

        <div className="logout">
          {" "}
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
