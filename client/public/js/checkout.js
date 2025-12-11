// ============================================
// CHECKOUT.JS - Complete E-Commerce Checkout Logic
// ============================================

console.log("✅ checkout.js loaded");

// ============================================
// STATE MANAGEMENT
// ============================================
const checkoutState = {
  currentStep: 1,
  address: null,
  paymentMethod: 'cod',
  cardDetails: {},
  cart: [],
  promoApplied: false,
  discount: 0,
  orderNumber: null
};

// Sample saved addresses (in production, fetch from backend)
const savedAddresses = [
  {
    id: 1,
    name: "John Doe",
    mobile: "+91 9876543210",
    address1: "123, Main Street",
    address2: "Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    type: "home",
    isDefault: true
  }
];

// Promo codes database
const promoCodes = {
  'FIRST50': { discount: 50, minOrder: 500, message: 'First order discount applied!' },
  'SAVE100': { discount: 100, minOrder: 1000, message: 'Flat ₹100 off applied!' },
  'FLASH20': { discount: 0.2, isPercentage: true, message: '20% discount applied!' },
  'FREESHIP': { freeShipping: true, message: 'Free shipping applied!' }
};

// ============================================
// INITIALIZE CHECKOUT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Checkout page initialized');
  
  // Check if cart has items
  if (!loadCartItems()) {
    alert('Your cart is empty. Redirecting to cart page...');
    window.location.href = 'cart.html';
    return;
  }
  
  renderSavedAddresses();
  updateOrderSummary();
  setupEventListeners();
  setEstimatedDelivery();
  
  // Initialize payment form validation
  initializeFormValidation();
});

// ============================================
// LOAD CART ITEMS
// ============================================
function loadCartItems() {
  checkoutState.cart = getCart(); // From main.js
  
  if (!checkoutState.cart || checkoutState.cart.length === 0) {
    return false;
  }
  
  console.log('📦 Cart loaded:', checkoutState.cart.length, 'items');
  return true;
}

// ============================================
// RENDER SAVED ADDRESSES
// ============================================
function renderSavedAddresses() {
  const container = document.getElementById('savedAddresses');
  
  if (!container) return;
  
  if (savedAddresses.length === 0) {
    container.innerHTML = '<p style="color: #999;">No saved addresses. Please add a new address.</p>';
    return;
  }
  
  const html = savedAddresses.map((addr, index) => `
    <div class="saved-address-card ${addr.isDefault ? 'selected' : ''}" 
         data-id="${addr.id}" 
         onclick="selectAddress(${index})">
      <h4>${addr.name} ${addr.isDefault ? '<span class="badge">Default</span>' : ''}</h4>
      <p class="address-type">${addr.type === 'home' ? '🏠' : '💼'} ${addr.type.toUpperCase()}</p>
      <p>${addr.address1}</p>
      ${addr.address2 ? `<p>${addr.address2}</p>` : ''}
      <p>${addr.city}, ${addr.state} - ${addr.pincode}</p>
      <p class="mobile">📱 ${addr.mobile}</p>
      ${addr.isDefault ? '<span class="default-badge">✓ Default Address</span>' : ''}
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // Auto-select default address
  const defaultIndex = savedAddresses.findIndex(a => a.isDefault);
  if (defaultIndex >= 0) {
    selectAddress(defaultIndex);
  }
}

// ============================================
// SELECT ADDRESS
// ============================================
function selectAddress(index) {
  checkoutState.address = savedAddresses[index];
  
  // Update UI
  document.querySelectorAll('.saved-address-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  const selectedCard = document.querySelectorAll('.saved-address-card')[index];
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  console.log('📍 Address selected:', checkoutState.address.city);
  
  // Show continue button effect
  showSuccessAnimation('Address selected successfully!');
  
  // Auto-proceed after delay
  setTimeout(() => proceedToPayment(), 1000);
}

// ============================================
// UPDATE ORDER SUMMARY
// ============================================
function updateOrderSummary() {
  const cart = checkoutState.cart;
  
  // Update summary items list
  const summaryItemsContainer = document.getElementById('summaryItems');
  if (summaryItemsContainer) {
    const itemsHtml = cart.map(item => `
      <div class="summary-item">
        <span class="summary-item-name" title="${item.name}">${item.name}</span>
        <span class="summary-item-qty">×${item.quantity}</span>
        <span class="summary-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join('');
    
    summaryItemsContainer.innerHTML = itemsHtml;
  }
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = (subtotal > 500 || checkoutState.promoApplied) ? 0 : 40;
  const gst = subtotal * 0.18;
  const discount = calculateDiscount(subtotal);
  const total = subtotal + shippingCost + gst - discount;
  
  // Update all total elements
  updateElement('itemsTotal', '₹' + subtotal.toLocaleString('en-IN'));
  updateElement('deliveryCharge', shippingCost === 0 ? 'FREE' : '₹' + shippingCost);
  updateElement('gstAmount', '₹' + Math.round(gst).toLocaleString('en-IN'));
  updateElement('orderTotal', '₹' + Math.round(total).toLocaleString('en-IN'));
  
  // Update review items section
  updateReviewItems();
}

