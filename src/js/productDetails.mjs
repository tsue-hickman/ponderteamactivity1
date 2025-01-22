// productDetails.mjs
 
import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";
 
let product = {};
 
// function addToCart() {
//   setLocalStorage("so-cart", product);
// }
 
function renderProductDetails() {
  document.getElementById("productName").innerText = product.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;
  document.getElementById("productFinalPrice").innerText = product.FinalPrice;
  document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}
 
export async function productDetails(productId) {
  // First, use findProductById to get the details for the current product
  try {
    product = await findProductById(productId);
    // Once we have the product details we can render out the HTML
    renderProductDetails();
    // Add a listener to Add to Cart button
    document.getElementById("addToCart")
      .addEventListener("click", addToCart);
  } catch (err) {
    console.log("Error loading product details:", err);
  }
}