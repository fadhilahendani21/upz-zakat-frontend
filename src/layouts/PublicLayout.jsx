import { Outlet } from "react-router-dom";
import Navbar from "../components/landing/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-100 mt-2">
        <p className="font-medium text-gray-700">
          UPZ Zakat Universitas Siliwangi
        </p>
        <p>Transparan, Amanah, dan Memberi Manfaat</p>
      </footer>
    </div>
  );
}
