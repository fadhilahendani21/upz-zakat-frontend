import { useState, useEffect, useRef } from "react";
import { Bell, HelpCircle, ChevronDown, Menu, LogOut, Settings, User, X, BookOpen, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../services/authService";
import { useSettings } from "../../services/settingService";

// ── Notifikasi dummy (bisa disambung ke API nanti) ────────────────────────────
const NOTIFIKASI = [
  { id: 1, icon: "💰", title: "Pengumpulan baru masuk", desc: "Zakat Fitrah Rp 900.000 dari muzakki baru.", time: "5 menit lalu", unread: true },
  { id: 2, icon: "📤", title: "Penyaluran diproses", desc: "Bantuan Sembako telah disalurkan ke 3 mustahik.", time: "1 jam lalu", unread: true },
  { id: 3, icon: "👤", title: "Muzakki baru terdaftar", desc: "Data muzakki berhasil ditambahkan ke sistem.", time: "Kemarin", unread: false },
];

export default function Topbar({ title, subtitle, onMenuClick }) {
  const navigate  = useNavigate();
  const settings  = useSettings();
  const user      = getUser();
  const userName  = user?.name ?? "Admin UPZ";
  const userRole  = user?.role ?? "administrator";
  const userInitial = userName.charAt(0).toUpperCase();

  const [today, setToday] = useState(new Date());
  const [openDropdown, setOpenDropdown] = useState(null); // "notif" | "help" | "profile" | null
  const [notifs, setNotifs] = useState(NOTIFIKASI);

  // Refs for click-outside detection
  const notifRef   = useRef(null);
  const helpRef    = useRef(null);
  const profileRef = useRef(null);

  // Update tanggal tiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setToday((prev) => prev.toDateString() !== now.toDateString() ? now : prev);
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifRef.current   && !notifRef.current.contains(e.target) &&
        helpRef.current    && !helpRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(name) {
    setOpenDropdown((prev) => prev === name ? null : name);
  }

  async function handleLogout() {
    await logout();
    navigate("/masuk");
  }

  function markAllRead() {
    setNotifs((n) => n.map((item) => ({ ...item, unread: false })));
  }

  const unreadCount = notifs.filter((n) => n.unread).length;

  const tanggalMasehi = today.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const tanggalHijriah = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
    day: "numeric", month: "long", year: "numeric",
  }).format(today).replace(/\bAH\b/, "H");

  return (
    <div className="flex items-start justify-between mb-4 gap-3">
      {/* Kiri: Judul */}
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden mt-1 shrink-0 text-gray-500 hover:text-gray-700"
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate sm:whitespace-normal">
            {title || (
              <>Assalamu&apos;alaikum, <span className="text-brand-600">{userName}</span></>
            )}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Kanan: Actions */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {/* Tanggal */}
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-700">{tanggalMasehi}</p>
          <p className="text-xs text-gray-400">{tanggalHijriah}</p>
        </div>

        {/* ── Notifikasi ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => toggle("notif")}
            className="relative text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] flex items-center justify-center bg-brand-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {openDropdown === "notif" && (
            <div className="absolute right-0 top-9 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeInUp_0.15s_ease]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline">
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${n.unread ? "bg-brand-50/50" : ""}`}
                    onClick={() => setNotifs((prev) => prev.map((item) => item.id === n.id ? { ...item, unread: false } : item))}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm leading-tight ${n.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <button className="text-xs text-brand-600 hover:underline">Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Bantuan ── */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => toggle("help")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Bantuan"
          >
            <HelpCircle size={20} />
          </button>

          {openDropdown === "help" && (
            <div className="absolute right-0 top-9 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeInUp_0.15s_ease]">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Bantuan</h3>
              </div>
              <div className="py-1.5">
                {[
                  { icon: BookOpen, label: "Panduan Penggunaan", action: () => alert("Panduan sistem sedang disiapkan.") },
                  { icon: MessageCircle, label: "Hubungi Admin", action: () => window.open(`mailto:${settings?.profil?.email || "upz@unsil.ac.id"}`) },
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={() => { action(); setOpenDropdown(null); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Icon size={15} className="text-gray-400" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">{settings?.profil?.namaSingkat || "UPZ Unsil"} v1.0.0</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Profil & Logout ── */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => toggle("profile")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Menu profil"
          >
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">{userName}</p>
              <p className="text-xs text-gray-500 leading-tight">{userRole}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${openDropdown === "profile" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "profile" && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeInUp_0.15s_ease]">
              {/* Info user */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button
                  onClick={() => { navigate("/dashboard/pengaturan"); setOpenDropdown(null); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings size={15} className="text-gray-400" />
                  Pengaturan Akun
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
