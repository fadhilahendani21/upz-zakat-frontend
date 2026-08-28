import { useState } from "react";
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "../../services/notificationService";

import ConfirmModal from "../common/ConfirmModal";

export default function NotificationModal({ isOpen, onClose, notifications = [], onRefresh }) {
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'pengumpulan' | 'penyaluran' | 'donasi' | 'sistem'
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return n.unread;
    if (filter === "pengumpulan") return n.type === "pengumpulan";
    if (filter === "penyaluran") return n.type === "penyaluran";
    if (filter === "donasi") return n.type === "donasi";
    if (filter === "sistem") return n.type === "sistem" || n.type === "mustahik";
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleItemClick = (n) => {
    markNotificationAsRead(n.id);
    if (onRefresh) onRefresh();
    if (n.targetUrl) {
      onClose();
      navigate(n.targetUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    if (onRefresh) onRefresh();
  };

  const handleConfirmClear = () => {
    clearAllNotifications();
    setShowClearConfirm(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Pusat Notifikasi</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-600 text-white">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Aktivitas transaksi, donasi online, dan sistem</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="px-6 py-2.5 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {[
              { id: "all", label: "Semua" },
              { id: "unread", label: `Belum Dibaca (${unreadCount})` },
              { id: "pengumpulan", label: "Pengumpulan" },
              { id: "penyaluran", label: "Penyaluran" },
              { id: "donasi", label: "Donasi" },
              { id: "sistem", label: "Sistem" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-xs text-brand-700 font-medium hover:underline"
              >
                <CheckCheck size={14} /> Tandai dibaca
              </button>
            )}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1 text-xs text-red-600 font-medium hover:underline ml-1"
              title="Bersihkan semua notifikasi"
            >
              <Trash2 size={13} /> Bersihkan
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Tidak ada notifikasi</p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === "unread"
                  ? "Semua notifikasi sudah Anda baca."
                  : "Belum ada notifikasi pada kategori ini."}
              </p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all ${
                  n.unread
                    ? "bg-brand-50/40 hover:bg-brand-50 border border-brand-100/60"
                    : "hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl shrink-0">
                  {n.icon || "🔔"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${n.unread ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-gray-400 shrink-0 flex items-center gap-1">
                      <Clock size={11} /> {n.time}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.desc}</p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded-md transition">
                      {n.actionLabel || "Buka Halaman"} <ExternalLink size={10} />
                    </span>

                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>Menampilkan {filteredNotifs.length} notifikasi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Tutup
          </button>
        </div>

      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClear}
        title="Hapus Riwayat Notifikasi?"
        message="Apakah Anda yakin ingin membersihkan semua riwayat notifikasi? Tindakan ini akan mengosongkan daftar notifikasi saat ini."
        confirmText="Ya, Bersihkan"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
