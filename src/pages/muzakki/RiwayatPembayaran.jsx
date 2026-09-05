import { useState } from "react";
import { Download, Eye, CheckCircle, Clock, Filter, Search } from "lucide-react";

export default function RiwayatPembayaran() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const riwayat = [
    { id: 1, tanggal: "10 Sep 2025", jenis: "Zakat Penghasilan", periode: "September 2025", nominal: 500000, metode: "Potong Gaji", status: "Lunas" },
    { id: 2, tanggal: "10 Agu 2025", jenis: "Zakat Penghasilan", periode: "Agustus 2025", nominal: 500000, metode: "Potong Gaji", status: "Lunas" },
    { id: 3, tanggal: "10 Jul 2025", jenis: "Zakat Penghasilan", periode: "Juli 2025", nominal: 500000, metode: "Potong Gaji", status: "Lunas" },
    { id: 4, tanggal: "10 Jun 2025", jenis: "Zakat Penghasilan", periode: "Juni 2025", nominal: 500000, metode: "Potong Gaji", status: "Lunas" },
    { id: 5, tanggal: "10 Mei 2025", jenis: "Zakat Penghasilan", periode: "Mei 2025", nominal: 500000, metode: "Potong Gaji", status: "Lunas" },
    { id: 6, tanggal: "10 Apr 2025", jenis: "Zakat Penghasilan", periode: "April 2025", nominal: 500000, metode: "Potong Gaji", status: "Proses" },
  ];

  const filteredRiwayat = riwayat.filter((item) => {
    const matchSearch =
      item.jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.periode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "semua" || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Pembayaran</h1>
        <p className="text-sm text-gray-500 mt-1">
          Lihat semua riwayat pembayaran zakat Anda
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari berdasarkan jenis atau periode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="semua">Semua Status</option>
            <option value="lunas">Lunas</option>
            <option value="proses">Proses</option>
            <option value="tertunda">Tertunda</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-5">
          <p className="text-emerald-100 text-sm">Total Zakat 2025</p>
          <p className="text-2xl font-bold mt-1">{formatRupiah(6000000)}</p>
          <p className="text-emerald-100 text-xs mt-1">12 transaksi berhasil</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm">Zakat Bulan Ini</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatRupiah(500000)}</p>
          <p className="text-emerald-600 text-xs mt-1">✓ Sudah dibayar</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm">Metode Pembayaran</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">Potong Gaji</p>
          <p className="text-gray-500 text-xs mt-1">Otomatis setiap bulan</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Jenis Zakat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nominal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Metode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRiwayat.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.tanggal}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.jenis}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.periode}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                    {formatRupiah(item.nominal)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.metode}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === "Lunas"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
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
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRiwayat.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>Tidak ada riwayat pembayaran yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
