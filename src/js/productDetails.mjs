import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs"; // Added getLocalStorage
 
let productDetail = {}; // Renamed from product to productDetail

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
  return `$${parseFloat(price).toFixed(2)}`;
}

function renderProductDetails() {
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

  document.getElementById("productColorName").innerText = productDetail.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = productDetail.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = productDetail.Id;
}

// Rest of the alert loading function remains the same
async function loadAlerts() {
  // ... existing code ...
}

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

export async function productDetails(productId) {
  try {
    // Load alerts first
    await loadAlerts();
    
    // Then load product details
    productDetail = await findProductById(productId);
    renderProductDetails();
    
    document.getElementById("addToCart")
      .addEventListener("click", () => addProductToCart(productDetail));
  } catch (err) {
    // console.log("Error loading product details:", err);
  }
}
