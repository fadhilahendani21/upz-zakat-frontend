import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../services/authService";
import ScrollToTop from "../components/common/ScrollToTop";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../pages/LandingPage";
import TentangPage from "../pages/TentangPage";
import VisiMisiPage from "../pages/VisiMisiPage";
import KepengurusanPage from "../pages/KepengurusanPage";
import ProfilUnsilPage from "../pages/ProfilUnsilPage";
import ProgramPage from "../pages/ProgramPage";
import BeritaPage from "../pages/BeritaPage";
import BeritaDetailPage from "../pages/BeritaDetailPage";
import LaporanPage from "../pages/LaporanPage";
import KontakPage from "../pages/KontakPage";
import DonasiPage from "../pages/DonasiPage";
import ZakatPage from "../pages/ZakatPage";
import HitungZakatPage from "../pages/HitungZakatPage";
import LoginPage from "../pages/LoginPage";

// ===============================
// PENDAFTARAN MUZAKKI
// ===============================
import DaftarMuzakkiPage from "../pages/DaftarMuzakkiPage";
import DaftarMuzakkiUmumPage from "../pages/DaftarMuzakkiUmumPage";
import DaftarMuzakkiUnsilPage from "../pages/DaftarMuzakkiUnsilPage";

// ===============================
// DASHBOARD
// ===============================
import DashboardHome from "../pages/dashboard/DashboardHome";
import Pengumpulan from "../pages/dashboard/Pengumpulan";
import Penyaluran from "../pages/dashboard/Penyaluran";
import MuzakkiMustahik from "../pages/dashboard/MuzakkiMustahik";
import Mustahik from "../pages/dashboard/Mustahik";
import Program from "../pages/dashboard/Program";
import BeritaAdmin from "../pages/dashboard/BeritaAdmin";
import DonasiOnline from "../pages/dashboard/DonasiOnline";
import Transaksi from "../pages/dashboard/Transaksi";
import RekeningKas from "../pages/dashboard/RekeningKas";
import LaporanKeuangan from "../pages/dashboard/LaporanKeuangan";
import Jurnal from "../pages/dashboard/Jurnal";
import Pengguna from "../pages/dashboard/Pengguna";
import Pengaturan from "../pages/dashboard/Pengaturan";

/**
 * Guard route: hanya Administrator yang boleh masuk.
 * Operator akan diarahkan ke /dashboard/pengguna.
 * Jika role belum diketahui (null / belum load), biarkan masuk dulu —
 * backend sudah menjaga keamanan di sisi server.
 */
function AdminRoute({ children }) {
  const user = getUser();

  // Hanya blokir jika role EKSPLISIT bukan administrator
  if (user && user.role && user.role !== "administrator") {
    return <Navigate to="/dashboard/pengguna" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>

        {/* =========================================
            HALAMAN PUBLIK
        ========================================== */}
        <Route element={<PublicLayout />}>

          <Route path="/" element={<LandingPage />} />

          {/* =========================
              TENTANG
          ========================= */}
          <Route path="/tentang" element={<TentangPage />} />

          <Route
            path="/tentang/kepengurusan"
            element={<KepengurusanPage />}
          />

          <Route
            path="/tentang/visi-misi"
            element={<VisiMisiPage />}
          />

          <Route
            path="/tentang/profil-unsil"
            element={<ProfilUnsilPage />}
          />

          {/* =========================
              PROGRAM
          ========================= */}
          <Route path="/program" element={<ProgramPage />} />

          {/* =========================
              BERITA
          ========================= */}
          <Route path="/berita" element={<BeritaPage />} />

          <Route
            path="/berita/:id"
            element={<BeritaDetailPage />}
          />

          {/* =========================
              LAPORAN & KONTAK
          ========================= */}
          <Route path="/laporan" element={<LaporanPage />} />

          <Route path="/kontak" element={<KontakPage />} />

          {/* =========================
              DONASI & ZAKAT
          ========================= */}
          <Route path="/donasi" element={<DonasiPage />} />

          <Route path="/zakat" element={<ZakatPage />} />

          <Route
            path="/hitung-zakat"
            element={<HitungZakatPage />}
          />

          {/* =========================================
              PENDAFTARAN MUZAKKI
          ========================================== */}

          {/* Halaman pilihan:
              Umum / Dosen & Staf UNSIL
          */}
          <Route
            path="/daftar-muzakki"
            element={<DaftarMuzakkiPage />}
          />

          {/* Form Muzakki Umum */}
          <Route
            path="/daftar-muzakki/umum"
            element={<DaftarMuzakkiUmumPage />}
          />

          {/* Form Dosen & Staf UNSIL */}
          <Route
            path="/daftar-muzakki/unsil"
            element={<DaftarMuzakkiUnsilPage />}
          />

        </Route>

        {/* =========================================
            LOGIN
            Tanpa navbar/sidebar publik
        ========================================== */}
        <Route
          path="/masuk"
          element={<LoginPage />}
        />

        {/* =========================================
            DASHBOARD
        ========================================== */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<DashboardHome />}
          />

          <Route
            path="pengumpulan"
            element={<Pengumpulan />}
          />

          <Route
            path="penyaluran"
            element={<Penyaluran />}
          />

          <Route
            path="muzakki"
            element={<MuzakkiMustahik />}
          />

          <Route
            path="mustahik"
            element={<Mustahik />}
          />

          {/* Legacy redirect tetap ada agar link lama tidak 404 */}
          <Route
            path="muzakki-mustahik"
            element={<MuzakkiMustahik />}
          />

          <Route
            path="program"
            element={<Program />}
          />

          <Route
            path="berita"
            element={<BeritaAdmin />}
          />

          <Route
            path="donasi-online"
            element={<DonasiOnline />}
          />

          <Route
            path="transaksi"
            element={<Transaksi />}
          />

          <Route
            path="pengguna"
            element={<Pengguna />}
          />

          {/* =========================================
              HALAMAN KHUSUS ADMINISTRATOR
          ========================================== */}

          <Route
            path="rekening-kas"
            element={
              <AdminRoute>
                <RekeningKas />
              </AdminRoute>
            }
          />

          <Route
            path="laporan-keuangan"
            element={
              <AdminRoute>
                <LaporanKeuangan />
              </AdminRoute>
            }
          />

          <Route
            path="jurnal"
            element={
              <AdminRoute>
                <Jurnal />
              </AdminRoute>
            }
          />

          <Route
            path="pengaturan"
            element={
              <AdminRoute>
                <Pengaturan />
              </AdminRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}