const API_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  console.log("fetchMe response:", res.json());
  return await res.json();
}
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return await res.json();
}

export async function signupUser(data) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function fetchCompanies() {
  const res = await fetch(`${API_URL}/companies`)
  const data = await res.json()
  return data
}