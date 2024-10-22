import DOMPurify from 'dompurify'; // Import the DOMPurify library
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Recipe = (props) => {

    const navigate = useNavigate();
    const[sanitizedHtmlSummary, setSanitizedHtmlSummary] = useState('')

    useEffect(() => {
        setSanitizedHtmlSummary(DOMPurify.sanitize(props.summary)); 

    },[])

    
    const navigateToRecipe = () => {
        navigate('/recipe_page', {state: {recipe: props, summary: sanitizedHtmlSummary}})
    }
    
    return (
        <div onClick={navigateToRecipe}>
 <h1>{props.title}</h1>
 <img src={props.image} alt='recipe image'/>
    <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlSummary }}/>
 </div>
)
}

export default Recipe