// CART.JS - SHOPPING CART PAGE
console.log("✅ cart.js loaded");

// DOM ELEMENTS
const cartItemsContainer = document.getElementById('cart-items');
const emptyMessage = document.getElementById('empty-cart-message');
const summaryBox = document.getElementById('summary-box');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

// UPDATE CART UI (MAIN FUNCTION)
function updateCartUI() {
  const cart = getCart(); // From main.js
  
  console.log('🔄 updateCartUI called - Cart items:', cart.length);

  if (!cart || cart.length === 0) {
    console.log('📭 Cart is empty');
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (emptyMessage) emptyMessage.style.display = 'block';
    if (summaryBox) summaryBox.style.display = 'none';
    return;
  }

  console.log('✅ Rendering cart items...');
  if (emptyMessage) emptyMessage.style.display = 'none';
  if (summaryBox) summaryBox.style.display = 'block';
  
  if (cartItemsContainer) cartItemsContainer.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemQuantity = item.quantity || 1;
    const itemPrice = Number(item.price) || 0;
    const itemTotal = itemPrice * itemQuantity;
    
    subtotal += itemTotal;

    // Use real image or fallback to placeholder
    const imageUrl = item.image || '../public/images/no-image.png';

    const itemHTML = `
      <div class="cart-item" data-id="${item.id}">
        <img src="${imageUrl}" alt="${item.name}" class="cart-item-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="image-fallback" style="display: none;">
          <span>📦</span>
        </div>
        
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">₹${itemPrice.toLocaleString('en-IN')}</p>

          <div class="quantity-controls">
            <button class="qty-btn" onclick="handleDecreaseQty(${index})">−</button>
            <span class="qty-display">${itemQuantity}</span>
            <button class="qty-btn" onclick="handleIncreaseQty(${index})">+</button>
            <button class="remove-btn" onclick="handleRemoveItem(${index})">🗑️ Remove</button>
          </div>
        </div>

        <div class="item-total">
          <p>₹${itemTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>
    `;

    if (cartItemsContainer) cartItemsContainer.innerHTML += itemHTML;
  });

  // Update totals IMMEDIATELY
  const shippingCost = 40;
  const total = subtotal + shippingCost;

  if (subtotalElement) subtotalElement.innerText = '₹' + subtotal.toLocaleString('en-IN');
  if (totalElement) totalElement.innerText = '₹' + total.toLocaleString('en-IN');

  console.log('💰 Subtotal:', subtotal, 'Total:', total);
}

// HANDLERS FOR BUTTONS

function handleIncreaseQty(index) {
  console.log('➕ Increasing qty for index:', index);
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    saveCart(cart);
    updateCartUI();
  }
}

function handleDecreaseQty(index) {
  console.log('➖ Decreasing qty for index:', index);
  const cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart(cart);
      updateCartUI();
    } else {
      handleRemoveItem(index);
    }
  }
}

function handleRemoveItem(index) {
  console.log('🗑️ Removing item at index:', index);
  const cart = getCart();
  if (cart[index]) {
    const itemName = cart[index].name || 'Item';
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`✅ "${itemName}" removed from cart`);
    updateCartUI();
    updateCartCount();
  }
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

// INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Cart page loaded - DOM ready');
  updateCartUI();
  updateCartCount();
});

// Listen for storage changes (multi-tab sync)
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY || e.key === null) {
    console.log('🔄 Storage changed in another tab');
    updateCartUI();
    updateCartCount();
  }
});
