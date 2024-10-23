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




import { useLocation } from "react-router-dom"

const Searches = () => {
  const location = useLocation();
  const { recipes = [], user = [] } = location.state || {};


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
            <div key={res.id}>
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
            <div key={use.id}>
                <h1 >{use.username}</h1>
                <img src={use.profilePictureURL} alt='profile picture'/>
                <h3>{use.followingData.followers.length} followers</h3>
                <h3>{use.followingData.following.length} following</h3>
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
