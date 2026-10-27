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

      <div className="flex h-16 sm:h-20 w-full items-center justify-between px-3.5 sm:px-5 lg:px-6 xl:px-8">
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
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md object-contain"
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
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 active:bg-gray-200 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={
            open
              ? "Tutup menu"
              : "Buka menu"
          }
        >

          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}

        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {open && (

        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg lg:hidden">

          <div className="flex flex-col gap-3">

            {/* MENU LINKS */}

            <div className="flex flex-col gap-1">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-brand-700"
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* ACTION BUTTONS MOBILE */}

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2.5">

              <div className="grid grid-cols-2 gap-2">
                {/* LOGIN MUZAKKI */}
                <Link
                  to="/muzakki/masuk"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-brand-600 py-2.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                >
                  <LogIn size={15} />
                  Login Muzakki
                </Link>

                {/* DAFTAR MUZAKKI */}
                <Link
                  to="/daftar-muzakki"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 py-2.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <UserRoundPlus size={15} />
                  Daftar
                </Link>
              </div>

              {/* DONASI SEKARANG */}
              <Link
                to="/donasi"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
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