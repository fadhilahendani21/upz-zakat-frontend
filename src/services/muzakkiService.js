/**
 * muzakkiService.js
 * Semua API call untuk data Muzakki.
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handle401(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/masuk";
    throw new Error("Sesi habis. Silakan login kembali.");
  }
}

/**
 * GET /api/muzakki?search=&kategori=&page=&per_page=
 * Mengembalikan { data, meta }
 */
export async function getMuzakki({ search = "", kategori = "", page = 1, perPage = 10 } = {}) {
  if (!API_URL) return { data: [], meta: { total: 0, total_dosen_staf: 0, total_umum: 0, current_page: 1, last_page: 1 } };

  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);
  if (kategori) params.set("kategori", kategori);

  const res = await fetch(`${API_URL}/muzakki?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data muzakki.");
  return res.json();
}

/**
 * GET /api/muzakki/options?search=
 * Untuk combobox — return [{id, nama, unit_kerja}]
 */
export async function getMuzakkiOptions(search = "") {
  if (!API_URL) return [];

  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const res = await fetch(`${API_URL}/muzakki/options?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil opsi muzakki.");
  return res.json();
}

/**
 * POST /api/muzakki
 */
export async function createMuzakki(data) {
  const res = await fetch(`${API_URL}/muzakki`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  handle401(res);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Gagal menambahkan muzakki.");
  }
  return res.json();
}

/**
 * PUT /api/muzakki/{id}
 */
export async function updateMuzakki(id, data) {
  const res = await fetch(`${API_URL}/muzakki/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  handle401(res);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Gagal memperbarui muzakki.");
  }
  return res.json();
}

/**
 * DELETE /api/muzakki/{id}
 */
export async function deleteMuzakki(id) {
  const res = await fetch(`${API_URL}/muzakki/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  handle401(res);
  if (!res.ok) throw new Error("Gagal menghapus muzakki.");
  return res.json();
}
