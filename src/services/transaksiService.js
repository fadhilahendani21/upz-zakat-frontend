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
export async function getPengumpulan({ search = "", kategori = "", bulan = 0, tahun = 0, page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search)  params.set("search", search);
  if (kategori) params.set("kategori", kategori);
  if (bulan && bulan !== 0) params.set("bulan", bulan);
  if (tahun && tahun !== 0) params.set("tahun", tahun);

  const res = await fetch(`${API_URL}/transaksi/pengumpulan?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data pengumpulan.");
  return res.json(); // { data, meta }
}

/**
 * GET /api/transaksi/penyaluran
 */
export async function getPenyaluran({ search = "", bulan = 0, tahun = 0, page = 1, perPage = 10 } = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);
  if (bulan && bulan !== 0) params.set("bulan", bulan);
  if (tahun && tahun !== 0) params.set("tahun", tahun);

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

/**
 * GET all transactions (masuk + keluar) combined for Transaksi page.
 */
export async function getAllTransaksi({ search = "", dateFrom = "", dateTo = "", jenis = "" } = {}) {
  const params = new URLSearchParams({ per_page: 200 });
  if (search) params.set("search", search);

  const [resMasuk, resKeluar] = await Promise.all([
    fetch(`${API_URL}/transaksi/pengumpulan?${params}`, { headers: authHeaders() }),
    fetch(`${API_URL}/transaksi/penyaluran?${params}`, { headers: authHeaders() }),
  ]);

  handle401(resMasuk);
  handle401(resKeluar);

  const [masukJson, keluarJson] = await Promise.all([resMasuk.json(), resKeluar.json()]);

  const masukRows = (masukJson.data || []).map((t) => ({ ...t, status: "Masuk" }));
  const keluarRows = (keluarJson.data || []).map((t) => ({ ...t, status: "Keluar" }));

  let rows = [...masukRows, ...keluarRows].sort((a, b) =>
    new Date(b.tanggal) - new Date(a.tanggal)
  );

  if (jenis === "Masuk")  rows = masukRows.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (jenis === "Keluar") rows = keluarRows.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (dateFrom) rows = rows.filter((r) => r.tanggal >= dateFrom);
  if (dateTo)   rows = rows.filter((r) => r.tanggal.slice(0, 10) <= dateTo);

  return {
    rows,
    totalMasuk: masukJson.meta?.total_nominal ?? masukRows.reduce((s, r) => s + r.nominal, 0),
    totalKeluar: keluarJson.meta?.total_nominal ?? keluarRows.reduce((s, r) => s + r.nominal, 0),
    totalTransaksi: masukRows.length + keluarRows.length,
  };
}

/**
 * GET saldo kas: total masuk - total keluar dari seluruh transaksi.
 */
export async function getDashboardSaldo() {
  const [resMasuk, resKeluar] = await Promise.all([
    fetch(`${API_URL}/transaksi/pengumpulan?per_page=1`, { headers: authHeaders() }),
    fetch(`${API_URL}/transaksi/penyaluran?per_page=1`, { headers: authHeaders() }),
  ]);
  handle401(resMasuk);
  handle401(resKeluar);
  const [masukJson, keluarJson] = await Promise.all([resMasuk.json(), resKeluar.json()]);
  return {
    totalMasuk:  masukJson.meta?.total_nominal  ?? 0,
    totalKeluar: keluarJson.meta?.total_nominal ?? 0,
    saldo: (masukJson.meta?.total_nominal ?? 0) - (keluarJson.meta?.total_nominal ?? 0),
  };
}
