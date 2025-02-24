import { renderCartContents } from "./shoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./cartAnimation.mjs";

document.addEventListener("DOMContentLoaded", renderCartContents);

loadHeaderFooter().then(() => {
    updateCartCount();
  });
