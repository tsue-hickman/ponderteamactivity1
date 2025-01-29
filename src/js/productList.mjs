// productList.mjs
import { getData } from "../js/productData.mjs";
import { renderListWithTemplate } from "../js/utils.mjs";

function calculateDiscount(originalPrice, finalPrice) {
  if (!originalPrice || !finalPrice) return 0;
  const discount = ((originalPrice - finalPrice) / originalPrice) * 100;
  return Math.round(discount);
}

function productCardTemplate(product) {
  const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  const discountTag = discount > 0 ? `<p class="discount-tag">${discount}% Off</p>` : "";
  
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      ${discountTag}
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
      ${discount > 0 ? `<p class="original-price">$${product.SuggestedRetailPrice}</p>` : ""}
    </a>
  </li>`;
}

function getTopFourTents(products) {
  return products.slice(0, 4);
}

export default async function productList(selector, category) {
  try {
    const products = await getData(category);
    const topFourTents = getTopFourTents(products);
    const productContainer = document.getElementById(selector);
    renderListWithTemplate(productCardTemplate, productContainer, topFourTents);
  } catch (error) {
    // console.error("Error fetching products:", error);
  }
}
