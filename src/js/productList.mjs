import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

// Declare product globally without initialization
let product;

function calculateDiscount(prod) {
  if (prod.SuggestedRetailPrice && prod.FinalPrice) {
    const suggestedPrice = parseFloat(prod.SuggestedRetailPrice);
    const finalPrice = parseFloat(prod.FinalPrice);
    if (suggestedPrice > finalPrice) {
      const discount = ((suggestedPrice - finalPrice) / suggestedPrice) * 100;
      return Math.round(discount);
    }
  }
  return 0;
}

function formatPrice(price) {
  return "$" + parseFloat(price).toFixed(2);
}

function renderProductDetails() {
  document.getElementById("productName").innerText = product.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;

  const discount = calculateDiscount(product);
  const priceDisplay = document.getElementById("productFinalPrice");
  priceDisplay.innerHTML = 
    (discount > 0 ? "<span class=\"discount-tag\">-" + discount + "%</span>" : "") +
    "<span class=\"current-price\">" + formatPrice(product.FinalPrice) + "</span>" +
    (discount > 0 ? "<span class=\"original-price\">" + formatPrice(product.SuggestedRetailPrice) + "</span>" : "");

  document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}

async function loadAlerts() {
  try {
    const response = await fetch("../json/alerts.json");
    const data = await response.json();
    const alertContainer = document.createElement("div");
    alertContainer.className = "alert-container";

    data.alerts
      .filter(alert => alert.active)
      .forEach(alert => {
        const alertElement = document.createElement("div");
        alertElement.className = "alert";
        alertElement.textContent = alert.message;
        alertElement.style.backgroundColor = alert.background;
        alertElement.style.color = alert.color;
        alertContainer.appendChild(alertElement);
      });

    const mainContent = document.querySelector("main");
    mainContent.insertBefore(alertContainer, mainContent.firstChild);
  } catch (err) {
    // No console.log per your rules
  }
}

function addProductToCart(prodToAdd) {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(prodToAdd);
  setLocalStorage("so-cart", cartItems);
}

export async function productDetails(productId) {
  try {
    await loadAlerts();
    product = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", () => addProductToCart(product));
  } catch (err) {
    // No console.log per your rules
  }
}
