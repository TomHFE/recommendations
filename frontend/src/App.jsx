import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { Profile } from "./pages/Profile/profile";
import CreatePage from "./navbar/create_button/createPage";
import RecipePage from "./components/recipePage";
import UsersFollowingPage from "./components/follow_component/handleFollowing";
import UsersFollowerPage from "./components/follower_component/handleFollowing";
import Searches from "./navbar/Searches";
import { MainLayout } from "./layouts/MainLayout";
import FetchedRecipes from "./navbar/fetchedRecipes";
import UserPage from "./components/UserPage";
//import { PublicProfile } from "./pages/PublicProfile/PublicProfile";

// docs: https://reactrouter.com/en/main/start/overview
//
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  { path: "/home", element: <HomePage /> },
  { path: "/", element: <HomePage /> }, 
  {
    path: "/", 
    element: <MainLayout />, 
    children: [
      { path: "/recipes", element: <FeedPage /> },
      { path: "/searches", element: <Searches /> },

      { path: "/create", element: <CreatePage /> },
      { path: "/create/fetched_recipe", element: <FetchedRecipes /> },
      { path: "/profile", element: <Profile /> },
      { path: "/recipe_page", element: <RecipePage /> },
      { path: "/user_page", element: <UserPage /> },
      { path: "/user_followers", element: <UsersFollowerPage /> },
      { path: "/user_following", element: <UsersFollowingPage /> },
    ],
  },
  //   {
  //     path: "/recipes/filtered",
  //     element: <FeedPage />,
  //   },
  // fetched_recipe
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
