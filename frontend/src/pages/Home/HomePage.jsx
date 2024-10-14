import { Link } from "react-router-dom";
import "./HomePage.css";
import SpaceScene from "./SpaceScene"; 

export function HomePage() {
  return (
    <div className="home">
      <SpaceScene /> 
      <h1>Welcome to Spacebook!</h1>
      <div className="button-container">
        <Link to="/signup" className="box signup-box"> 
          Sign Up
        </Link>
        <Link to="/login" className="box login-box">
          Log In
        </Link>
      </div>
    </div>
  );
}

