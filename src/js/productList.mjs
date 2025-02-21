import { getData } from "../js/productData.mjs";
import { renderListWithTemplate } from "../js/utils.mjs";
import { setLocalStorage, getLocalStorage } from "../js/utils.mjs"; // Added for CTA

function calculateDiscount(originalPrice, finalPrice) {
  if (!originalPrice || !finalPrice) return 0;
  const discount = ((originalPrice - finalPrice) / originalPrice) * 100;
  return Math.round(discount);
}

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
  "</li>";
}

function getTopFourTents(products) {
  return products.slice(0, 4);
}

function showCTABanner() {
  const hasVisited = getLocalStorage("has-visited");
  if (!hasVisited) {
    const banner = document.createElement("div");
    banner.className = "cta-banner";
    banner.innerHTML = 
      "<div class=\"cta-content\">" +
        "<h2>Welcome to Our Site!</h2>" +
        "<p>Register now for a chance to win a $100 gift card in our monthly giveaway!</p>" +
        "<button class=\"cta-register\">Register Now</button>" +
        "<span class=\"cta-close\">×</span>" +
      "</div>";

    document.body.appendChild(banner);

    const closeBtn = banner.querySelector(".cta-close");
    closeBtn.addEventListener("click", () => {
      banner.remove();
      setLocalStorage("has-visited", true);
    });

    const registerBtn = banner.querySelector(".cta-register");
    registerBtn.addEventListener("click", () => {
      window.location.href = "/register.html"; // Adjust to your register page URL
      setLocalStorage("has-visited", true);
    });

    banner.addEventListener("click", (e) => {
      if (e.target === banner) {
        banner.remove();
        setLocalStorage("has-visited", true);
      }
    });
  }
}

export default async function productList(selector, category = null) {
  try {
    const effectiveCategory = category || (new URLSearchParams(window.location.search).get("category") || "defaultCategory");

    const products = await getData(effectiveCategory);
    const topFourTents = getTopFourTents(products);
    const productContainer = document.querySelector(selector);
    renderListWithTemplate(productCardTemplate, productContainer, topFourTents);

    showCTABanner(); // Added here
  } catch (error) {
    const productContainer = document.querySelector(selector);
    if (productContainer) {
      productContainer.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
  }
}
