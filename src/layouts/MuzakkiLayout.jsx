import { useState, useEffect, useRef } from "react";
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
  MapPin,
  LogIn,
  Phone,
  Mail,
  CheckCheck,
} from "lucide-react";

import logoUpz from "../assets/img/logo-upz.png";
import { useSettings } from "../services/settingService";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/muzakki/dashboard",
  },
  {
    icon: User,
    label: "Profil Saya",
    path: "/muzakki/profil",
  },
  {
    icon: CreditCard,
    label: "Kartu Muzakki",
    path: "/muzakki/kartu",
  },
  {
    icon: IdCard,
    label: "Kartu NPWZ",
    path: "/muzakki/npwz",
  },
  {
    icon: HandCoins,
    label: "Tunaikan Zakat",
    path: "/muzakki/tunaikan",
  },
  {
    icon: History,
    label: "Riwayat Pembayaran",
    path: "/muzakki/riwayat",
  },
  {
    icon: FileText,
    label: "Laporan Zakat",
    path: "/muzakki/laporan",
  },
  {
    icon: Calculator,
    label: "Kalkulator Zakat",
    path: "/muzakki/kalkulator",
  },
  {
    icon: Settings,
    label: "Pengaturan",
    path: "/muzakki/pengaturan",
  },
  {
    icon: HelpCircle,
    label: "Bantuan",
    path: "/muzakki/bantuan",
  },
];

const pageTitles = {
  "/muzakki/dashboard": {
    title: "Dashboard",
    subtitle: "Ringkasan aktivitas zakat Anda.",
  },
  "/muzakki/profil": {
    title: "Profil Saya",
    subtitle: "Kelola informasi profil Muzakki Anda.",
  },
  "/muzakki/kartu": {
    title: "Kartu Muzakki",
    subtitle: "Kartu identitas Muzakki Anda.",
  },
  "/muzakki/npwz": {
    title: "Kartu NPWZ",
    subtitle: "Nomor Pokok Wajib Zakat Anda.",
  },
  "/muzakki/tunaikan": {
    title: "Tunaikan Zakat",
    subtitle: "Tunaikan kewajiban zakat Anda dengan mudah.",
  },
  "/muzakki/riwayat": {
    title: "Riwayat Pembayaran",
    subtitle: "Riwayat pembayaran zakat Anda.",
  },
  "/muzakki/laporan": {
    title: "Laporan Zakat",
    subtitle: "Lihat dan unduh laporan pembayaran zakat.",
  },
  "/muzakki/kalkulator": {
    title: "Kalkulator Zakat",
    subtitle: "Hitung estimasi kewajiban zakat Anda.",
  },
  "/muzakki/pengaturan": {
    title: "Pengaturan",
    subtitle: "Kelola pengaturan akun Anda.",
  },
  "/muzakki/bantuan": {
    title: "Bantuan",
    subtitle: "Pusat bantuan dan informasi Muzakki.",
  },
};

const navigasi = [
  { label: "Beranda", to: "/" },
  { label: "Tentang UPZ", to: "/tentang" },
  { label: "Program", to: "/program" },
  { label: "Berita", to: "/berita" },
  { label: "Laporan", to: "/laporan" },
  { label: "Kontak", to: "/kontak" },
];

const layanan = [
  { label: "Kalkulator Zakat", to: "/hitung-zakat" },
  { label: "Tunaikan Zakat", to: "/donasi" },
  { label: "Program Penyaluran", to: "/program" },
  { label: "Transparansi Dana", to: "/laporan" },
];

