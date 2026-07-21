const params = new URLSearchParams(window.location.search);

const category = params.get("category");

document.getElementById("categoryTitle").innerText =
(category || "Products").toUpperCase();

async function loadProducts(){

    const result =
    await APIClient.getAllProducts();

    const grid =
    document.getElementById("productGrid");

    grid.innerHTML="";

    const products =
    result.data.filter(
        p=>p.category===category
    );

    if(products.length===0){

        grid.innerHTML=`
<h2 style="grid-column:1/-1;text-align:center">
No Products Found
</h2>
`;

        return;

    }

    products.forEach(product=>{

        grid.innerHTML+=`

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

loadProducts();