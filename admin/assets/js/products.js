const form = document.getElementById("productForm");

if (form) {

form.addEventListener("submit", async (e) => {

e.preventDefault();

let imageName = "";

const imageFile =
document.getElementById("image").files[0];

if (imageFile) {

  const formData = new FormData();

  formData.append(
    "image",
    imageFile
  );

  const uploadResponse =
  await apiFetch(
    "http://localhost:5000/api/products/upload",
    {
      method: "POST",
      body: formData
    }
  );

  const uploadData =
  await uploadResponse.json();

  imageName =
  uploadData.filename;

}

const product = {

  sku:
  document.getElementById("sku").value,

  name:
  document.getElementById("name").value,

  brand:
  document.getElementById("brand").value,

  description:
  document.getElementById("description").value,

  price:
  Number(
    document.getElementById("price").value
  ),

  sale_price:
  Number(
    document.getElementById("sale_price").value
  ),

  stock:
  Number(
    document.getElementById("stock").value
  ),

  image:
  imageName,

  category:
  document.getElementById("category").value

};

try {

  const response =
  await apiFetch(
    "http://localhost:5000/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type":
        "application/json"
      },
      body:
      JSON.stringify(product)
    }
  );

  const data =
  await response.json();

  if (data.success) {

    alert(
      "Product Added Successfully"
    );

    form.reset();

  } else {

    alert(data.error);

  }

} catch (error) {

  console.error(error);

}

});

}

async function loadProducts() {
  const response = await apiFetch("http://localhost:5000/api/products");

  const result = await response.json();

  const tbody = document.getElementById("productTableBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  result.data.forEach((product) => {
    tbody.innerHTML += `

        <tr>

            <td>
            <img
            src="http://localhost:5000/uploads/products/${product.image}"
            width="60"
            height="60">
            </td>

            <td>
            ${product.sku}
            </td>

            <td>
            ${product.name}
            </td>

            <td>
            ₹${product.sale_price}
            </td>

            <td>
            ${product.stock}
            </td>

            <td>

                <button
                class="edit-btn"
                onclick="editProduct(${product.id})">
                Edit
                </button>

                <button
                class="delete-btn"
                onclick="deleteProduct(${product.id})">

                Delete

                </button>

            </td>

        </tr>

        `;
  });
}

function editProduct(id){

window.location.href =
`edit-product.html?id=${id}`;

}

async function deleteProduct(id) {
  const confirmDelete = confirm("Delete Product?");

  if (!confirmDelete) return;

  await apiFetch(
    `http://localhost:5000/api/products/${id}`,

    {
      method: "DELETE",
    },
  );

  loadProducts();
}

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
loadProducts();
