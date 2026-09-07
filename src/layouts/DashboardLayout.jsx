import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MosqueIllustration from "../components/dashboard/MosqueIllustration";
import { useSettings } from "../services/settingService";
import { UserProvider } from "../contexts/UserContext";
import { DashboardProvider, useDashboard } from "../contexts/DashboardContext";
import { getAllDashboardData } from "../services/dashboardService";

const APP_VERSION = "1.0.0";

// Map path → { title, subtitle } untuk menghindari switch statement per-render
const PAGE_INFO = {
  "/dashboard": {
    title: null, // Tampilkan Assalamu'alaikum bawaan Topbar
    subtitleKey: "dashboard",
  },
  "/dashboard/pengumpulan": {
    title: "Pengumpulan",
    subtitle: "Manajemen dana zakat, infaq, dan sedekah yang masuk.",
  },
  "/dashboard/penyaluran": {
    title: "Penyaluran",
    subtitle: "Manajemen penyaluran dana zakat kepada mustahik.",
  },
  "/dashboard/muzakki": {
    title: "Muzakki",
    subtitleKey: "muzakki",
  },
  "/dashboard/tagihan": {
    title: "Tagihan & Kepatuhan Zakat",
    subtitle: "Kontrol status pembayaran zakat, tunggakan, dan pelunasan komitmen muzakki.",
  },
  "/dashboard/mustahik": {
    title: "Mustahik",
    subtitleKey: "mustahik",
  },
  "/dashboard/donasi-online": {
    title: "Donasi Online",
    subtitle: "Pantau dan kelola transaksi donasi online dari publik.",
  },
  "/dashboard/program": {
    title: "Program Penyaluran",
    subtitleKey: "program",
  },
  "/dashboard/berita": {
    title: "Berita & Artikel",
    subtitle: "Manajemen berita, publikasi, dan artikel kegiatan UPZ.",
  },
  "/dashboard/transaksi": {
    title: "Transaksi Umum",
    subtitle: "Riwayat seluruh transaksi yang tercatat di sistem.",
  },
  "/dashboard/rekening-kas": {
    title: "Rekening & Kas",
    subtitle: "Manajemen likuiditas dan saldo kas UPZ.",
  },
  "/dashboard/laporan-keuangan": {
    title: "Laporan Keuangan",
    subtitle: "Laporan dan pembukuan keuangan UPZ.",
  },
  "/dashboard/jurnal": {
    title: "Jurnal Umum",
    subtitle: "Pencatatan debit dan kredit pembukuan transaksi UPZ.",
  },
  "/dashboard/pengguna": {
    title: "Pengaturan Pengguna",
    subtitle: "Kelola profil akun, keamanan kata sandi, dan status sesi.",
  },
  "/dashboard/pengaturan": {
    title: "Pengaturan Sistem",
    subtitle: "Konfigurasi sistem dan preferensi aplikasi.",
  },
  "/dashboard/zakat-requests": {
    title: "Revisi Kesepakatan",
    subtitle: "Tinjau dan kelola usulan perubahan nominal atau frekuensi zakat dari muzakki.",
  },
};

function getPageInfo(pathname, settings) {
  const info = PAGE_INFO[pathname];
  if (!info) return { title: "Dashboard", subtitle: "" };

  const namaSingkat = settings?.profil?.namaSingkat || "UPZ Unsil";

  let subtitle = info.subtitle || "";
  if (info.subtitleKey) {
    switch (info.subtitleKey) {
      case "dashboard":
        subtitle = `Selamat datang di Sistem Keuangan ${namaSingkat}`;
        break;
      case "muzakki":
        subtitle = `Data induk muzakki (pemberi zakat) ${namaSingkat}.`;
        break;
      case "mustahik":
        subtitle = `Data induk mustahik (penerima zakat) ${namaSingkat}.`;
        break;
      case "program":
        subtitle = `Kelola program-program penyaluran zakat aktif ${namaSingkat}.`;
        break;
    }
  }

  return { title: info.title, subtitle };
}

function DashboardLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const settings = useSettings();
  const orgName = settings?.profil?.namaLembaga || "UPZ Zakat Universitas Siliwangi";
  const { setDashboardData, setLoading } = useDashboard();

  useEffect(() => {
    const tahun = new Date().getFullYear();
    setLoading(true);
    getAllDashboardData(tahun)
      .then((data) => {
        setDashboardData(data);
      })
      .catch(() => {
        // Error handling tetap dilakukan di komponen anak
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setDashboardData, setLoading]);

  const { title: topbarTitle, subtitle: topbarSubtitle } = getPageInfo(location.pathname, settings);

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

export default function DashboardLayout() {
  return (
    <UserProvider>
      <DashboardProvider>
        <DashboardLayoutContent />
      </DashboardProvider>
    </UserProvider>
  );
}
