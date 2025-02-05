import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

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
  }
}

function cartItemTemplate(item) {
  console.log(item);

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
  <p class="cart-card__quantity">qty: 1</p>
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

renderCartContents();