// ============================================
// CALCULATE DISCOUNT
// ============================================
function calculateDiscount(subtotal) {
  if (!checkoutState.promoApplied) return 0;
  
  const promo = promoCodes[checkoutState.promoCode];
  if (!promo) return 0;
  
  if (promo.isPercentage) {
    return subtotal * promo.discount;
  }
  
  return promo.discount;
}

// ============================================
// UPDATE REVIEW ITEMS
// ============================================
function updateReviewItems() {
  const reviewItemsContainer = document.getElementById('reviewItems');
  if (!reviewItemsContainer) return;
  
  const reviewHtml = checkoutState.cart.map(item => `
    <div class="review-item">
      <img src="${item.image || 'images/no-image.png'}" 
           alt="${item.name}" 
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E'">
      <div class="review-item-details">
        <h4>${item.name}</h4>
        <p class="qty">Quantity: ${item.quantity}</p>
        <p class="price">₹${item.price.toLocaleString('en-IN')} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
      </div>
    </div>
  `).join('');
  
  reviewItemsContainer.innerHTML = reviewHtml;
}

// ============================================
// SET ESTIMATED DELIVERY
// ============================================
function setEstimatedDelivery() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  updateElement('deliveryDate', formattedDate);
}

// ============================================
// SETUP EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Add new address
  const addNewBtn = document.getElementById('addNewAddressBtn');
  if (addNewBtn) {
    addNewBtn.addEventListener('click', showAddressForm);
  }
  
  // Cancel address form
  const cancelBtn = document.getElementById('cancelAddressBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideAddressForm);
  }
  
  // Save address
  const saveBtn = document.getElementById('saveAddressBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNewAddress);
  }
  
  // Payment method selection
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', handlePaymentMethodChange);
  });
  
  // Continue payment
  const continuePaymentBtn = document.getElementById('continuePaymentBtn');
  if (continuePaymentBtn) {
    continuePaymentBtn.addEventListener('click', proceedToReview);
  }
  
  // Place order
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
  
  // Promo code
  const applyPromoBtn = document.getElementById('applyPromo');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', applyPromoCode);
  }
  
  // Edit buttons for sections
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const section = this.closest('.checkout-section');
      editSection(section);
    });
  });
  
  // Pincode auto-fill
  const pincodeInput = document.getElementById('pincode');
  if (pincodeInput) {
    pincodeInput.addEventListener('blur', autoFillCityState);
  }
}

// ============================================
// SHOW/HIDE ADDRESS FORM
// ============================================
function showAddressForm() {
  document.getElementById('addressForm').style.display = 'block';
  document.getElementById('addNewAddressBtn').style.display = 'none';
  document.getElementById('fullName').focus();
}

function hideAddressForm() {
  document.getElementById('addressForm').style.display = 'none';
  document.getElementById('addNewAddressBtn').style.display = 'block';
  clearAddressForm();
}

// ============================================
// CLEAR ADDRESS FORM
// ============================================
function clearAddressForm() {
  document.getElementById('fullName').value = '';
  document.getElementById('mobile').value = '';
  document.getElementById('pincode').value = '';
  document.getElementById('city').value = '';
  document.getElementById('address1').value = '';
  document.getElementById('address2').value = '';
  document.getElementById('state').value = '';
}

