// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUsersAndRecipes(token, searchparam) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",

    },    
    body: JSON.stringify({ searchparam: searchparam }),

  };
    console.log(requestOptions)
  const response = await fetch(
    `${BACKEND_URL}/searchbar/`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch following");
  }

  const data = await response.json();
  return data;
}
