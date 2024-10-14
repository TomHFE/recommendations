import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signup.css';
import { signup } from "../../services/authentication";

import VerifiedEmail from "../../components/verifiedEmail";
import VerifiedPassword  from "../../components/verifiedPassword";


export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("")

  const[emailerror, setEmailError] =useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (VerifiedEmail(email)) {
      if (VerifiedPassword(password)){
      try {
        await signup(email, password, username, profilePictureURL);
          alert("You signed up successfully")
          navigate("/login"); 
      } catch (err) {
        alert(err.message)
        setEmail("")
        setUsername("")
        setProfilePictureURL("")
      }}
      else{
        setPasswordError(alert('Password must:\n - Be min. 8 characters\n - Have a capital letter\n - Have a special character'))
        setPassword('')
      }
    }
    else {
      setEmailError(alert('Email is invalid try again'))
      setEmail('')
    }
  }

  function handleEmailChange(event) {
    let characters = event.target.value
      setEmail(characters);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value)
  }
  function handleProfilePicURLChange(event) {
    setProfilePictureURL(event.target.value)
    if (profilePictureURL == "") {
      setProfilePictureURL("https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg")
    }
  }

  return (
    <> 
    <div className="signup">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          placeholder="Email"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="username">Username:</label>
        <input
          placeholder="Username"
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="profilePictureURL">Profile picture URL</label>
        <input
          placeholder="Profile picture URL"
          id="profilePictureURL"
          type="text"
          value={profilePictureURL}
          onChange={handleProfilePicURLChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />

        {emailerror && <div>
          {emailerror}</div>}
          {passwordError &&  <div>
              {passwordError}</div>}

      </form>
      </div>
    </>
  );
}