// ============================================
// SAVE NEW ADDRESS
// ============================================
function saveNewAddress() {
  // Get form values
  const newAddress = {
    id: Date.now(),
    name: document.getElementById('fullName').value.trim(),
    mobile: document.getElementById('mobile').value.trim(),
    address1: document.getElementById('address1').value.trim(),
    address2: document.getElementById('address2').value.trim(),
    city: document.getElementById('city').value.trim(),
    state: document.getElementById('state').value,
    pincode: document.getElementById('pincode').value.trim(),
    type: document.querySelector('input[name="addressType"]:checked').value,
    isDefault: savedAddresses.length === 0
  };
  
  // Validate required fields
  if (!validateAddress(newAddress)) {
    return;
  }
  
  // Add to saved addresses
  savedAddresses.push(newAddress);
  checkoutState.address = newAddress;
  
  // Update UI
  hideAddressForm();
  renderSavedAddresses();
  
  showSuccessAnimation('Address saved successfully!');
  
  // Proceed to payment
  setTimeout(() => proceedToPayment(), 1000);
}

// ============================================
// VALIDATE ADDRESS
// ============================================
function validateAddress(address) {
  const required = ['name', 'mobile', 'address1', 'city', 'state', 'pincode'];
  const missing = [];
  
  for (let field of required) {
    if (!address[field]) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    showError('Please fill all required fields: ' + missing.join(', '));
    return false;
  }
  
  // Validate mobile number
  if (!/^\+?[0-9]{10,13}$/.test(address.mobile.replace(/\s/g, ''))) {
    showError('Please enter a valid mobile number');
    return false;
  }
  
  // Validate pincode
  if (!/^[0-9]{6}$/.test(address.pincode)) {
    showError('Please enter a valid 6-digit pincode');
    return false;
  }
  
  return true;
}

// ============================================
// AUTO-FILL CITY/STATE FROM PINCODE
// ============================================
function autoFillCityState() {
  const pincode = document.getElementById('pincode').value;
  
  // Sample pincode database (in production, use API)
  const pincodeData = {
    '400001': { city: 'Mumbai', state: 'MH' },
    '110001': { city: 'New Delhi', state: 'DL' },
    '560001': { city: 'Bangalore', state: 'KA' },
    '600001': { city: 'Chennai', state: 'TN' }
  };
  
  if (pincodeData[pincode]) {
    document.getElementById('city').value = pincodeData[pincode].city;
    document.getElementById('state').value = pincodeData[pincode].state;
  }
}

