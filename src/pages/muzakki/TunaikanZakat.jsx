import { useState } from "react";
import {
  HandCoins,
  CreditCard,
  Smartphone,
  QrCode,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function TunaikanZakat() {
  const [activeMethod, setActiveMethod] = useState("potong-gaji");
  const [amount, setAmount] = useState("");
  const [jenisZakat, setJenisZakat] = useState("Zakat Penghasilan");
  const [catatan, setCatatan] = useState("");

  // =====================================================
  // METODE PEMBAYARAN
  // =====================================================
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
      available: true,
    },
    {
      id: "qris",
      icon: QrCode,
      label: "QRIS",
      desc: "Scan QR Code untuk pembayaran",
      available: true,
    },
  ];

  // =====================================================
  // REKENING BANK
  // =====================================================
  const bankAccounts = [
    {
      bank: "Bank Syariah Indonesia (BSI)",
      norek: "1234567890",
      atas: "UPZ Universitas Siliwangi",
    },
    {
      bank: "Bank Mandiri Syariah",
      norek: "9876543210",
      atas: "UPZ UNSIL",
    },
  ];

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // =====================================================
  // SUBMIT PEMBAYARAN
  // =====================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Masukkan nominal zakat yang valid!");
      return;
    }

    const selectedMethod = methods.find(
      (method) => method.id === activeMethod
    );

    alert(
      `Pembayaran berhasil diproses!\n\n` +
        `Jenis: ${jenisZakat}\n` +
        `Nominal: ${formatRupiah(amount)}\n` +
        `Metode: ${selectedMethod?.label || "-"}`
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* =====================================================
          INFO BANNER
      ===================================================== */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle size={17} className="text-emerald-600" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-900">
            Untuk Dosen & Staf UNSIL
          </p>

          <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
            Pembayaran zakat penghasilan dapat dilakukan melalui
            potong gaji setiap bulan. Gunakan metode lain untuk
            pembayaran zakat tambahan seperti zakat maal atau
            zakat fitrah.
          </p>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* ===================================================
            LEFT CONTENT
        =================================================== */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* =================================================
              PAYMENT METHOD
          ================================================= */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Pilih Metode Pembayaran
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Pilih metode pembayaran zakat yang tersedia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methods.map((method) => {
                const Icon = method.icon;
                const isActive = activeMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setActiveMethod(method.id)}
                    className={`flex items-start gap-3 p-3.5 border rounded-xl text-left transition ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {method.label}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {method.desc}
                      </p>
                    </div>

                    {isActive && (
                      <CheckCircle
                        size={17}
                        className="text-emerald-600 shrink-0 mt-0.5"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              PAYMENT DETAIL
          ================================================= */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Detail Pembayaran
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Lengkapi informasi pembayaran zakat Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* =================================================
                  JENIS ZAKAT
              ================================================= */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Jenis Zakat
                </label>

                <select
                  value={jenisZakat}
                  onChange={(e) => setJenisZakat(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option>Zakat Penghasilan</option>
                  <option>Zakat Maal</option>
                  <option>Zakat Fitrah</option>
                </select>
              </div>

              {/* =================================================
                  NOMINAL
              ================================================= */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Nominal Zakat
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rp
                  </span>

                  <input
                    type="number"
                    min="1"
                    placeholder="Masukkan nominal zakat"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                {amount && Number(amount) > 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5">
                    {formatRupiah(amount)}
                  </p>
                )}
              </div>

              {/* =================================================
                  TRANSFER BANK
              ================================================= */}
              {activeMethod === "transfer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Transfer ke Rekening UPZ
                  </p>

                  <div className="space-y-2">
                    {bankAccounts.map((account, index) => (
                      <div
                        key={index}
                        className="bg-white border border-blue-100 rounded-lg p-3"
                      >
                        <p className="text-[11px] text-gray-500">
                          {account.bank}
                        </p>

                        <p className="text-base sm:text-lg font-bold text-gray-900 mt-0.5 tracking-wide">
                          {account.norek}
                        </p>

                        <p className="text-[11px] text-gray-500 mt-0.5">
                          a.n. {account.atas}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-blue-700 mt-3 leading-relaxed">
                    Setelah melakukan transfer, simpan bukti pembayaran
                    untuk proses verifikasi.
                  </p>
                </div>
              )}

              {/* =================================================
                  E-WALLET
              ================================================= */}
              {activeMethod === "ewallet" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Smartphone
                        size={17}
                        className="text-purple-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-purple-900">
                        Pembayaran E-Wallet
                      </p>

                      <p className="text-[11px] text-purple-700">
                        Pilih salah satu e-wallet berikut
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* OVO */}
                    <div className="bg-white border border-purple-100 rounded-lg p-3">
                      <p className="text-[11px] text-gray-500">
                        OVO
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        081234567890
                      </p>

                      <p className="text-[11px] text-gray-500 mt-0.5">
                        UPZ Universitas Siliwangi
                      </p>
                    </div>

                    {/* GOPAY */}
                    <div className="bg-white border border-purple-100 rounded-lg p-3">
                      <p className="text-[11px] text-gray-500">
                        GoPay
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        081234567890
                      </p>

                      <p className="text-[11px] text-gray-500 mt-0.5">
                        UPZ Universitas Siliwangi
                      </p>
                    </div>

                    {/* DANA */}
                    <div className="bg-white border border-purple-100 rounded-lg p-3">
                      <p className="text-[11px] text-gray-500">
                        DANA
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        081234567890
                      </p>

                      <p className="text-[11px] text-gray-500 mt-0.5">
                        UPZ Universitas Siliwangi
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-700 mt-3 leading-relaxed">
                    Setelah melakukan pembayaran, simpan bukti
                    pembayaran untuk proses verifikasi.
                  </p>
                </div>
              )}

              {/* =================================================
                  QRIS
              ================================================= */}
              {activeMethod === "qris" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <QrCode
                        size={17}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Pembayaran QRIS
                      </p>

                      <p className="text-[11px] text-emerald-700">
                        Scan QR Code untuk melakukan pembayaran
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white border border-emerald-100 rounded-lg p-5">
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <QrCode
                        size={100}
                        className="text-gray-400"
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-700 mt-3">
                      QRIS UPZ Universitas Siliwangi
                    </p>

                    <p className="text-[11px] text-gray-500 text-center mt-1">
                      Scan QR Code menggunakan aplikasi pembayaran
                      yang mendukung QRIS.
                    </p>
                  </div>

                  <p className="text-[11px] text-emerald-700 mt-3 leading-relaxed">
                    Setelah melakukan pembayaran, simpan bukti
                    pembayaran untuk proses verifikasi.
                  </p>
                </div>
              )}

              {/* =================================================
                  POTONG GAJI
              ================================================= */}
              {activeMethod === "potong-gaji" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Building2
                        size={17}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Potong Gaji
                      </p>

                      <p className="text-[11px] text-emerald-700">
                        Zakat akan dipotong dari gaji bulanan.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 bg-white border border-emerald-100 rounded-lg p-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Metode ini dapat digunakan oleh dosen dan
                      staf UNSIL yang telah terdaftar dalam program
                      potong gaji zakat.
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  CATATAN
              ================================================= */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Catatan{" "}
                  <span className="text-gray-400 font-normal">
                    (Opsional)
                  </span>
                </label>

                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition"
              >
                <HandCoins size={17} />
                Proses Pembayaran
              </button>
            </form>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}
        <div className="space-y-4 sm:space-y-5">
          {/* =================================================
              QUICK CALCULATION
          ================================================= */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <HandCoins size={17} />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold">
                  Kalkulator Cepat
                </h3>

                <p className="text-[11px] text-emerald-100">
                  Perkiraan nominal zakat
                </p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-emerald-100">
                Nominal Zakat
              </p>

              <p className="text-xl sm:text-2xl font-bold mt-1">
                {amount ? formatRupiah(amount) : "Rp 0"}
              </p>
            </div>

            <p className="text-[11px] text-emerald-100 mt-3 leading-relaxed">
              Masukkan nominal zakat pada formulir untuk melihat
              nominal pembayaran.
            </p>
          </div>

          {/* =================================================
              PAYMENT TIPS
          ================================================= */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="text-base">💡</span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Tips Pembayaran
              </h3>
            </div>

            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <span className="text-emerald-600 font-bold">
                  •
                </span>

                <span>
                  Simpan bukti transfer untuk proses verifikasi.
                </span>
              </li>

              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <span className="text-emerald-600 font-bold">
                  •
                </span>

                <span>
                  Pembayaran akan diproses maksimal 1×24 jam.
                </span>
              </li>

              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <span className="text-emerald-600 font-bold">
                  •
                </span>

                <span>
                  Bukti pembayaran dapat dilihat di menu Riwayat
                  Pembayaran.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}