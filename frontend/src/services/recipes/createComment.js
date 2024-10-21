const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createComment(token, message, recipe_id) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      recipe_id: recipe_id,
    }),
  };

  // below might need to change based on routes
  const response = await fetch(
    `${BACKEND_URL}/recipes/comments`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
