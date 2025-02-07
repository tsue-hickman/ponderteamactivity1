//main.js
import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Call the productList function when the page loads
window.addEventListener("DOMContentLoaded", () => {
  productList(".product-list", "tents");
  loadHeaderFooter();
});
