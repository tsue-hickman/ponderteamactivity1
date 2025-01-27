import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";
 
let product = {};
 
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

function addProductToCart() {
  setLocalStorage("so-cart", product);
}

export async function productDetails(productId) {
  // findProductById to get details for the current product
  try {
    product = await findProductById(productId);
    // render HTML based on product
    renderProductDetails();
    // listener for Add to Cart button
    document.getElementById("addToCart")
      .addEventListener("click", addProductToCart);
  } catch (err) {
    console.log("Error loading product details:", err);
  }
}