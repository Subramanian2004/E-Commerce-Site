// IMAGE SWITCHER
function changeImage(img) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = img.src;
}

// ADD TO CART
document.getElementById("addToCartBtn").addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = {
    id: productData.id,
    title: productData.title,
    price: productData.price,
    quantity: Number(document.getElementById("quantity").value),
    image: productData.image
  };

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to cart!");
  window.location.href = "./cart.html";
});

// Defensive add-to-cart helper — use this in product page
function addToCartFromProduct(productData, qty = 1) {
  try {
    // productData must contain id, name (or title), price, image
    const normalized = {
      id: productData.id ?? productData._id ?? Date.now(),
      name: productData.name || productData.title || 'Untitled',
      price: Number(productData.price ?? 0),
      image: productData.image || productData.img || 'images/no-image.png',
      quantity: Number(qty || 1)
    };

    const key = 'cart';
    const raw = localStorage.getItem(key);
    const cart = raw ? JSON.parse(raw) : [];

    // If same product id exists, increment qty
    const existing = cart.find(it => String(it.id) === String(normalized.id));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + normalized.quantity;
    } else {
      cart.push(normalized);
    }

    localStorage.setItem(key, JSON.stringify(cart));
    console.log('Added to cart:', normalized);
    // small UI feedback
    if (window.showToast) showToast('Added to cart'); else alert('Added to cart');
  } catch (err) {
    console.error('addToCartFromProduct error', err);
  }
}

function addToCart(product) {
  const KEY = "cart";
  let cart = JSON.parse(localStorage.getItem(KEY)) || [];

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem(KEY, JSON.stringify(cart));
  alert("Added to Cart!");
}
