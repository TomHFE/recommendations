import Spacescene from "./spacescene3";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import GoBack from "../../components/gobackbutton";
import { getRecipesWithUserDetails } from "../../services/recipes/getRecipesWithUserDetails";
// import {createrecipes} from "../../services/createrecipes";
import Recipe from "./recipe";
import './profile.css'
import followList  from "./followingList";

// build out recipe card and finish off profile page


export function Profile(){
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const [newRecipe,setNewRecipe]=useState({message:'',pictureURL:''})
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
          getRecipesWithUserDetails(token)
            .then((data) => {
              setRecipes(data.recipes);
              localStorage.setItem("token", data.token);
            })
            .catch((err) => {
              console.error(err);
              navigate("/login");
            });
        }
      }, [navigate]);
    
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

     
  // const handleSubmit= async (event)=>{
  //   event.preventDefault();
  //   try {
  //   const data = await createrecipes(token, newRecipe);
  //   setRecipes((prevrecipes) => [data.post, ...prevrecipes]);
  //   //setNewRecipe('')
  //   setNewRecipe({message:'',pictureURL:''});
    
  //   localStorage.setItem('token', data.token)
  //   window.location.reload()
  // } catch(err){
  //   console.error('Error creating post:', err)
  // }
  // }
    
return (
    <>
      <div className="container"><Spacescene/></div>
      <div className="newRecipe">
      <h1>Favourites</h1>
      {/* <form onSubmit={handleSubmit}>
        <input 
        //value = {newRecipe}
        value={newRecipe.message}
       onChange={(e) => setNewRecipe({...newRecipe, message:e.target.value})}
       //onChange={(e) => setNewRecipe( e.target.value)}
        placeholder="Type a new post ..."></input>
         <input 
            value={newRecipe.pictureURL} onChange={(e) => setNewRecipe({...newRecipe, pictureURL:e.target.value})} 
            placeholder="Paste Url picture here...">
            </input>
        <button type='submit'>Post</button>
      </form> */}
      </div>
            <h2>My recipes</h2>
      <div className="feed" role="feed">
        {recipes.map((recipe) => (
          <Recipe recipe={recipe} key={recipe._id} />
        ))}
      </div>
      <div className="friendlist"><FriendList/></div>
      
      <div className="goback"><GoBack/></div>
      <div className="logout"> <LogoutButton /></div>
      </>)}