import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./cartAnimation.mjs";

let productDetail; // Using productDetail consistently

export function calculateDiscount(prod) {
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

export function formatPrice(price) {
  return "$" + parseFloat(price).toFixed(2);
}

function renderProductDetails() {
  document.getElementById("productName").innerText = productDetail.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = productDetail.NameWithoutBrand;
  document.getElementById("productImage").src = productDetail.Image;
  document.getElementById("productImage").alt = productDetail.Name;

  const discount = calculateDiscount(productDetail);

  // Remove previous discount flag if it exists
  const existingFlag = document.querySelector(".discount-flag");
  if (existingFlag) {
    existingFlag.remove();
  }

  // Add discount flag if discount exists
  if (discount > 0) {
    const discountFlag = document.createElement("div");
    discountFlag.className = "discount-flag";
    discountFlag.textContent = discount + "% Off";
    document.querySelector(".product-detail").appendChild(discountFlag);
  }

  const priceDisplay = document.getElementById("productFinalPrice");
  priceDisplay.innerHTML = `
    <span class="current-price">${formatPrice(productDetail.FinalPrice)}</span>
    ${discount > 0 ? `<span class="original-price">${formatPrice(productDetail.SuggestedRetailPrice)}</span>` : ""}
  `;

  document.getElementById("productColorName").innerText = productDetail.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = productDetail.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = productDetail.Id;
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
    // Handle error without console.log
  }
}

function addProductToCart() {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  let existingProduct = cartItems.find(item => item.Id === productDetail.Id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartItems.push({ ...productDetail, quantity: 1});
  }
  
  setLocalStorage("so-cart", cartItems);

  updateCartCount();
}

export async function productDetails(productId) {
  try {
    await loadAlerts();
    
    // Load product details
    productDetail = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", addProductToCart);
  } catch (err) {
    // Handle error without console.log
  }
}
