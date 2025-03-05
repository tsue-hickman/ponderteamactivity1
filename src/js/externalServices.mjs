const baseURL = import.meta.env.VITE_SERVER_URL; 
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw { name: "servicesError", message: res.statusText };
  }
}

export async function getProductsByCategory(category = "tents") {
  const response = await fetch(baseURL + `products/search/${category}`)
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const data = await convertToJson(response);
  return data.Result; 
}

export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(baseURL + "checkout/", options).then(convertToJson);
}

export async function loginRequest(creds) {
  const url = "http://server-nodejs.cit.byui.edu:3000/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    return data.accessToken; // The token returned by the server
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Propagate the error to be handled by the calling function
  }
}
