function toggleWishlist(productId = productManager.product.id) {

    let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

    if(wishlist.includes(productId)){

        wishlist =
        wishlist.filter(id=>id!==productId);

    }else{

        wishlist.push(productId);

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistButton(productId);

}

function updateWishlistButton(productId){

    const btn =
    document.getElementById("wishlistBtn");

    if(!btn) return;

    const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

    btn.innerText =
    wishlist.includes(productId)
    ? "❤️ Wishlisted"
    : "🤍 Add to Wishlist";

}