// ============================================
// PROCEED TO PAYMENT
// ============================================
function proceedToPayment() {
  if (!checkoutState.address) {
    showError('Please select or add a delivery address');
    return;
  }
  
  // Mark address section as completed
  completeSection('addressSection');
  
  // Enable and open payment section
  enableSection('paymentSection');
  
  // Scroll to payment section
  document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// HANDLE PAYMENT METHOD CHANGE
// ============================================
function handlePaymentMethodChange(event) {
  checkoutState.paymentMethod = event.target.value;
  
  // Hide all payment detail forms
  document.getElementById('cardDetails').style.display = 'none';
  document.getElementById('upiDetails').style.display = 'none';
  
  // Show relevant payment form
  switch(checkoutState.paymentMethod) {
    case 'card':
      document.getElementById('cardDetails').style.display = 'block';
      break;
    case 'upi':
      document.getElementById('upiDetails').style.display = 'block';
      break;
  }
  
  console.log('💳 Payment method selected:', checkoutState.paymentMethod);
}

// ============================================
// PROCEED TO REVIEW
// ============================================
function proceedToReview() {
  // Validate payment details if required
  if (!validatePayment()) {
    return;
  }
  
  // Mark payment section as completed
  completeSection('paymentSection');
  
  // Enable and open review section
  enableSection('reviewSection');
  
  // Scroll to review section
  document.getElementById('reviewSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// VALIDATE PAYMENT
// ============================================
function validatePayment() {
  if (checkoutState.paymentMethod === 'card') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || cardNumber.length < 16) {
      showError('Please enter a valid card number');
      return false;
    }
    
    if (!expiry || !expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      showError('Please enter valid expiry date (MM/YY)');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      showError('Please enter a valid CVV');
      return false;
    }
    
    if (!cardName) {
      showError('Please enter cardholder name');
      return false;
    }
    
    // Store card details (encrypted in production)
    checkoutState.cardDetails = {
      last4: cardNumber.slice(-4),
      name: cardName
    };
  } else if (checkoutState.paymentMethod === 'upi') {
    const upiId = document.getElementById('upiId').value;
    
    if (!upiId || !upiId.match(/^[\w.-]+@[\w]+$/)) {
      showError('Please enter a valid UPI ID');
      return false;
    }
    
    checkoutState.upiId = upiId;
  }
  
  return true;
}

// ============================================
// PLACE ORDER
// ============================================
async function placeOrder() {
  // Show loading state
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const originalText = placeOrderBtn.textContent;
  placeOrderBtn.textContent = 'Processing...';
  placeOrderBtn.disabled = true;
  
  try {
    // Simulate API call
    await simulateOrderProcessing();
    
    // Generate order number
    checkoutState.orderNumber = 'ORD' + Date.now();
    
    // Clear cart
    localStorage.removeItem('flash_cart');
    
    // Show success message
    showOrderSuccess();
    
  } catch (error) {
    showError('Order processing failed. Please try again.');
    placeOrderBtn.textContent = originalText;
    placeOrderBtn.disabled = false;
  }
}

// ============================================
// SIMULATE ORDER PROCESSING
// ============================================
function simulateOrderProcessing() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ Order processed successfully');
      resolve();
    }, 2000);
  });
}

