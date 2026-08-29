import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logoUnsil from "../../assets/img/logo-upz.png";
import MosqueIllustration from "./MosqueIllustration";
import { useSettings } from "../../services/settingService";
import { getUser } from "../../services/authService";
import { getProfile } from "../../services/penggunaService";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Heart,
  Globe,
  FolderKanban,
  Receipt,
  Wallet,
  BarChart3,
  BookOpen,
  UserCog,
  Settings,
  X,
} from "lucide-react";

const pengelolaan = [
  { label: "Pengumpulan", icon: ArrowDownToLine, to: "/dashboard/pengumpulan" },
  { label: "Penyaluran", icon: ArrowUpFromLine, to: "/dashboard/penyaluran" },
  { label: "Muzakki", icon: Users, to: "/dashboard/muzakki" },
  { label: "Mustahik", icon: Heart, to: "/dashboard/mustahik" },
  { label: "Program", icon: FolderKanban, to: "/dashboard/program" },
  { label: "Donasi Online", icon: Globe, to: "/dashboard/donasi-online" },
];

const keuangan = [
  { label: "Transaksi", icon: Receipt, to: "/dashboard/transaksi" },
  { label: "Rekening & Kas", icon: Wallet, to: "/dashboard/rekening-kas" },
  { label: "Laporan Keuangan", icon: BarChart3, to: "/dashboard/laporan-keuangan" },
  { label: "Jurnal", icon: BookOpen, to: "/dashboard/jurnal" },
];

function SidebarLink({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-brand-600 text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`
      }
    >
      <span className="flex items-center gap-3">
        <item.icon size={18} />
        {item.label}
      </span>
    </NavLink>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const settings = useSettings();
  const brandName = settings?.profil?.namaSingkat || "UPZ Unsil";

  // Baca dari localStorage dulu (cepat), lalu refresh dari API
  const [user, setUser] = useState(() => getUser());
  const isAdmin = user?.role === "administrator";

  useEffect(() => {
    let cancelled = false;
    async function refreshUser() {
      try {
        const fresh = await getProfile();
        if (cancelled) return;
        // Simpan ulang ke localStorage dengan data terbaru dari API
        const existing = getUser() || {};
        const updated = { ...existing, ...fresh };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
      } catch {
        // Abaikan error, tetap gunakan data localStorage
      }
    }
    refreshUser();
    return () => { cancelled = true; };
  }, []);

  const pengaturan = [
    { label: isAdmin ? "Pengguna & Akses" : "Profil Pengguna", icon: UserCog, to: "/dashboard/pengguna" },
    ...(isAdmin ? [{ label: "Pengaturan Sistem", icon: Settings, to: "/dashboard/pengaturan" }] : []),
  ];

  return (
    <>
      {/* Overlay gelap, cuma muncul di mobile pas sidebar kebuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 shrink-0 h-screen bg-white flex flex-col
          fixed top-0 left-0 z-50 border-r border-gray-100
          transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
          <img
            src={logoUnsil}
            alt={brandName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
              {brandName}
            </p>
            <p className="text-[11px] text-gray-500 leading-tight truncate">
              Universitas Siliwangi
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Role badge */}
        {!isAdmin && (
          <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-700 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Masuk sebagai Operator
          </div>
        )}

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
              isActive
                ? "bg-brand-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-400 mb-2 tracking-wide">
            PENGELOLAAN
          </p>
          <div className="space-y-1">
            {pengelolaan.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>

        {/* Keuangan: Transaksi untuk semua, sisanya admin only */}
        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-400 mb-2 tracking-wide">
            KEUANGAN
          </p>
          <div className="space-y-1">
            <SidebarLink item={{ label: "Transaksi", icon: Receipt, to: "/dashboard/transaksi" }} />
            {isAdmin && (
              <>
                <SidebarLink item={{ label: "Rekening & Kas", icon: Wallet, to: "/dashboard/rekening-kas" }} />
                <SidebarLink item={{ label: "Laporan Keuangan", icon: BarChart3, to: "/dashboard/laporan-keuangan" }} />
              </>
            )}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-400 mb-2 tracking-wide">
            PENGATURAN
          </p>
          <div className="space-y-1">
            {pengaturan.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* <div className="relative m-4 p-4 rounded-xl bg-brand-700 text-white text-xs leading-relaxed overflow-hidden">
        <MosqueIllustration className="pointer-events-none absolute -bottom-6 -right-4 w-32 text-white/10 -z-0" />
        <div className="relative z-10">
          <p className="text-lg leading-none mb-2">&ldquo;</p>
          <p>
            Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu
            membersihkan dan mensucikan mereka.
          </p>
          <p className="mt-2 text-brand-200 text-[11px]">
            – QS. At-Taubah: 103
          </p>
        </div>
      </div> */}
      </aside>
    </>
  );
}
