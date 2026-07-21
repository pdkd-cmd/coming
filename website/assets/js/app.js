const menuBtn = document.getElementById("mobileMenuBtn");
const navbar = document.getElementById("navbar");

if(menuBtn && navbar){

    menuBtn.addEventListener("click",()=>{

        navbar.classList.toggle("show-menu");

    });

}

// =============================
// Hero Banner
// =============================

async function loadBanner(){

    try{

        const result =
        await APIClient.get("/banners");

        if(!result.success) return;

        const banners =
        result.data.filter(item=>item.status==1);

        if(banners.length===0) return;

        let current=0;

        function showBanner(){

            const banner=banners[current];

            document.getElementById("bannerTitle").innerText =
            banner.title;

            document.getElementById("bannerSubtitle").innerText =
            banner.subtitle;

            document.getElementById("bannerButton").innerText =
            banner.button_text || "Shop Now";

            document.getElementById("bannerButtonLink").href =
            "#productGrid";

            document.getElementById("heroBanner").style.backgroundImage =

`linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),
url(${APIClient.getImageUrl(banner.image, 'banners')})`;

            document.getElementById("heroBanner").style.backgroundSize="cover";
            document.getElementById("heroBanner").style.backgroundPosition="center";

        }

        showBanner();

        setInterval(()=>{

            current++;

            if(current>=banners.length){

                current=0;

            }

            showBanner();

        },5000);

    }

    catch(err){

        console.log(err);

    }

}

loadBanner();


// =============================
// Navbar Smooth Scroll
// =============================

document.querySelectorAll(".navbar a").forEach(link=>{

    link.addEventListener("click",function(e){

        const text=this.innerText.toLowerCase();

        if(text==="home"){

            e.preventDefault();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

        if(text==="categories"){

            e.preventDefault();

            document.querySelector(".categories")
            .scrollIntoView({

                behavior:"smooth"

            });

        }

        if(text==="offers"){

            e.preventDefault();

            document.querySelector(".offer-banner")
            .scrollIntoView({

                behavior:"smooth"

            });

        }

        if(text==="contact"){

            e.preventDefault();

            document.querySelector("footer")
            .scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

async function loadSettings(){

    try{

        const result =
        await APIClient.get("/settings");

        if(!result.success) return;

        const s = result.data;

        document.title =
        s.store_name || "Pyaru Didi Ki Dukan";

        if(document.getElementById("footerStoreName"))
            document.getElementById("footerStoreName").innerText =
            s.store_name || "";

        if(document.getElementById("footerText"))
            document.getElementById("footerText").innerText =
            s.footer_text || "Premium Shopping Experience";

        if(document.getElementById("footerPhone"))
            document.getElementById("footerPhone").innerText =
            s.phone || "Phone Not Available";

        if(document.getElementById("footerEmail"))
            document.getElementById("footerEmail").innerText =
            s.email || "Email Not Available";

        if(document.getElementById("footerTelegram"))
            document.getElementById("footerTelegram").innerText =
            s.telegram_username
            ? "@"+s.telegram_username
            : "Telegram Not Available";

    }

    catch(err){

        console.log(err);

    }

}

window.addEventListener("scroll",()=>{

    const header=document.querySelector(".header");

    if(window.scrollY>40){

        header.style.boxShadow=

        "0 10px 25px rgba(0,0,0,.12)";

    }

    else{

        header.style.boxShadow=

        "0 2px 15px rgba(0,0,0,.08)";

    }

});

// ===============================
// Load Offer
// ===============================

async function loadOffer(){

    try{

        const result =
        await APIClient.get("/offers");

        if(!result.success || result.data.length===0) return;

        const offer = result.data[0];

        document.getElementById("offerTitle").innerText =
        offer.title;

        document.getElementById("offerSubtitle").innerText =
        offer.subtitle;

        document.getElementById("offerButton").innerText =
        offer.button_text;

        document
        .getElementById("offerButton")
        .parentElement.href =
        offer.button_link || "#productGrid";

    }

    catch(err){

        console.log(err);

    }

}

// ===============================
// Load Footer
// ===============================

async function loadFooter(){

    try{

        const result =
        await APIClient.get("/settings");

        if(!result.success) return;

        const s = result.data;

        document.getElementById("footerStoreName").innerText =
        s.store_name || "";

        document.getElementById("footerText").innerText =
        s.footer_text || "";

        document.getElementById("footerPhone").innerText =
        s.phone || "";

        document.getElementById("footerEmail").innerText =
        s.email || "";

        document.getElementById("footerTelegram").innerText =
        s.telegram_username || "";

    }

    catch(err){

        console.log(err);

    }

}

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    const text = document.getElementById("toastMessage");

    text.innerText = message;

    toast.className = "toast " + type + " show";

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

loadOffer();

loadFooter();

loadSettings();