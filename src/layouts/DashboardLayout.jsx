import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MosqueIllustration from "../components/dashboard/MosqueIllustration";

const APP_VERSION = "1.0.0";

export default function DashboardLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <MosqueIllustration className="pointer-events-none absolute -top-4 right-0 w-80 lg:w-96 text-brand-100/80 -z-0" />
        <div className="relative z-10 flex-1">
          <Topbar
            subtitle="Selamat datang di Sistem Keuangan UPZ Zakat Universitas Siliwangi"
          />
          <Outlet />
        </div>

        <footer className="relative z-10 mt-10 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} UPZ Zakat Universitas Siliwangi
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
