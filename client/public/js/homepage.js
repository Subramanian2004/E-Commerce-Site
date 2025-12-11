// HOMEPAGE.JS
console.log("✅ homepage.js loaded");

const products = [
  { id: 1, title: '6-Piece Non-Stick Baking Set', price: 1299, rating: 4.5, image: '../public/images/6-piece-non-stick-baking-set.webp' },
  { id: 2, title: '6-Piece White Dinner Plate Set', price: 899, rating: 4.4, image: '../public/images/6-piece-white-dinner-plate-set.jpg' },
  { id: 3, title: 'Adults Plain Cotton T-Shirt 2-Pack Black', price: 599, rating: 4.3, image: '../public/images/adults-plain-cotton-tshirt-2-pack-black.jpg' },
  { id: 4, title: 'Adults Plain Cotton T-Shirt 2-Pack Plus Black', price: 699, rating: 4.2, image: '../public/images/adults-plain-cotton-tshirt-2-pack-plus-black.jpg' },
  { id: 5, title: 'Adults Plain Cotton T-Shirt 2-Pack Red', price: 599, rating: 4.3, image: '../public/images/adults-plain-cotton-tshirt-2-pack-red.jpg' },
  { id: 6, title: 'Adults Plain Cotton T-Shirt 2-Pack Teal', price: 599, rating: 4.3, image: '../public/images/adults-plain-cotton-tshirt-2-pack-teal.jpg' },
  { id: 7, title: 'Athletic Cotton Socks 6-Pairs', price: 399, rating: 4.6, image: '../public/images/athletic-cotton-socks-6-pairs.jpg' },
  { id: 8, title: 'Backpack', price: 1499, rating: 4.8, image: '../public/images/backpack.jpg' },
  { id: 9, title: 'Bathroom Rug', price: 799, rating: 4.4, image: '../public/images/bathroom-rug.jpg' },
  { id: 10, title: 'Black 2-Slot Toaster', price: 1599, rating: 4.5, image: '../public/images/black-2-slot-toaster.jpg' },
  { id: 11, title: 'Blackout Curtain Set Beige', price: 1299, rating: 4.5, image: '../public/images/blackout-curtain-set-beige.webp' },
  { id: 12, title: 'Blackout Curtains Black', price: 1199, rating: 4.6, image: '../public/images/blackout-curtains-black.jpg' },
  { id: 13, title: 'Coffeemaker with Glass Carafe Black', price: 1899, rating: 4.7, image: '../public/images/coffeemaker-with-glass-carafe-black.jpg' },
  { id: 14, title: 'Cotton Bath Towels Teal', price: 699, rating: 4.5, image: '../public/images/cotton-bath-towels-teal.webp' },
  { id: 15, title: 'Countertop Blender 64 oz', price: 2199, rating: 4.6, image: '../public/images/countertop-blender-64-oz.jpg' },
  { id: 16, title: 'Double Elongated Twist French Wire Earrings', price: 599, rating: 4.4, image: '../public/images/double-elongated-twist-french-wire-earrings.webp' },
  { id: 17, title: 'Duvet Cover Set Blue Queen', price: 1699, rating: 4.5, image: '../public/images/duvet-cover-set-blue-queen.jpg' },
  { id: 18, title: 'Duvet Cover Set Blue Twin', price: 1399, rating: 4.5, image: '../public/images/duvet-cover-set-blue-twin.jpg' },
  { id: 19, title: 'Duvet Cover Set Red Queen', price: 1699, rating: 4.5, image: '../public/images/duvet-cover-set-red-queen.jpg' },
  { id: 20, title: 'Duvet Cover Set Red Twin', price: 1399, rating: 4.5, image: '../public/images/duvet-cover-set-red-twin.jpg' },
  { id: 21, title: 'Electric Glass and Steel Hot Water Kettle', price: 1299, rating: 4.7, image: '../public/images/electric-glass-and-steel-hot-water-kettle.webp' },
  { id: 22, title: 'Facial Tissue 2-Ply 18-Boxes', price: 499, rating: 4.3, image: '../public/images/facial-tissue-2-ply-18-boxes.jpg' },
  { id: 23, title: 'Floral Mixing Bowl Set', price: 899, rating: 4.4, image: '../public/images/floral-mixing-bowl-set.jpg' },
  { id: 24, title: 'Intermediate Composite Basketball', price: 799, rating: 4.6, image: '../public/images/intermediate-composite-basketball.jpg' },
  { id: 25, title: 'Kitchen Paper Towels 30-Pack', price: 599, rating: 4.4, image: '../public/images/kitchen-paper-towels-30-pack.jpg' },
  { id: 26, title: 'Knit Athletic Sneakers Gray', price: 1299, rating: 4.5, image: '../public/images/knit-athletic-sneakers-gray.jpg' },
  { id: 27, title: 'Knit Athletic Sneakers Pink', price: 1299, rating: 4.5, image: '../public/images/knit-athletic-sneakers-pink.webp' },
  { id: 28, title: 'Liquid Laundry Detergent Lavender', price: 699, rating: 4.5, image: '../public/images/liquid-laundry-detergent-lavender.jpg' },
  { id: 29, title: 'Liquid Laundry Detergent Plain', price: 649, rating: 4.4, image: '../public/images/liquid-laundry-detergent-plain.jpg' },
  { id: 30, title: 'Luxury Tower Set 4-Piece', price: 1999, rating: 4.6, image: '../public/images/luxury-tower-set-4-piece.jpg' },
  { id: 31, title: 'Luxury Tower Set 6-Piece', price: 2499, rating: 4.7, image: '../public/images/luxury-tower-set-6-piece.jpg' },
  { id: 32, title: 'Men Athletic Shoes Black', price: 1799, rating: 4.6, image: '../public/images/men-athletic-shoes-black.jpg' },
  { id: 33, title: 'Men Athletic Shoes Green', price: 1799, rating: 4.6, image: '../public/images/men-athletic-shoes-green.jpg' },
  { id: 34, title: 'Men Chino Pants Beige', price: 999, rating: 4.5, image: '../public/images/men-chino-pants-beige.jpg' },
  { id: 35, title: 'Men Chino Pants Black', price: 999, rating: 4.5, image: '../public/images/men-chino-pants-black.jpg' },
  { id: 36, title: 'Men Chino Pants Green', price: 999, rating: 4.5, image: '../public/images/men-chino-pants-green.jpg' },
  { id: 37, title: 'Men Cozy Fleece Zip-Up Hoodie Black', price: 1399, rating: 4.6, image: '../public/images/men-cozy-fleece-zip-up-hoodie-black.jpg' },
  { id: 38, title: 'Men Cozy Fleece Zip-Up Hoodie Red', price: 1399, rating: 4.6, image: '../public/images/men-cozy-fleece-zip-up-hoodie-red.jpg' },
  { id: 39, title: 'Men Golf Polo T-Shirt Black', price: 899, rating: 4.4, image: '../public/images/men-golf-polo-t-shirt-black.jpg' },
  { id: 40, title: 'Men Golf Polo T-Shirt Blue', price: 899, rating: 4.4, image: '../public/images/men-golf-polo-t-shirt-blue.jpg' },
  { id: 41, title: 'Men Golf Polo T-Shirt Red', price: 899, rating: 4.4, image: '../public/images/men-golf-polo-t-shirt-red.jpg' },
  { id: 42, title: 'Men Navigator Sunglasses Brown', price: 1199, rating: 4.5, image: '../public/images/men-navigator-sunglasses-brown.jpg' },
  { id: 43, title: 'Men Navigator Sunglasses Silver', price: 1199, rating: 4.5, image: '../public/images/men-navigator-sunglasses-silver.jpg' },
  { id: 44, title: 'Men Slim Fit Summer Shorts Beige', price: 799, rating: 4.4, image: '../public/images/men-slim-fit-summer-shorts-beige.jpg' },
  { id: 45, title: 'Men Slim Fit Summer Shorts Black', price: 799, rating: 4.4, image: '../public/images/men-slim-fit-summer-shorts-black.jpg' },
  { id: 46, title: 'Men Slim Fit Summer Shorts Gray', price: 799, rating: 4.4, image: '../public/images/men-slim-fit-summer-shorts-gray.jpg' },
  { id: 47, title: 'Non-Stick Cooking Set 15-Pieces', price: 2299, rating: 4.7, image: '../public/images/non-stick-cooking-set-15-pieces.webp' },
  { id: 48, title: 'Plain Hooded Fleece Sweatshirt Teal', price: 1199, rating: 4.5, image: '../public/images/plain-hooded-fleece-sweatshirt-teal.jpg' },
  { id: 49, title: 'Plain Hooded Fleece Sweatshirt Yellow', price: 1199, rating: 4.5, image: '../public/images/plain-hooded-fleece-sweatshirt-yellow.jpg' },
  { id: 50, title: 'Round Airtight Food Storage Containers', price: 899, rating: 4.6, image: '../public/images/round-airtight-food-storage-containers.jpg' },
  { id: 51, title: 'Round Sunglasses Black', price: 999, rating: 4.4, image: '../public/images/round-sunglasses-black.jpg' },
  { id: 52, title: 'Round Sunglasses Gold', price: 1099, rating: 4.5, image: '../public/images/round-sunglasses-gold.jpg' },
  { id: 53, title: 'Sky Flower Stud Earrings', price: 599, rating: 4.3, image: '../public/images/sky-flower-stud-earrings.webp' },
  { id: 54, title: 'Straw Sunhat', price: 499, rating: 4.5, image: '../public/images/straw-sunhat.webp' },
  { id: 55, title: 'Trash Can with Foot Pedal 30 Liter Tall', price: 699, rating: 4.4, image: '../public/images/trash-can-with-foot-pedal-30-liter-tall.jpg' },
  { id: 56, title: 'Trash Can with Foot Pedal 50 Liter', price: 899, rating: 4.5, image: '../public/images/trash-can-with-foot-pedal-50-liter.jpg' },
  { id: 57, title: 'Umbrella', price: 599, rating: 4.4, image: '../public/images/umbrella.jpg' },
  { id: 58, title: 'Vanity Mirror Silver', price: 1299, rating: 4.6, image: '../public/images/vanity-mirror-silver.jpg' },
  { id: 59, title: 'Women Beach Sandals', price: 699, rating: 4.5, image: '../public/images/women-beach-sandals.jpg' },
  { id: 60, title: 'Women Chiffon Beachwear Coverup Black', price: 1199, rating: 4.5, image: '../public/images/women-chiffon-beachwear-coverup-black.jpg' },
  { id: 61, title: 'Women Chunky Beanie Gray', price: 499, rating: 4.4, image: '../public/images/women-chunky-beanie-gray.webp' },
  { id: 62, title: 'Women French Terry Fleece Jogger Camo', price: 1299, rating: 4.5, image: '../public/images/women-french-terry-fleece-jogger-camo.jpg' },
  { id: 63, title: 'Women French Terry Fleece Jogger Gray', price: 1299, rating: 4.5, image: '../public/images/women-french-terry-fleece-jogger-gray.jpg' },
  { id: 64, title: 'Women Knit Ballet Flat Black', price: 899, rating: 4.4, image: '../public/images/women-knit-ballet-flat-black.jpg' },
  { id: 65, title: 'Women Knit Ballet Flat Gray', price: 899, rating: 4.4, image: '../public/images/women-knit-ballet-flat-gray.jpg' },
  { id: 66, title: 'Women Knit Ballet Flat Leopard', price: 999, rating: 4.5, image: '../public/images/women-knit-ballet-flat-leopard.jpg' },
  { id: 67, title: 'Women Stretch Popover Hoodie Black', price: 1399, rating: 4.6, image: '../public/images/women-stretch-popover-hoodie-black.jpg' },
  { id: 68, title: 'Women Stretch Popover Hoodie Blue', price: 1399, rating: 4.6, image: '../public/images/women-stretch-popover-hoodie-blue.jpg' },
  { id: 69, title: 'Women Stretch Popover Hoodie Gray', price: 1399, rating: 4.6, image: '../public/images/women-stretch-popover-hoodie-gray.jpg' }
];

