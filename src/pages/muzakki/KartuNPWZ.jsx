import { Download, Share2, IdCard } from "lucide-react";

export default function KartuNPWZ() {
  const user = JSON.parse(localStorage.getItem("muzakki_user") || "{}");

  const npwzData = {
    nomor: "3171100126559 41",
    nama: user.name || "Nama Muzakki",
    nik: "3201234567890123",
    alamat: "Jl. Siliwangi No. 24, Tasikmalaya",
    terdaftar: "15 Januari 2025",
  };

  const handleDownload = () => {
    alert("Fitur download kartu NPWZ akan segera tersedia");
  };

  const handleShare = () => {
    alert("Fitur share kartu NPWZ akan segera tersedia");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kartu NPWZ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Nomor Pokok Wajib Zakat - Identitas Wajib Zakat Anda
        </p>
      </div>

      {/* Card Display */}
      <div className="max-w-2xl mx-auto">
        {/* Front Card */}
        <div className="bg-gradient-to-br from-teal-700 via-emerald-800 to-green-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 250">
              <rect x="50" y="50" width="100" height="100" fill="white" opacity="0.5" />
              <rect x="250" y="100" width="120" height="120" fill="white" opacity="0.3" />
              <circle cx="100" cy="200" r="60" fill="white" opacity="0.4" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <IdCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">NPWZ</p>
                    <p className="text-xs opacity-80">Nomor Pokok Wajib Zakat</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70">Republik Indonesia</p>
                <p className="text-[10px] opacity-60">BAZNAS</p>
              </div>
            </div>

            {/* NPWZ Number */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs opacity-70 mb-1">Nomor NPWZ</p>
              <p className="text-3xl font-bold tracking-widest">{npwzData.nomor}</p>
            </div>

            {/* Personal Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs opacity-70 mb-1">Nama Lengkap</p>
                <p className="text-lg font-semibold">{npwzData.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70 mb-1">NIK</p>
                  <p className="font-medium text-sm">{npwzData.nik}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Terdaftar</p>
                  <p className="font-medium text-sm">{npwzData.terdaftar}</p>
                </div>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1">Alamat</p>
                <p className="text-sm">{npwzData.alamat}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] opacity-70">Penerbit</p>
                <p className="text-xs font-semibold">UPZ Universitas Siliwangi</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-70">Status</p>
                <p className="text-xs font-semibold">Aktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Download size={18} />
            Download Kartu
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <Share2 size={18} />
            Bagikan
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Tentang NPWZ:</strong> NPWZ adalah Nomor Pokok Wajib Zakat yang diterbitkan oleh BAZNAS sebagai identitas wajib zakat di Indonesia.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">Manfaat NPWZ:</h3>
            <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
              <li>Bukti sebagai Wajib Zakat yang terdaftar</li>
              <li>Dapat digunakan untuk pengurangan PKP (Penghasilan Kena Pajak)</li>
              <li>Memudahkan administrasi pembayaran zakat</li>
              <li>Tersimpan dalam database nasional BAZNAS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
