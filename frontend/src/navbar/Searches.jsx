// import { useEffect } from "react"
// import { useLocation } from "react-router-dom"

// const Searches = () => {
//         const location = useLocation()
//         const  {recipe, user} = location.state || {}
//  return (
// <div>
// <div>
//   {recipe && recipe.length > 0 ? (
//     recipe.map((res) => (
//       <div key={res.id}>{res.title}</div>
//     ))
//   ) : (
//     <div>No recipes found</div>
//   )}
// </div>

// <div>
//   {user && user.length > 0 ? (
//     user.map((use) => (
//       <div key={use.id}>{use.username}</div>
//     ))
//   ) : (
//     <div>No users found</div>
//   )}
// </div>

// </div> )
// }
// export default Searches
import DOMPurify from 'dompurify'; // Import the DOMPurify library
import { toggleFollowingServ } from '../services/toggleFollowingServ';
import { useLocation } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

const Searches = () => {
  const location = useLocation();
  const { recipes = [], user = [] } = location.state || {};
  const navigate = useNavigate();
  
  const handleRecipe = (recipe, summary) => {
    navigate('/recipe_page' , {state: {recipe: recipe, summary: summary}})
  }
  const handleUser = (user) => {
    navigate('/user_page' , {state: {user: user}})
  }
  const handleFollowing = async (id) => {
      console.log('this is id', id)
      const token = localStorage.getItem('token')
      console.log('this is token', token)
      const loggedIn = token !== null
      console.log(loggedIn)
      if (loggedIn) {
        try {
          await toggleFollowingServ(token, id).then((data) => {
            console.log(data)
            
            return localStorage.setItem('token', data.token)
          })
        }
        catch (error) {
          console.log(error.message)
          navigate('/login')
        }
      }
  }
  console.log(user)
  console.log(recipes)

return (
    <div>
      <div>

          <h2>Recipes</h2>
        {recipes.length > 0 ? (
            recipes.map((res, i) => {
              let summary = DOMPurify.sanitize(res.summary); 
            return (
            <div key={res.id} onClick={() => {handleRecipe(res, summary)}}>
                <h1>{res.title}</h1>
                <img src={res.image} alt='recipe image' />
                <div dangerouslySetInnerHTML={{ __html: summary }}/>
                </div>
          )})
        ) : (
          <h2>No recipes found</h2>
        )}
      </div>

      <div>
        <h2>Users</h2>
        {user.length > 0 ? (
          user.map((use) => (
            <div key={use._id}>
              <div  onClick={() => handleUser(use)}>
                  <h1 >{use.username}</h1>
                  <img src={use.profilePictureURL} alt='profile picture'/>
              </div>
                  <button onClick={() => {{handleFollowing(use._id)}}}>Follow</button>
              </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default Searches;
