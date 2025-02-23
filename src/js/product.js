import { getParam, loadHeaderFooter } from "./utils.mjs";
import { productDetails } from "./productDetails.mjs";
import { animateCartIcon, updateCartCount } from "./cartAnimation.mjs";

const productId = getParam("product");
productDetails(productId);

document.getElementById("addToCart").addEventListener("click", animateCartIcon);
loadHeaderFooter();

updateCartCount();