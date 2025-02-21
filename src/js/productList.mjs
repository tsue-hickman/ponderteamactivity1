import { getData } from "../js/productData.mjs";
import { renderListWithTemplate } from "../js/utils.mjs";
import { findProductById } from "../js/productData.mjs";
import { calculateDiscount, formatPrice } from "../js/productDetails.mjs";
import { setLocalStorage, getLocalStorage } from "../js/utils.mjs";

function productCardTemplate(product) {
  const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  const discountTag = discount > 0 ? "<p class=\"discount-tag\">" + discount + "% Off</p>" : "";

  return "<li class=\"product-card\">" +
    "<a href=\"product_pages/index.html?product=" + product.Id + "\">" +
      "<img src=\"" + product.Image + "\" alt=\"Image of " + product.Name + "\" />" +
      discountTag +
      "<h3 class=\"card__brand\">" + product.Brand.Name + "</h3>" +
      "<h2 class=\"card__name\">" + product.Name + "</h2>" +
      "<p class=\"product-card__price\">$" + product.FinalPrice + "</p>" +
      (discount > 0 ? "<p class=\"original-price\">$" + product.SuggestedRetailPrice + "</p>" : "") +
    "</a>" +
    "<button class=\"quick-view-btn\" data-id=\"" + product.Id + "\">Quick View</button>" +
  "</li>";
}

function getTopFourTents(products) {
  return products.slice(0, 4);
}

function showQuickViewModal(prod) {
  const modal = document.createElement("div");
  modal.className = "quick-view-modal";
  const discount = calculateDiscount(prod.SuggestedRetailPrice, prod.FinalPrice);
  modal.innerHTML = 
    "<div class=\"modal-content\">" +
      "<span class=\"close-modal\">×</span>" +
      "<img src=\"" + prod.Image + "\" alt=\"Image of " + prod.Name + "\" />" +
      "<h3 class=\"modal-brand\">" + prod.Brand.Name + "</h3>" +
      "<h2 class=\"modal-name\">" + prod.NameWithoutBrand + "</h2>" +
      "<p class=\"modal-price\">" +
        (discount > 0 ? "<span class=\"discount-tag\">-" + discount + "%</span>" : "") +
        "<span class=\"current-price\">" + formatPrice(prod.FinalPrice) + "</span>" +
        (discount > 0 ? "<span class=\"original-price\">" + formatPrice(prod.SuggestedRetailPrice) + "</span>" : "") +
      "</p>" +
      "<p class=\"modal-color\">Color: " + prod.Colors[0].ColorName + "</p>" +
      "<div class=\"modal-description\">" + prod.DescriptionHtmlSimple + "</div>" +
      "<button class=\"modal-add-to-cart\" data-id=\"" + prod.Id + "\">Add to Cart</button>" +
    "</div>";

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  const addToCartBtn = modal.querySelector(".modal-add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    let cartItems = getLocalStorage("so-cart") || [];
    if (!Array.isArray(cartItems)) cartItems = [];
    cartItems.push(prod);
    setLocalStorage("so-cart", cartItems);
    modal.remove();
  });
}

export default async function productList(selector, category = null) {
  try {
    const effectiveCategory = category || (new URLSearchParams(window.location.search).get("category") || "defaultCategory");

    const products = await getData(effectiveCategory);
    const topFourTents = getTopFourTents(products);
    const productContainer = document.querySelector(selector);
    renderListWithTemplate(productCardTemplate, productContainer, topFourTents);

    const quickViewButtons = document.querySelectorAll(".quick-view-btn");
    quickViewButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const productId = button.dataset.id;
        const prod = await findProductById(productId);
        showQuickViewModal(prod);
      });
    });
  } catch (error) {
    const productContainer = document.querySelector(selector);
    if (productContainer) {
      productContainer.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
  }
}
