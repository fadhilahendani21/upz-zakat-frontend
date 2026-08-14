import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../pages/LandingPage";
import TentangPage from "../pages/TentangPage";
import ProgramPage from "../pages/ProgramPage";
import BeritaPage from "../pages/BeritaPage";
import BeritaDetailPage from "../pages/BeritaDetailPage";
import LaporanPage from "../pages/LaporanPage";
import KontakPage from "../pages/KontakPage";
import DonasiPage from "../pages/DonasiPage";
import HitungZakatPage from "../pages/HitungZakatPage";
import LoginPage from "../pages/LoginPage";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Pengumpulan from "../pages/dashboard/Pengumpulan";
import Penyaluran from "../pages/dashboard/Penyaluran";
import MuzakkiMustahik from "../pages/dashboard/MuzakkiMustahik";
import Mustahik from "../pages/dashboard/Mustahik";
import Program from "../pages/dashboard/Program";
import DonasiOnline from "../pages/dashboard/DonasiOnline";
import Transaksi from "../pages/dashboard/Transaksi";
import RekeningKas from "../pages/dashboard/RekeningKas";
import LaporanKeuangan from "../pages/dashboard/LaporanKeuangan";
import Pengaturan from "../pages/dashboard/Pengaturan";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tentang" element={<TentangPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:id" element={<BeritaDetailPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/kontak" element={<KontakPage />} />
          <Route path="/donasi" element={<DonasiPage />} />
          <Route path="/hitung-zakat" element={<HitungZakatPage />} />
        </Route>

        {/* Login (tanpa layout navbar/sidebar) */}
        <Route path="/masuk" element={<LoginPage />} />

        {/* Dashboard admin (nanti bisa dibungkus proteksi auth) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="pengumpulan" element={<Pengumpulan />} />
          <Route path="penyaluran" element={<Penyaluran />} />
          <Route path="muzakki" element={<MuzakkiMustahik />} />
          <Route path="mustahik" element={<Mustahik />} />
          {/* legacy redirect tetap ada agar link lama tidak 404 */}
          <Route path="muzakki-mustahik" element={<MuzakkiMustahik />} />
          <Route path="program" element={<Program />} />
          <Route path="donasi-online" element={<DonasiOnline />} />
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="rekening-kas" element={<RekeningKas />} />
          <Route path="laporan-keuangan" element={<LaporanKeuangan />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
