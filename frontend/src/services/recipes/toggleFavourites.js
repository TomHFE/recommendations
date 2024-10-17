const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createFavourite(token, recipe_id) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipe_id: recipe_id,
    }),
  };

  const response = await fetch(
    `${BACKEND_URL}/recipes/toggle_favourites`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
