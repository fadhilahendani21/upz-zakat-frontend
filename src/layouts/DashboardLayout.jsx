import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MosqueIllustration from "../components/dashboard/MosqueIllustration";

export default function DashboardLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 relative overflow-hidden">
        <MosqueIllustration className="pointer-events-none absolute -top-4 right-0 w-80 lg:w-96 text-brand-100/80 -z-0" />
        <div className="relative z-10">
          <Topbar
            subtitle="Selamat datang di Sistem Keuangan UPZ Zakat Universitas Siliwangi"
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
