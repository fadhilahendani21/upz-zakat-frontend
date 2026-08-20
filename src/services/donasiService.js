/**
 * donasiService.js
 * Layanan API untuk fitur Donasi Online dan Laporan Keuangan.
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

/**
 * POST /api/donasi  (PUBLIC — tanpa auth)
 * Kirim donasi dari halaman publik.
 */
export async function submitDonasi(payload) {
  if (!API_URL) {
    // fallback demo jika API belum dikonfigurasi
    return Promise.resolve({
      kode: "DON-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      kategori: payload.kategori,
      nominal: payload.nominal,
      metode: payload.metode,
      message: "Donasi berhasil (demo mode).",
    });
  }
  const res = await fetch(`${API_URL}/donasi`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.message ?? Object.values(err.errors ?? {}).flat().join(", ") ?? "Gagal mengirim donasi.";
    throw new Error(msg);
  }
  return res.json();
}

/**
 * GET /api/donasi  (PROTECTED)
 * Daftar donasi online untuk dashboard admin.
 */
export async function getDonasiOnline({ search = "", page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);
  const res = await fetch(`${API_URL}/donasi?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal memuat data donasi.");
  return res.json();
}

/**
 * GET /api/laporan/ringkasan?tahun=YYYY  (PROTECTED)
 */
export async function getLaporanRingkasan(tahun = new Date().getFullYear()) {
  const res = await fetch(`${API_URL}/laporan/ringkasan?tahun=${tahun}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal memuat laporan keuangan.");
  return res.json();
}
