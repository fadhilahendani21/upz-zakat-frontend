/**
 * tagihanService.js
 * Layanan API untuk fitur Manajemen Tagihan & Kepatuhan Zakat Muzakki.
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
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

async function handleResponse(res) {
  handle401(res);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json.message ??
      Object.values(json.errors ?? {}).flat().join(", ") ??
      "Terjadi kesalahan saat memproses data tagihan.";
    throw new Error(msg);
  }
  return json;
}

/**
 * GET /api/tagihan (PROTECTED)
 * Mengambil data tagihan, status pelunasan, dan metrik kepatuhan muzakki.
 */
export async function getTagihan({
  bulan = new Date().getMonth() + 1,
  tahun = new Date().getFullYear(),
  status = "all",
  kategori = "all",
  search = "",
  page = 1,
  perPage = 15,
} = {}) {
  const params = new URLSearchParams({
    bulan: String(bulan),
    tahun: String(tahun),
    status,
    kategori,
    page: String(page),
    per_page: String(perPage),
  });
  if (search) params.set("search", search);

  const res = await fetch(`${API_URL}/tagihan?${params}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * POST /api/tagihan/catat-bayar (PROTECTED)
 * Mencatat pembayaran langsung oleh Admin.
 */
export async function catatPembayaranTagihan(payload) {
  const res = await fetch(`${API_URL}/tagihan/catat-bayar`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
