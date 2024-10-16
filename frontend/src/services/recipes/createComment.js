const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createComment(token, message, recipe_id, rating) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      recipe_id: recipe_id,
      rating: rating,
    }),
  };

  // below might need to change based on routes
  const response = await fetch(
    `${BACKEND_URL}/recipes/add_comment`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
