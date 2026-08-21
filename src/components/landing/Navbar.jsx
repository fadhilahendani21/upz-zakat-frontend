import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, User, Menu, X } from "lucide-react";
import logoUpz from "../../assets/img/LOGO-UPZ.png";
import { useSettings } from "../../services/settingService";

const menu = [
  { label: "Beranda", to: "/" },
  { label: "Tentang UPZ", to: "/tentang" },
  { label: "Program", to: "/program" },
  { label: "Berita", to: "/berita" },
  { label: "Laporan", to: "/laporan" },
  { label: "Kontak", to: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const brandName = settings?.profil?.namaSingkat || "UPZ Unsil";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoUpz}
            alt={brandName}
            className="h-11 w-11 object-contain shrink-0 rounded-md"
          />
          <div>
            <p className="font-bold text-gray-900 leading-tight">{brandName}</p>
            <p className="text-xs text-gray-500 leading-tight">
              Universitas Siliwangi
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium pb-1 border-b-2 transition-colors ${
                  isActive
                    ? "text-brand-700 border-brand-600"
                    : "text-gray-600 border-transparent hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/masuk"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <User size={16} /> Masuk
          </Link>
          <Link
            to="/donasi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            <Heart size={16} /> Donasi Sekarang
          </Link>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} className="text-sm text-gray-700">
              {item.label}
            </NavLink>
          ))}
          <Link to="/masuk" className="text-sm font-medium text-brand-700">
            Masuk
          </Link>
          <Link
            to="/donasi"
            className="text-center bg-brand-600 text-white py-2 rounded-lg text-sm font-medium"
          >
            Donasi Sekarang
          </Link>
        </div>
      )}
    </header>
  );
}
