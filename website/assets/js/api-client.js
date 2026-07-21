/**
 * Centralized API Client
 * All API calls go through this layer
 * Standardizes error handling and responses
 */

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:5000/api"
  : "/api"; // For production

class APIClient {
  static async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success === undefined) {
        return {
          success: true,
          data: data,
        };
      }

      return data;
    } catch (err) {
      console.error(`GET ${endpoint}:`, err);
      throw err;
    }
  }

  static async post(endpoint, body) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success === undefined) {
        data.success = true;
      }

      return data;
    } catch (err) {
      console.error(`POST ${endpoint}:`, err);
      throw err;
    }
  }

  // API Endpoints - Products
  static getProduct(id) {
    return this.get(`/products/${id}`);
  }

  static getProductVariants(id) {
    return this.get(`/products/${id}/variants`);
  }

  static getProductImages(id) {
    return this.get(`/products/${id}/images`);
  }

  static getAllProducts() {
    return this.get("/products");
  }

  // API Endpoints - Settings
  static getSettings() {
    return this.get("/settings");
  }

  // API Endpoints - Orders
  static createOrder(order) {
    return this.post("/orders", order);
  }

  // Utility: Image URL
  static getImageUrl(filename, type = "products") {
    const uploadBase = window.location.origin.includes("localhost")
      ? "http://localhost:5000/uploads"
      : "/uploads";
    return `${uploadBase}/${type}/${filename}`;
  }
}
