

export default function cleanData (data, allergies) {
    const exportedData = {
       title: data.title,
       image: data.image,
       summary: data.summary,
       instructions: data.instructions,
        SearchingParameters: {
            nationalities: data.cuisines[0],
            dishType: data.dishType,
            preparationMinutes: data.preparationMinutes,
            cookingMinutes: data.cookingMinutes,
            servings: data.servings,
            nuts: allergies[0].value,
            shellfish: allergies[1].value,
            dairy: allergies[2].value,
            soy: allergies[3].value,
            eggs: allergies[4].value,
            vegeterian: data.vegeterian,
            vegan: data.vegan,
            pescatarian: checkPescatarian(data.extendedIngredients),
            glutenFree: data.glutenFree,
            dairyFree: data.dairyFree,
            healthy: data.healthy,
            costFriendly: data.cheap,
            readyInMinutes: data.readyInMinutes
        },
        ingredients: convertIngredients(data.
            extendedIngredients),
    }
    function checkPescatarian (ingredients) {
        const checkedIngredients = ingredients.filter((ingredient) => ingredient.aisle.includes('fish'))
        return checkedIngredients == true ? true : false
    }
    function convertIngredients (ingredients) {
        const cleanedIngredients = ingredients.map((ingredient) => ({
            
                name: ingredient.name,
                quantity: ingredient.measures.metric.amount,
                unit: ingredient.measures.metric.unitLong,
            
        }))
        return cleanedIngredients
    }

    return exportedData
}