export default function MuzakkiLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'notif' | 'profile' | null
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const settings = useSettings();

  const user = JSON.parse(
    localStorage.getItem("muzakki_user") || "{}"
  );

  const currentPage =
    pageTitles[location.pathname] ||
    pageTitles["/muzakki/dashboard"];

  const userName =
    user?.name ||
    user?.nama ||
    user?.muzakki?.nama ||
    "Muzakki";

  const userInitial =
    userName.charAt(0).toUpperCase();

  // ================= NOTIFIKASI MUZAKKI =================
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("muzakki_notifs");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "muz-notif-1",
        title: "Zakat Berhasil Dicatat",
        desc: "Pembayaran zakat Anda telah terverifikasi dan tercatat ke pembukuan resmi UPZ UNSIL.",
        time: "Baru saja",
        unread: true,
        link: "/muzakki/riwayat",
      },
      {
        id: "muz-notif-2",
        title: "Kartu NPWZ Siap Diunduh",
        desc: "Nomor Pokok Wajib Zakat Anda telah aktif. Anda dapat mengunduh kartu NPWZ digital.",
        time: "Kemarin",
        unread: true,
        link: "/muzakki/npwz",
      },
      {
        id: "muz-notif-3",
        title: "Laporan Penyaluran ZIS",
        desc: "Laporan transparansi distribusi dana ZIS periode terbaru telah dapat dilihat.",
        time: "3 hari lalu",
        unread: false,
        link: "/muzakki/laporan",
      },
    ];
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    try {
      localStorage.setItem("muzakki_notifs", JSON.stringify(updated));
    } catch {}
  };

  const handleNotifClick = (notif) => {
    const updated = notifications.map((n) =>
      n.id === notif.id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
    try {
      localStorage.setItem("muzakki_notifs", JSON.stringify(updated));
    } catch {}
    setOpenDropdown(null);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifRef.current && !notifRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dropdown saat ganti halaman
  useEffect(() => {
    setOpenDropdown(null);
    setSidebarOpen(false);
  }, [location.pathname]);

  // ================= FOOTER DATA =================

  const brandName =
    settings?.profil?.namaSingkat ||
    "UPZ Unsil";

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  const alamat =
    settings?.profil?.alamat ||
    "Universitas Siliwangi, Tasikmalaya";

  const whatsapp =
    settings?.profil?.whatsapp ||
    "081234567890";

  const whatsappClean =
    whatsapp.replace(/\D/g, "");

  const whatsappHref =
    `https://wa.me/${
      whatsappClean.startsWith("0")
        ? "62" + whatsappClean.slice(1)
        : whatsappClean
    }`;

  const email =
    settings?.profil?.email ||
    "upz@unsil.ac.id";

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("muzakki_token");
    localStorage.removeItem("muzakki_user");

    navigate("/muzakki/masuk");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[250px]
          bg-[#2e7d38] text-white
          transition-transform duration-300
          lg:sticky lg:translate-x-0
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* LOGO */}

          <div className="h-[78px] shrink-0 border-b border-white/15 px-5">
            <div className="flex h-full items-center">

              <Link
                to="/muzakki/dashboard"
                onClick={closeSidebar}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
                  <img
                    src={logoUpz}
                    alt="Logo UPZ UNSIL"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide">
                    UPZ UNSIL
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/75">
                    Universitas Siliwangi
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeSidebar}
                className="ml-auto rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
              >
                <X size={20} />
              </button>

            </div>
          </div>

          {/* MENU */}

          <nav className="flex-1 overflow-y-auto px-3 py-4">

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Menu Utama
            </p>

            <div className="space-y-1">

              {menuItems.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5
                      text-[13px] font-medium transition
                      ${
                        active
                          ? "bg-white text-[#2e7d38] shadow-sm"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.4 : 2}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {item.label}
                    </span>
                  </Link>
                );
              })}

            </div>
          </nav>

          {/* QUOTE */}

          <div className="shrink-0 border-t border-white/15 px-5 py-4">

            <p className="text-[10px] leading-relaxed text-white/70 italic">
              "Ambillah zakat dari sebagian harta mereka, dengan
              zakat itu kamu membersihkan dan mensucikan mereka..."
            </p>

            <p className="mt-1 text-[9px] text-white/45">
              QS. At-Taubah: 103
            </p>

          </div>

          {/* LOGOUT */}

          <div className="shrink-0 px-3 pb-3">

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3 rounded-lg
                px-3 py-2.5 text-[13px] font-medium
                text-white/80 transition
                hover:bg-white/10 hover:text-white
              "
            >
              <LogOut size={18} />

              <span>Keluar</span>
            </button>

          </div>

        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        {/* ================= TOPBAR ================= */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">

          <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0">

                <h1 className="truncate text-lg font-bold text-gray-800 sm:text-xl">
                  {currentPage.title}
                </h1>

                <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                  {currentPage.subtitle}
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              {/* NOTIFICATION */}

              <div ref={notifRef} className="relative">

                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "notif" ? null : "notif")}
                  className={`
                    relative flex h-10 w-10 items-center justify-center
                    rounded-xl text-gray-500 transition
                    hover:bg-gray-100 hover:text-[#2e7d38]
                    ${openDropdown === "notif" ? "bg-gray-100 text-[#2e7d38]" : ""}
                  `}
                  aria-label="Notifikasi Muzakki"
                >
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {openDropdown === "notif" && (
                  <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Notifikasi
                        </h3>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            {unreadCount} baru
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                        >
                          <CheckCheck size={13} />
                          Tandai dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-xs text-gray-400">
                            Tidak ada notifikasi baru
                          </p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`flex cursor-pointer gap-3 px-4 py-3 transition hover:bg-gray-50 ${
                              n.unread ? "bg-brand-50/40" : ""
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                              <Bell size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`truncate text-xs sm:text-sm leading-tight ${
                                  n.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"
                                }`}>
                                  {n.title}
                                </p>
                                <span className="shrink-0 text-[10px] text-gray-400">
                                  {n.time}
                                </span>
                              </div>

                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                                {n.desc}
                              </p>
                            </div>

                            {n.unread && (
                              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5 text-center text-xs">
                      <Link
                        to="/muzakki/riwayat"
                        onClick={() => setOpenDropdown(null)}
                        className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
                      >
                        Lihat Semua Riwayat Pembayaran &rarr;
                      </Link>
                    </div>
                  </div>
                )}

              </div>

              {/* USER PROFILE */}

              <div ref={profileRef} className="relative">

                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "profile" ? null : "profile")}
                  className={`flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100 ${
                    openDropdown === "profile" ? "bg-gray-100" : ""
                  }`}
                  aria-label="Menu profil Muzakki"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dbf0dd] text-sm font-bold text-[#2e7d38]">
                    {userInitial}
                  </div>

                  <div className="hidden max-w-[170px] text-left sm:block">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {userName}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      {user?.kategori || "Muzakki Terdaftar"}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`hidden text-gray-400 transition-transform duration-200 sm:block ${
                      openDropdown === "profile" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "profile" && (
                  <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header Info */}
                    <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbf0dd] text-sm font-bold text-[#2e7d38]">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {userName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user?.email || user?.nip || "Muzakki UNSIL"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Nav Items */}
                    <div className="py-1.5 text-xs font-medium text-gray-700">
                      <Link
                        to="/muzakki/profil"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <User size={15} className="text-gray-400" />
                        <span>Profil Saya</span>
                      </Link>

                      <Link
                        to="/muzakki/kartu"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <CreditCard size={15} className="text-gray-400" />
                        <span>Kartu Muzakki</span>
                      </Link>

                      <Link
                        to="/muzakki/npwz"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <IdCard size={15} className="text-gray-400" />
                        <span>Kartu NPWZ</span>
                      </Link>

                      <Link
                        to="/muzakki/tunaikan"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <HandCoins size={15} className="text-gray-400" />
                        <span>Tunaikan Zakat</span>
                      </Link>

                      <Link
                        to="/muzakki/pengaturan"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Settings size={15} className="text-gray-400" />
                        <span>Pengaturan Akun</span>
                      </Link>

                      <Link
                        to="/muzakki/bantuan"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <HelpCircle size={15} className="text-gray-400" />
                        <span>Pusat Bantuan</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenDropdown(null);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut size={15} />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>

        </main>

        {/* ===================================================== */}
        {/* ===================== FOOTER ======================== */}
        {/* ===================================================== */}

        <footer className="bg-[#175621] text-white">

          {/* ================= MAIN FOOTER ================= */}

          <div className="mx-auto max-w-7xl px-6 pb-4 pt-6 lg:px-10">

            <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-12 lg:gap-7">

              {/* ================= BRAND ================= */}

              <div className="col-span-3 lg:col-span-5">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 rounded-lg bg-white p-1 shadow-sm">

                    <img
                      src={logoUpz}
                      alt="Logo UPZ Unsil"
                      className="h-full w-full rounded-md object-contain"
                    />

                  </div>

                  <div>

                    <h3 className="text-base font-bold">
                      {brandName}
                    </h3>

                    <p className="mt-0.5 text-xs font-medium text-green-300">
                      Universitas Siliwangi
                    </p>

                  </div>

                </div>

                <p className="mt-3 max-w-md text-xs leading-5 text-green-100">

                  {orgName} berkomitmen
                  dalam mengelola dan menyalurkan zakat, infak,
                  dan sedekah secara amanah, transparan, dan tepat
                  sasaran.

                </p>

                {/* ================= SOCIAL MEDIA ================= */}

                <div className="mt-3 flex items-center gap-2">

                  {/* Instagram */}

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                      />

                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

                      <line
                        x1="17.5"
                        x2="17.51"
                        y1="6.5"
                        y2="6.5"
                      />
                    </svg>
                  </a>

                  {/* Facebook */}

                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>

                  {/* YouTube */}

                  <a
                    href="#"
                    aria-label="YouTube"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />

                      <path d="m10 15 5-3-5-3z" />
                    </svg>
                  </a>

                </div>

              </div>

              {/* ================= NAVIGASI ================= */}

              <div className="col-span-1 lg:col-span-2">

                <h4 className="text-sm font-semibold text-white">
                  Navigasi
                </h4>

                <div className="mb-2.5 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

                <ul className="space-y-1.5">

                  {navigasi.map((item) => (
                    <li key={item.to}>

                      <Link
                        to={item.to}
                        className="inline-block text-xs text-green-100 transition-all duration-200 hover:translate-x-1 hover:text-white"
                      >
                        {item.label}
                      </Link>

                    </li>
                  ))}

                </ul>

              </div>

              {/* ================= LAYANAN ================= */}

              <div className="col-span-1 lg:col-span-2">

                <h4 className="text-sm font-semibold text-white">
                  Layanan
                </h4>

                <div className="mb-2.5 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

                <ul className="space-y-1.5">

                  {layanan.map((item) => (
                    <li key={item.to}>

                      <Link
                        to={item.to}
                        className="inline-block text-xs text-green-100 transition-all duration-200 hover:translate-x-1 hover:text-white"
                      >
                        {item.label}
                      </Link>

                    </li>
                  ))}

                </ul>

              </div>

              {/* ================= HUBUNGI KAMI ================= */}

              <div className="col-span-1 lg:col-span-3">

                <h4 className="text-sm font-semibold text-white">
                  Hubungi Kami
                </h4>

                <div className="mb-3 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

                <div className="space-y-3">

                  {/* ALAMAT */}

                  <div className="flex items-start gap-2.5">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <MapPin size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-medium leading-4 text-green-300">
                        Alamat
                      </p>

                      <p className="text-xs leading-5 text-green-100">
                        {alamat}
                      </p>

                    </div>

                  </div>

                  {/* WHATSAPP */}

                  <div className="flex items-start gap-2.5">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Phone size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-medium leading-4 text-green-300">
                        WhatsApp / Telepon
                      </p>

                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs leading-5 text-green-100 transition-colors hover:text-white"
                      >
                        {whatsapp}
                      </a>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="flex items-start gap-2.5">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Mail size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-medium leading-4 text-green-300">
                        Email
                      </p>

                      <a
                        href={`mailto:${email}`}
                        className="break-all text-xs leading-5 text-green-100 transition-colors hover:text-white"
                      >
                        {email}
                      </a>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================= BOTTOM ================= */}

          <div className="border-t border-white/10">

            <div className="mx-auto max-w-7xl px-6 py-2.5 lg:px-10">

              <div className="flex flex-col items-center justify-between gap-2 md:flex-row">

                {/* COPYRIGHT + LOGIN */}

                <div className="flex items-center gap-2 text-center md:text-left">

                  <p className="text-[11px] text-green-200">

                    © {new Date().getFullYear()} {orgName}.
                    All rights reserved.

                  </p>

                  <Link
                    to="/masuk"
                    aria-label="Masuk"
                    title="Masuk"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-green-200/40 transition-all duration-200 hover:bg-white/10 hover:text-green-100"
                  >
                    <LogIn
                      size={13}
                      strokeWidth={1.8}
                    />
                  </Link>

                </div>

                {/* TAGLINE */}

                <div className="flex items-center gap-1.5 text-[11px] text-green-200">

                  <span>Amanah</span>

                  <span className="text-green-400">
                    •
                  </span>

                  <span>Transparan</span>

                  <span className="text-green-400">
                    •
                  </span>

                  <span>Tepat Sasaran</span>

                </div>

              </div>

            </div>

          </div>

        </footer>

      </div>

    </div>
  );
}