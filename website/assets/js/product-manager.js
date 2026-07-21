/**
 * ProductManager - Single source of truth for product data
 * All product-related data and logic managed here
 * Other files (telegram.js, cart.js, etc.) read from this
 */

class ProductManager {
  constructor() {
    // URL params
    this.productId = new URLSearchParams(window.location.search).get('id');
    
    // Product data
    this.product = null;
    this.variants = [];
    this.images = [];
    this.selectedVariant = null;
    this.quantity = 1;
    
    // Settings
    this.telegramUsername = 'PyaruDidiKiDukan_bot';
    
    // Loading states
    this.isLoading = false;
    this.loadError = null;
  }

  /**
   * Main initialization - Load all product data
   */
  async init() {
    if (!this.productId) {
      this.loadError = 'No product ID provided';
      return false;
    }

    this.isLoading = true;

    try {
      await Promise.all([
        this.loadProduct(),
        this.loadSettings(),
        this.loadVariants(),
        this.loadImages()
      ]);

      // Auto-select first variant if available
      if (this.variants.length > 0) {
        this.selectVariant(this.variants[0]);
      }

      this.isLoading = false;
      return true;
    } catch (err) {
      console.error('ProductManager init error:', err);
      this.loadError = err.message;
      this.isLoading = false;
      return false;
    }
  }

  /**
   * Load product details
   */
  async loadProduct() {
    const data = await APIClient.getProduct(this.productId);
    
    if (!data.success || !data.data) {
      throw new Error('Product not found');
    }

    this.product = data.data;
  }

  /**
   * Load variants for this product
   */
  async loadVariants() {
    const data = await APIClient.getProductVariants(this.productId);
    
    if (data.success && data.data) {
      this.variants = data.data;
    }
  }

  /**
   * Load gallery images
   */
  async loadImages() {
    const data = await APIClient.getProductImages(this.productId);
    
    if (data.success && data.data) {
      this.images = data.data;
    }
  }

  /**
   * Load store settings
   */
  async loadSettings() {
    const data = await APIClient.getSettings();
    
    if (data.success && data.data && data.data.telegram_username) {
      this.telegramUsername = data.data.telegram_username;
    }
  }

  /**
   * Select a variant
   */
  selectVariant(variant) {
    this.selectedVariant = variant;
    this.quantity = 1; // Reset quantity when variant changes
  }

  /**
   * Get current price (from variant or product)
   */
  getCurrentPrice() {
    if (this.selectedVariant) {
      return this.selectedVariant.sale_price;
    }
    return this.product?.sale_price || 0;
  }

  /**
   * Get current stock (from variant or product)
   */
  getCurrentStock() {
    if (this.selectedVariant) {
      return this.selectedVariant.stock;
    }
    return this.product?.stock || 0;
  }

  /**
   * Increase quantity
   */
  increaseQuantity() {
    const maxStock = this.getCurrentStock();
    if (this.quantity < maxStock) {
      this.quantity++;
    }
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Set quantity directly
   */
  setQuantity(qty) {
    const maxStock = this.getCurrentStock();
    const numQty = Number(qty) || 1;
    this.quantity = Math.min(Math.max(numQty, 1), maxStock);
  }

  /**
   * Get discount percentage
   */
  getDiscountPercent() {
    if (!this.product) return 0;
    
    const price = Number(this.product.price);
    const salePrice = Number(this.product.sale_price);
    
    if (price <= salePrice) return 0;
    
    return Math.round(((price - salePrice) / price) * 100);
  }

  /**
   * Get product info for cart
   */
  getCartItem() {
    return {
      id: this.product.id,
      sku: this.selectedVariant?.sku || this.product.sku,
      name: this.product.name,
      image: this.product.image,
      price: this.getCurrentPrice(),
      qty: this.quantity,
      size: this.selectedVariant?.size || '-',
      color: this.selectedVariant?.color || '-',
      variantId: this.selectedVariant?.id || null
    };
  }

  /**
   * Get main product image URL
   */
  getMainImageUrl() {
    return APIClient.getImageUrl(this.product.image, 'products');
  }

  /**
   * Get all image URLs
   */
  getImageUrls() {
    return [
      this.getMainImageUrl(),
      ...this.images.map(img => APIClient.getImageUrl(img.image, 'products'))
    ];
  }

  /**
   * Check if product is in stock
   */
  isInStock() {
    return this.getCurrentStock() > 0;
  }

  /**
   * Get unique sizes from variants
   */
  getUniqueSizes() {
    return [...new Set(this.variants.map(v => v.size).filter(Boolean))];
  }

  /**
   * Get unique colors from variants
   */
  getUniqueColors() {
    return [...new Set(this.variants.map(v => v.color).filter(Boolean))];
  }

  /**
   * Find variant by size and color
   */
  findVariant(size, color) {
    return this.variants.find(v => v.size === size && v.color === color) || null;
  }
}

const productManager = new ProductManager();

window.productManager = productManager;

document.addEventListener('DOMContentLoaded', async () => {
    await productManager.init();
});

