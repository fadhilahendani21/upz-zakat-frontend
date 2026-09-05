import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Heart,
  UserRoundPlus,
  LogIn,
  Menu,
  X,
} from "lucide-react";

import logoUpz from "../../assets/img/logo-upz.png";
import { useSettings } from "../../services/settingService";

const menu = [
  { label: "Beranda", to: "/" },
  { label: "Tentang UPZ", to: "/tentang" },
  { label: "Program", to: "/program" },
  { label: "Laporan", to: "/laporan" },
  { label: "Kontak", to: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const settings = useSettings();

  const brandName =
    settings?.profil?.namaSingkat || "UPZ Unsil";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">

      {/* =====================================================
          NAVBAR UTAMA
      ====================================================== */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* ===================================================
            LOGO
        ==================================================== */}

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >

          <img
            src={logoUpz}
            alt={brandName}
            className="h-10 w-10 shrink-0 rounded-md object-contain"
          />

          <div>

            <p className="text-sm font-bold leading-tight text-gray-900">
              {brandName}
            </p>

            <p className="text-[11px] leading-tight text-gray-500">
              Universitas Siliwangi
            </p>

          </div>

        </Link>

        {/* ===================================================
            MENU DESKTOP
        ==================================================== */}

        <nav className="hidden items-center gap-5 lg:flex">

          {menu.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `border-b-2 pb-1 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "border-brand-600 text-brand-700"
                    : "border-transparent text-gray-600 hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>

          ))}

        </nav>

        {/* ===================================================
            ACTION DESKTOP
            TANPA TOMBOL MASUK
        ==================================================== */}

        <div className="hidden items-center gap-2 lg:flex">

          {/* LOGIN MUZAKKI */}
          <Link
            to="/muzakki/masuk"
            className="
              inline-flex
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-lg
              border-1
              border-brand-600
              px-3
              py-2
              text-xs
              font-semibold
              text-brand-600
              transition-colors
              hover:bg-brand-50
            "
          >
            <LogIn size={15} />
            Login Muzakki
          </Link>

          {/* DAFTAR MUZAKKI */}

          <Link
            to="/daftar-muzakki"
            className="
              inline-flex
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-lg
              bg-brand-600
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-brand-700
            "
          >

            <UserRoundPlus size={15} />

            Daftar Muzakki

          </Link>

          {/* DONASI */}

          <Link
            to="/donasi"
            className="
              inline-flex
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-lg
              bg-brand-600
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-brand-700
            "
          >

            <Heart size={15} />

            Donasi Sekarang

          </Link>

        </div>

        {/* ===================================================
            MOBILE BUTTON
        ==================================================== */}

        <button
          type="button"
          className="text-gray-700 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={
            open
              ? "Tutup menu"
              : "Buka menu"
          }
        >

          {open ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}

        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {open && (

        <div className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden">

          <div className="flex flex-col gap-4">

            {/* MENU */}

            {menu.map((item) => (

              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-700"
                      : "text-gray-700 hover:text-brand-700"
                  }`
                }
              >
                {item.label}
              </NavLink>

            ))}

            {/* ACTION MOBILE */}

            <div className="border-t border-gray-100 pt-4">

              {/* LOGIN MUZAKKI */}

              <Link
                to="/muzakki/masuk"
                onClick={() => setOpen(false)}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border border-brand-600
                  py-2.5
                  text-sm
                  font-semibold
                  text-brand-600
                  transition-colors
                  hover:bg-brand-50
                "
              >
                <LogIn size={16} />
                Login Muzakki
              </Link>

              {/* DAFTAR MUZAKKI */}

              <Link
                to="/daftar-muzakki"
                onClick={() => setOpen(false)}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-brand-600
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-brand-700
                "
              >

                <UserRoundPlus size={16} />

                Daftar Muzakki

              </Link>

              {/* DONASI */}

              <Link
                to="/donasi"
                onClick={() => setOpen(false)}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-brand-600
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-brand-700
                "
              >

                <Heart size={16} />

                Donasi Sekarang

              </Link>

            </div>

          </div>

        </div>

      )}

    </header>
  );
}