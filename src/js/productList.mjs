import { getData } from "../js/productData.mjs";
import { renderListWithTemplate } from "../js/utils.mjs"; // Import the new reusable function

// Template function to create HTML for each product
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// Filter to show only 4 products
function getTopFourTents(products) {
  return products.slice(0, 4); // Return the first 4 products
}

// Fetch products by category and display them
export default async function productList(selector, category) {
  try {
    // Fetch products for the specified category
    const products = await getData(category); 

    // Filter the products to show only the top 4 tents
    const topFourTents = getTopFourTents(products);

    // Get the container element
    const productContainer = document.getElementById(selector);

    // Use the reusable render function to render the products
    renderListWithTemplate(productCardTemplate, productContainer, topFourTents);
    
  } catch (error) {
    // console.error("Error fetching products:", error);
  }
}

// Sample fetch function (can be used in other parts of the app)
async function fetchProducts() {
  try {
    const response = await fetch("https://api.example.com/products"); // Example API endpoint
    const data = await response.json();
    return data; // Assuming the data is in JSON format
  } catch (error) {
    // console.error("Error fetching products:", error);
    return []; // Return empty array in case of error
  }
}

// Example of calling the fetchProducts function
fetchProducts().then(products => {
  
  // console.log(products); // Handle the products here
});

