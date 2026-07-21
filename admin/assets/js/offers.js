document
.getElementById("offerForm")
.addEventListener("submit", async e=>{

e.preventDefault();

const data={

title:title.value,

subtitle:subtitle.value,

discount:discount.value,

button_text:button_text.value,

button_link:button_link.value

};

const response = await apiFetch(API, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});

const result = await response.json();

if(result.success){

    alert("Offer Saved");

    document.getElementById("offerForm").reset();

    loadOffers();

}else{

    alert(result.error || "Offer Save Failed");

}

});

async function loadOffers(){

const res=await apiFetch(API);

const result=await res.json();

const list=document.getElementById("offerList");

list.innerHTML="";

result.data.forEach(o=>{

list.innerHTML+=`

<div
style="
padding:20px;
border:1px solid #ddd;
margin-bottom:15px;
">

<h3>${o.title}</h3>

<p>${o.subtitle}</p>

<b>${o.discount}</b>

</div>

`;

});

}

loadOffers();
