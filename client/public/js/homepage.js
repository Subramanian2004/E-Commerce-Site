// Dummy product data
const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Sample Product ${i + 1}`,
  price: (Math.random() * 250 + 20).toFixed(2),
  rating: (Math.random() * 2 + 3).toFixed(1),
  img: `https://picsum.photos/seed/p${i}/400/300`
}));

const productGrid = document.getElementById("productGrid");

// Render products
function renderProducts(list) {
  productGrid.innerHTML = list
    .map(
      (p) => `
    <div class="card">
      <img src="${p.img}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="price">₹${p.price}</div>
      <div class="actions">
        <button class="btn outline" onclick="viewProduct(${p.id})">View</button>
        <button class="btn primary" onclick="addToCart(${p.id})">Add</button>
      </div>
    </div>
  `
    )
    .join("");
}

renderProducts(products);

// View product
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// Add to cart
function addToCart(id) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });

  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}

// Search
document.getElementById("searchBtn").onclick = () => {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(q)
  );
  renderProducts(filtered);
};

// Sorting
document.getElementById("sortSelect").onchange = (e) => {
  let sorted = [...products];

  if (e.target.value === "price-asc")
    sorted.sort((a, b) => a.price - b.price);

  if (e.target.value === "price-desc")
    sorted.sort((a, b) => b.price - a.price);

  renderProducts(sorted);
};
