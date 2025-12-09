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

    // Generate color-based placeholder instead of loading images
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C97F', '#EB6F6F', '#8E7DBE'];
    const colorIndex = (item.id % colors.length);
    const bgColor = colors[colorIndex];
    const darkerColor = adjustBrightness(bgColor, -20);

    const itemHTML = `
      <div class="cart-item" data-id="${item.id}">
        <div class="product-image-placeholder" style="background: linear-gradient(135deg, ${bgColor} 0%, ${darkerColor} 100%);">
          <span class="product-icon">📦</span>
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

// HELPER: ADJUST COLOR BRIGHTNESS
function adjustBrightness(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  let RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  let GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  let BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

function handleIncreaseQty(index) {
  console.log('➕ Increasing qty for index:', index);
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    saveCart(cart);
    updateCartUI(); // CRITICAL: Update UI immediately
  }
}

function handleDecreaseQty(index) {
  console.log('➖ Decreasing qty for index:', index);
  const cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart(cart);
      updateCartUI(); // CRITICAL: Update UI immediately
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
    updateCartUI(); // CRITICAL: Update UI immediately
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
