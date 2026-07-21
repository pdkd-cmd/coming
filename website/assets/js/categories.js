async function loadCategories() {

    try{

        const result =
        await APIClient.get("/categories");

        const grid =
        document.getElementById("categoryGrid");

        if(!grid) return;

        grid.innerHTML="";

        result.data.forEach(category=>{

            grid.innerHTML+=`

<div class="category-card">

<a href="category.html?category=${category.slug}">

<div class="category-image">

<img
src="${APIClient.getImageUrl(category.image || 'logo.png', 'products')}"
onerror="this.onerror=null; this.src='assets/images/logo.png';">

</div>

<div class="category-content">

<h3>${category.name}</h3>

<p>Explore Collection</p>

</div>

</a>

</div>

`;

        });

    }

    catch(err){

        console.log(err);

    }

}

loadCategories();