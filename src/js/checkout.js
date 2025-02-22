//checkout.js
import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

// Call the productList function when the page loads
window.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  setupFormValidation();
  checkoutProcess.init("so-cart", "#order-summary");
});

function setupFormValidation() {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      alert("Please fill out all fields correctly before submitting.");
    }
  });
}
