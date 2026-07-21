/**
 * product.js - UI Layer
 * Responsible ONLY for rendering and DOM updates
 * All data comes from ProductManager
 * 
 * NOTE: product-manager.js and api-client.js must be loaded BEFORE this file
 */

// Initialize on page load
async function initProductPage() {
  try {
    const success = await productManager.init();
    
    if (!success) {
      showError(productManager.loadError);
      return;
    }

    renderProductDetails();
    renderVariants();
    renderGallery();
    loadRelatedProducts();
  } catch (err) {
    console.error('Product page error:', err);
    showError('Failed to load product');
  }
}

/**
 * Render main product details
 */
function renderProductDetails() {
  const { product } = productManager;

  document.getElementById('productName').innerText = product.name;
  document.getElementById('productDescription').innerText = product.description || '';
  
  // Update prices
  updatePriceDisplay();
  
  // Update discount
  const discount = productManager.getDiscountPercent();
  document.querySelector('.discount').innerText = `${discount}% OFF`;
  
  // Update stock status
  updateStockDisplay();
  
  // Update main image
  document.getElementById('mainProductImage').src = productManager.getMainImageUrl();
  document.getElementById('mainProductImage').onerror = function () {
    this.onerror = null;
    this.src = 'assets/images/logo.png';
  };

  // Update wishlist button
  updateWishlistButton(product.id);
}

/**
 * Update price display
 */
function updatePriceDisplay() {
  const price = productManager.getCurrentPrice();
  const originalPrice = productManager.product.price;

  document.getElementById('salePrice').innerText = '₹' + Math.floor(price);
  document.getElementById('oldPrice').innerText = '₹' + Math.floor(originalPrice);
}

/**
 * Update stock status
 */
function updateStockDisplay() {
  const stock = productManager.getCurrentStock();
  const el = document.getElementById('stockInfo');

  if (stock <= 0) {
    el.innerHTML = '❌ Out Of Stock';
    el.style.color = 'red';
  } else if (stock < 5) {
    el.innerHTML = `⚠️ Only ${stock} left`;
    el.style.color = 'orange';
  } else {
    el.innerHTML = '✅ In Stock';
    el.style.color = 'green';
  }
}

/**
 * Render size and color variant buttons
 */
function renderVariants() {
  const sizes = productManager.getUniqueSizes();
  const colors = productManager.getUniqueColors();

  const sizeGroup = document.getElementById('sizeGroup');
  const colorGroup = document.getElementById('colorGroup');

  sizeGroup.innerHTML = '';
  colorGroup.innerHTML = '';

  // Render size buttons
  sizes.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.className = 'variant-btn' + (index === 0 ? ' active' : '');
    btn.innerText = size;
    btn.onclick = () => selectSize(size);
    sizeGroup.appendChild(btn);
  });

  // Render color buttons
  colors.forEach((color, index) => {
    const btn = document.createElement('button');
    btn.className = 'variant-btn' + (index === 0 ? ' active' : '');
    btn.innerText = color;
    btn.style.backgroundColor = getColorCode(color);
    btn.onclick = () => selectColor(color);
    colorGroup.appendChild(btn);
  });

  // Update variant info when both selected
  updateVariantInfo();
}

/**
 * Select size
 */