// ============================================
// DOM ELEMENTS
// ============================================
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

// ============================================
// RENDER PRODUCTS TO DOM
// ============================================
function renderProducts(list) {
  console.log('🎨 Rendering', list.length, 'products');
  
  if (!productGrid) {
    console.error('❌ productGrid element not found');
    return;
  }

  productGrid.innerHTML = '';
  
  if (list.length === 0) {
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No products found</p>';
    return;
  }

  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const ratingStars = '⭐'.repeat(Math.round(product.rating));
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22220%22 height=%22160%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22220%22 height=%22160%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EImage Not Available%3C/text%3E%3C/svg%3E'" />
      <div class="title">${product.title}</div>
      <div class="meta">Rating: ${product.rating} ${ratingStars}</div>
      <div class="price">₹${Number(product.price).toLocaleString('en-IN')}</div>
      <div class="actions">
        <button class="btn outline" onclick="viewProduct(${product.id})">View</button>
        <button class="btn primary" onclick="addProductToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    
    productGrid.appendChild(card);
  });

  console.log('✅ Rendered successfully');
}

// ============================================
// VIEW PRODUCT - Navigate to Details Page
// ============================================
function viewProduct(id) {
  console.log('👁️ Viewing product ID:', id);
  window.location.href = `product.html?id=${id}`;
}

