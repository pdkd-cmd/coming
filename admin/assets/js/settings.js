const API =
  window.location.origin.includes("localhost")
    ? "http://localhost:5000/api/settings"
    : "/api/settings";

// =========================
// Load Settings
// =========================

async function loadSettings() {

    try {

        const response = await apiFetch(API);

        const result = await response.json();

        if (!result.success) {

            alert("Unable To Load Settings");

            return;

        }

        const s = result.data;

        document.getElementById("store_name").value = s.store_name || "";

        document.getElementById("phone").value = s.phone || "";

        document.getElementById("email").value = s.email || "";

        document.getElementById("address").value = s.address || "";

        document.getElementById("telegram_username").value =
            s.telegram_username || "";

        document.getElementById("whatsapp").value =
            s.whatsapp || "";

        document.getElementById("instagram").value =
            s.instagram || "";

        document.getElementById("facebook").value =
            s.facebook || "";

        document.getElementById("youtube").value =
            s.youtube || "";

        document.getElementById("footer_text").value =
            s.footer_text || "";

    } catch (err) {

        console.error(err);

        alert("Server Error");

    }

}

// =========================
// Save Settings
// =========================

document
.getElementById("settingsForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const settings = {

        store_name:
            document.getElementById("store_name").value,

        phone:
            document.getElementById("phone").value,

        email:
            document.getElementById("email").value,

        address:
            document.getElementById("address").value,

        telegram_username:
            document.getElementById("telegram_username").value,

        whatsapp:
            document.getElementById("whatsapp").value,

        instagram:
            document.getElementById("instagram").value,

        facebook:
            document.getElementById("facebook").value,

        youtube:
            document.getElementById("youtube").value,

        footer_text:
            document.getElementById("footer_text").value,

        logo: ""

    };

    try {

        const response = await apiFetch(API, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(settings)

        });

        const result = await response.json();

        if (result.success) {

            alert("✅ Settings Saved Successfully");

        } else {

            alert("❌ Save Failed");

        }

    } catch (err) {

        console.error(err);

        alert("Server Error");

    }

});

// =========================

loadSettings();
