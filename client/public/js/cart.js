// Robust cart renderer (drop into client/public/js/cart.js)
(function(){
  console.log('cart.js (defensive) loaded');

  const KEY = 'cart';
  const getEl = id => document.getElementById(id);

  // tolerate different ID names by fallback mapping
  const idMap = {
    items: getEl('cart-items') || getEl('cartItems') || getEl('cartItemsContainer'),
    emptyMsg: getEl('empty-cart-message') || getEl('emptyCart') || getEl('empty-msg'),
    summaryBox: getEl('summary-box') || getEl('summaryBox') || getEl('cart-summary'),
    subtotal: getEl('subtotal') || getEl('sub-total') || getEl('cart-subtotal'),
    total: getEl('total') || getEl('order-total') || getEl('cart-total')
  };

  // Log missing DOM nodes
  Object.entries(idMap).forEach(([k,v]) => { if(!v) console.warn(`cart.js: missing DOM element for "${k}" — expected one of id variants`); });

  function readCart(){
    try {
      const raw = localStorage.getItem(KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) return [];
      return parsed;
    } catch(e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  }

  function formatPrice(n){ return '₹' + (Number(n) || 0).toFixed(2); }

  function updateCartUI(){
    const cart = readCart();

    // If no items and emptyMsg exists show it (else try to render nothing)
    if(!idMap.items){
      console.error('cart.js: cannot render — container element not found (cart-items)');
      return;
    }

    // empty UI
    if(!cart.length){
      if(idMap.emptyMsg) idMap.emptyMsg.style.display = 'block';
      if(idMap.items) idMap.items.innerHTML = '';
      if(idMap.summaryBox) idMap.summaryBox.style.display = 'none';
      console.log('cart.js: cart empty');
      return;
    }

    // render items
    if(idMap.emptyMsg) idMap.emptyMsg.style.display = 'none';
    if(idMap.summaryBox) idMap.summaryBox.style.display = 'block';

    idMap.items.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, idx) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;

      const wrapper = document.createElement('div');
      wrapper.className = 'cart-item';
      wrapper.innerHTML = `
        <img src="${item.image || 'images/no-image.png'}" alt="${escapeHtml(item.name)}" />
        <div class="item-details">
          <h3>${escapeHtml(item.name)}</h3>
          <p>Price: ${formatPrice(price)}</p>
          <p>Quantity: ${qty}</p>
          <div class="quantity-controls">
            <button data-idx="${idx}" class="qty-inc">+</button>
            <button data-idx="${idx}" class="qty-dec">-</button>
            <button data-idx="${idx}" class="remove-item">Remove</button>
          </div>
        </div>
      `;
      idMap.items.appendChild(wrapper);
    });

    if(idMap.subtotal) idMap.subtotal.innerText = formatPrice(subtotal);
    const shipping = 50;
    if(idMap.total) idMap.total.innerText = formatPrice(subtotal + shipping);
  }

  // helper to save cart
  function saveCart(cart){
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
      console.log('cart.js: saved cart', cart);
      updateCartUI();
    } catch(e){
      console.error('cart.js: failed to save cart', e);
    }
  }

  // event delegation for buttons
  document.addEventListener('click', function(e){
    const tgt = e.target;
    if(tgt.matches('.qty-inc')){
      const idx = Number(tgt.dataset.idx);
      const cart = readCart();
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
      saveCart(cart);
    } else if(tgt.matches('.qty-dec')){
      const idx = Number(tgt.dataset.idx);
      const cart = readCart();
      if(cart[idx].quantity > 1){ cart[idx].quantity--; saveCart(cart); }
    } else if(tgt.matches('.remove-item')){
      const idx = Number(tgt.dataset.idx);
      const cart = readCart();
      cart.splice(idx,1); saveCart(cart);
    }
  });

  // small helper
  function escapeHtml(str){
    if(!str) return '';
    return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[s]);
  }

  // initial render
  updateCartUI();

  // expose add helper to global for quick testing
  window.__addToCartForDebug = function(item){
    const cart = readCart();
    const existing = cart.find(x=>String(x.id) === String(item.id));
    if(existing){ existing.quantity = (existing.quantity||0) + (item.quantity||1); }
    else cart.push(item);
    saveCart(cart);
  };

})();
localStorage.setItem("cart", JSON.stringify([
  {
    id: 111,
    name: "Demo Product",
    price: 999,
    image: "images/demo.jpg",
    quantity: 1
  }
]));
