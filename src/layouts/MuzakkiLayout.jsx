import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CreditCard,
  IdCard,
  HandCoins,
  History,
  FileText,
  Calculator,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/muzakki/dashboard" },
  { icon: User, label: "Profil Saya", path: "/muzakki/profil" },
  { icon: CreditCard, label: "Kartu Muzzakki", path: "/muzakki/kartu" },
  { icon: IdCard, label: "Kartu NPWZ", path: "/muzakki/npwz" },
  { icon: HandCoins, label: "Tunaikan Zakat", path: "/muzakki/tunaikan" },
  { icon: History, label: "Riwayat Pembayaran", path: "/muzakki/riwayat" },
  { icon: FileText, label: "Laporan Zakat", path: "/muzakki/laporan" },
  { icon: Calculator, label: "Kalkulator Zakat", path: "/muzakki/kalkulator" },
  { icon: Settings, label: "Pengaturan", path: "/muzakki/pengaturan" },
  { icon: HelpCircle, label: "Bantuan", path: "/muzakki/bantuan" },
];

export default function MuzakkiLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("muzakki_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("muzakki_token");
    localStorage.removeItem("muzakki_user");
    navigate("/muzakki/masuk");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#064f35] via-[#08613d] to-[#0b7548] text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">U</div>
            <div>
              <p className="text-sm font-bold">UPZ UNSIL</p>
              <p className="text-[10px] text-white/70">Universitas Siliwangi</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.label === "Tunaikan Zakat" && (
                    <ChevronDown size={14} className="ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Religious Quote */}
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-[11px] text-white/80 leading-relaxed italic">
              "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..."
            </p>
            <p className="text-[10px] text-white/50 mt-1">(QS. At-Taubah: 103)</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || "M"}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name || "Muzakki"}</p>
                  <p className="text-xs text-gray-500">{user.role || "muzakki"}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
