function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");

  if (!badge) return;

  const cart = getCart();

  const totalQty = cart.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  badge.innerText = totalQty;
}

function increaseCartQty(index) {
  const cart = getCart();

  cart[index].qty++;

  saveCart(cart);

  renderCart();
}

function decreaseCartQty(index) {
  const cart = getCart();

  if (cart[index].qty > 1) {
    cart[index].qty--;
  }

  saveCart(cart);

  renderCart();
}

function removeCartItem(index) {
  const cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);

  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");

  const totalBox = document.getElementById("cartTotal");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
<div class="empty-cart">
<img src="assets/images/logo.png" style="width:120px;margin-bottom:20px;">
<h2>Your Cart is Empty</h2>
<p>Looks like you haven't added anything yet.</p>
<a href="index.html">
<button class="checkout-btn">Continue Shopping</button>
</a>
</div>
`;

    totalBox.innerText = "₹0";

    return;
  }

  let total = 0;

  container.innerHTML = "";

  cart.forEach((item, index) => {
    total += Number(item.price) * Number(item.qty);

    const imageUrl = APIClient 
      ? APIClient.getImageUrl(item.image, 'products')
      : `uploads/products/${item.image}`;

    container.innerHTML += `
<div class="cart-card">
<img src="${imageUrl}" onerror="this.onerror=null;this.src='assets/images/logo.png'">
<div class="cart-info">
<h3>${item.name}</h3>
<p><b>SKU:</b> ${item.sku}</p>
<p><b>Size:</b> ${item.size || "-"} </p>
<p><b>Color:</b>${item.color || "-"}</p>
<p><b>Price:</b> ₹${item.price}</p>
<div class="qty-row">
<button onclick="decreaseCartQty(${index})">−</button>
<span>${item.qty}</span>
<button onclick="increaseCartQty(${index})">+</button>
</div>
<button class="remove-btn" onclick="removeCartItem(${index})">
Remove
</button>
</div>
</div>
`;
  });

  totalBox.innerText = "₹" + total;
}

function clearCart() {
  if (!confirm("Clear Cart?")) return;

  localStorage.removeItem("cart");

  updateCartBadge();

  renderCart();
}


function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id && item.size === product.size && item.color === product.color);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({

            ...product,

            qty: product.qty || 1

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge();

    showToast("🛒 Product Added To Cart");

}

updateCartBadge();

renderCart();
