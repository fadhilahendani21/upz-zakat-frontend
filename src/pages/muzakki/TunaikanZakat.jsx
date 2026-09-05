import { useState } from "react";
import { HandCoins, CreditCard, Smartphone, QrCode, Building2, CheckCircle } from "lucide-react";

export default function TunaikanZakat() {
  const [activeMethod, setActiveMethod] = useState("potong-gaji");
  const [amount, setAmount] = useState("");

  const methods = [
    {
      id: "potong-gaji",
      icon: Building2,
      label: "Potong Gaji",
      desc: "Otomatis dipotong dari gaji bulanan",
      available: true,
    },
    {
      id: "transfer",
      icon: CreditCard,
      label: "Transfer Bank",
      desc: "Transfer manual ke rekening UPZ",
      available: true,
    },
    {
      id: "ewallet",
      icon: Smartphone,
      label: "E-Wallet",
      desc: "Bayar melalui OVO, GoPay, Dana",
      available: false,
    },
    {
      id: "qris",
      icon: QrCode,
      label: "QRIS",
      desc: "Scan QR Code untuk pembayaran",
      available: false,
    },
  ];

  const bankAccounts = [
    { bank: "Bank Syariah Indonesia (BSI)", norek: "1234567890", atas: "UPZ Universitas Siliwangi" },
    { bank: "Bank Mandiri Syariah", norek: "9876543210", atas: "UPZ UNSIL" },
  ];

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Masukkan nominal zakat yang valid!");
      return;
    }
    alert(`Pembayaran ${formatRupiah(amount)} melalui ${methods.find(m => m.id === activeMethod)?.label} berhasil diproses!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tunaikan Zakat</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pilih metode pembayaran dan nominal zakat yang akan Anda tunaikan
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900">
          <p className="font-semibold">Untuk Dosen & Staf UNSIL:</p>
          <p className="mt-1">
            Pembayaran zakat penghasilan Anda sudah otomatis dipotong dari gaji setiap bulan. 
            Gunakan metode lain jika ingin membayar zakat tambahan (maal, fitrah, dll).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Method Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => method.available && setActiveMethod(method.id)}
                  disabled={!method.available}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg text-left transition ${
                    activeMethod === method.id
                      ? "border-emerald-500 bg-emerald-50"
                      : method.available
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeMethod === method.id
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <method.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                    {!method.available && (
                      <span className="inline-block mt-1 text-xs text-red-600 font-medium">
                        Segera Hadir
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detail Pembayaran</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Zakat
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Zakat Penghasilan</option>
                  <option>Zakat Maal</option>
                  <option>Zakat Fitrah</option>
                  <option>Infaq/Sedekah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Masukkan nominal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                {amount && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formatRupiah(parseFloat(amount))}
                  </p>
                )}
              </div>

              {activeMethod === "transfer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Transfer ke Rekening:
                  </p>
                  {bankAccounts.map((acc, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 mb-2 last:mb-0">
                      <p className="text-xs text-gray-600">{acc.bank}</p>
                      <p className="font-bold text-gray-900 text-lg">{acc.norek}</p>
                      <p className="text-xs text-gray-600">a.n. {acc.atas}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan catatan jika diperlukan"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Proses Pembayaran
              </button>
            </form>
          </div>
        </div>

        {/* Summary & Info */}
        <div className="space-y-6">
          {/* Quick Calculation */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <HandCoins size={20} />
              <h3 className="font-semibold">Kalkulator Cepat</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-emerald-100">2.5% Zakat Penghasilan</p>
                <p className="text-2xl font-bold mt-1">
                  {amount ? formatRupiah(parseFloat(amount)) : "Rp 0"}
                </p>
              </div>
              <p className="text-emerald-100 text-xs">
                Masukkan nominal di form samping untuk melihat perhitungan
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips Pembayaran</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Simpan bukti transfer untuk verifikasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Pembayaran akan diproses maksimal 1x24 jam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Bukti pembayaran dapat diunduh di menu Riwayat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
