import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Info,
} from "lucide-react";

export default function KalkulatorZakat() {
  const [activeTab, setActiveTab] = useState("penghasilan");

  const [penghasilan, setPenghasilan] = useState({
    gajiPokok: "",
    tunjangan: "",
    bonus: "",
  });

  const [maal, setMaal] = useState({
    emas: "",
    perak: "",
    tabungan: "",
    investasi: "",
  });

  // Nishab berdasarkan harga emas dan perak
  const nishabEmas = 85 * 1200000;
  const nishabPerak = 595 * 150000;

  // =========================
  // HITUNG ZAKAT PENGHASILAN
  // =========================
  const totalPenghasilan =
    parseFloat(penghasilan.gajiPokok || 0) +
    parseFloat(penghasilan.tunjangan || 0) +
    parseFloat(penghasilan.bonus || 0);

  const zakatPenghasilan =
    totalPenghasilan >= nishabEmas
      ? totalPenghasilan * 0.025
      : 0;

  // =========================
  // HITUNG ZAKAT MAAL
  // =========================
  const totalMaal =
    parseFloat(maal.emas || 0) +
    parseFloat(maal.perak || 0) +
    parseFloat(maal.tabungan || 0) +
    parseFloat(maal.investasi || 0);

  const zakatMaal =
    totalMaal >= nishabEmas
      ? totalMaal * 0.025
      : 0;

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalAktif =
    activeTab === "penghasilan"
      ? totalPenghasilan
      : totalMaal;

  const zakatAktif =
    activeTab === "penghasilan"
      ? zakatPenghasilan
      : zakatMaal;

  const sudahNishab =
    totalAktif >= nishabEmas;

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* =========================
          TABS
      ========================= */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("penghasilan")}
          className={`px-4 sm:px-6 py-2.5 text-sm font-medium transition ${
            activeTab === "penghasilan"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Zakat Penghasilan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("maal")}
          className={`px-4 sm:px-6 py-2.5 text-sm font-medium transition ${
            activeTab === "maal"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Zakat Maal
        </button>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* =========================
            INPUT
        ========================= */}
        <div className="lg:col-span-2">

          {/* =========================
              ZAKAT PENGHASILAN
          ========================= */}
          {activeTab === "penghasilan" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">

              <div className="flex items-center gap-2">
                <Calculator
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                  Input Penghasilan Bulanan
                </h3>
              </div>

              {/* Gaji Pokok */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Gaji Pokok
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={penghasilan.gajiPokok}
                  onChange={(e) =>
                    setPenghasilan({
                      ...penghasilan,
                      gajiPokok: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Tunjangan */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Total Tunjangan
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={penghasilan.tunjangan}
                  onChange={(e) =>
                    setPenghasilan({
                      ...penghasilan,
                      tunjangan: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Bonus */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Bonus / Pendapatan Lain
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={penghasilan.bonus}
                  onChange={(e) =>
                    setPenghasilan({
                      ...penghasilan,
                      bonus: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Total Penghasilan
                  </span>

                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formatRupiah(totalPenghasilan)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================
              ZAKAT MAAL
          ========================= */}
          {activeTab === "maal" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">

              <div className="flex items-center gap-2">
                <DollarSign
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                  Input Harta (Maal)
                </h3>
              </div>

              {/* Emas */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Nilai Emas (Rupiah)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={maal.emas}
                  onChange={(e) =>
                    setMaal({
                      ...maal,
                      emas: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Perak */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Nilai Perak (Rupiah)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={maal.perak}
                  onChange={(e) =>
                    setMaal({
                      ...maal,
                      perak: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Tabungan */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Tabungan / Deposito
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={maal.tabungan}
                  onChange={(e) =>
                    setMaal({
                      ...maal,
                      tabungan: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Investasi */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Investasi / Saham
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={maal.investasi}
                  onChange={(e) =>
                    setMaal({
                      ...maal,
                      investasi: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Total Harta
                  </span>

                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formatRupiah(totalMaal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            HASIL
        ========================= */}
        <div className="space-y-4">

          {/* Hasil Perhitungan */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-4 sm:p-5 shadow-md">

            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={19} />

              <h3 className="font-semibold text-sm sm:text-base">
                Hasil Perhitungan
              </h3>
            </div>

            <div className="space-y-3">

              <div>
                <p className="text-xs sm:text-sm text-emerald-100">
                  Zakat yang Harus Dibayar
                </p>

                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {formatRupiah(zakatAktif)}
                </p>
              </div>

              <div className="pt-3 border-t border-white/20">
                <p className="text-xs text-emerald-100">
                  {activeTab === "penghasilan"
                    ? "Total Penghasilan"
                    : "Total Harta"}
                </p>

                <p className="text-base sm:text-lg font-semibold">
                  {formatRupiah(totalAktif)}
                </p>
              </div>

              <div>
                <p className="text-xs text-emerald-100">
                  Persentase Zakat
                </p>

                <p className="text-base sm:text-lg font-semibold">
                  2.5%
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              INFORMASI NISHAB
          ========================= */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">

            <div className="flex items-center gap-2 mb-3">
              <Info
                size={18}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Informasi Nishab
              </h3>
            </div>

            <div className="space-y-3">

              {/* Nishab Emas */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Nishab Emas (85 gram)
                </p>

                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {formatRupiah(nishabEmas)}
                </p>
              </div>

              {/* Nishab Perak */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Nishab Perak (595 gram)
                </p>

                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {formatRupiah(nishabPerak)}
                </p>
              </div>

              {/* Status Nishab */}
              <div className="pt-3 border-t border-gray-200">
                <div
                  className={`rounded-lg px-3 py-2 text-xs sm:text-sm ${
                    sudahNishab
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {sudahNishab
                    ? "✅ Harta Anda sudah mencapai nishab"
                    : "❌ Harta Anda belum mencapai nishab"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}