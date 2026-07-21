// ================================
// PDKD ADMIN ORDERS
// Part 1
// ================================

let orders = [];

async function loadOrders() {
  try {
    const response = await apiFetch("http://localhost:5000/api/orders");

    const result = await response.json();

    orders = result.data || [];

    renderOrders(orders);
  } catch (err) {
    console.error(err);

    alert("Unable to load orders.");
  }
}

function renderOrders(data) {
  const tbody = document.getElementById("ordersTable");

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `

<tr>

<td colspan="6"
style="text-align:center;padding:40px;">

No Orders Found

</td>

</tr>

`;

    return;
  }

  data.forEach((order) => {
    tbody.innerHTML += `

<tr>

<td>

${order.order_id}

</td>

<td>

${order.customer_name}

</td>

<td>

${order.customer_phone}

</td>

<td>

₹${Number(order.total || 0)}

</td>

<td>

<select
onchange="updateStatus(${order.id},this.value)">

<option
value="Pending"
${order.status == "Pending" ? "selected" : ""}>
Pending
</option>

<option
value="Confirmed"
${order.status == "Confirmed" ? "selected" : ""}>
Confirmed
</option>

<option
value="Packed"
${order.status == "Packed" ? "selected" : ""}>
Packed
</option>

<option
value="Shipped"
${order.status == "Shipped" ? "selected" : ""}>
Shipped
</option>

<option
value="Delivered"
${order.status == "Delivered" ? "selected" : ""}>
Delivered
</option>

<option
value="Cancelled"
${order.status == "Cancelled" ? "selected" : ""}>
Cancelled
</option>

</select>

</td>

<td>

<button
class="view"
onclick="viewOrder(${order.id})">

View

</button>

<button
class="delete"
onclick="deleteOrder(${order.id})">

Delete

</button>

</td>

</tr>

`;
  });
}

async function deleteOrder(id) {
  const ok = confirm("Delete this order?");

  if (!ok) return;

  await apiFetch(
    `http://localhost:5000/api/orders/${id}`,

    {
      method: "DELETE",
    },
  );

  loadOrders();
}

async function updateStatus(id, status) {
  const response = await apiFetch(
    `http://localhost:5000/api/orders/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  const result = await response.json();

  if (result.success) {
    loadOrders();
  }
}

function viewOrder(id) {
  const order = orders.find((o) => o.id == id);

  if (!order) return;

  const products = order.products ? JSON.parse(order.products) : [];

  let html = `

<h2 style="margin-bottom:20px;">
Order #${order.order_id}
</h2>

<div style="
background:#f8f9fa;
padding:20px;
border-radius:12px;
margin-bottom:25px;
line-height:2;
">

<h3>👤 Customer Details</h3>

<div><b>Name :</b> ${order.customer_name}</div>

<div><b>Phone :</b> ${order.customer_phone}</div>

<div><b>Address :</b> ${order.customer_address}</div>

<div>

<b>Status :</b>

<span
style="
background:#198754;
color:white;
padding:5px 12px;
border-radius:20px;
">

${order.status}

</span>

</div>

<div>

<b>Created :</b>

${order.created_at}

</div>

</div>

<h3 style="margin-bottom:20px;">
📦 Products
</h3>

`;

  let grandTotal = 0;

  products.forEach((product) => {
    const price = Number(product.price || product.sale_price || 0);

    const subtotal = price * Number(product.qty);

    grandTotal += subtotal;

    html += `

<div
style="
display:flex;
gap:20px;
align-items:center;
padding:20px;
margin-bottom:20px;
border:1px solid #eee;
border-radius:15px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
">

<img
src="http://localhost:5000/uploads/products/${product.image}"

style="
width:120px;
height:120px;
object-fit:cover;
border-radius:12px;
">

<div style="flex:1;">

<h2 style="margin-bottom:10px;">

${product.name}

</h2>

<p>

<b>SKU :</b>

${product.sku}

</p>

<p>

<b>Price :</b>

₹${price}

</p>

<p>

<b>Quantity :</b>

${product.qty}

</p>

<p>

<b>Subtotal :</b>

₹${subtotal}

</p>

</div>

</div>

`;
  });

  html += `

<div
style="
background:#111;
color:white;
padding:25px;
border-radius:12px;
text-align:right;
">

<h2>

Grand Total

</h2>

<h1
style="
font-size:36px;
margin-top:10px;
color:#28a745;
">

₹${grandTotal}

</h1>

</div>

`;

  document.getElementById("modalBody").innerHTML = html;

  document.getElementById("viewModal").style.display = "block";
}

function closeModal() {
  document.getElementById("viewModal").style.display = "none";
}

// Live Search

document.getElementById("searchOrder").addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase();

  const filtered = orders.filter(
    (order) =>
      (order.order_id || "").toLowerCase().includes(keyword) ||
      (order.customer_name || "").toLowerCase().includes(keyword) ||
      (order.customer_phone || "").toLowerCase().includes(keyword),
  );

  renderOrders(filtered);
});

// Close Modal when clicking outside

window.onclick = function (e) {
  const modal = document.getElementById("viewModal");

  if (e.target === modal) {
    closeModal();
  }
};

// Initial Load

loadOrders();
