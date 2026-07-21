const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProduct() {
  const response = await apiFetch(`http://localhost:5000/api/products/${id}`);

  const product = await response.json();

  document.getElementById("sku").value = product.sku;

  document.getElementById("name").value = product.name;

  document.getElementById("brand").value = product.brand;

  document.getElementById("price").value = product.price;

  document.getElementById("sale_price").value = product.sale_price;

  document.getElementById("stock").value = product.stock;

  document.getElementById("category").value = product.category;

  document.getElementById("description").value = product.description;

  document.getElementById("image").value = product.image;
}

const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    sku: document.getElementById("sku").value,

    name: document.getElementById("name").value,

    brand: document.getElementById("brand").value,

    description: document.getElementById("description").value,

    price: document.getElementById("price").value,

    sale_price: document.getElementById("sale_price").value,

    stock: document.getElementById("stock").value,

    image: document.getElementById("image").value,

    category: document.getElementById("category").value,
  };

  const response = await apiFetch(`http://localhost:5000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const result = await response.json();

  if (result.success) {
    const ok = await saveVariants();

    if (!ok) return;

    alert("Product & Variants Updated");

    window.location.href = "products.html";
  }
});

let variantCount = 0;

function addVariantRow() {
  variantCount++;

  const list = document.getElementById("variantList");

  list.innerHTML += `

<div
class="variant-row"
style="
display:grid;
grid-template-columns:
1fr 1fr 1fr 1fr 1fr 1fr auto;
gap:10px;
margin-bottom:15px;
">

<input
placeholder="SKU"
class="variant-sku">

<input
placeholder="Color"
class="variant-color">

<input
placeholder="Size"
class="variant-size">

<input
type="number"
placeholder="Stock"
class="variant-stock">

<input
type="number"
placeholder="Price"
class="variant-price">

<input
type="number"
placeholder="Sale Price"
class="variant-sale-price">

<button
type="button"
onclick="this.parentElement.remove()">

Remove

</button>

</div>

`;
}

// ===============================
// LOAD VARIANTS
// ===============================

async function loadVariants() {
  const response = await apiFetch(
    `http://localhost:5000/api/products/${id}/variants`,
  );

  const result = await response.json();

  if (!result.success) return;

  const list = document.getElementById("variantList");

  list.innerHTML = "";

  result.data.forEach((v) => {
    list.innerHTML += `

<div
class="variant-row"
data-id="${v.id}"
style="
display:grid;
grid-template-columns:
1fr 1fr 1fr 1fr 1fr 1fr auto;
gap:10px;
margin-bottom:15px;
">

<input
class="variant-sku"
value="${v.sku}">

<input
class="variant-color"
value="${v.color}">

<input
class="variant-size"
value="${v.size}">

<input
type="number"
class="variant-stock"
value="${v.stock}">

<input
type="number"
class="variant-price"
value="${v.price}">

<input
type="number"
class="variant-sale-price"
value="${v.sale_price}">

<button
type="button"
onclick="deleteVariant(${v.id}, this)">

Delete

</button>

</div>

`;
  });
}

// ===============================
// SAVE VARIANTS
// ===============================

async function saveVariants(){

    const rows =
    document.querySelectorAll(".variant-row");

    for(const row of rows){

        const data={

            sku:row.querySelector(".variant-sku").value,

            color:row.querySelector(".variant-color").value,

            size:row.querySelector(".variant-size").value,

            stock:Number(row.querySelector(".variant-stock").value),

            price:Number(row.querySelector(".variant-price").value),

            sale_price:Number(row.querySelector(".variant-sale-price").value)

        };

        const variantId=row.dataset.id;

        let url=
`http://localhost:5000/api/products/${id}/variants`;

        let method="POST";

        if(variantId){

            url=
`http://localhost:5000/api/products/variants/${variantId}`;

            method="PUT";

        }

        const response=await apiFetch(url,{

            method,

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result=
        await response.json();

        if(!result.success){

            alert("Variant Save Failed");

            return false;

        }

    }

    return true;

}

// ===============================
// DELETE VARIANT
// ===============================

async function deleteVariant(id, btn){

    if(!confirm("Delete Variant?")) return;

    const response = await apiFetch(

        `http://localhost:5000/api/products/variants/${id}`,

        {

            method:"DELETE"

        }

    );

    const result = await response.json();

    if(result.success){

        btn.parentElement.remove();

    }

}

// =====================================
// LOAD PRODUCT GALLERY
// =====================================

async function loadGallery() {

    const response = await apiFetch(
        `http://localhost:5000/api/products/${id}/images`
    );

    const result = await response.json();

    if (!result.success) return;

    const gallery =
    document.getElementById("galleryList");

    gallery.innerHTML = "";

    result.data.forEach(img => {

        gallery.innerHTML += `

<div
style="
border:1px solid #ddd;
padding:10px;
border-radius:10px;
text-align:center;
">

<img
src="http://localhost:5000/uploads/products/${img.image}"
style="
width:100%;
height:120px;
object-fit:cover;
border-radius:8px;
">

<br><br>

<button
type="button"
onclick="deleteGalleryImage(${img.id})">

Delete

</button>

</div>

`;

    });

}

// =====================================
// DELETE IMAGE
// =====================================

async function deleteGalleryImage(imageId){

    if(!confirm("Delete Image?"))
        return;

    const response = await apiFetch(

`http://localhost:5000/api/products/images/${imageId}`,

        {

            method:"DELETE"

        }

    );

    const result = await response.json();

    if(result.success){

        loadGallery();

    }

}

async function uploadGalleryImages(){

    alert("Next Step : Image Upload");

}

// ===============================
// Upload Gallery Images
// ===============================

async function uploadGalleryImages() {

    const files =
    document.getElementById("galleryImages").files;

    if (!files.length) {

        alert("Select Images");

        return;

    }

    for (const file of files) {

        const formData = new FormData();

        formData.append("image", file);

        const response = await apiFetch(

            `http://localhost:5000/api/product-images/upload/${id}`,

            {

                method: "POST",

                body: formData

            }

        );

        const result = await response.json();

        if (!result.success) {

            alert("Upload Failed");

            return;

        }

    }

    alert("Gallery Uploaded");

    loadGallery();

}

// ===============================
// Load Gallery
// ===============================

async function loadGallery() {

    const response = await apiFetch(

        `http://localhost:5000/api/product-images/${id}`

    );

    const result = await response.json();

    const box =
    document.getElementById("galleryList");

    if (!box) return;

    box.innerHTML = "";

    result.data.forEach(img => {

        box.innerHTML += `

<div style="text-align:center;">

<img
src="http://localhost:5000/uploads/products/${img.image}"
style="
width:100%;
height:150px;
object-fit:cover;
border-radius:10px;
">

<br><br>

<button
type="button"
onclick="deleteGalleryImage(${img.id})">

Delete

</button>

</div>

`;

    });

}

// ===============================
// Delete Gallery Image
// ===============================

async function deleteGalleryImage(id) {

    if (!confirm("Delete Image?")) return;

    await apiFetch(

        `http://localhost:5000/api/product-images/${id}`,

        {

            method: "DELETE"

        }

    );

    loadGallery();

}

// Load gallery when page opens
loadGallery();

loadProduct().then(() => {

    loadVariants();

    loadGallery();

});
