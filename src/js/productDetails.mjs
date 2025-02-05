import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";

let product = {};

function calculateDiscount(product) {
  if (product.SuggestedRetailPrice && product.FinalPrice) {
    const suggestedPrice = parseFloat(product.SuggestedRetailPrice);
    const finalPrice = parseFloat(product.FinalPrice);
    if (suggestedPrice > finalPrice) {
      const discount = ((suggestedPrice - finalPrice) / suggestedPrice) * 100;
      return Math.round(discount);
    }
  }
  return 0;
}

function formatPrice(price) {
  return `$${parseFloat(price).toFixed(2)}`;
}

function renderProductDetails() {
  document.getElementById("productName").innerText = product.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;
  
  // Add discount display
  const discount = calculateDiscount(product);
  const priceDisplay = document.getElementById("productFinalPrice");
  priceDisplay.innerHTML = `
    ${discount > 0 ? `<span class="discount-tag">-${discount}%</span>` : ''}
    <span class="current-price">${formatPrice(product.FinalPrice)}</span>
    ${discount > 0 ? `<span class="original-price">${formatPrice(product.SuggestedRetailPrice)}</span>` : ''}
  `;

  document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}

async function loadAlerts() {
  try {
    const response = await fetch('../json/alerts.json');
    const data = await response.json();
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';

    data.alerts
      .filter(alert => alert.active)
      .forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert';
        alertElement.textContent = alert.message;
        alertElement.style.backgroundColor = alert.background;
        alertElement.style.color = alert.color;
        alertContainer.appendChild(alertElement);
      });

    // Insert alerts at the top of the main content
    const mainContent = document.querySelector('main');
    mainContent.insertBefore(alertContainer, mainContent.firstChild);
  } catch (err) {
    console.log('Error loading alerts:', err);
  }
}

function addProductToCart() {
  setLocalStorage("so-cart", product);
}

export async function productDetails(productId) {
  try {
    // Load alerts first
    await loadAlerts();
    
    // Then load product details
    product = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", addProductToCart);
  } catch (err) {
    console.log("Error loading product details:", err);
  }
}
