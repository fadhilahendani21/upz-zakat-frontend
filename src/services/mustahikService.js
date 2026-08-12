const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/masuk";
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Terjadi kesalahan.");
  return json;
}

export const getMustahik = ({ search = "", status = "", kategori = "", page = 1, perPage = 10 } = {}) => {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (kategori) params.append("kategori", kategori);
  return request("GET", `/mustahik?${params}`);
};

export const getMustahikOptions = async (search = "") => {
  const res = await getMustahik({ search, perPage: 30 });
  // Format agar sama dengan muzakkiOptions: [{id, nama, kategori}]
  return res.data.map((m) => ({ id: m.id, nama: m.nama, kategori: m.kategori }));
};

export const createMustahik = (data) => request("POST", "/mustahik", data);
export const updateMustahik = (id, data) => request("PUT", `/mustahik/${id}`, data);
export const deleteMustahik = (id) => request("DELETE", `/mustahik/${id}`);
