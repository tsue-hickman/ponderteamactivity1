// productList.mjs

// Sample data-fetching function (you can replace it with your actual API call)
export async function fetchProducts() {
  try {
    const response = await fetch('https://api.example.com/products'); // Replace with your actual API endpoint
    const data = await response.json();
    return data; // Assuming the data is in JSON format
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array in case of error
  }
}

// Main function to handle product list display
export default async function productList() {
  const products = await fetchProducts();
  
  // Assuming you want to dynamically display products on the webpage
  const productContainer = document.getElementById('product-list');
  
  if (products.length === 0) {
    productContainer.innerHTML = 'No products available';
  } else {
    const productHTML = products.map(product => {
      return `
        <div class="product-item">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
        </div>
      `;
    }).join('');
    
    productContainer.innerHTML = productHTML;
  }
}
