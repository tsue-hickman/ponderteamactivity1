import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form submission refresh

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const redirect = getParam("redirect") || "/index.html"; // Default redirect

      if (!username || !password) {
        displayError("Please enter both username and password.");
        return;
      }

      await login({ username, password }, redirect);
    });
  }
});

/**
 * Displays an error message in the login form.
 * @param {string} message - The error message to display
 */
function displayError(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
