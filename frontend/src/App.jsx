import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { Profile } from "./pages/Profile/profile";
import CreatePage from './navbar/create_button/createPage'
import RecipePage from './components/recipePage'
import UsersFollowingPage from "./components/follow_component/handleFollowing";
import UsersFollowerPage from "./components/follower_component/handleFollowing";
import { MainLayout } from "./layouts/MainLayout";
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
  {
    
    
      path: "/", // Main layout for all these routes
      element: <MainLayout />, // Wrap child routes with MainLayout
      children: [
        { path: "/recipes", element: <FeedPage /> },
        { path: "/create", element: <CreatePage /> },
        { path: "/profile", element: <Profile /> },
        { path: "/recipe_page", element: <RecipePage /> },
        { path: "/user_followers", element: <UsersFollowerPage /> },
        { path: "/user_following", element: <UsersFollowingPage /> },

      ],
    
  },
//   {
//     path: "/recipes/filtered",
//     element: <FeedPage />,
//   },
])


function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;
