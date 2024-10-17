import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authentication";
import VerifiedEmail from "../../components/verifiedEmail";
import "./login.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // const token = localStorage.getItem("token");
  // if (token) {
  //   navigate("/posts");
  // }

  async function handleSubmit(event) {
    event.preventDefault();
    if (VerifiedEmail(email)) {
      try {
        const token = await login(email, password);
        localStorage.setItem("token", token);
        navigate("/recipes");
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate("/login");
      }
    } else {
      setError("Email is invalid try again");
      setEmail("");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            role="submit-button"
            id="submit"
            type="submit"
            value="Submit"
          />
        </form>
        {error && <div id="error">{error}</div>}
      </div>
    </>
  );
}
