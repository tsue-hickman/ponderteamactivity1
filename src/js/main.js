//main.js
import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./cartAnimation.mjs";

// Call the productList function when the page loads
window.addEventListener("DOMContentLoaded", () => {
  productList(".product-list", "tents");
  loadHeaderFooter();
  updateCartCount();
});
