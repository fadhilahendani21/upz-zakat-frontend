import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MosqueIllustration from "../components/dashboard/MosqueIllustration";
import { useSettings } from "../services/settingService";

const APP_VERSION = "1.0.0";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const settings = useSettings();
  const orgName = settings?.profil?.namaLembaga || "UPZ Zakat Universitas Siliwangi";

  let topbarTitle = "";
  let topbarSubtitle = "";

  switch (location.pathname) {
    case "/dashboard":
      topbarTitle = null; // Tampilkan Assalamu'alaikum bawaan Topbar
      topbarSubtitle = `Selamat datang di Sistem Keuangan ${settings?.profil?.namaSingkat || "UPZ Unsil"}`;
      break;
    case "/dashboard/pengumpulan":
      topbarTitle = "Pengumpulan";
      topbarSubtitle = "Manajemen dana zakat, infaq, dan sedekah yang masuk.";
      break;
    case "/dashboard/penyaluran":
      topbarTitle = "Penyaluran";
      topbarSubtitle = "Manajemen penyaluran dana zakat kepada mustahik.";
      break;
    case "/dashboard/muzakki":
      topbarTitle = "Muzakki";
      topbarSubtitle = `Data induk muzakki (pemberi zakat) ${settings?.profil?.namaSingkat || "UPZ Unsil"}.`;
      break;
    case "/dashboard/mustahik":
      topbarTitle = "Mustahik";
      topbarSubtitle = `Data induk mustahik (penerima zakat) ${settings?.profil?.namaSingkat || "UPZ Unsil"}.`;
      break;
    case "/dashboard/donasi-online":
      topbarTitle = "Donasi Online";
      topbarSubtitle = "Pantau dan kelola transaksi donasi online dari publik.";
      break;
    case "/dashboard/program":
      topbarTitle = "Program Penyaluran";
      topbarSubtitle = `Kelola program-program penyaluran zakat aktif ${settings?.profil?.namaSingkat || "UPZ Unsil"}.`;
      break;
    case "/dashboard/berita":
      topbarTitle = "Berita & Artikel";
      topbarSubtitle = "Manajemen berita, publikasi, dan artikel kegiatan UPZ.";
      break;
    case "/dashboard/transaksi":
      topbarTitle = "Transaksi Umum";
      topbarSubtitle = "Riwayat seluruh transaksi yang tercatat di sistem.";
      break;
    case "/dashboard/rekening-kas":
      topbarTitle = "Rekening & Kas";
      topbarSubtitle = "Manajemen likuiditas dan saldo kas UPZ.";
      break;
    case "/dashboard/laporan-keuangan":
      topbarTitle = "Laporan Keuangan";
      topbarSubtitle = "Laporan dan pembukuan keuangan UPZ.";
      break;
    case "/dashboard/jurnal":
      topbarTitle = "Jurnal Umum";
      topbarSubtitle = "Pencatatan debit dan kredit pembukuan transaksi UPZ.";
      break;
    case "/dashboard/pengguna":
      topbarTitle = "Pengaturan Pengguna";
      topbarSubtitle = "Kelola profil akun, keamanan kata sandi, dan status sesi.";
      break;
    case "/dashboard/pengaturan":
      topbarTitle = "Pengaturan Sistem";
      topbarSubtitle = "Konfigurasi sistem dan preferensi aplikasi.";
      break;
    default:
      topbarTitle = "Dashboard";
      break;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 relative overflow-hidden flex flex-col min-w-0">
        <MosqueIllustration className="pointer-events-none absolute -top-4 right-0 w-80 lg:w-96 text-brand-100/80 -z-0" />
        <div className="relative flex-1">
          <Topbar
            title={topbarTitle}
            subtitle={topbarSubtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <Outlet />
        </div>

        <footer className="relative z-10 mt-10 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} {orgName}
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">
              Transparan, Amanah, dan Memberi Manfaat
            </span>
          </p>
          <p>Versi {APP_VERSION}</p>
        </footer>
      </div>
    </div>
  );
}
