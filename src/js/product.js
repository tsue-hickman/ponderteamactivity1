import { getParam, loadHeaderFooter } from "./utils.mjs";
import { productDetails } from "./productDetails.mjs";
import { animateCartIcon } from "./cartAnimation";

const productId = getParam("product");
productDetails(productId);

document.getElementById("addToCart").addEventListener("click", animateCartIcon);
loadHeaderFooter();