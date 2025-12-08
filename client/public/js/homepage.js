// HOMEPAGE.JS - PRODUCT LISTING & ACTIONS
console.log("✅ homepage.js loaded");

// SAMPLE PRODUCTS DATA
const products = [
  { id: 1, title: 'Wireless Earbuds', price: 1299, rating: 4.5, img: 'images/earbuds.jpg' },
  { id: 2, title: 'Smart Watch', price: 2999, rating: 4.2, img: 'images/smartwatch.jpg' },
  { id: 3, title: 'USB-C Cable', price: 299, rating: 4.8, img: 'images/cable.jpg' },
  { id: 4, title: 'Phone Stand', price: 499, rating: 4.6, img: 'images/stand.jpg' },
  { id: 5, title: 'Laptop Bag', price: 1999, rating: 4.4, img: 'images/bag.jpg' },
  { id: 6, title: 'Wireless Mouse', price: 799, rating: 4.3, img: 'images/mouse.jpg' },
  { id: 7, title: 'USB Hub', price: 899, rating: 4.7, img: 'images/hub.jpg' },
  { id: 8, title: 'Screen Protector', price: 199, rating: 4.5, img: 'images/protector.jpg' },
  { id: 9, title: 'Phone Case', price: 399, rating: 4.6, img: 'images/case.jpg' },
  { id: 10, title: 'Charging Pad', price: 1499, rating: 4.4, img: 'images/charger.jpg' },
  { id: 11, title: 'Bluetooth Speaker', price: 2499, rating: 4.7, img: 'images/speaker.jpg' },
  { id: 12, title: 'Webcam HD', price: 3499, rating: 4.5, img: 'images/webcam.jpg' }
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
    card.innerHTML = `
      <img src="${product.img}" alt="${product.title}" onerror="this.src='images/no-image.png'" />
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

// VIEW PRODUCT
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// ADD PRODUCT TO CART (Helper)
function addProductToCart(productId) {
  console.log('🛒 Adding product ID:', productId);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error('❌ Product not found:', productId);
    return;
  }

  // Convert to cart format
  const cartProduct = {
    id: product.id,
    name: product.title,
    price: product.price,
    image: product.img,
    quantity: 1
  };

  addToCart(cartProduct); // Uses main.js function
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
    const filtered = products.filter(p => p.price <= maxPrice);
    renderProducts(filtered);
    console.log('💰 Filtered by price:', maxPrice, '→', filtered.length, 'products');
  });
}

// INITIALIZE PAGE
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Homepage initialized');
  renderProducts(products);
  updateCartCount();
});
