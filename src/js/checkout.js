import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

// Initialize page when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  checkoutProcess.init("so-cart", "#order-summary");
  setupFormValidation();
});

function setupFormValidation() {
  const form = document.getElementById("checkout-form");
  if (!form) {
    // console.error("Checkout form not found!");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission for AJAX handling
    const isValid = form.checkValidity();
    form.reportValidity(); // Display browser-native validation messages
    if (isValid) {
      checkoutProcess.checkout(form); // This now handles success internally
    }
  });
}
