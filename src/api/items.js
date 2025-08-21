const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to include auth token
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...( token && {Authorization: `Bearer ${token}`}),
  };
}

export async function fetchItems(page = 1, limit = 10) {
  const res = await fetch(`${API_URL}/items?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return await res.json();
}

export async function fetchItem(id) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    headers: authHeaders(),
  });
  return await res.json();
}

export async function createItem(item) {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  return await res.json();
}

export async function updateItem(id, item) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  return await res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return await res.json();
}
