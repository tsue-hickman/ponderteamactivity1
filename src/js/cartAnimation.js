export function animateCartIcon() {
  const cartIcon = document.querySelector(".cart svg");
  if (!cartIcon) return;

  cartIcon.classList.add("shake");

  setTimeout(() => {
    cartIcon.classList.remove("shake");
  }, 400);
}
