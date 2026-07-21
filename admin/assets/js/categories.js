let categories = [];
let editingId = null;

async function loadCategories() {
    const response = await apiFetch("http://localhost:5000/api/categories");
    const result = await response.json();

    categories = result.data || [];

    renderCategories(categories);
}

function renderCategories(data) {

    const list = document.getElementById("categoryList");

    list.innerHTML = "";

    if(data.length===0){

        list.innerHTML="<p>No Categories Found</p>";
        return;

    }

    data.forEach(cat=>{

        list.innerHTML += `
        <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        background:#fff;
        padding:15px;
        margin:10px 0;
        border-radius:10px;
        box-shadow:0 3px 10px rgba(0,0,0,.08);
        ">

            <div style="display:flex;align-items:center;gap:15px;">

<img
src="http://localhost:5000/uploads/products/${cat.image || "logo.png"}"
style="
width:60px;
height:60px;
border-radius:8px;
object-fit:cover;
"
onerror="this.src='assets/images/logo.png'">

<div>

<b>${cat.name}</b><br>

<small>${cat.slug}</small>

</div>

</div>

            <div>

                <button onclick="editCategory(${cat.id},'${cat.name}','${cat.slug}')">
                    Edit
                </button>

                <button
                style="background:red"
                onclick="deleteCategory(${cat.id})">
                    Delete
                </button>

            </div>

        </div>
        `;

    });

}

document.getElementById("categoryForm").addEventListener("submit",async(e)=>{

    e.preventDefault();

    const name=document.getElementById("categoryName").value.trim();
    const slug=document.getElementById("categorySlug").value.trim();

    let image = "";

const file =
document.getElementById("categoryImage").files[0];

if(file){

    const fd = new FormData();

    fd.append("image",file);

    const upload =
    await apiFetch(
        "http://localhost:5000/api/categories/upload",
        {
            method:"POST",
            body:fd
        }
    );

    const uploadData =
    await upload.json();

    if(uploadData.success){

        image = uploadData.filename;

    }

}

    if(!name || !slug){
        alert("Fill all fields");
        return;
    }

    let url="http://localhost:5000/api/categories";
    let method="POST";

    if(editingId){

        url+="/"+editingId;
        method="PUT";

    }

    await apiFetch(url,{

        method,

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            name,
            slug,
            image
        })

    });

    editingId=null;

    document.getElementById("categoryForm").reset();

    document.querySelector("#categoryForm button").innerText="Add Category";

    loadCategories();

});

function editCategory(id,name,slug){

    editingId=id;

    document.getElementById("categoryName").value=name;
    document.getElementById("categorySlug").value=slug;

    document.querySelector("#categoryForm button").innerText="Update Category";

}

async function deleteCategory(id){

    if(!confirm("Delete Category?")) return;

    await apiFetch(
        "http://localhost:5000/api/categories/"+id,
        {
            method:"DELETE"
        }
    );

    loadCategories();

}

loadCategories();
