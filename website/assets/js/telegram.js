/**
 * telegram.js - Telegram Ordering Module
 * Handles Telegram order sending and cart-related operations
 * Uses ProductManager for product data
 * Requires: product-manager.js, cart.js, api-client.js
 */

/**
 * Send order to Telegram with current product
 * Called from product page
 */
function sendOrderToTelegram() {
  if (!productManager || !productManager.product) {
    alert('Product not loaded');
    return;
  }

  const product = productManager.product;
  const variant = productManager.selectedVariant;
  const qty = productManager.quantity;
  const price = productManager.getCurrentPrice();
  const totalPrice = price * qty;

  const message = `🛍️ *New Order Request*

📦 Product : ${product.name}
🏷️ SKU : ${variant?.sku || product.sku}
📏 Size : ${variant?.size || '-'}
🎨 Color : ${variant?.color || '-'}
🔢 Quantity : ${qty}
💰 Price Per Unit : ₹${Math.floor(price)}
💳 Total Price : ₹${Math.floor(totalPrice)}

Please confirm availability.`;

  window.open(
    `https://t.me/${productManager.telegramUsername}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
}

/**
 * Send entire cart to Telegram
 */
function sendCartToTelegram() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Cart is empty');
    return;
  }

  let message = `📦 *Cart Order*\n\n`;

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    message += `${index + 1}. ${item.name}\n`;
    message += `   SKU: ${item.sku}\n`;
    message += `   Size: ${item.size || '-'} | Color: ${item.color || '-'}\n`;
    message += `   Qty: ${item.qty} x ₹${item.price} = ₹${item.price * item.qty}\n\n`;
  });

  message += `💳 *Total: ₹${total}*\n\n`;
  message += `Please confirm availability and provide delivery details.`;

  const telegramUsername = productManager?.telegramUsername || 'PyaruDidiKiDukan_bot';

  window.open(
    `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
}

/**
 * Show a toast notification
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 9999;
    animation: slideUp 0.3s ease-in-out;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}