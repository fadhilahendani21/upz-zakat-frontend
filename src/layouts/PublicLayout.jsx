import { Outlet } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/common/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}