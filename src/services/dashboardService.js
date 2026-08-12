/**
 * dashboardService.js
 *
 * Strategi:
 *  1. VITE_API_URL tidak di-set → mode demo (dummy data)
 *  2. VITE_API_URL di-set → 1 request ke /api/dashboard/all
 *  3. Kalau API gagal → fallback ke dummy data
 *
 * Tidak ada caching — setiap kunjungan selalu fetch fresh dari API.
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Main: 1 endpoint gabungan ───────────────────────────────────────────────

/**
 * Ambil SEMUA data dashboard sekaligus dalam 1 request.
 * Mengembalikan object: { stats, ringkasanDana, grafik, transaksi, program }
 */
export async function getAllDashboardData(tahun = new Date().getFullYear()) {
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

    return await res.json();
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
export async function getDashboardStats(tahun = new Date().getFullYear()) {
  const data = await getAllDashboardData(tahun);
  return data.stats;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getRingkasanDana(tahun = new Date().getFullYear()) {
  const data = await getAllDashboardData(tahun);
  return data.ringkasanDana;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getGrafikTahunan(tahun = new Date().getFullYear()) {
  const data = await getAllDashboardData(tahun);
  return data.grafik;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getTransaksiTerbaru(limit = 5) {
  const data = await getAllDashboardData();
  return data.transaksi;
}

/** @deprecated Gunakan getAllDashboardData() */
export async function getProgramAktif(tahun = new Date().getFullYear()) {
  const data = await getAllDashboardData(tahun);
  return data.program;
}
