export function animateCartIcon() {
  const cartIcon = document.querySelector(".cart svg");
  if (!cartIcon) return;

  cartIcon.classList.add("shake");

  setTimeout(() => {
    cartIcon.classList.remove("shake");
  }, 400);
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  console.log("Cart Data:", cart);

  // Sum up the total quantity of all items
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  console.log("Total quantity:", totalQuantity);


  const cartCountElement = document.getElementById("cart-count");
  
  if (!cartCountElement) {
    console.warn("Cart count element not found.")
    return;
  }

  if (totalQuantity > 0) {
      cartCountElement.textContent = totalQuantity;
      cartCountElement.style.visibility = "visible";
  } else {
      cartCountElement.style.visibility = "hidden";
  }
}