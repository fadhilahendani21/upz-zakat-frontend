import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Info } from "lucide-react";

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

  const nishabEmas = 85 * 1200000; // 85 gram × Rp 1.200.000/gram
  const nishabPerak = 595 * 150000; // 595 gram × Rp 150.000/gram

  const hitungZakatPenghasilan = () => {
    const total =
      parseFloat(penghasilan.gajiPokok || 0) +
      parseFloat(penghasilan.tunjangan || 0) +
      parseFloat(penghasilan.bonus || 0);
    return total >= nishabEmas ? total * 0.025 : 0;
  };

  const hitungZakatMaal = () => {
    const total =
      parseFloat(maal.emas || 0) +
      parseFloat(maal.perak || 0) +
      parseFloat(maal.tabungan || 0) +
      parseFloat(maal.investasi || 0);
    return total >= nishabEmas ? total * 0.025 : 0;
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPenghasilan =
    parseFloat(penghasilan.gajiPokok || 0) +
    parseFloat(penghasilan.tunjangan || 0) +
    parseFloat(penghasilan.bonus || 0);

  const totalMaal =
    parseFloat(maal.emas || 0) +
    parseFloat(maal.perak || 0) +
    parseFloat(maal.tabungan || 0) +
    parseFloat(maal.investasi || 0);

  const zakatPenghasilan = hitungZakatPenghasilan();
  const zakatMaal = hitungZakatMaal();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kalkulator Zakat</h1>
        <p className="text-sm text-gray-500 mt-1">
          Hitung zakat Anda dengan mudah dan akurat
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("penghasilan")}
          className={`px-6 py-3 font-medium text-sm transition ${
            activeTab === "penghasilan"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Zakat Penghasilan
        </button>
        <button
          onClick={() => setActiveTab("maal")}
          className={`px-6 py-3 font-medium text-sm transition ${
            activeTab === "maal"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Zakat Maal
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "penghasilan" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calculator size={18} className="text-emerald-600" />
                Input Penghasilan Bulanan
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Pokok
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={penghasilan.gajiPokok}
                  onChange={(e) =>
                    setPenghasilan({ ...penghasilan, gajiPokok: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tunjangan
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={penghasilan.tunjangan}
                  onChange={(e) =>
                    setPenghasilan({ ...penghasilan, tunjangan: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonus / Pendapatan Lain
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={penghasilan.bonus}
                  onChange={(e) =>
                    setPenghasilan({ ...penghasilan, bonus: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Penghasilan:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatRupiah(totalPenghasilan)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "maal" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" />
                Input Harta (Maal)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai Emas (Rupiah)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={maal.emas}
                  onChange={(e) => setMaal({ ...maal, emas: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai Perak (Rupiah)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={maal.perak}
                  onChange={(e) => setMaal({ ...maal, perak: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tabungan / Deposito
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={maal.tabungan}
                  onChange={(e) => setMaal({ ...maal, tabungan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investasi / Saham
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={maal.investasi}
                  onChange={(e) => setMaal({ ...maal, investasi: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Harta:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatRupiah(totalMaal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {/* Hasil Perhitungan */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} />
              <h3 className="font-semibold">Hasil Perhitungan</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-emerald-100 text-sm">Zakat yang Harus Dibayar</p>
                <p className="text-3xl font-bold mt-1">
                  {activeTab === "penghasilan"
                    ? formatRupiah(zakatPenghasilan)
                    : formatRupiah(zakatMaal)}
                </p>
              </div>
              <div className="pt-3 border-t border-white/20">
                <p className="text-emerald-100 text-xs">Total Harta</p>
                <p className="text-lg font-semibold">
                  {activeTab === "penghasilan"
                    ? formatRupiah(totalPenghasilan)
                    : formatRupiah(totalMaal)}
                </p>
              </div>
              <div>
                <p className="text-emerald-100 text-xs">Persentase Zakat</p>
                <p className="text-lg font-semibold">2.5%</p>
              </div>
            </div>
          </div>

          {/* Nishab Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Informasi Nishab</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Nishab Emas (85 gram)</p>
                <p className="font-semibold text-gray-900">{formatRupiah(nishabEmas)}</p>
              </div>
              <div>
                <p className="text-gray-600">Nishab Perak (595 gram)</p>
                <p className="font-semibold text-gray-900">{formatRupiah(nishabPerak)}</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {activeTab === "penghasilan"
                    ? totalPenghasilan >= nishabEmas
                      ? "✅ Harta Anda sudah mencapai nishab"
                      : "❌ Harta Anda belum mencapai nishab"
                    : totalMaal >= nishabEmas
                    ? "✅ Harta Anda sudah mencapai nishab"
                    : "❌ Harta Anda belum mencapai nishab"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
