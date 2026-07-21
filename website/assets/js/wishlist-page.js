async function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const response = await fetch("http://localhost:5000/api/products");

  const result = await response.json();

  const products = result.data || [];

  const grid = document.getElementById("wishlistGrid");

  grid.innerHTML = "";

  const data = products.filter((p) => wishlist.includes(p.id));

  if (data.length === 0) {
    grid.innerHTML = `

<h2
style="
grid-column:1/-1;
text-align:center;
padding:60px;
">

Wishlist Empty

</h2>

`;

    return;
  }

  data.forEach((product) => {
    grid.innerHTML += `

<div class="product-card">

<div class="product-image">

<a href="product.html?id=${product.id}">

<img
src="${APIClient.getImageUrl(product.image, 'products')}"
onerror="this.src='assets/images/logo.png'">

</a>

</div>

<div class="product-info">

<div class="product-name">

${product.name}

</div>

<div class="product-price">

₹${product.sale_price}

</div>

<button
class="order-btn"
onclick="location.href='product.html?id=${product.id}'">

View Product

</button>

</div>

</div>

`;
  });
}

loadWishlist();
