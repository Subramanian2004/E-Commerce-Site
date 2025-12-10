// MAIN.JS - GLOBAL UTILITIES
console.log("✅ main.js loaded");

// CART KEY (CENTRALIZED)
const CART_KEY = 'flash_cart';

// GET CART FROM LOCALSTORAGE
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      console.log('📭 No cart found in localStorage');
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('❌ Error parsing cart:', err);
    return [];
  }
}

// SAVE CART TO LOCALSTORAGE
function saveCart(cartArray) {
  try {
    if (!Array.isArray(cartArray)) {
      console.error('❌ Cart must be an array');
      return false;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
    console.log('✅ Cart saved:', cartArray.length, 'items');
    updateCartCount();
    return true;
  } catch (err) {
    console.error('❌ Error saving cart:', err);
    return false;
  }
}

// UPDATE CART COUNT BADGE
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cartCount');
  
  if (cartCountElements.length === 0) {
    console.log('⚠️ No cart count element found');
    return;
  }
  
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  cartCountElements.forEach(el => {
    el.textContent = total;
  });
  
  console.log('📦 Cart count updated to:', total);
}

// ADD TO CART (PROPER VERSION)
function addToCart(product) {
  if (!product || !product.id) {
    console.error('❌ Invalid product:', product);
    showToast('❌ Error adding product', 2000);
    return false;
  }

  const normalized = {
    id: product.id,
    name: product.name || product.title || 'Untitled',
    price: Number(product.price || 0),
    image: product.image || product.img || null,
    color: product.color || '#667eea',
    quantity: Number(product.quantity || 1)
  };

  const cart = getCart();

  // Check if product already exists
  const existingIndex = cart.findIndex(item => item.id === normalized.id);

  if (existingIndex !== -1) {
    // Update quantity if product exists
    cart[existingIndex].quantity += normalized.quantity;
    console.log('✏️ Updated qty for:', normalized.name);
  } else {
    // Add new product
    cart.push(normalized);
    console.log('➕ Added to cart:', normalized.name);
  }

  saveCart(cart);
  showToast(`✅ "${normalized.name}" added to cart!`, 2000);
  return true;
}

// TOAST NOTIFICATION
function showToast(message, duration = 2000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 120px;
    right: 20px;
    background: #27ae60;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideUp 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// THEME SWITCHER
const THEME_KEY = 'flash_theme';

function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const themeToggle = document.getElementById('theme-toggle');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.innerHTML = '&#x2600;'; // Sun icon
  } else {
    document.body.classList.remove('dark-theme');
    if (themeToggle) themeToggle.innerHTML = '&#x1F319;'; // Moon icon
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  applyTheme();
}


// INITIALIZE ON EVERY PAGE
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM Content Loaded - Initializing...');
  updateCartCount();

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  applyTheme();
});

// Listen for storage changes (multi-tab sync)
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY || e.key === null) {
    console.log('🔄 Cart updated in another tab');
    updateCartCount();
  }
});
