const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createRecipe(token, recipeList){

    const requestOptions={
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeList: recipeList}),
    };
  
    const response = await fetch(`${BACKEND_URL}/recipes/create_recipe`, requestOptions);
  
    if (response.status !== 201) {
      throw new Error("Unable to fetch posts");
    }
  
    const data = await response.json();
    return data;
  
      }