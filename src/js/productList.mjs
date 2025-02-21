import { getData } from "../js/productData.mjs";
import { renderListWithTemplate } from "../js/utils.mjs";

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

function addNewsletterSignup() {
  const footer = document.querySelector("footer");
  if (footer) {
    const signup = document.createElement("div");
    signup.className = "newsletter-signup";
    signup.innerHTML = 
      "<h3>Subscribe to Our Newsletter</h3>" +
      "<form id=\"newsletter-form\">" +
        "<input type=\"email\" placeholder=\"Enter your email\" required>" +
        "<button type=\"submit\">Subscribe</button>" +
      "</form>";
    footer.appendChild(signup);

    const form = signup.querySelector("#newsletter-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value;
      localStorage.setItem("newsletter-email", email);
      form.innerHTML = "<p>Thanks for subscribing!</p>";
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

    addNewsletterSignup();
  } catch (error) {
    const productContainer = document.querySelector(selector);
    if (productContainer) {
      productContainer.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
  }
}
