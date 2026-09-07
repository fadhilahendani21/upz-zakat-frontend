import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../services/authService";
import ScrollToTop from "../components/common/ScrollToTop";

// ── Layouts (eager — always needed) ──────────────────────────────────────────
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// ── Lazy-loaded Public Pages ─────────────────────────────────────────────────
const LandingPage = lazy(() => import("../pages/LandingPage"));
const TentangPage = lazy(() => import("../pages/TentangPage"));
const VisiMisiPage = lazy(() => import("../pages/VisiMisiPage"));
const KepengurusanPage = lazy(() => import("../pages/KepengurusanPage"));
const ProfilUnsilPage = lazy(() => import("../pages/ProfilUnsilPage"));
const ProgramPage = lazy(() => import("../pages/ProgramPage"));
const BeritaPage = lazy(() => import("../pages/BeritaPage"));
const BeritaDetailPage = lazy(() => import("../pages/BeritaDetailPage"));
const LaporanPage = lazy(() => import("../pages/LaporanPage"));
const KontakPage = lazy(() => import("../pages/KontakPage"));
const DonasiPage = lazy(() => import("../pages/DonasiPage"));
const ZakatPage = lazy(() => import("../pages/ZakatPage"));
const HitungZakatPage = lazy(() => import("../pages/HitungZakatPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const MuzakkiLoginPage = lazy(() => import("../pages/MuzakkiLoginPage"));
const MuzakkiLayout = lazy(() => import("../layouts/MuzakkiLayout"));
const MuzakkiDashboard = lazy(() => import("../pages/MuzakkiDashboard"));
const DaftarMuzakkiPage = lazy(() => import("../pages/DaftarMuzakkiPage"));
const DaftarMuzakkiUmumPage = lazy(() => import("../pages/DaftarMuzakkiUmumPage"));
const DaftarMuzakkiUnsilPage = lazy(() => import("../pages/DaftarMuzakkiUnsilPage"));

// ── Lazy-loaded Muzakki Pages ────────────────────────────────────────────────
const ProfilSaya = lazy(() => import("../pages/muzakki/ProfilSaya"));
const KartuMuzakki = lazy(() => import("../pages/muzakki/KartuMuzakki"));
const KartuNPWZ = lazy(() => import("../pages/muzakki/KartuNPWZ"));
const TunaikanZakat = lazy(() => import("../pages/muzakki/TunaikanZakat"));
const RiwayatPembayaran = lazy(() => import("../pages/muzakki/RiwayatPembayaran"));
const LaporanZakat = lazy(() => import("../pages/muzakki/LaporanZakat"));
const KalkulatorZakat = lazy(() => import("../pages/muzakki/KalkulatorZakat"));
const PengaturanMuzakki = lazy(() => import("../pages/muzakki/PengaturanMuzakki"));
const BantuanMuzakki = lazy(() => import("../pages/muzakki/BantuanMuzakki"));

// ── Lazy-loaded Dashboard Pages ──────────────────────────────────────────────
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const Pengumpulan = lazy(() => import("../pages/dashboard/Pengumpulan"));
const Penyaluran = lazy(() => import("../pages/dashboard/Penyaluran"));
const MuzakkiMustahik = lazy(() => import("../pages/dashboard/MuzakkiMustahik"));
const Mustahik = lazy(() => import("../pages/dashboard/Mustahik"));
const Program = lazy(() => import("../pages/dashboard/Program"));
const BeritaAdmin = lazy(() => import("../pages/dashboard/BeritaAdmin"));
const DonasiOnline = lazy(() => import("../pages/dashboard/DonasiOnline"));
const Transaksi = lazy(() => import("../pages/dashboard/Transaksi"));
const RekeningKas = lazy(() => import("../pages/dashboard/RekeningKas"));
const LaporanKeuangan = lazy(() => import("../pages/dashboard/LaporanKeuangan"));
const Jurnal = lazy(() => import("../pages/dashboard/Jurnal"));
const Pengguna = lazy(() => import("../pages/dashboard/Pengguna"));
const Pengaturan = lazy(() => import("../pages/dashboard/Pengaturan"));
const ZakatRequests = lazy(() => import("../pages/dashboard/ZakatRequests"));
const Tagihan = lazy(() => import("../pages/dashboard/Tagihan"));

// ── Fallback Loading ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}

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
      <Suspense fallback={<PageLoader />}>
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

          <Route path="/muzakki/masuk" element={<MuzakkiLoginPage />} />

          <Route path="/muzakki" element={<MuzakkiLayout />}>
            <Route path="dashboard" element={<MuzakkiDashboard />} />
            <Route path="profil" element={<ProfilSaya />} />
            <Route path="kartu" element={<KartuMuzakki />} />
            <Route path="npwz" element={<KartuNPWZ />} />
            <Route path="tunaikan" element={<TunaikanZakat />} />
            <Route path="riwayat" element={<RiwayatPembayaran />} />
            <Route path="laporan" element={<LaporanZakat />} />
            <Route path="kalkulator" element={<KalkulatorZakat />} />
            <Route path="pengaturan" element={<PengaturanMuzakki />} />
            <Route path="bantuan" element={<BantuanMuzakki />} />
          </Route>

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
              path="zakat-requests"
              element={<ZakatRequests />}
            />

            <Route
              path="tagihan"
              element={<Tagihan />}
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
      </Suspense>
    </BrowserRouter>
  );
}
