const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to include auth token
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && {Authorization: `Bearer ${token}`}),
  };
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    headers: authHeaders(),
  });
  return await res.json();
}

export async function fetchCategory(id) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    headers: authHeaders(),
  });
  return await res.json();
}

export async function createCategory(item) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  return await res.json();
}

export async function updateCategory(id, updatedItem) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updatedItem),
  });
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return await res.json();
}
