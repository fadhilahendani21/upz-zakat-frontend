import { AlertTriangle, Trash2, LogOut, Info, X, AlertCircle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger", // 'danger' | 'warning' | 'info'
  loading = false,
  errorMessage = "",
}) {
  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: Trash2,
      bg: "bg-red-50 text-red-600",
      btn: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50 text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    },
    info: {
      icon: Info,
      bg: "bg-brand-50 text-brand-600",
      btn: "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500",
    },
  };

  const { icon: Icon, bg, btn } = iconConfig[variant] || iconConfig.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-[scaleUp_0.15s_ease]">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center`}>
            <Icon size={22} />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
            {message}
          </p>
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200/80 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-1.5 ${btn} disabled:opacity-50`}
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
