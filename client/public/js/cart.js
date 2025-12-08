// CART.JS - SHOPPING CART PAGE
console.log("✅ cart.js loaded");

// DOM ELEMENTS
const cartItemsContainer = document.getElementById('cart-items');
const emptyMessage = document.getElementById('empty-cart-message');
const summaryBox = document.getElementById('summary-box');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

// UPDATE CART UI
function updateCartUI() {
  const cart = getCart(); // From main.js
  
  console.log('📦 updateCartUI - Current cart:', cart);

  if (!cart || cart.length === 0) {
    console.log('🛒 Cart is empty');
    cartItemsContainer.innerHTML = '';
    emptyMessage.style.display = 'block';
    summaryBox.style.display = 'none';
    return;
  }

  console.log('✅ Cart has items, rendering...');
  emptyMessage.style.display = 'none';
  summaryBox.style.display = 'block';
  cartItemsContainer.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemQuantity = item.quantity || 1;
    const itemPrice = Number(item.price) || 0;
    const itemTotal = itemPrice * itemQuantity;
    
    subtotal += itemTotal;

    const itemHTML = `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/no-image.png'">
        
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">₹${itemPrice.toLocaleString('en-IN')}</p>

          <div class="quantity-controls">
            <button onclick="decreaseQty(${index})">−</button>
            <span class="qty-display">${itemQuantity}</span>
            <button onclick="increaseQty(${index})">+</button>
            <button class="remove-btn" onclick="removeItem(${index})">🗑️ Remove</button>
          </div>
        </div>

        <div class="item-total">
          <p>₹${itemTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>
    `;

    cartItemsContainer.innerHTML += itemHTML;
  });

  // Update totals
  const shippingCost = 40;
  const total = subtotal + shippingCost;

  subtotalElement.innerText = '₹' + subtotal.toLocaleString('en-IN');
  totalElement.innerText = '₹' + total.toLocaleString('en-IN');

  console.log('💰 Subtotal:', subtotal, 'Total:', total);
}

// INCREASE QUANTITY
function increaseQty(index) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    saveCart(cart);
    console.log('➕ Increased qty for item:', index);
  }
}

// DECREASE QUANTITY
function decreaseQty(index) {
  const cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart(cart);
      console.log('➖ Decreased qty for item:', index);
    } else {
      removeItem(index);
    }
  }
}

// REMOVE ITEM
function removeItem(index) {
  const cart = getCart();
  const itemName = cart[index]?.name || 'Item';
  cart.splice(index, 1);
  saveCart(cart);
  console.log('🗑️ Removed:', itemName);
  showToast(`✅ "${itemName}" removed from cart`);
}

// CLEAR CART
function clearCart() {
  if (confirm('⚠️ Are you sure you want to clear your entire cart?')) {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
    updateCartCount();
    showToast('🗑️ Cart cleared');
    console.log('🗑️ Cart cleared');
  }
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Cart page loaded');
  updateCartUI();
});

// Listen for storage changes (multi-tab sync)
window.addEventListener('storage', () => {
  console.log('🔄 Storage changed, updating cart');
  updateCartUI();
});
