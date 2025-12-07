// IMAGE SWITCHER
function changeImage(img) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = img.src;
}

//  UNIVERSAL ADD TO CART
function addToCart(productObj, qty = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // FIX 1: Auto-generate unique ID if missing  
    const id = productObj.id || Date.now();

    // FIX 2: Correct image path
    const imgPath = productObj.image.startsWith("http")
        ? productObj.image
        : "../public/images/" + productObj.image.replace(/^.*[\\/]/, "");

    const product = {
        id: id,
        name: productObj.title || productObj.name || "Unnamed",
        price: Number(productObj.price),
        image: imgPath,
        quantity: Number(qty)
    };

    // FIX 3: If product exists, increase qty
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}


//  ADD BUTTON FUNCTION
document.getElementById("addToCartBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const imgFile = productData.image.replace(/^.*[\\/]/, ""); // remove folder prefix

    const product = {
        id: productData.id || Date.now(),
        name: productData.title || productData.name,
        price: Number(productData.price),
        quantity: Number(document.getElementById("quantity").value),
        image: "../public/images/" + imgFile 
    };

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
    window.location.href = "./cart.html";
});


