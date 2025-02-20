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

  } catch (error) {
    const productContainer = document.querySelector(selector);
    if (productContainer) {
      productContainer.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
  }
}
