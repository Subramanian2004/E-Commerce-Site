// HOMEPAGE.JS - PRODUCT LISTING & ACTIONS
console.log("✅ homepage.js loaded");

// SAMPLE PRODUCTS DATA (NO EXTERNAL IMAGES)
const products = [
  { id: 1, title: 'Wireless Earbuds', price: 1299, rating: 4.5, color: '#FF6B6B' },
  { id: 2, title: 'Smart Watch', price: 2999, rating: 4.2, color: '#4ECDC4' },
  { id: 3, title: 'USB-C Cable', price: 299, rating: 4.8, color: '#45B7D1' },
  { id: 4, title: 'Phone Stand', price: 499, rating: 4.6, color: '#FFA07A' },
  { id: 5, title: 'Laptop Bag', price: 1999, rating: 4.4, color: '#98D8C8' },
  { id: 6, title: 'Wireless Mouse', price: 799, rating: 4.3, color: '#F7DC6F' },
  { id: 7, title: 'USB Hub', price: 899, rating: 4.7, color: '#BB8FCE' },
  { id: 8, title: 'Screen Protector', price: 199, rating: 4.5, color: '#85C1E2' },
  { id: 9, title: 'Phone Case', price: 399, rating: 4.6, color: '#F8B88B' },
  { id: 10, title: 'Charging Pad', price: 1499, rating: 4.4, color: '#52C97F' },
  { id: 11, title: 'Bluetooth Speaker', price: 2499, rating: 4.7, color: '#EB6F6F' },
  { id: 12, title: 'Webcam HD', price: 3499, rating: 4.5, color: '#8E7DBE' }
];

// DOM ELEMENTS
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');

// RENDER PRODUCTS
function renderProducts(list) {
  productGrid.innerHTML = '';
  
  if (list.length === 0) {
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No products found</p>';
    return;
  }

  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Use color backgrounds instead of images
    const productImage = `
      <div class="product-image-placeholder" style="background: linear-gradient(135deg, ${product.color} 0%, ${adjustBrightness(product.color, -20)} 100%);">
        <span class="product-icon">📦</span>
      </div>
    `;

    card.innerHTML = `
      ${productImage}
      <div class="title">${product.title}</div>
      <div class="meta">Rating: ${product.rating} ⭐</div>
      <div class="price">₹${Number(product.price).toLocaleString('en-IN')}</div>
      <div class="actions">
        <button class="btn outline" onclick="viewProduct(${product.id})">View</button>
        <button class="btn primary" onclick="addProductToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  console.log('📊 Rendered', list.length, 'products');
}

// HELPER: ADJUST COLOR BRIGHTNESS
function adjustBrightness(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

// VIEW PRODUCT
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// ADD PRODUCT TO CART
function addProductToCart(productId) {
  console.log('🛒 Adding product ID:', productId);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error('❌ Product not found:', productId);
    return;
  }

  const cartProduct = {
    id: product.id,
    name: product.title,
    price: product.price,
    image: null, // No image needed
    color: product.color,
    quantity: 1
  };

  addToCart(cartProduct);
}

// SEARCH FUNCTIONALITY
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(query)
  );
  renderProducts(filtered);
  console.log('🔍 Search:', query, '→', filtered.length, 'results');
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// SORT FUNCTIONALITY
sortSelect.addEventListener('change', (e) => {
  const sortType = e.target.value;
  let sorted = [...products];

  switch(sortType) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      sorted = [...products];
  }

  renderProducts(sorted);
  console.log('📊 Sorted by:', sortType);
});

// PRICE RANGE FILTER
const priceRange = document.getElementById('priceRange');
if (priceRange) {
  priceRange.addEventListener('input', (e) => {
    const maxPrice = Number(e.target.value);
    document.getElementById('priceValue').textContent = maxPrice.toLocaleString('en-IN');
    const filtered = products.filter(p => p.price <= maxPrice);
    renderProducts(filtered);
    console.log('💰 Filtered by price:', maxPrice);
  });
}

// INITIALIZE PAGE
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Homepage initialized');
  renderProducts(products);
  updateCartCount();
});