function selectSize(size) {
  document.querySelectorAll('#sizeGroup .variant-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  updateVariantInfo();
}

/**
 * Select color
 */
function selectColor(color) {
  document.querySelectorAll('#colorGroup .variant-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  updateVariantInfo();
}

/**
 * Update variant info based on selection
 */
function updateVariantInfo() {
  const selectedSize = document.querySelector('#sizeGroup .active')?.innerText || null;
  const selectedColor = document.querySelector('#colorGroup .active')?.innerText || null;

  if (!selectedSize && !selectedColor) return;

  const variant = productManager.findVariant(selectedSize, selectedColor);
  
  if (variant) {
    productManager.selectVariant(variant);
    updatePriceDisplay();
    updateStockDisplay();
  }
}

/**
 * Render gallery
 */
function renderGallery() {
  const gallery = document.getElementById('productGallery');
  gallery.innerHTML = '';

  const imageUrls = productManager.getImageUrls();

  imageUrls.forEach((url, index) => {
    const img = document.createElement('img');
    img.className = 'thumb' + (index === 0 ? ' active-thumb' : '');
    img.src = url;
    img.onerror = function () {
      this.onerror = null;
      this.src = 'assets/images/logo.png';
    };
    img.onclick = () => changeMainImage(img);
    gallery.appendChild(img);
  });
}

/**
 * Change main image
 */
function changeMainImage(img) {
  document.getElementById('mainProductImage').src = img.src;
  
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active-thumb'));
  img.classList.add('active-thumb');
}

/**
 * Load related products
 */
async function loadRelatedProducts() {
  try {
    const data = await APIClient.getAllProducts();
    
    if (!data.success || !data.data) return;

    const grid = document.getElementById('relatedProducts');
    if (!grid) return;

    grid.innerHTML = '';

    data.data
      .filter(item => item.id !== productManager.product.id)
      .slice(0, 4)
      .forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-image">
            <a href="product.html?id=${product.id}">
              <img src="${APIClient.getImageUrl(product.image, 'products')}" 
                   onerror="this.onerror=null;this.src='assets/images/logo.png'">
            </a>
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">₹${Math.floor(product.sale_price)}</div>
            <button class="order-btn" onclick="location.href='product.html?id=${product.id}'">
              View Product
            </button>
          </div>
        `;
        grid.appendChild(card);
      });
  } catch (err) {
    console.error('Failed to load related products:', err);
  }
}

/**
 * Quantity controls
 */
function increaseQty() {
  productManager.increaseQuantity();
  document.getElementById('qty').value = productManager.quantity;
}

function decreaseQty() {
  productManager.decreaseQuantity();
  document.getElementById('qty').value = productManager.quantity;
}

/**
 * Add to cart
 */
function addCurrentProductToCart() {
  console.log("Add to Cart clicked");
  console.log(productManager.getCartItem());
  if (!productManager.product) {
    alert('Product not loaded');
    return;
  }

  if (productManager.getCurrentStock() < productManager.quantity) {
    alert('Not enough stock');
    return;
  }

  const item = productManager.getCartItem();
  addToCart(item);
}

/**
 * Order on Telegram
 */
function orderNow() {
  if (!productManager.product) {
    alert('Product not loaded');
    return;
  }

  const message = `🛍️ *New Order Request*

📦 Product : ${productManager.product.name}
🏷️ SKU : ${productManager.selectedVariant?.sku || productManager.product.sku}
📏 Size : ${productManager.selectedVariant?.size || '-'}
🎨 Color : ${productManager.selectedVariant?.color || '-'}
🔢 Quantity : ${productManager.quantity}
💰 Price Per Unit : ₹${Math.floor(productManager.getCurrentPrice())}
💳 Total Price : ₹${Math.floor(productManager.getCurrentPrice() * productManager.quantity)}

Please confirm availability.`;

  window.open(
    `https://t.me/${productManager.telegramUsername}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
}

/**
 * Utility: Get color code for color button background
 */
function getColorCode(colorName) {
  const colorMap = {
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#22c55e',
    'Yellow': '#eab308',
    'Black': '#000000',
    'White': '#ffffff',
    'Pink': '#ec4899',
    'Purple': '#a855f7',
    'Orange': '#f97316',
    'Brown': '#92400e'
  };
  return colorMap[colorName] || '#d1d5db';
}

/**
 * Show error message
 */
function showError(message) {
  const productPage = document.querySelector('.product-page');
  if (productPage) {
    productPage.innerHTML = `<div style="padding: 40px; text-align: center;"><h2>⚠️ ${message}</h2></div>`;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProductPage);
