import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarRange,
  ChevronDown,
  Download,
  Eye,
  Search,
  Wallet,
  X,
} from "lucide-react";

const mockTransactions = [
  {
    id: "TRX-20250512-001",
    date: "12 Mei 2025",
    dateIso: "2025-05-12",
    time: "09:15 WIB",
    jenis: "Zakat Fitrah",
    kategori: "Dana Zakat",
    keterangan: "Pembayaran zakat fitrah mahasiswa baru",
    payment: "Transfer Bank",
    amount: 2500000,
    status: "Masuk",
  },
  {
    id: "TRX-20250513-004",
    date: "13 Mei 2025",
    dateIso: "2025-05-13",
    time: "14:40 WIB",
    jenis: "Infaq Jumat",
    kategori: "Dana Infaq",
    keterangan: "Donasi rutin Jumat untuk kemaslahatan masjid",
    payment: "E-Wallet",
    amount: 1800000,
    status: "Masuk",
  },
  {
    id: "TRX-20250515-011",
    date: "15 Mei 2025",
    dateIso: "2025-05-15",
    time: "08:10 WIB",
    jenis: "Bantuan Mustahik",
    kategori: "Penyaluran Zakat",
    keterangan: "Pembelian bahan sembako untuk keluarga terdampak",
    payment: "Kas Tunai",
    amount: 3500000,
    status: "Keluar",
  },
  {
    id: "TRX-20250517-019",
    date: "17 Mei 2025",
    dateIso: "2025-05-17",
    time: "12:25 WIB",
    jenis: "Sedekah Umum",
    kategori: "Dana Sosial",
    keterangan: "Donatur umum melalui QRIS untuk bantuan pendidikan",
    payment: "QRIS",
    amount: 1200000,
    status: "Masuk",
  },
  {
    id: "TRX-20250519-023",
    date: "19 Mei 2025",
    dateIso: "2025-05-19",
    time: "16:55 WIB",
    jenis: "Biaya Operasional",
    kategori: "Pengeluaran Internal",
    keterangan: "Pembelian perlengkapan kegiatan pengelolaan zakat",
    payment: "Transfer Bank",
    amount: 4700000,
    status: "Keluar",
  },
  {
    id: "TRX-20250521-028",
    date: "21 Mei 2025",
    dateIso: "2025-05-21",
    time: "10:05 WIB",
    jenis: "Infaq Ramadan",
    kategori: "Dana Infaq",
    keterangan: "Donasi dukungan program berbuka puasa & takjil",
    payment: "Bank Transfer",
    amount: 4200000,
    status: "Masuk",
  },
  {
    id: "TRX-20250524-032",
    date: "24 Mei 2025",
    dateIso: "2025-05-24",
    time: "11:20 WIB",
    jenis: "Bantuan Kesehatan",
    kategori: "Penyaluran Zakat",
    keterangan: "Pendanaan pemeriksaan medis dan obat untuk mustahik",
    payment: "Kas Tunai",
    amount: 2900000,
    status: "Keluar",
  },
  {
    id: "TRX-20250528-035",
    date: "28 Mei 2025",
    dateIso: "2025-05-28",
    time: "18:30 WIB",
    jenis: "Zakat Profesi",
    kategori: "Dana Zakat",
    keterangan: "Zakat profesi pegawai dan dosen aktif",
    payment: "Transfer Bank",
    amount: 6800000,
    status: "Masuk",
  },
];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Transaksi() {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReportMenu, setShowReportMenu] = useState(false);

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return mockTransactions.filter((item) => {
      const itemDate = new Date(`${item.dateIso}T00:00:00`);
      const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
      const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

      const matchesDate =
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
      const matchesJenis =
        jenisFilter === "Semua" || item.kategori === jenisFilter;
      const matchesStatus =
        statusFilter === "Semua" || item.status === statusFilter;
      const matchesSearch =
        !q ||
        [item.id, item.kategori, item.keterangan, item.jenis].some((value) =>
          value.toLowerCase().includes(q)
        );

      return matchesDate && matchesJenis && matchesStatus && matchesSearch;
    });
  }, [dateFrom, dateTo, jenisFilter, statusFilter, search]);

  const summary = useMemo(() => {
    const total = filteredTransactions.length;
    const masuk = filteredTransactions
      .filter((item) => item.status === "Masuk")
      .reduce((sum, item) => sum + item.amount, 0);
    const keluar = filteredTransactions
      .filter((item) => item.status === "Keluar")
      .reduce((sum, item) => sum + item.amount, 0);

    return { total, masuk, keluar };
  }, [filteredTransactions]);

  const summaryCards = [
    {
      label: "Total Transaksi Bulan Ini",
      value: `${summary.total} Transaksi`,
      meta: `${summary.total > 0 ? "Data aktif" : "Tidak ada data"} untuk filter saat ini`,
      icon: Wallet,
      accent: "green",
    },
    {
      label: "Total Kas Masuk",
      value: formatRupiah(summary.masuk),
      meta: "Jumlah penerimaan berdasarkan filter",
      icon: ArrowDownLeft,
      accent: "green",
    },
    {
      label: "Total Kas Keluar",
      value: formatRupiah(summary.keluar),
      meta: "Jumlah pengeluaran berdasarkan filter",
      icon: ArrowUpRight,
      accent: "amber",
    },
  ];

  function handleDownloadReport(format) {
    const label = format === "pdf" ? "PDF" : "Excel";
    window.alert(`Laporan transaksi berhasil diunduh dalam format ${label}.`);
    setShowReportMenu(false);
  }

  function handleResetDateFilter() {
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Manajemen Transaksi Keuangan
        </h1>
        <p className="text-sm text-gray-500">
          Pantau seluruh aliran dana masuk dan keluar dari program zakat, infaq,
          serta penyaluran sosial UPZ Universitas Siliwangi.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {summaryCards.map(({ label, value, meta, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h2>
                <p
                  className={`text-xs font-medium ${
                    accent === "amber" ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {meta}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  accent === "amber"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <Icon size={22} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-3 w-full xl:w-auto">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Rentang Tanggal
              </span>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={handleResetDateFilter}
                  className="text-xs font-medium text-brand-700 hover:text-brand-800"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row w-full xl:w-auto">
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 min-w-0 flex-1 sm:flex-none">
                <CalendarRange size={17} className="text-brand-600 shrink-0" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                />
              </label>
              <span className="flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                —
              </span>
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 min-w-0 flex-1 sm:flex-none">
                <CalendarRange size={17} className="text-brand-600 shrink-0" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 sm:flex-row sm:flex-wrap xl:flex-1 xl:justify-end">
            <div className="w-full sm:w-[180px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Jenis Dana
              </label>
              <div className="relative">
                <select
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option>Semua</option>
                  <option>Dana Zakat</option>
                  <option>Dana Infaq</option>
                  <option>Penyaluran Zakat</option>
                  <option>Dana Sosial</option>
                  <option>Pengeluaran Internal</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="w-full sm:w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option>Semua</option>
                  <option>Masuk</option>
                  <option>Keluar</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="relative flex-1 min-w-[180px] xl:max-w-[260px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cari
              </label>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pencarian"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 opacity-0 sm:opacity-0">
                Aksi
              </label>
              <button
                onClick={() => setShowReportMenu((prev) => !prev)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:w-auto"
              >
                <Download size={16} />
                Unduh Laporan
              </button>

              {showReportMenu && (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleDownloadReport("pdf")}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Unduh PDF</span>
                    <Download size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadReport("excel")}
                    className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>Unduh Excel</span>
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tanggal & Waktu</th>
                <th className="px-4 py-3">Jenis / Kategori</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3">Metode Pembayaran</th>
                <th className="px-4 py-3">Jumlah (Rp)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 align-top text-sm text-gray-700"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900">{row.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800">{row.date}</div>
                      <div className="mt-1 text-xs text-gray-500">{row.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                          {row.jenis}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">{row.kategori}</div>
                    </td>
                    <td className="px-4 py-4 max-w-[280px] text-gray-600">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{row.payment}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {row.status === "Masuk" ? "+" : "-"}
                      {formatRupiah(row.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "Masuk"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedTransaction(row)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-brand-300 hover:text-brand-700"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada transaksi yang cocok dengan filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Detail Transaksi
                </p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedTransaction.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
                aria-label="Tutup detail transaksi"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 text-sm text-gray-700">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Tanggal & Waktu</span>
                <span className="font-semibold text-gray-900">
                  {selectedTransaction.date} • {selectedTransaction.time}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Jenis / Kategori</span>
                <span className="font-semibold text-gray-900">
                  {selectedTransaction.jenis} / {selectedTransaction.kategori}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500">Keterangan</span>
                <span className="max-w-[60%] text-right font-medium text-gray-900">
                  {selectedTransaction.keterangan}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-semibold text-gray-900">
                  {selectedTransaction.payment}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Jumlah</span>
                <span className="font-bold text-gray-900">
                  {selectedTransaction.status === "Masuk" ? "+" : "-"}
                  {formatRupiah(selectedTransaction.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Status</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    selectedTransaction.status === "Masuk"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
