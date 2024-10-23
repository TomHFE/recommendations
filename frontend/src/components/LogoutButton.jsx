import { useNavigate } from "react-router-dom";
import "./logoutbutton.css";
import { useState } from "react";
// import cryingGif from "../pictures/michael-scott-crying.gif";
function LogoutButton() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  function logOut() {

      localStorage.removeItem("token");
      navigate("/");
  }

  return (
    <>
      <button className="logout-button" onClick={logOut}>
        Log out
      </button>
    
    </>
  );
}

export default LogoutButton;
