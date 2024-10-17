const { useLocation } = require("react-router-dom")

const RecipePage = () => {
    const location = useLocation()
    const recipe = location.state || {}

    return (
        <div>
            <h1>
                {recipe.title}
            </h1>
            <img src={recipe.image} />
            <h2>summary</h2>
            <p>{recipe.summary}</p>
            <h2>Ingredients</h2>
            {recipe.ingredients.map((ingredient) => {
                <div>
                    <h4>{ingredient.name}</h4>
                    <h4>quantity: {ingredient.quantity}{ingredient.unit}</h4>
                </div>
            })}
            <h2>Instructions</h2>
            <p>{recipe.instructions}</p>
        </div>
    )
}

export default RecipePage