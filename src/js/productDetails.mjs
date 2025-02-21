import { findProductById } from "./productData.mjs";
<<<<<<< HEAD
import { setLocalStorage, getLocalStorage } from "./utils.mjs";
=======
import { setLocalStorage, getLocalStorage } from "./utils.mjs"; // Added getLocalStorage
 
let productDetail = {}; // Renamed from product to productDetail
>>>>>>> th--feature/sorting-product

// Declare product globally without initialization
// eslint-disable-next-line no-redeclare
let product;

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
<<<<<<< HEAD
  document.getElementById("productName").innerText = product.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;

  const discount = calculateDiscount(product);

  const existingFlag = document.querySelector(".discount-flag");
  if (existingFlag) {
    existingFlag.remove();
  }

  if (discount > 0) {
    const discountFlag = document.createElement("div");
    discountFlag.className = "discount-flag";
    discountFlag.textContent = discount + "% Off";
    document.querySelector(".product-detail").appendChild(discountFlag);
  }

  const priceDisplay = document.getElementById("productFinalPrice");
  priceDisplay.innerHTML = 
    "<span class=\"current-price\">" + formatPrice(product.FinalPrice) + "</span>" +
    (discount > 0 ? "<span class=\"original-price\">" + formatPrice(product.SuggestedRetailPrice) + "</span>" : "");
=======
  document.getElementById("productName").innerText = productDetail.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = productDetail.NameWithoutBrand;
  document.getElementById("productImage").src = productDetail.Image;
  document.getElementById("productImage").alt = productDetail.Name;
  
  // Add discount display
  const discount = calculateDiscount(productDetail);
  const priceDisplay = document.getElementById("productFinalPrice");
  priceDisplay.innerHTML = `
    ${discount > 0 ? `<span class="discount-tag">-${discount}%</span>` : ""}
    <span class="current-price">${formatPrice(productDetail.FinalPrice)}</span>
    ${discount > 0 ? `<span class="original-price">${formatPrice(productDetail.SuggestedRetailPrice)}</span>` : ""}
  `;
>>>>>>> th--feature/sorting-product

  document.getElementById("productColorName").innerText = productDetail.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = productDetail.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = productDetail.Id;
}

<<<<<<< HEAD
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
    // No console.log
  }
=======
// Rest of the alert loading function remains the same
async function loadAlerts() {
  // ... existing code ...
>>>>>>> th--feature/sorting-product
}

function addProductToCart() {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

export async function productDetails(productId) {
  try {
    await loadAlerts();
<<<<<<< HEAD
    product = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", addProductToCart);
=======
    
    // Then load product details
    productDetail = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", () => addProductToCart(productDetail));
>>>>>>> th--feature/sorting-product
  } catch (err) {
    // No console.log
  }
}
