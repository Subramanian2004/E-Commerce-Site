// Global helpers

function getCart() {
  return JSON.parse(localStorage.getItem("vendo_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("vendo_cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = total;
}

updateCartCount();
