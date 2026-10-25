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
    <div className="w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-9">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Tunaikan Zakat
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              Tunaikan zakat Anda melalui UPZ Zakat Universitas Siliwangi
              dengan metode pembayaran yang tersedia. Bersama kita wujudkan
              pengelolaan zakat yang amanah, transparan, dan tepat sasaran.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="w-full space-y-5 p-4 sm:p-6">
        {/* =====================================================
            INFO BANNER
        ===================================================== */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 sm:p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <CheckCircle size={17} className="text-emerald-600" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-900">
              Untuk Dosen &amp; Staf UNSIL
            </p>

            <p className="mt-1 text-xs leading-relaxed text-emerald-800 sm:text-sm">
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
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {/* ===================================================
              LEFT CONTENT
          =================================================== */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-2">
            {/* =================================================
                PAYMENT METHOD
            ================================================= */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Pilih Metode Pembayaran
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Pilih metode pembayaran zakat yang tersedia.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {methods.map((method) => {
                  const Icon = method.icon;
                  const isActive = activeMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setActiveMethod(method.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
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

                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          {method.desc}
                        </p>
                      </div>

                      {isActive && (
                        <CheckCircle
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
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
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Detail Pembayaran
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Lengkapi informasi pembayaran zakat Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* JENIS ZAKAT */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
                    Jenis Zakat
                  </label>

                  <select
                    value={jenisZakat}
                    onChange={(e) => setJenisZakat(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Zakat Penghasilan</option>
                    <option>Zakat Maal</option>
                    <option>Zakat Fitrah</option>
                  </select>
                </div>

                {/* NOMINAL */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
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
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {amount && Number(amount) > 0 && (
                    <p className="mt-1.5 text-xs font-medium text-emerald-600">
                      {formatRupiah(amount)}
                    </p>
                  )}
                </div>

                {/* TRANSFER BANK */}
                {activeMethod === "transfer" && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5">
                    <p className="mb-3 text-sm font-semibold text-blue-900">
                      Transfer ke Rekening UPZ
                    </p>

                    <div className="space-y-2">
                      {bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-blue-100 bg-white p-3"
                        >
                          <p className="text-[11px] text-gray-500">
                            {account.bank}
                          </p>

                          <p className="mt-0.5 text-base font-bold tracking-wide text-gray-900 sm:text-lg">
                            {account.norek}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-500">
                            a.n. {account.atas}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-3 text-[11px] leading-relaxed text-blue-700">
                      Setelah melakukan transfer, simpan bukti pembayaran
                      untuk proses verifikasi.
                    </p>
                  </div>
                )}

                {/* E-WALLET */}
                {activeMethod === "ewallet" && (
                  <div className="rounded-xl border border-purple-200 bg-purple-50 p-3.5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Smartphone size={17} className="text-purple-600" />
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

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {/* OVO */}
                      <div className="rounded-lg border border-purple-100 bg-white p-3">
                        <p className="text-[11px] text-gray-500">OVO</p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          081234567890
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-500">
                          UPZ Universitas Siliwangi
                        </p>
                      </div>

                      {/* GOPAY */}
                      <div className="rounded-lg border border-purple-100 bg-white p-3">
                        <p className="text-[11px] text-gray-500">GoPay</p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          081234567890
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-500">
                          UPZ Universitas Siliwangi
                        </p>
                      </div>

                      {/* DANA */}
                      <div className="rounded-lg border border-purple-100 bg-white p-3">
                        <p className="text-[11px] text-gray-500">DANA</p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          081234567890
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-500">
                          UPZ Universitas Siliwangi
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] leading-relaxed text-purple-700">
                      Setelah melakukan pembayaran, simpan bukti
                      pembayaran untuk proses verifikasi.
                    </p>
                  </div>
                )}

                {/* QRIS */}
                {activeMethod === "qris" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                        <QrCode size={17} className="text-emerald-600" />
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

                    <div className="flex flex-col items-center justify-center rounded-lg border border-emerald-100 bg-white p-5">
                      <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                        <QrCode size={100} className="text-gray-400" />
                      </div>

                      <p className="mt-3 text-xs font-semibold text-gray-700">
                        QRIS UPZ Universitas Siliwangi
                      </p>

                      <p className="mt-1 text-center text-[11px] text-gray-500">
                        Scan QR Code menggunakan aplikasi pembayaran
                        yang mendukung QRIS.
                      </p>
                    </div>

                    <p className="mt-3 text-[11px] leading-relaxed text-emerald-700">
                      Setelah melakukan pembayaran, simpan bukti
                      pembayaran untuk proses verifikasi.
                    </p>
                  </div>
                )}

                {/* POTONG GAJI */}
                {activeMethod === "potong-gaji" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                        <Building2 size={17} className="text-emerald-600" />
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

                    <div className="mt-3 rounded-lg border border-emerald-100 bg-white p-3">
                      <p className="text-xs leading-relaxed text-gray-600">
                        Metode ini dapat digunakan oleh dosen dan
                        staf UNSIL yang telah terdaftar dalam program
                        potong gaji zakat.
                      </p>
                    </div>
                  </div>
                )}

                {/* CATATAN */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
                    Catatan{" "}
                    <span className="font-normal text-gray-400">
                      (Opsional)
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tambahkan catatan jika diperlukan..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.99]"
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
            {/* QUICK CALCULATION */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <HandCoins size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    Kalkulator Cepat
                  </h3>

                  <p className="text-[11px] text-emerald-100">
                    Perkiraan nominal zakat
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xs text-emerald-100">
                  Nominal Zakat
                </p>

                <p className="mt-1 text-xl font-bold sm:text-2xl">
                  {amount ? formatRupiah(amount) : "Rp 0"}
                </p>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-emerald-100">
                Masukkan nominal zakat pada formulir untuk melihat
                nominal pembayaran.
              </p>
            </div>

            {/* PAYMENT TIPS */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <span className="text-base">💡</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  Tips Pembayaran
                </h3>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
                  <span className="font-bold text-emerald-600">•</span>

                  <span>
                    Simpan bukti transfer untuk proses verifikasi.
                  </span>
                </li>

                <li className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
                  <span className="font-bold text-emerald-600">•</span>

                  <span>
                    Pembayaran akan diproses maksimal 1×24 jam.
                  </span>
                </li>

                <li className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
                  <span className="font-bold text-emerald-600">•</span>

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
    </div>
  );
}