import { X, QrCode } from "lucide-react";

export default function QrisModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <QrCode size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            Pembayaran QRIS
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Scan QR berikut menggunakan aplikasi pembayaran Anda.
          </p>

        </div>

        {/* QR */}
        <div className="mt-6 flex justify-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <img
              src="/dummy-qris.png"
              alt="QRIS"
              className="h-64 w-64 object-contain"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-gray-500">
          Silakan scan QR untuk melanjutkan pembayaran.
        </p>

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Tutup
        </button>

      </div>
    </div>
  );
}