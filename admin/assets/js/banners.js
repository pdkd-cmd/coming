// =====================================
// PDKD Banner Manager
// Part 1
// =====================================

let banners = [];

async function loadBanners() {
  try {
    const response = await apiFetch("http://localhost:5000/api/banners");

    const result = await response.json();

    banners = result.data || [];

    renderBanners(banners);
  } catch (err) {
    console.error(err);

    alert("Unable to load banners.");
  }
}

function renderBanners(data) {
  const table = document.getElementById("bannerTable");

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `

<tr>

<td colspan="4"
style="text-align:center;padding:40px;">

No Banners Found

</td>

</tr>

`;

    return;
  }

  data.forEach((banner) => {
    table.innerHTML += `

<tr>

<td>

<img
class="banner-img"
src="http://localhost:5000/uploads/banners/${banner.image}">

</td>

<td>

<b>${banner.title}</b>

<br>

<small>${banner.subtitle || ""}</small>

</td>

<td>

<span class="${banner.status ? "active" : "inactive"}">

${banner.status ? "Active" : "Inactive"}

</span>

</td>

<td>

<button
onclick="editBanner(${banner.id})">

Edit

</button>

<button
style="background:#dc3545;"
onclick="deleteBanner(${banner.id})">

Delete

</button>

</td>

</tr>

`;
  });
}

// =====================
// Delete Banner
// =====================

async function deleteBanner(id) {
  const ok = confirm("Delete Banner?");

  if (!ok) return;

  const response = await apiFetch(
    `http://localhost:5000/api/banners/${id}`,

    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (result.success) {
    loadBanners();
  }
}

// =====================
// Search
// =====================

document.getElementById("search").addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase();

  const filtered = banners.filter(
    (banner) =>
      (banner.title || "").toLowerCase().includes(keyword) ||
      (banner.subtitle || "").toLowerCase().includes(keyword),
  );

  renderBanners(filtered);
});

// Temporary
function editBanner(id) {
  alert("Edit Banner Coming In Part 2");
}

// =====================================
// PDKD Banner Manager
// Part 2
// =====================================

let editingBannerId = null;

// ===============================
// Add Banner
// ===============================

function openAddBanner() {
  editingBannerId = null;

  const title = prompt("Banner Title");

  if (!title) return;

  const subtitle = prompt("Banner Subtitle") || "";

  const buttonText = prompt("Button Text") || "Shop Now";

  const buttonLink = prompt("Button Link") || "#";

  const image = prompt("Banner Image Filename\nExample : banner1.jpg");

  if (!image) return;

  saveBanner({
    title,
    subtitle,
    button_text: buttonText,
    button_link: buttonLink,
    image,
    status: 1,
  });
}

// ===============================
// Edit Banner
// ===============================

function editBanner(id) {
  const banner = banners.find((b) => b.id == id);

  if (!banner) return;

  editingBannerId = id;

  const title = prompt("Banner Title", banner.title);

  if (title === null) return;

  const subtitle = prompt("Subtitle", banner.subtitle);

  const buttonText = prompt("Button Text", banner.button_text);

  const buttonLink = prompt("Button Link", banner.button_link);

  const image = prompt("Image Filename", banner.image);

  const status = confirm("Active Banner ?") ? 1 : 0;

  saveBanner({
    title,

    subtitle,

    button_text: buttonText,

    button_link: buttonLink,

    image,

    status,
  });
}

// ===============================
// Save Banner
// ===============================

async function saveBanner(data) {
  let url = "http://localhost:5000/api/banners";

  let method = "POST";

  if (editingBannerId) {
    url += "/" + editingBannerId;

    method = "PUT";
  }

  const response = await apiFetch(url, {
    method,

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.success) {
    alert(editingBannerId ? "Banner Updated" : "Banner Added");

    editingBannerId = null;

    loadBanners();
  } else {
    alert("Operation Failed");
  }
}

loadBanners();