// ============================================
// SHOW ORDER SUCCESS
// ============================================
// ============================================
// SHOW ORDER SUCCESS - UPDATED VERSION
// ============================================
function showOrderSuccess() {
  // Calculate final total
  const subtotal = checkoutState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = (subtotal > 500 || checkoutState.promoApplied) ? 0 : 40;
  const gst = subtotal * 0.18;
  const discount = calculateDiscount(subtotal);
  const orderTotal = Math.round(subtotal + shippingCost + gst - discount);
  
  // Prepare order data for tracking system
  const orderData = {
    orderNumber: checkoutState.orderNumber,
    total: orderTotal,
    items: checkoutState.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image || null,
      icon: '📦'
    }))
  };
  
  // Save order to localStorage for tracking
  let existingOrders = [];
  try {
    const savedOrders = localStorage.getItem('flash_orders');
    if (savedOrders) {
      existingOrders = JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error('Error loading existing orders:', error);
  }
  
  // Add new order to the beginning of the array
  existingOrders.unshift({
    id: orderData.orderNumber,
    date: new Date().toISOString(),
    status: 'processing',
    total: orderData.total,
    items: orderData.items,
    address: {
      name: checkoutState.address.name,
      address1: checkoutState.address.address1,
      address2: checkoutState.address.address2,
      city: checkoutState.address.city,
      state: checkoutState.address.state,
      pincode: checkoutState.address.pincode,
      mobile: checkoutState.address.mobile
    },
    paymentMethod: checkoutState.paymentMethod,
    timeline: [
      { 
        status: 'Order Placed', 
        date: new Date(), 
        completed: true, 
        current: true,
        message: 'Your order has been successfully placed'
      },
      { 
        status: 'Order Confirmed', 
        date: null, 
        completed: false,
        message: 'Seller is preparing your order'
      },
      { 
        status: 'Shipped', 
        date: null, 
        completed: false,
        message: 'Your order is on the way'
      },
      { 
        status: 'Out for Delivery', 
        date: null, 
        completed: false,
        message: 'Your order will be delivered today'
      },
      { 
        status: 'Delivered', 
        date: null, 
        completed: false,
        message: 'Order delivered successfully'
      }
    ]
  });
  
  // Save orders back to localStorage
  localStorage.setItem('flash_orders', JSON.stringify(existingOrders));
  
  // Get estimated delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Update the main container with success message
  const mainContainer = document.querySelector('.checkout-grid');
  
  mainContainer.innerHTML = `
    <div class="order-success">
      <div class="success-icon">✅</div>
      <h1>Order Placed Successfully!</h1>
      <p class="order-number">Order ID: <strong>${checkoutState.orderNumber}</strong></p>
      
      <div class="success-details">
        <p>Thank you for your order! We've sent a confirmation email to your registered email address.</p>
        
        <div class="order-summary-success">
          <h3>📦 Order Summary</h3>
          <div class="order-items-list">
            ${checkoutState.cart.map(item => `
              <div class="success-item">
                <span>${item.name}</span>
                <span>×${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            `).join('')}
          </div>
          <div class="success-total">
            <strong>Total Amount Paid:</strong>
            <strong>₹${orderTotal.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        
        <div class="delivery-info">
          <h3>🚚 Delivery Details</h3>
          <p><strong>${checkoutState.address.name}</strong></p>
          <p>${checkoutState.address.address1}</p>
          ${checkoutState.address.address2 ? `<p>${checkoutState.address.address2}</p>` : ''}
          <p>${checkoutState.address.city}, ${checkoutState.address.state} - ${checkoutState.address.pincode}</p>
          <p>Mobile: ${checkoutState.address.mobile}</p>
          <div class="estimated-delivery">
            <strong>📅 Estimated Delivery:</strong> ${formattedDeliveryDate}
          </div>
        </div>
        
        <div class="payment-info">
          <h3>💳 Payment Method</h3>
          <p>${getPaymentMethodDisplay(checkoutState.paymentMethod)}</p>
          ${checkoutState.paymentMethod === 'cod' ? 
            '<p class="cod-note">💵 Please keep exact change ready for delivery</p>' : 
            '<p class="paid-note">✅ Payment completed successfully</p>'
          }
        </div>
        
        <div class="action-buttons">
          <button onclick="window.location.href='orders.html?order=${checkoutState.orderNumber}'" class="btn-track">
            📦 Track Order
          </button>
          <button onclick="window.location.href='index.html'" class="btn-continue-shopping">
            🛍️ Continue Shopping
          </button>
        </div>
        
        <div class="help-section">
          <p>Need help? <a href="mailto:support@flash.com">Contact Support</a> or call <strong>1800-123-4567</strong></p>
        </div>
      </div>
    </div>
  `;
  
  // Add these additional styles if not already present
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .order-summary-success {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .order-summary-success h3 {
      margin-bottom: 15px;
      color: #1a1a1a;
      font-size: 18px;
    }
    
    .order-items-list {
      margin-bottom: 15px;
    }
    
    .success-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    
    .success-item:last-child {
      border-bottom: none;
    }
    
    .success-total {
      display: flex;
      justify-content: space-between;
      padding-top: 15px;
      border-top: 2px solid #1a73e8;
      font-size: 16px;
      color: #1a73e8;
    }
    
    .payment-info {
      background: #e8f4fd;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #1a73e8;
    }
    
    .payment-info h3 {
      margin-bottom: 10px;
      color: #1a1a1a;
      font-size: 18px;
    }
    
    .cod-note {
      color: #f39c12;
      font-weight: 600;
      margin-top: 10px;
    }
    
    .paid-note {
      color: #27ae60;
      font-weight: 600;
      margin-top: 10px;
    }
    
    .estimated-delivery {
      margin-top: 15px;
      padding: 10px;
      background: #e8f5e9;
      border-radius: 6px;
      color: #27ae60;
    }
    
    .help-section {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    
    .help-section a {
      color: #1a73e8;
      text-decoration: none;
      font-weight: 600;
    }
    
    .help-section a:hover {
      text-decoration: underline;
    }
  `;
  
  // Add styles if not already present
  if (!document.querySelector('style[data-order-success]')) {
    styleElement.setAttribute('data-order-success', 'true');
    document.head.appendChild(styleElement);
  }
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Send order confirmation (mock)
  console.log('📧 Order confirmation email sent to user');
  
  // Clear cart badge
  updateCartCount();
  
  // Play success sound (optional)
  playSuccessSound();
}

// ============================================
// HELPER FUNCTION: Get Payment Method Display
// ============================================
function getPaymentMethodDisplay(method) {
  const methods = {
    'cod': 'Cash on Delivery',
    'card': 'Credit/Debit Card',
    'upi': 'UPI Payment',
    'netbanking': 'Net Banking'
  };
  return methods[method] || 'Online Payment';
}

// ============================================
// HELPER FUNCTION: Play Success Sound
// ============================================
function playSuccessSound() {
  try {
    // Create a simple success beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio not supported');
  }
}

// ============================================
// HELPER FUNCTION: Calculate Order Total
// ============================================
function calculateOrderTotal() {
  const subtotal = checkoutState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = (subtotal > 500 || checkoutState.promoApplied) ? 0 : 40;
  const gst = subtotal * 0.18;
  const discount = calculateDiscount(subtotal);
  return Math.round(subtotal + shippingCost + gst - discount);
}


// ============================================
// APPLY PROMO CODE
// ============================================
function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const promoCode = promoInput.value.trim().toUpperCase();
  const messageEl = document.getElementById('promoMessage');
  
  if (!promoCode) {
    showPromoMessage('Please enter a promo code', 'error');
    return;
  }
  
  const promo = promoCodes[promoCode];
  
  if (!promo) {
    showPromoMessage('Invalid promo code', 'error');
    return;
  }
  
  // Check minimum order requirement
  const subtotal = checkoutState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (promo.minOrder && subtotal < promo.minOrder) {
    showPromoMessage(`Minimum order of ₹${promo.minOrder} required`, 'error');
    return;
  }
  
  // Apply promo
  checkoutState.promoApplied = true;
  checkoutState.promoCode = promoCode;
  checkoutState.discount = promo.isPercentage ? subtotal * promo.discount : promo.discount;
  
  // Update UI
  showPromoMessage(promo.message, 'success');
  updateOrderSummary();
  
  // Disable promo input
  promoInput.disabled = true;
  document.getElementById('applyPromo').textContent = 'Applied';
  document.getElementById('applyPromo').disabled = true;
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================
function completeSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('completed');
    const editBtn = section.querySelector('.edit-btn');
    if (editBtn) editBtn.style.display = 'block';
    const content = section.querySelector('.section-content');
    if (content) content.style.display = 'none';
  }
}

function enableSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.remove('disabled');
    const content = section.querySelector('.section-content');
    if (content) content.style.display = 'block';
  }
}

function editSection(section) {
  // Re-enable the section
  section.classList.remove('completed');
  const content = section.querySelector('.section-content');
  if (content) content.style.display = 'block';
  
  // Disable subsequent sections
  const allSections = document.querySelectorAll('.checkout-section');
  let foundCurrent = false;
  
  allSections.forEach(sec => {
    if (foundCurrent) {
      sec.classList.add('disabled');
    }
    if (sec === section) {
      foundCurrent = true;
    }
  });
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showError(message) {
  alert('❌ ' + message); // Replace with toast notification in production
}

function showPromoMessage(message, type) {
  const messageEl = document.getElementById('promoMessage');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = 'promo-message ' + type;
  }
}

function showSuccessAnimation(message) {
  // Simple console log for now - implement toast/animation in production
  console.log('✅', message);
}

// ============================================
// FORM VALIDATION HELPERS
// ============================================
function initializeFormValidation() {
  // Card number formatting
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
  
  // Expiry date formatting
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
  
  // CVV validation
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
  }
  
  // Mobile number validation
  const mobileInput = document.getElementById('mobile');
  if (mobileInput) {
    mobileInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/[^0-9+\s]/g, '');
    });
  }
  
  // Pincode validation
  const pincodeInput = document.getElementById('pincode');
  if (pincodeInput) {
    pincodeInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
  }
}

// ============================================
// EXPORT FOR TESTING
// ============================================
if (typeof window !== 'undefined') {
  window.checkoutState = checkoutState;
  window.checkoutFunctions = {
    selectAddress,
    saveNewAddress,
    proceedToPayment,
    proceedToReview,
    placeOrder,
    applyPromoCode
  };
}

console.log('✅ Checkout system ready');
