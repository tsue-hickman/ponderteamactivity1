import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { renderListWithTemplate } from "./utils.mjs";

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector('#cart-total');

  if (cartItems.length === 0) {
    productList.innerHTML =
      "<p>Your cart is empty! Add items to view them in cart.</p>";
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item)).join("");
    productList.innerHTML = htmlItems;

    document.querySelectorAll(".remove-from-cart").forEach(button => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        removeProductFromCart(itemId);
      })
    })

    document.querySelectorAll(".quantity-dropdown").forEach(select => {
      select.addEventListener("change", (event) => {
        const itemId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value, 10);
        updateProductQuantity(itemId, newQuantity);
      });
    });

    const totalPrice = cartItems.reduce((total, item) => total + item.FinalPrice, 0);
    cartTotal.textContent = totalPrice.toFixed(2);

    cartFooter.classList.remove("hide");
  }
}

function cartItemTemplate(item) {

  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
    return `<option value="${num}" ${num === item.quantity ? "selected" : ""}>${num}</option>`;
  }).join("");

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <select class="quantity-dropdown" data-id="${item.Id}">
    ${quantityOptions}
  </select>
  <p class="cart-card__quantity">${item.quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="remove-from-cart" data-id="${item.Id}">&times;</span>
</li>`;

  return newItem;
}

function removeProductFromCart(itemId) {
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.filter(item => item.Id !== itemId);

  setLocalStorage("so-cart", cartItems);

  renderCartContents()
}