// ============================================
// ADD PRODUCT TO CART
// ============================================
function addProductToCart(productId) {
  console.log('🛒 Adding product ID to cart:', productId);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error('❌ Product not found:', productId);
    showToast('❌ Product not found', 2000);
    return;
  }

  const cartProduct = {
    id: product.id,
    name: product.title,
    price: product.price,
    image: product.image,
    quantity: 1
  };

  // Use main.js addToCart function
  if (typeof addToCart === 'function') {
    addToCart(cartProduct);
  } else {
    console.error('❌ addToCart function not found in main.js');
  }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  
  if (!query) {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(query)
  );
  
  console.log('🔍 Search query:', query, '→', filtered.length, 'results');
  renderProducts(filtered);
}

// ============================================
// SORT FUNCTIONALITY
// ============================================
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    const sortType = e.target.value;
    let sorted = [...products];

    switch(sortType) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        console.log('📊 Sorted: Price Low to High');
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        console.log('📊 Sorted: Price High to Low');
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        console.log('📊 Sorted: Top Rated');
        break;
      default:
        sorted = [...products];
        console.log('📊 Sorted: Relevance');
    }

    renderProducts(sorted);
  });
}

// ============================================
// PRICE RANGE FILTER
// ============================================
if (priceRange) {
  priceRange.addEventListener('input', (e) => {
    const maxPrice = Number(e.target.value);
    
    if (priceValue) {
      priceValue.textContent = maxPrice.toLocaleString('en-IN');
    }
    
    const filtered = products.filter(p => p.price <= maxPrice);
    console.log('💰 Filtered by price: ₹0 - ₹' + maxPrice, '→', filtered.length, 'products');
    
    renderProducts(filtered);
  });
}

// ============================================
// INITIALIZE PAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Homepage initialized');
  console.log('📦 Total products available:', products.length);
  
  renderProducts(products);
  
  // Update cart count from main.js
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
});

// ============================================
// EXPORT PRODUCTS FOR OTHER PAGES
// ============================================
if (typeof window !== 'undefined') {
  window.allProducts = products;
  console.log('✅ Products exported to window.allProducts');
}
