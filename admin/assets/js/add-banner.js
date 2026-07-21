const form = document.getElementById("bannerForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const title =
    document.getElementById("title").value.trim();

    const subtitle =
    document.getElementById("subtitle").value.trim();

    const buttonText =
    document.getElementById("buttonText").value.trim();

    const buttonLink =
    document.getElementById("buttonLink").value.trim();

    const status =
    Number(document.getElementById("status").value);

    const imageFile =
    document.getElementById("bannerImage").files[0];

    if (!title) {

        alert("Banner Title Required");

        return;

    }

    if (!imageFile) {

        alert("Select Banner Image");

        return;

    }

    try {

        // Upload Image
        const uploadData = new FormData();

        uploadData.append("image", imageFile);

        const uploadResponse = await apiFetch(

            "http://localhost:5000/api/banners/upload",

            {

                method: "POST",

                body: uploadData

            }

        );

        const uploadResult =
        await uploadResponse.json();

        if (!uploadResult.success) {

            alert("Image Upload Failed");

            return;

        }

        // Save Banner
        const banner = {

            title,

            subtitle,

            button_text: buttonText,

            button_link: buttonLink,

            image: uploadResult.filename,

            status

        };

        const response = await apiFetch(

            "http://localhost:5000/api/banners",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(banner)

            }

        );

        const result =
        await response.json();

        if (result.success) {

            alert("Banner Added Successfully");

            window.location.href = "banners.html";

        }

        else {

            alert("Failed To Save Banner");

        }

    }

    catch (err) {

        alert("Server Error");

    }

});
