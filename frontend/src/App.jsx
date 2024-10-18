import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { Profile } from "./pages/Profile/profile";
import RecipePage from './components/recipePage'
import UsersFollowingPage from "./components/follow_component/handleFollowing";
import UsersFollowerPage from "./components/follower_component/handleFollowing";
//import { PublicProfile } from "./pages/PublicProfile/PublicProfile";

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/recipes",
    element: <FeedPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/recipe_page",
    element: <RecipePage />,
  },
  {
    path: "/user_followers",
    element: <UsersFollowerPage />,
  },
  {
    path: "/user_following",
    element: <UsersFollowingPage />,
  },
  //{
  //path: "/profile/:username",
  //element: <PublicProfile />
  //}
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
