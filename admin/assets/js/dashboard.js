async function loadDashboard() {
  try {
    const response = await apiFetch("http://localhost:5000/api/dashboard");

    const stats = await response.json();

    document.getElementById("stats").innerHTML = `

<div class="card">

<h2>📦 ${stats.products}</h2>

<p>Total Products</p>

</div>

<div class="card">

<h2>🛒 ${stats.orders}</h2>

<p>Total Orders</p>

</div>

<div class="card">

<h2>⏳ ${stats.pending}</h2>

<p>Pending Orders</p>

</div>

<div class="card">

<h2>💰 ₹${Number(stats.revenue || 0)}</h2>

<p>Total Revenue</p>

</div>

`;
  } catch (err) {
    console.error(err);

    document.getElementById("stats").innerHTML =
      "<h2>Failed to load dashboard.</h2>";
  }
}

loadDashboard();
