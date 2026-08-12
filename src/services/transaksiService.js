/**
 * transaksiService.js
 * API call untuk menyimpan dan mengambil transaksi Pengumpulan dan Penyaluran.
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
    window.location.href = "/masuk";
    throw new Error("Sesi habis.");
  }
}

/**
 * GET /api/transaksi/pengumpulan
 */
export async function getPengumpulan({ search = "", kategori = "", bulan = 0, page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search)  params.set("search", search);
  if (kategori) params.set("kategori", kategori);
  if (bulan && bulan !== 0) params.set("bulan", bulan);

  const res = await fetch(`${API_URL}/transaksi/pengumpulan?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data pengumpulan.");
  return res.json(); // { data, meta }
}

/**
 * GET /api/transaksi/penyaluran
 */
export async function getPenyaluran({ search = "", page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);

  const res = await fetch(`${API_URL}/transaksi/penyaluran?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data penyaluran.");
  return res.json(); // { data, meta }
}

/**
 * POST /api/transaksi/pengumpulan
 */
export async function savePengumpulan({ muzakki_id, kategori, nominal, metode, keterangan }) {
  if (!API_URL) throw new Error("API tidak terkonfigurasi.");

  const res = await fetch(`${API_URL}/transaksi/pengumpulan`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ muzakki_id, kategori, nominal: Number(nominal), metode, keterangan }),
  });
  handle401(res);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.message ?? Object.values(err.errors ?? {}).flat().join(", ") ?? "Gagal menyimpan.";
    throw new Error(msg);
  }
  return res.json();
}

/**
 * POST /api/transaksi/penyaluran
 */
export async function savePenyaluran({ mustahik_id, program_id, program, nominal, metode, keterangan }) {
  if (!API_URL) throw new Error("API tidak terkonfigurasi.");

  const res = await fetch(`${API_URL}/transaksi/penyaluran`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ mustahik_id, program_id, program, nominal: Number(nominal), metode, keterangan }),
  });
  handle401(res);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.message ?? Object.values(err.errors ?? {}).flat().join(", ") ?? "Gagal menyimpan.";
    throw new Error(msg);
  }
  return res.json();
}
