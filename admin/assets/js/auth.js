const currentPage = window.location.pathname.split("/").pop();
const adminToken = localStorage.getItem("adminToken");

if (currentPage !== "login.html" && !adminToken) {
    window.location.replace("login.html");
}

// All admin API calls use the same bearer token.  Keeping this here means
// product, order, category, offer, banner and settings requests cannot
// accidentally be sent without authentication (including FormData uploads).
const nativeFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const isApiRequest = url.startsWith("/api/") ||
        url.startsWith("http://localhost:5000/api/");

    if (!isApiRequest || !adminToken) {
        return nativeFetch(input, init);
    }

    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    headers.set("Authorization", `Bearer ${adminToken}`);

    return nativeFetch(input, { ...init, headers });
};

function logout() {
    localStorage.removeItem("adminToken");
    window.location.replace("login.html");
}
