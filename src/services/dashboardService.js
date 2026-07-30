/**
 * dashboardService.js
 *
 * Strategi:
 *  1. Kalau VITE_API_URL tidak di-set di .env → langsung pakai dummy data (mode demo)
 *  2. Kalau VITE_API_URL di-set tapi API gagal/timeout → fallback ke dummy data
 *  3. Kalau API berhasil → pakai data real dari backend
 */

import { dummyStats, dummyRingkasanDana } from "../data/dummyStats";
import { dummyChartTahunan } from "../data/dummyChart";
import { dummyTransaksi } from "../data/dummyTransaksi";
import { dummyProgramAktif } from "../data/dummyProgram";

const API_URL = import.meta.env.VITE_API_URL;
const USE_DUMMY = !API_URL; // tidak ada VITE_API_URL → mode demo

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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Handle response HTTP — 401 redirect ke /masuk, selainnya throw error
 */
async function handleResponse(res, errorMsg) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/masuk";
    throw new Error("Sesi habis. Silakan login kembali.");
  }
  if (!res.ok) {
    try {
      const body = await res.json();
      throw new Error(body.message ?? errorMsg);
    } catch {
      throw new Error(errorMsg);
    }
  }
  return await res.json();
}

/**
 * Wrapper: coba fetch ke API, kalau gagal (network error / timeout) → fallback
 * @param {() => Promise<any>} apiFn  - fungsi fetch ke API
 * @param {any} fallback              - data dummy sebagai fallback
 * @param {string} label              - nama endpoint untuk log
 */
async function withFallback(apiFn, fallback, label) {
  if (USE_DUMMY) {
    return Promise.resolve(fallback);
  }
  try {
    return await apiFn();
  } catch (err) {
    console.warn(
      `%c[UPZ Dashboard] Gagal ambil ${label}, fallback ke dummy data. Error: ${err.message}`,
      "color: #f59e0b;"
    );
    return fallback;
  }
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Ambil statistik utama dashboard
 * GET /api/dashboard/stats?tahun=2025
 */
export async function getDashboardStats(tahun = 2025) {
  return withFallback(
    async () => {
      const res = await fetch(`${API_URL}/dashboard/stats?tahun=${tahun}`, {
        headers: authHeaders(),
      });
      return handleResponse(res, "Gagal mengambil data statistik dashboard.");
    },
    dummyStats,
    "dashboard/stats"
  );
}

/**
 * Ambil data ringkasan dana untuk donut chart
 * GET /api/dashboard/ringkasan-dana?tahun=2025
 */
export async function getRingkasanDana(tahun = 2025) {
  return withFallback(
    async () => {
      const res = await fetch(`${API_URL}/dashboard/ringkasan-dana?tahun=${tahun}`, {
        headers: authHeaders(),
      });
      return handleResponse(res, "Gagal mengambil data ringkasan dana.");
    },
    dummyRingkasanDana,
    "dashboard/ringkasan-dana"
  );
}

/**
 * Ambil data grafik pengumpulan vs penyaluran per bulan
 * GET /api/dashboard/grafik?tahun=2025
 */
export async function getGrafikTahunan(tahun = 2025) {
  return withFallback(
    async () => {
      const res = await fetch(`${API_URL}/dashboard/grafik?tahun=${tahun}`, {
        headers: authHeaders(),
      });
      return handleResponse(res, "Gagal mengambil data grafik.");
    },
    dummyChartTahunan,
    "dashboard/grafik"
  );
}

/**
 * Ambil daftar transaksi terbaru
 * GET /api/transaksi?limit=5&sort=terbaru
 */
export async function getTransaksiTerbaru(limit = 5) {
  return withFallback(
    async () => {
      const res = await fetch(`${API_URL}/transaksi?limit=${limit}&sort=terbaru`, {
        headers: authHeaders(),
      });
      return handleResponse(res, "Gagal mengambil data transaksi.");
    },
    dummyTransaksi.slice(0, limit),
    "transaksi"
  );
}

/**
 * Ambil daftar program penyaluran aktif
 * GET /api/program?status=aktif
 */
export async function getProgramAktif(tahun = 2025) {
  return withFallback(
    async () => {
      const res = await fetch(`${API_URL}/program?status=aktif&tahun=${tahun}`, {
        headers: authHeaders(),
      });
      return handleResponse(res, "Gagal mengambil data program aktif.");
    },
    dummyProgramAktif,
    "program"
  );
}
