import { useState } from "react";
import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";

export default function RiwayatPembayaran() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const riwayat = [
    {
      id: 1,
      tanggal: "10 Sep 2025",
      jenis: "Zakat Penghasilan",
      periode: "September 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Lunas",
    },
    {
      id: 2,
      tanggal: "10 Agu 2025",
      jenis: "Zakat Penghasilan",
      periode: "Agustus 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Lunas",
    },
    {
      id: 3,
      tanggal: "10 Jul 2025",
      jenis: "Zakat Penghasilan",
      periode: "Juli 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Lunas",
    },
    {
      id: 4,
      tanggal: "10 Jun 2025",
      jenis: "Zakat Penghasilan",
      periode: "Juni 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Lunas",
    },
    {
      id: 5,
      tanggal: "10 Mei 2025",
      jenis: "Zakat Penghasilan",
      periode: "Mei 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Lunas",
    },
    {
      id: 6,
      tanggal: "10 Apr 2025",
      jenis: "Zakat Penghasilan",
      periode: "April 2025",
      nominal: 500000,
      metode: "Potong Gaji",
      status: "Proses",
    },
  ];

  const filteredRiwayat = riwayat.filter((item) => {
    const keyword = searchTerm.toLowerCase();

    const matchSearch =
      item.jenis.toLowerCase().includes(keyword) ||
      item.periode.toLowerCase().includes(keyword) ||
      item.metode.toLowerCase().includes(keyword);

    const matchStatus =
      filterStatus === "semua" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleView = (item) => {
    alert(
      `Detail Pembayaran\n\nJenis: ${item.jenis}\nPeriode: ${item.periode}\nNominal: ${formatRupiah(
        item.nominal
      )}\nStatus: ${item.status}`
    );
  };

  const handleDownload = (item) => {
    alert(
      `Bukti pembayaran ${item.jenis} periode ${item.periode} akan segera tersedia.`
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* =====================================================
          FILTER & SEARCH
      ===================================================== */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari jenis, periode, atau metode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="text-gray-500 shrink-0"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="semua">Semua Status</option>
              <option value="lunas">Lunas</option>
              <option value="proses">Proses</option>
              <option value="tertunda">Tertunda</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Total Zakat */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4">
          <p className="text-emerald-100 text-xs sm:text-sm">
            Total Zakat 2025
          </p>

          <p className="text-xl sm:text-2xl font-bold mt-1">
            {formatRupiah(6000000)}
          </p>

          <p className="text-emerald-100 text-[11px] sm:text-xs mt-1">
            12 transaksi berhasil
          </p>
        </div>

        {/* Zakat Bulan Ini */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            Zakat Bulan Ini
          </p>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {formatRupiah(500000)}
          </p>

          <div className="flex items-center gap-1 mt-1">
            <CheckCircle
              size={13}
              className="text-emerald-600"
            />

            <p className="text-emerald-600 text-[11px] sm:text-xs font-medium">
              Sudah dibayar
            </p>
          </div>
        </div>

        {/* Metode */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-gray-500 text-xs sm:text-sm">
            Metode Pembayaran
          </p>

          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
            Potong Gaji
          </p>

          <p className="text-gray-500 text-[11px] sm:text-xs mt-1">
            Otomatis setiap bulan
          </p>
        </div>
      </div>

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Daftar Pembayaran
              </h3>

              <p className="text-xs text-gray-500 mt-0.5">
                {filteredRiwayat.length} transaksi ditemukan
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  No
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Tanggal
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Jenis Zakat
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Periode
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Nominal
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Metode
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase">
                  Status
                </th>

                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-600 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRiwayat.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* No */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {idx + 1}
                  </td>

                  {/* Tanggal */}
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.tanggal}
                  </td>

                  {/* Jenis */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {item.jenis}
                    </p>
                  </td>

                  {/* Periode */}
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {item.periode}
                  </td>

                  {/* Nominal */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-emerald-600 whitespace-nowrap">
                      {formatRupiah(item.nominal)}
                    </p>
                  </td>

                  {/* Metode */}
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {item.metode}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                        item.status === "Lunas"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "Proses"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "Lunas" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Clock size={12} />
                      )}

                      {item.status}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleView(item)}
                        title="Lihat detail"
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        title="Download bukti"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRiwayat.length === 0 && (
          <div className="py-10 px-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Search
                size={18}
                className="text-gray-400"
              />
            </div>

            <p className="text-sm font-medium text-gray-700">
              Tidak ada riwayat pembayaran
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}