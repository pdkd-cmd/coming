async function placeOrder(){

    const name=
    document.getElementById("customerName").value.trim();

    const phone=
    document.getElementById("customerPhone").value.trim();

    const address=
    document.getElementById("customerAddress").value.trim();

    if(name===""){

        alert("Enter Customer Name");

        return;

    }

    if(phone.length!=10){

        alert("Enter Valid Mobile Number");

        return;

    }

    if(address===""){

        alert("Enter Delivery Address");

        return;

    }

    const cart=

    JSON.parse(

    localStorage.getItem("cart")

    )||[];

    if(cart.length===0){

        alert("Cart is Empty");

        return;

    }

    let total=0;

    cart.forEach(item=>{

        total+=

        Number(item.price)

        *

        Number(item.qty);

    });

    const order={

        order_id:

        "PDKD"+Date.now(),

        customer_name:name,

        customer_phone:phone,

        customer_address:address,

        products:JSON.stringify(cart),

        total:total

    };

    try{

        const result=

        await APIClient.post("/orders", order);

        if(!result.success){

            alert("Order Failed");

            return;

        }

        let telegramUsername="PyaruDidiKiDukan_bot";

        try{

            const r=

            await APIClient.get("/settings");

            if(

                r.success &&

                r.data.telegram_username

            ){

                telegramUsername=

                r.data.telegram_username;

            }

        }

        catch(err){}

        let message=

`🛍️ New Order

Order ID : ${order.order_id}

Customer : ${name}

Phone : ${phone}

Address : ${address}

------------------------

`;

        cart.forEach(item=>{

            message+=

`SKU : ${item.sku}

Product : ${item.name}

Size : ${item.size}

Color : ${item.color}

Qty : ${item.qty}

Price : ₹${item.price}

------------------------

`;

        });

        message+=

`Total : ₹${total}`;

        localStorage.removeItem("cart");

        window.open(

`https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`,

"_blank"

        );

        alert(

        "Order Placed Successfully"

        );

        window.location.href="order-success.html";

    }

    catch(err){

        console.log(err);

        alert(

        "Server Error"

        );

    }

}