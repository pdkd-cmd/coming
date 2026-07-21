let products = [];

async function loadInventory() {
  try {
    const response = await apiFetch("http://localhost:5000/api/products");

    const result = await response.json();

    products = result.data || [];

    renderInventory(products);
  } catch (err) {
    console.error(err);

    alert("Unable To Load Inventory");
  }
}

function renderInventory(data) {
  const table = document.getElementById("inventoryTable");

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `

<tr>

<td colspan="6"
style="text-align:center;padding:40px;">

No Products Found

</td>

</tr>

`;

    return;
  }

  data.forEach((product) => {
    let status = "";
    let className = "";

    if (product.stock <= 0) {
      status = "Out Of Stock";
      className = "stock-out";
    } else if (product.stock < 5) {
      status = "Low Stock";
      className = "stock-low";
    } else {
      status = "In Stock";
      className = "stock-good";
    }

    table.innerHTML += `

<tr>

<td>

<img
src="http://localhost:5000/uploads/products/${product.image}"
style="
width:70px;
height:70px;
object-fit:cover;
border-radius:8px;
">

</td>

<td>

${product.sku}

</td>

<td>

${product.name}

</td>

<td>

<input
type="number"
id="stock-${product.id}"
value="${product.stock}"
min="0">

</td>

<td>

<span class="${className}">

${status}

</span>

</td>

<td>

<button
onclick="updateStock(${product.id})">

Save

</button>

</td>

</tr>

`;
  });
}

async function updateStock(id) {
  const stock = Number(document.getElementById(`stock-${id}`).value);

  if (stock < 0) {
    alert("Stock cannot be negative");

    return;
  }

  try {
    const response = await apiFetch(
      `http://localhost:5000/api/products/${id}/stock`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          stock: stock,
        }),
      },
    );

    const result = await response.json();

    if (result.success) {
      alert("Stock Updated Successfully");

      loadInventory();
    } else {
      alert("Update Failed");
    }
  } catch (err) {
    console.error(err);

    alert("Server Error");
  }
}

// =============================
// Search
// =============================

document.getElementById("search").addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase();

  const filtered = products.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(keyword) ||
      (product.sku || "").toLowerCase().includes(keyword),
  );

  renderInventory(filtered);
});

// =============================
// Auto Refresh
// =============================

loadInventory();
