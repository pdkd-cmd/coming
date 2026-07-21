const searchInput = document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("keydown",function(e){

        if(e.key==="Enter"){

            window.location.href=
            "search.html?q="+
            encodeURIComponent(this.value);

        }

    });

}