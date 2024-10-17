// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFilteredRecipes(token, filters) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filters),
  };

  const response = await fetch(
    `${BACKEND_URL}/recipes/filtered`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch filteres recipes");
  }

  const data = await response.json();
  return data;
}
