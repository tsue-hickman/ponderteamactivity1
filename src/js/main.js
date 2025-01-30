//main.js
import productList from "./productList.mjs";

// Call the productList function when the page loads
window.addEventListener("DOMContentLoaded", () => {
  productList(".product-list", "tents");
})

