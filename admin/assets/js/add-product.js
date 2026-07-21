const variantContainer = document.getElementById("variantContainer");
const addVariantBtn = document.getElementById("addVariantBtn");

addVariantBtn.addEventListener("click", () => {
  variantContainer.insertAdjacentHTML(
    "beforeend",
    `
        <div class="variant-row" style="border:1px solid #ddd;padding:10px;margin:10px 0;border-radius:6px;">

            <input type="text" class="variant-sku" placeholder="Variant SKU">

            <input type="text" class="variant-color" placeholder="Color">

            <input type="text" class="variant-size" placeholder="Size">

            <input type="number" class="variant-price" placeholder="Price">

            <input type="number" class="variant-sale-price" placeholder="Sale Price">

            <input type="number" class="variant-stock" placeholder="Stock">

            <button
                type="button"
                class="removeVariant">
                Remove
            </button>

        </div>
        `,
  );
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeVariant")) {
    e.target.parentElement.remove();
  }
});

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // ---------- Upload Main Image ----------
    let mainImage = "";

    const imageFile = document.getElementById("image").files[0];

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await apiFetch(
        "http://localhost:5000/api/products/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        mainImage = uploadData.filename;
      }
    }

    // ---------- Create Product ----------
    const product = {
      name: document.getElementById("name").value,
      sku: document.getElementById("sku").value,
      brand: document.getElementById("brand").value,
      price: Number(document.getElementById("price").value),
      sale_price: Number(document.getElementById("sale_price").value),
      stock: Number(document.getElementById("stock").value),
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      image: mainImage,
    };

    const productRes = await apiFetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const productData = await productRes.json();

    if (!productData.success) {
      alert("Product save failed");
      return;
    }

    const productId = productData.id;

    // ---------- Upload Gallery Images ----------

    const galleryFiles = document.getElementById("galleryImages").files;

    for (const file of galleryFiles) {
      const fd = new FormData();

      fd.append("image", file);

      await apiFetch(
        `http://localhost:5000/api/product-images/upload/${productId}`,
        {
          method: "POST",
          body: fd,
        },
      );
    }

    // ---------- Save Variants ----------

    const rows = document.querySelectorAll(".variant-row");

    for (const row of rows) {
      const variant = {
        sku: row.querySelector(".variant-sku").value,

        color: row.querySelector(".variant-color").value,

        size: row.querySelector(".variant-size").value,

        stock: Number(row.querySelector(".variant-stock").value),

        price: Number(row.querySelector(".variant-price").value),

        sale_price: Number(row.querySelector(".variant-sale-price").value),
      };

      const response = await apiFetch(
        `http://localhost:5000/api/products/${productId}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variant),
        },
      );

      const result = await response.json();

      if (!result.success) {
        console.error("Variant Save Failed", result);
      }
    }

    alert("Product Created Successfully");
    location.href = "products.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }

});

  async function loadCategories() {
  const response = await apiFetch("http://localhost:5000/api/categories");
  const result = await response.json();

  const select = document.getElementById("category");
  if (!select) return;

  select.innerHTML = '<option value="">Select Category</option>';

  result.data.forEach((cat) => {
    select.innerHTML += `
      <option value="${cat.slug}">
        ${cat.name}
      </option>
    `;
  });
}

loadCategories();
