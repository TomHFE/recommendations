import { useNavigate } from "react-router-dom";
import "./logoutbutton.css";
import { useState } from "react";
import cryingGif from "../pictures/michael-scott-crying.gif";
function LogoutButton() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  function logOut() {
    setShowPopup(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, 5000);
  }

  return (
    <>
      <button className="logout-button" onClick={logOut}>
        Log out
      </button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            {/* <img src={cryingGif} alt="Logging out..." /> */}
            <p>Logging out...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutButton;
