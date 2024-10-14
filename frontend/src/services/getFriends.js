const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function FindByUsername(token, name){
    const requestOptions={
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userSearchName: name}),
    };
  
    const response = await fetch(`${BACKEND_URL}/users/find_by_username`, requestOptions);
  
    if (response.status !== 201) {
      throw new Error("Unable to fetch posts");
    }
  
    const data = await response.json();
    return data;
  
      }