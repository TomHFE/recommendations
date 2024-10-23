import "../navbar/navbar.css";
import { useNavigate } from "react-router-dom";
import { getUsersAndRecipes } from "../services/getUserAndRecipes";
import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
// import IncomingRequests from "./components/incomingRequests";
// import SearchFriends from "./components/searchFriends";


const NavBar = () => {
  const [searchParam, setSearchParam] = useState("");
  const [result, setResult] = useState({});
  const [submit, setSubmit] = useState(0);

  useEffect(() => {
    handleSearchBar();
  }, [submit]);

  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("./recipes");
  };
  const handleProfileButton = () => {
    navigate("./profile");
  };
  const handleCreateButton = () => {
    navigate("./create");
  };
  const handleSearchBar = async () => {
    // e.preventDefault()
    const token = localStorage.getItem("token");
    const data = await getUsersAndRecipes(token, searchParam);
    setResult(data);
    localStorage.setItem("token", data.token);
    console.log(data);
    navigate('./searches', {state: {recipes: data.recipes, user: data.user}})
  };
  const handleSearchChange = (e) => {
    setSearchParam(e.target.value);
    console.log(searchParam);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchBar();
  };
  return (
    <nav className="navbar-main">
      <div className="navbar-incoming-requests">
        <button className="home" onClick={handleHomeButton}>
          Home
        </button>

        <button className="profile" onClick={handleProfileButton}>
          Profile
        </button>
        <button className="create" onClick={handleCreateButton}>
          Create
        </button>

        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search..."
            id="searchInput"
            onChange={handleSearchChange}
          />
          <button className="search-button" onClick={() => {handleSearchBar()}}>
            Search
          </button>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
