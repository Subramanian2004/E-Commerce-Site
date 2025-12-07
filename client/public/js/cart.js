console.log("cart.js loaded");

// Load cart from localStorage safely
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    console.error("Cart JSON parse error", e);
    return [];
  }
}

let cart = loadCart();

// DOM Elements
const cartItemsContainer = document.getElementById("cart-items");
const emptyMessage = document.getElementById("empty-cart-message");
const summaryBox = document.getElementById("summary-box");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");

// Update UI
function updateCartUI() {
  console.log("updateCartUI: current cart =", cart);

  if (!cart || cart.length === 0) {
    emptyMessage.style.display = "block";
    summaryBox.style.display = "none";
    cartItemsContainer.innerHTML = "";
    return;
  }

  emptyMessage.style.display = "none";
  summaryBox.style.display = "block";

  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="">
        
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>

          <div class="quantity-controls">
            <button onclick="decreaseQty(${index})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${index})">+</button>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  subtotalElement.innerText = "₹" + subtotal;
  totalElement.innerText = "₹" + (subtotal + 40);
}

// Increase Quantity
function increaseQty(index) {
  cart[index].quantity++;
  saveCart();
}

// Decrease Quantity
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// Save and update
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Init
updateCartUI();
