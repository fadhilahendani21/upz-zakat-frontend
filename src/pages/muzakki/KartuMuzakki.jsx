import { Download, Share2, CreditCard } from "lucide-react";

export default function KartuMuzakki() {
  const user = JSON.parse(localStorage.getItem("muzakki_user") || "{}");

  const cardData = {
    nomor: "MZK-2025-000123",
    nama: user.name || "Nama Muzakki",
    nip: user.nip || "-",
    fakultas: user.faculty || "-",
    terdaftar: "15 Januari 2025",
  };

  const handleDownload = () => {
    alert("Fitur download kartu akan segera tersedia");
  };

  const handleShare = () => {
    alert("Fitur share kartu akan segera tersedia");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kartu Muzakki</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kartu identitas Anda sebagai Muzakki UPZ UNSIL
        </p>
      </div>

      {/* Card Display */}
      <div className="max-w-2xl mx-auto">
        {/* Front Card */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 250">
              <circle cx="350" cy="50" r="100" fill="white" />
              <circle cx="50" cy="200" r="80" fill="white" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold opacity-90">UPZ UNSIL</p>
                    <p className="text-[10px] opacity-70">Universitas Siliwangi</p>
                  </div>
                </div>
              </div>
              <p className="text-xs bg-white/20 px-3 py-1 rounded-full">Muzakki</p>
            </div>

            {/* Card Number */}
            <div>
              <p className="text-xs opacity-70 mb-1">Nomor Kartu</p>
              <p className="text-2xl font-bold tracking-wider">{cardData.nomor}</p>
            </div>

            {/* Name & Details */}
            <div className="space-y-3">
              <div>
                <p className="text-xs opacity-70 mb-1">Nama Lengkap</p>
                <p className="text-lg font-semibold">{cardData.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70 mb-1">NIP</p>
                  <p className="font-medium">{cardData.nip}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Fakultas</p>
                  <p className="font-medium text-sm">{cardData.fakultas}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] opacity-70">Terdaftar Sejak</p>
                <p className="text-xs font-semibold">{cardData.terdaftar}</p>
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Informasi:</strong> Kartu Muzakki ini dapat digunakan sebagai bukti bahwa Anda adalah Muzakki terdaftar di UPZ Universitas Siliwangi.
          </p>
        </div>
      </div>
    </div>
  );
}
