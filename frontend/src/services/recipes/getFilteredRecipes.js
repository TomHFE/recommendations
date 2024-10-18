// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFilteredRecipes(token, filters) {
  console.log("this is filters" + filters);
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
    // body: JSON.stringify({ nationality: "Indian" }),
  };

  console.log("this is request options" + requestOptions);
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
