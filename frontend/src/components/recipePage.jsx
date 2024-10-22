// import  { useLocation } from "react-router-dom"

// const RecipePage = () => {
//     const location = useLocation()
//     const recipe = location.state || {}
//     console.log(recipe.title)
//     return (
//         <div>
//             <h1>
//                 {recipe.title}
//             </h1>
//             <img src={recipe.image} />
//             <h2>summary</h2>
//             <p>{recipe.summary}</p>
//             <h2>Ingredients</h2>
//             {recipe.ingredients.map((ingredient) => {
//                 <div>
//                     <h4>{ingredient.name}</h4>
//                     <h4>quantity: {ingredient.quantity}{ingredient.unit}</h4>
//                 </div>
//             })}
//             <h2>Instructions</h2>
//             <p>{recipe.instructions}</p>
//         </div>
//     )
// }

// export default RecipePage


import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const RecipePage = () => {
    const [recipes, setRecipes] = useState(null)
    const [sum, setSum] = useState('')
    const location = useLocation();
    const {recipe, summary} = location.state || {};
    useEffect(() => {
        setRecipes(recipe)
        setSum(summary)
        console.log(summary)
        console.log(recipe)

    },[])

    // console.log(recipe.recipe.image)
    return (
        <div>
            {recipes && (
               <div> 

            <h1>{recipes.title}</h1>
            <img src={recipes.image} alt="Recipe" />
            <h2>Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: sum }}/>

            <h2>Ingredients</h2>
            {recipes.ingredients.map((ingredient, index) => (
                <div key={index}>
                    <h4>{ingredient.name}</h4>
                    <h4>Quantity: {ingredient.quantity} {ingredient.unit}</h4>
                </div>
            ))}

            <h2>Instructions</h2>
            <p>{recipes.instructions}</p>
            </div>

            )}
        </div>
    );
};

export default RecipePage;
