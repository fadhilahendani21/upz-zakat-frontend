import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
} from "lucide-react";

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

  const handleDownloadPDF = () => {
    alert(`Laporan PDF tahun ${selectedYear} akan diunduh`);
  };

  const handleDownloadExcel = () => {
    alert(`Laporan Excel tahun ${selectedYear} akan diunduh`);
  };

  const handleSendEmail = () => {
    alert("Laporan akan dikirim melalui email");
  };

  const maxNominal = Math.max(
    ...monthlyData.map((data) => data.nominal)
  );

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* =========================
          FILTER PERIODE
      ========================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">

          <div className="flex items-center gap-2 shrink-0">
            <Calendar
              size={18}
              className="text-gray-600"
            />

            <span className="text-sm font-medium text-gray-700">
              Periode:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">

            {/* Tahun */}
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

            {/* Bulan */}
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value)
              }
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {months.map((month) => (
                <option
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </option>
              ))}
            </select>

          </div>

          {/* Tombol Unduh */}
          <button
            type="button"
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition shrink-0"
          >
            <Download size={16} />
            <span>Unduh Laporan</span>
          </button>

        </div>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Zakat */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-4 shadow-sm">

          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />

            <p className="text-xs sm:text-sm text-emerald-100">
              Total Zakat {selectedYear}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-bold">
            {formatRupiah(summary.totalZakat)}
          </p>

          <p className="text-xs text-emerald-100 mt-1">
            {summary.totalTransaksi} transaksi
          </p>
        </div>

        {/* Zakat Penghasilan */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <p className="text-xs sm:text-sm text-gray-600">
            Zakat Penghasilan
          </p>

          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatPenghasilan)}
          </p>

          <p className="text-xs text-emerald-600 mt-1">
            100%
          </p>
        </div>

        {/* Zakat Maal */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <p className="text-xs sm:text-sm text-gray-600">
            Zakat Maal
          </p>

          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatMaal)}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            0%
          </p>
        </div>

        {/* Zakat Fitrah */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <p className="text-xs sm:text-sm text-gray-600">
            Zakat Fitrah
          </p>

          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.zakatFitrah)}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            0%
          </p>
        </div>

      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* =========================
            GRAFIK BULANAN
        ========================= */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5">

          <div className="flex items-center gap-2 mb-5">
            <TrendingUp
              size={19}
              className="text-emerald-600"
            />

            <h3 className="font-semibold text-sm sm:text-base text-gray-900">
              Grafik Pembayaran Bulanan
            </h3>
          </div>

          <div className="space-y-3">

            {monthlyData.map((data, index) => {

              const percentage =
                maxNominal > 0
                  ? (data.nominal / maxNominal) * 100
                  : 0;

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3"
                >

                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-7 sm:w-8 shrink-0">
                    {data.bulan}
                  </span>

                  <div className="flex-1 bg-gray-100 rounded-full h-7 sm:h-8 overflow-hidden">

                    {data.nominal > 0 && (
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2 sm:px-3"
                        style={{
                          width: `${percentage}%`,
                        }}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                          {formatRupiah(data.nominal)}
                        </span>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* =========================
            RIGHT CONTENT
        ========================= */}
        <div className="space-y-4">

          {/* =========================
              DISTRIBUSI ZAKAT
          ========================= */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">

            <div className="flex items-center gap-2 mb-4">
              <PieChart
                size={19}
                className="text-emerald-600"
              />

              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Distribusi Zakat
              </h3>
            </div>

            <div className="space-y-3">

              {/* Penghasilan */}
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />

                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Zakat Penghasilan
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  100%
                </span>

              </div>

              {/* Maal */}
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />

                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Zakat Maal
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  0%
                </span>

              </div>

              {/* Fitrah */}
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />

                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Zakat Fitrah
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  0%
                </span>

              </div>

            </div>
          </div>

          {/* =========================
              EKSPOR LAPORAN
          ========================= */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5">

            <div className="flex items-center gap-2 mb-4">
              <FileText
                size={19}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Ekspor Laporan
              </h3>
            </div>

            <div className="space-y-2">

              {/* PDF */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm font-medium text-gray-700 text-left"
              >
                <FileText
                  size={16}
                  className="text-red-500"
                />

                <span>
                  Download PDF
                </span>
              </button>

              {/* Excel */}
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm font-medium text-gray-700 text-left"
              >
                <FileText
                  size={16}
                  className="text-green-600"
                />

                <span>
                  Download Excel
                </span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm font-medium text-gray-700 text-left"
              >
                <span className="text-base">
                  📧
                </span>

                <span>
                  Kirim via Email
                </span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}