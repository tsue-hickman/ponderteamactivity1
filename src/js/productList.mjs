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

function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === "name") {
      return a.Name.localeCompare(b.Name);
    } else if (sortBy === "price") {
      return parseFloat(a.FinalPrice) - parseFloat(b.FinalPrice);
    }
    return 0;
  });
}

function addSortingControls(container, products, renderFunction) {
  const sortingDiv = document.createElement("div");
  sortingDiv.className = "sorting-controls";
  sortingDiv.innerHTML = 
    "<label for=\"sort-select\">Sort by:</label>" +
    "<select id=\"sort-select\">" +
      "<option value=\"default\">Default</option>" +
      "<option value=\"name\">Name</option>" +
      "<option value=\"price\">Price</option>" +
    "</select>";

  container.parentNode.insertBefore(sortingDiv, container);

  document.getElementById("sort-select").addEventListener("change", (e) => {
    const sortBy = e.target.value;
    const sortedProducts = sortBy === "default" 
      ? products 
      : sortProducts(products, sortBy);
    renderFunction(sortedProducts);
  });
}

function renderProducts(products, container) {
  container.innerHTML = "";
  renderListWithTemplate(productCardTemplate, container, products);
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
      window.location.href = "/register.html";
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

export default async function productList(selector, categoryParam = null) {
  try {
    let categoryToUse = categoryParam;
    if (!categoryToUse) {
      const params = new URLSearchParams(window.location.search);
      categoryToUse = params.get("category") || "defaultCategory";
    }

    const productContainer = document.querySelector(selector);
    const products = await getData(categoryToUse);

    renderProducts(products, productContainer);
    addSortingControls(
      productContainer, 
      products, 
      (sortedProducts) => renderProducts(sortedProducts, productContainer)
    );

    addNewsletterSignup();
    showCTABanner();

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
