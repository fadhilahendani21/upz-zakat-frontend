export default function QrisPreview() {
  return (
    <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-5 text-center">
      <p className="text-sm font-semibold text-brand-700">
        Pembayaran QRIS
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Silakan scan QR untuk melanjutkan pembayaran.
      </p>

      <div className="mt-4 flex justify-center">
        <img
          src="/dummy-qris.png"
          alt="QRIS"
          className="h-56 w-56 rounded-xl border border-gray-200 bg-white p-3 object-contain"
        />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Scan QR menggunakan aplikasi pembayaran Anda.
      </p>
    </div>
  );
}