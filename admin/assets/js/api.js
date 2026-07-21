function getToken() {
  return localStorage.getItem("adminToken");
}

function handleUnauthorized() {
  localStorage.removeItem("adminToken");

  if (!window.location.pathname.endsWith("/login.html")) {
    window.location.replace("login.html");
  }
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
  }

  return response;
}
