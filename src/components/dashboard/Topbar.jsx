import { useState, useEffect, useRef } from "react";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  BookOpen,
  MessageCircle,
  Phone,
  CheckCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../services/authService";
import { useSettings } from "../../services/settingService";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";
import { getProfile } from "../../services/penggunaService";
import HelpModal from "./HelpModal";
import NotificationModal from "./NotificationModal";

export default function Topbar({ title, subtitle, onMenuClick }) {
  const navigate  = useNavigate();
  const settings  = useSettings();

  // Baca dari localStorage dulu lalu sinkronkan dengan API
  const [currentUser, setCurrentUser] = useState(() => getUser());
  const [today, setToday] = useState(new Date());
  const userName    = currentUser?.name  ?? "Admin UPZ";
  const userRole    = currentUser?.role  ?? "administrator";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    let cancelled = false;
    async function refreshUser() {
      try {
        const fresh = await getProfile();
        if (cancelled) return;
        const existing = getUser() || {};
        const updated = { ...existing, ...fresh };
        localStorage.setItem("user", JSON.stringify(updated));
        setCurrentUser(updated);
      } catch { /* tetap pakai cache */ }
    }
    refreshUser();
    return () => { cancelled = true; };
  }, []);

  const [openDropdown, setOpenDropdown] = useState(null); // "notif" | "help" | "profile" | null
  const [notifs, setNotifs] = useState([]);
  
  // Modals state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Refs for click-outside detection
  const notifRef   = useRef(null);
  const helpRef    = useRef(null);
  const profileRef = useRef(null);

  // Load notifikasi
  const loadNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifs(data);
    } catch {
      // Fallback tetap aman
    }
  };

  useEffect(() => {
    loadNotifs();

    const handleUpdate = () => loadNotifs();
    window.addEventListener("upz_notifs_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("upz_notifs_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Update tanggal tiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setToday((prev) => (prev.toDateString() !== now.toDateString() ? now : prev));
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
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  async function handleLogout() {
    await logout();
    navigate("/masuk");
  }

  const handleNotifClick = (n) => {
    markNotificationAsRead(n.id);
    setOpenDropdown(null);
    if (n.targetUrl) {
      navigate(n.targetUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    loadNotifs();
  };

  const unreadCount = notifs.filter((n) => n.unread).length;

  const tanggalMasehi = today.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const tanggalHijriah = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
    day: "numeric", month: "long", year: "numeric",
  }).format(today).replace(/\bAH\b/, "H");

  return (
    <>
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
              className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center bg-brand-600 text-white rounded-full ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {openDropdown === "notif" && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeInUp_0.15s_ease]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline font-medium"
                    >
                      <CheckCheck size={13} /> Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="py-8 text-center px-4">
                      <p className="text-xs text-gray-400">Tidak ada notifikasi baru</p>
                    </div>
                  ) : (
                    notifs.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          n.unread ? "bg-brand-50/40" : ""
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{n.icon || "🔔"}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className={`text-xs sm:text-sm leading-tight truncate ${
                                n.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"
                              }`}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.desc}</p>
                        </div>
                        {n.unread && (
                          <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      setShowNotifModal(true);
                    }}
                    className="text-brand-700 font-semibold hover:underline inline-flex items-center gap-1 mx-auto"
                  >
                    Lihat semua notifikasi ({notifs.length}) <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Bantuan ── */}
          <div ref={helpRef} className="relative">
            <button
              onClick={() => toggle("help")}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 transition-colors"
              aria-label="Pusat Bantuan"
            >
              <HelpCircle size={20} />
            </button>

            {openDropdown === "help" && (
              <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-[fadeInUp_0.15s_ease]">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                  <h3 className="font-semibold text-gray-800 text-sm">Pusat Bantuan</h3>
                  <p className="text-[11px] text-gray-500">Panduan & Dukungan Sistem</p>
                </div>

                <div className="py-1.5 divide-y divide-gray-50">
                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      setShowHelpModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-800 transition-colors text-left"
                  >
                    <BookOpen size={16} className="text-brand-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs sm:text-sm">Panduan Penggunaan</p>
                      <p className="text-[10px] text-gray-400">Tutorial & Alur Modul</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      window.open(`mailto:${settings?.profil?.email || "upz@unsil.ac.id"}`);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <MessageCircle size={16} className="text-blue-500 shrink-0" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Kirim Email Admin</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[160px]">{settings?.profil?.email || "upz@unsil.ac.id"}</p>
                    </div>
                  </button>

                  {settings?.profil?.telepon && (
                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                        window.open(`https://wa.me/${settings.profil.telepon.replace(/[^0-9]/g, "")}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Phone size={16} className="text-green-600 shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">WhatsApp Pengurus</p>
                        <p className="text-[10px] text-gray-400">{settings.profil.telepon}</p>
                      </div>
                    </button>
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{settings?.profil?.namaSingkat || "UPZ Unsil"}</span>
                  <span className="font-mono">v1.0.0</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Profil & Logout ── */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => toggle("profile")}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
              aria-label="Menu profil"
            >
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                {userInitial}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">{userName}</p>
                <p className="text-xs text-gray-500 leading-tight capitalize">{userRole}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  openDropdown === "profile" ? "rotate-180" : ""
                }`}
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
                      <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items -> Hyperlink Pengaturan Akun diarahkan ke /dashboard/pengguna */}
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      navigate("/dashboard/pengguna");
                      setOpenDropdown(null);
                    }}
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
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
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

      {/* ── Modals ── */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <NotificationModal
        isOpen={showNotifModal}
        onClose={() => setShowNotifModal(false)}
        notifications={notifs}
        onRefresh={loadNotifs}
      />
    </>
  );
}
