import { useNavigate } from "react-router-dom";
import './profilebutton.css'
import profilepicture from '../pictures/Dwight.jpg'
function ProfileButton() {
  const navigate = useNavigate();

  function profile() {
    navigate("/profile");
  }

  return <button className="profile-button" onClick={profile}>My Profile
  <img className="profile-pic" src={profilepicture} alt="Profile" />
  </button>
}

export default ProfileButton;
