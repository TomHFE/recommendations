import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to the Recipe Finder!</h1>
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

