const params = new URLSearchParams(window.location.search);

const keyword = (params.get("q") || "").toLowerCase();

document.getElementById("searchInput").value = keyword;

document.getElementById("searchTitle").innerText = `Results for "${keyword}"`;

async function loadSearch() {
  const result = await APIClient.getAllProducts();
  const products = result.data || [];

  const result = await response.json();

  const products = result.data || [];

  const filtered = products.filter((product) => {
    return (
      (product.name || "").toLowerCase().includes(keyword) ||
      (product.sku || "").toLowerCase().includes(keyword) ||
      (product.category || "").toLowerCase().includes(keyword)
    );
  });

  const grid = document.getElementById("productGrid");

  if (filtered.length === 0) {
    grid.innerHTML = `

<h2
style="
grid-column:1/-1;
text-align:center;
padding:60px;
">

No Products Found

</h2>

`;

    return;
  }

  grid.innerHTML = "";

  filtered.forEach((product) => {
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

loadSearch();

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      window.location.href = "search.html?q=" + encodeURIComponent(this.value);
    }
  });
