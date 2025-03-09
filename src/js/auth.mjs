import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import { loginRequest } from "./externalServices.mjs";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "so-token";

/**
 * Logs in the user by sending credentials to the authentication server.
 * If successful, stores the token and redirects the user.
 * @param {Object} creds - User credentials { username, password }
 * @param {string} redirect - The URL to redirect to after login
 */

export async function login(creds, redirect) {
    try {
        const token = await loginRequest(creds);
        localStorage.setItem(TOKEN_KEY, token);
        window.location = redirect || "/";

      } catch (error) {
        displayError("Login failed: Invalid credentials. Please try again.");
      }
}

/**
 * Checks if the authentication token is valid (not expired).
 * @returns {boolean} True if valid, false if expired
 */

export function isTokenValid() {
  const token = getLocalStorage(TOKEN_KEY);
  if (!token) return false;

  try {
    const decoded = jwt_decode(token);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decoded.exp < now) {
      console.warn("Token expired.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  };
}

/**
 * Checks if the user is logged in. If not, redirects to the login page.
 */
export function checkLogin() {
  const token = getLocalStorage(TOKEN_KEY);

  if (!isTokenValid()) {
    localStorage.removeItem(TOKEN_KEY); // Clear invalid token
    const currentPage = window.location.href;
    window.location.href = `/login.html?redirect=${encodeURIComponent(currentPage)}`;
    return null;
  }

  return token;
}

/**
 * Displays an error message on the login form.
 * @param {string} message - The error message to display
 */

function displayError(message) {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
  }