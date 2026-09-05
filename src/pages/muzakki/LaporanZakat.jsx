import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, PieChart } from "lucide-react";

export default function LaporanZakat() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const years = ["2025", "2024", "2023"];
  const months = [
    { value: "all", label: "Semua Bulan" },
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const summary = {
    totalZakat: 6000000,
    totalTransaksi: 12,
    zakatPenghasilan: 6000000,
    zakatMaal: 0,
    zakatFitrah: 0,
  };

  const monthlyData = [
    { bulan: "Jan", nominal: 500000 },
    { bulan: "Feb", nominal: 500000 },
    { bulan: "Mar", nominal: 500000 },
    { bulan: "Apr", nominal: 500000 },
    { bulan: "Mei", nominal: 500000 },
    { bulan: "Jun", nominal: 500000 },
    { bulan: "Jul", nominal: 500000 },
    { bulan: "Agu", nominal: 500000 },
    { bulan: "Sep", nominal: 500000 },
    { bulan: "Okt", nominal: 0 },
    { bulan: "Nov", nominal: 0 },
    { bulan: "Des", nominal: 0 },
  ];

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadReport = () => {
    alert(`Laporan zakat tahun ${selectedYear} akan diunduh`);
  };

  const maxNominal = Math.max(...monthlyData.map((d) => d.nominal));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Zakat</h1>
          <p className="text-sm text-gray-500 mt-1">
            Lihat ringkasan dan laporan pembayaran zakat Anda
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          <Download size={16} />
          Unduh Laporan
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Periode:</span>
        </div>
        <div className="flex gap-3 flex-1">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <p className="text-sm text-emerald-100">Total Zakat {selectedYear}</p>
          </div>
          <p className="text-2xl font-bold">{formatRupiah(summary.totalZakat)}</p>
          <p className="text-xs text-emerald-100 mt-1">{summary.totalTransaksi} transaksi</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Zakat Penghasilan</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatPenghasilan)}
          </p>
          <p className="text-xs text-emerald-600 mt-1">100%</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Zakat Maal</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatMaal)}
          </p>
          <p className="text-xs text-gray-500 mt-1">0%</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Zakat Fitrah</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatFitrah)}
          </p>
          <p className="text-xs text-gray-500 mt-1">0%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Grafik Pembayaran Bulanan</h3>
          </div>

          <div className="space-y-3">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">{data.bulan}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-3"
                    style={{
                      width: data.nominal > 0 ? `${(data.nominal / maxNominal) * 100}%` : "0%",
                    }}
                  >
                    {data.nominal > 0 && (
                      <span className="text-xs font-semibold text-white">
                        {formatRupiah(data.nominal)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-6">
          {/* Pie Chart Representation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Distribusi Zakat</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-700">Zakat Penghasilan</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">Zakat Maal</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Zakat Fitrah</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">0%</span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Ekspor Laporan</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 text-left">
                📄 Download PDF
              </button>
              <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 text-left">
                📊 Download Excel
              </button>
              <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 text-left">
                📧 Kirim via Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
