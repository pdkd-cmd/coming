const grid = document.getElementById("productGrid");

// ===== Skeleton Loading =====

grid.innerHTML = "";

for (let i = 0; i < 8; i++) {

    grid.innerHTML += `

    <div class="skeleton-card">

        <div class="skeleton-image"></div>

        <div class="skeleton-line"></div>

        <div class="skeleton-line short"></div>

        <div class="skeleton-btn"></div>

    </div>

    `;

}

// ===== Fetch Products =====

APIClient.getAllProducts()
    .then((result) => {

        const products = result.data || [];

        // Remove Skeleton
        grid.innerHTML = "";

        products.forEach((product) => {

            const discount =
                product.price > product.sale_price
                    ? Math.round(
                          ((product.price - product.sale_price) /
                              product.price) *
                              100
                      )
                    : 0;

            grid.innerHTML += `

<div class="product-card">

    <div class="product-image">

        <span class="product-badge">

            ${discount}% OFF

        </span>

        <button class="wishlist-icon">

            ❤️

        </button>

        <a href="product.html?id=${product.id}">

            <img
                src="${APIClient.getImageUrl(product.image, 'products')}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.src='assets/images/no-image.png'">

        </a>

        <div class="product-overlay">

            <a href="product.html?id=${product.id}">

                <button class="quick-view-btn">

                    Quick View

                </button>

            </a>

        </div>

    </div>

    <div class="product-info">

        <p class="product-brand">

            ${product.brand || "Pyaru Didi Ki Dukan"}

        </p>

        <h3 class="product-name">

            ${product.name}

        </h3>

        <div class="rating-row">

            ⭐⭐⭐⭐⭐

            <span>(4.8)</span>

        </div>

        <div class="price-row">

            <span class="sale-price">

                ₹${product.sale_price}

            </span>

            <span class="original-price">

                ₹${product.price}

            </span>

        </div>

        <div class="stock-row">

            ${
                Number(product.stock) > 0
                    ? "🟢 In Stock"
                    : "🔴 Out of Stock"
            }

        </div>

        <button
            class="order-btn"
            onclick="orderNow('${product.sku}','${product.name}')">

            Order Now

        </button>

    </div>

</div>

`;

        });

    })

    .catch((err) => {

        console.error(err);

        grid.innerHTML = `

        <div class="error-box">

            <h2>Unable to load products.</h2>

            <p>Please try again later.</p>

        </div>

        `;

    });