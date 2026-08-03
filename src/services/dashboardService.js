/**
 * dashboardService.js
 *
 * Strategi:
 *  1. VITE_API_URL tidak di-set → mode demo (dummy data)
 *  2. VITE_API_URL di-set → 1 request ke /api/dashboard/all (bukan 5 terpisah)
 *     Ini menghilangkan 4 round-trip token verification ke Neon.
 *  3. Kalau API gagal → fallback ke dummy data
 */

import { dummyStats, dummyRingkasanDana } from "../data/dummyStats";
import { dummyChartTahunan } from "../data/dummyChart";
import { dummyTransaksi } from "../data/dummyTransaksi";
import { dummyProgramAktif } from "../data/dummyProgram";

const API_URL = import.meta.env.VITE_API_URL;
const USE_DUMMY = !API_URL;

if (USE_DUMMY) {
  console.info(
    "%c[UPZ Dashboard] Mode Demo aktif — VITE_API_URL tidak di-set. Data ditampilkan dari dummy.",
    "color: #f59e0b; font-weight: bold;"
  );
}

// ─── Client-side SWR Cache (localStorage) ────────────────────────────────────

const LS_KEY = "upz_dashboard_data";
const LS_TTL = 5 * 60 * 1000; // 5 menit dalam ms

/**
 * Baca cache dashboard dari localStorage — SYNCHRONOUS, instan.
 * Return null jika tidak ada atau sudah expired.
 */
export function getCachedDashboardData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { data, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > LS_TTL) return null; // expired
    return data;
  } catch {
    return null;
  }
}

/**
 * Simpan data dashboard ke localStorage setelah fetch berhasil.
 */
function saveDashboardCache(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch {
    // localStorage penuh atau private browsing — abaikan
  }
}

/**
 * Hapus cache (dipanggil saat logout)
 */
export function clearDashboardCache() {
  localStorage.removeItem(LS_KEY);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Main: 1 endpoint gabungan ───────────────────────────────────────────────

/**
 * Ambil SEMUA data dashboard sekaligus dalam 1 request.
 * Mengembalikan object: { stats, ringkasanDana, grafik, transaksi, program }
 *
 * Keuntungan vs 5 endpoint terpisah:
 *  - 1x token verification (vs 5x)
 *  - 1x TCP connection (vs 5x sequential di php artisan serve)
 *  - Dashboard load dari ~5 detik → ~1 detik
 */
export async function getAllDashboardData(tahun = 2025) {
  // Mode demo: langsung return dummy
  if (USE_DUMMY) {
    return {
      stats: dummyStats,
      ringkasanDana: dummyRingkasanDana,
      grafik: dummyChartTahunan,
      transaksi: dummyTransaksi.slice(0, 5),
      program: dummyProgramAktif,
    };
  }

  try {
    const res = await fetch(`${API_URL}/dashboard/all?tahun=${tahun}`, {
      headers: authHeaders(),
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/masuk";
      throw new Error("Sesi habis. Silakan login kembali.");
    }

    if (!res.ok) {
      throw new Error("Gagal mengambil data dashboard.");
    }

    const data = await res.json();
    saveDashboardCache(data); // simpan untuk kunjungan berikutnya
    return data;
  } catch (err) {
    console.warn(
      `%c[UPZ Dashboard] API gagal, fallback ke dummy. Error: ${err.message}`,
      "color: #f59e0b;"
    );
    // Fallback ke dummy data jika API gagal
    return {
      stats: dummyStats,
      ringkasanDana: dummyRingkasanDana,
      grafik: dummyChartTahunan,
      transaksi: dummyTransaksi.slice(0, 5),
      program: dummyProgramAktif,
    };
  }
}

// ─── Legacy individual functions (tetap dipertahankan untuk kompatibilitas) ──

/** @deprecated Gunakan getAllDashboardData() untuk performa lebih baik */
export async function getDashboardStats(tahun = 2025) {
  const data = await getAllDashboardData(tahun);
  return data.stats;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getRingkasanDana(tahun = 2025) {
  const data = await getAllDashboardData(tahun);
  return data.ringkasanDana;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getGrafikTahunan(tahun = 2025) {
  const data = await getAllDashboardData(tahun);
  return data.grafik;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getTransaksiTerbaru(limit = 5) {
  const data = await getAllDashboardData();
  return data.transaksi;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getProgramAktif(tahun = 2025) {
  const data = await getAllDashboardData(tahun);
  return data.program;
}
