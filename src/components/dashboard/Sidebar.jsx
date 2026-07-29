import { NavLink } from "react-router-dom";
import logoUnsil from "../../assets/images/logo-unsil.png";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Globe,
  FolderKanban,
  Receipt,
  Wallet,
  BarChart3,
  BookOpen,
  UserCog,
  Settings,
} from "lucide-react";

const pengelolaan = [
  { label: "Pengumpulan", icon: ArrowDownToLine, to: "/dashboard/pengumpulan" },
  { label: "Penyaluran", icon: ArrowUpFromLine, to: "/dashboard/penyaluran" },
  { label: "Muzakki & Mustahik", icon: Users, to: "/dashboard/muzakki-mustahik" },
  { label: "Donasi Online", icon: Globe, to: "/dashboard/donasi-online" },
  { label: "Program", icon: FolderKanban, to: "/dashboard/program" },
];

const keuangan = [
  { label: "Transaksi", icon: Receipt, to: "/dashboard/transaksi" },
  { label: "Rekening & Kas", icon: Wallet, to: "/dashboard/rekening-kas" },
  { label: "Laporan Keuangan", icon: BarChart3, to: "/dashboard/laporan-keuangan" },
  { label: "Jurnal", icon: BookOpen, to: "/dashboard/jurnal" },
];

const pengaturan = [
  { label: "Pengguna", icon: UserCog, to: "/dashboard/pengguna" },
  { label: "Pengaturan Sistem", icon: Settings, to: "/dashboard/pengaturan" },
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

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-gray-100 bg-white flex flex-col">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
        <img
          src={logoUnsil}
          alt="Logo UPZ Zakat Universitas Siliwangi"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">
            UPZ Zakat
          </p>
          <p className="text-[11px] text-gray-500 leading-tight">
            Universitas Siliwangi
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
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

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-400 mb-2 tracking-wide">
            KEUANGAN
          </p>
          <div className="space-y-1">
            {keuangan.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
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

      <div className="m-4 p-4 rounded-xl bg-brand-700 text-white text-xs leading-relaxed">
        <p className="text-lg leading-none mb-2">&ldquo;</p>
        <p>
          Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu
          membersihkan dan mensucikan mereka.
        </p>
        <p className="mt-2 text-brand-200 text-[11px]">– QS. At-Taubah: 103</p>
      </div>
    </aside>
  );
}
