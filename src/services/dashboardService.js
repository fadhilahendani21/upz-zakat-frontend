import { dummyStats, dummyRingkasanDana } from "../data/dummyStats";
import { dummyChartTahunan } from "../data/dummyChart";
import { dummyTransaksi } from "../data/dummyTransaksi";
import { dummyProgramAktif } from "../data/dummyProgram";

// const API_URL = import.meta.env.VITE_API_URL;

/**
 * Ambil statistik utama dashboard (total dana, muzakki, dll)
 * TODO (BE): ganti body function ini jadi:
 *   const res = await fetch(`${API_URL}/dashboard/stats`);
 *   return await res.json();
 * Response API diharapkan punya struktur sama persis kayak dummyStats.js
 */
export async function getDashboardStats() {
  return Promise.resolve(dummyStats);
}

/**
 * Ambil data ringkasan dana buat donut chart
 * Endpoint yang disarankan: GET /api/dashboard/ringkasan-dana
 */
export async function getRingkasanDana() {
  return Promise.resolve(dummyRingkasanDana);
}

/**
 * Ambil data grafik pengumpulan vs penyaluran per bulan
 * Endpoint yang disarankan: GET /api/dashboard/grafik?tahun=2025
 */
export async function getGrafikTahunan(tahun = 2025) {
  return Promise.resolve(dummyChartTahunan);
}

/**
 * Ambil daftar transaksi terbaru (limit default 5)
 * Endpoint yang disarankan: GET /api/transaksi?limit=5&sort=terbaru
 */
export async function getTransaksiTerbaru(limit = 5) {
  return Promise.resolve(dummyTransaksi.slice(0, limit));
}

/**
 * Ambil daftar program penyaluran yang sedang aktif
 * Endpoint yang disarankan: GET /api/program?status=aktif
 */
export async function getProgramAktif() {
  return Promise.resolve(dummyProgramAktif);
}
