import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Recipe = (props) => {

    const navigate = useNavigate();


    const navigateToRecipe = () => {
        navigate('/recipe_page', {state: {recipe: props}})
    }

return (
<div onClick={navigateToRecipe}>
 <h1>{props.title}</h1>
 <img src={props.image} alt='recipe image'/>
 <p>{props.summary}</p>
 </div>
)
}

export default Recipe