import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Wallet,
  X,
  Trash2,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getAllTransaksi, deleteTransaksi } from "../../services/transaksiService";
import { getUser } from "../../services/authService";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatJam(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

export default function Transaksi() {
  const user = getUser();
  const isAdmin = user?.role === "administrator";

  const [allRows, setAllRows]       = useState([]);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [loading, setLoading]       = useState(true);

  const [jenisFilter, setJenisFilter]   = useState("Semua");
  const [search, setSearch]             = useState("");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 15;

  const [selectedRow, setSelectedRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllTransaksi({
        search,
        dateFrom,
        dateTo,
        jenis: jenisFilter === "Semua" ? "" : jenisFilter,
      });
      setAllRows(res.rows);
      setTotalMasuk(res.totalMasuk);
      setTotalKeluar(res.totalKeluar);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, dateFrom, dateTo, jenisFilter]);

  async function handleConfirmDelete() {
    if (!rowToDelete?.id) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteTransaksi(rowToDelete.id);
      setRowToDelete(null);
      if (selectedRow?.id === rowToDelete.id) {
        setSelectedRow(null);
      }
      fetchData();
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus transaksi.");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  const totalPages = Math.max(1, Math.ceil(allRows.length / PER_PAGE));
  const pagedRows  = useMemo(
    () => allRows.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [allRows, page]
  );

  const summaryCards = [
    {
      label: "Total Transaksi",
      value: `${allRows.length} Transaksi`,
      meta: jenisFilter !== "Semua" ? `Filter: ${jenisFilter}` : "Semua jenis transaksi",
      icon: Wallet,
      accent: "green",
    },
    {
      label: "Total Kas Masuk",
      value: formatRupiah(totalMasuk),
      meta: "Akumulasi seluruh pengumpulan",
      icon: ArrowDownLeft,
      accent: "green",
    },
    {
      label: "Total Kas Keluar",
      value: formatRupiah(totalKeluar),
      meta: "Akumulasi seluruh penyaluran",
      icon: ArrowUpRight,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet}        label="Saldo Bersih"      value={formatRupiah(totalMasuk - totalKeluar)} color="brand"   loading={loading} />
        <StatCard icon={ArrowDownLeft} label="Total Kas Masuk"   value={formatRupiah(totalMasuk)}               color="emerald" loading={loading} />
        <StatCard icon={ArrowUpRight}  label="Total Kas Keluar"  value={formatRupiah(totalKeluar)}              color="amber"   loading={loading} />
      </section>

      {/* Filter Bar */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          {/* Date range */}
          <div className="flex flex-col gap-3 w-full xl:w-auto">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rentang Tanggal</span>
              {(dateFrom || dateTo) && (
                <button type="button" onClick={() => { setDateFrom(""); setDateTo(""); setPage(1); }}
                  className="text-xs font-medium text-brand-700 hover:text-brand-800">
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row w-full xl:w-auto">
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 min-w-0 flex-1 sm:flex-none">
                <CalendarRange size={17} className="text-brand-600 shrink-0" />
                <input type="date" value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                  className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none" />
              </label>
              <span className="flex items-center justify-center text-xs font-semibold text-gray-400">—</span>
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 min-w-0 flex-1 sm:flex-none">
                <CalendarRange size={17} className="text-brand-600 shrink-0" />
                <input type="date" value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                  className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none" />
              </label>
            </div>
          </div>

          {/* Jenis + Search */}
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:flex-wrap xl:flex-1 xl:justify-end">
            <div className="w-full sm:w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
              <div className="relative">
                <select value={jenisFilter}
                  onChange={(e) => { setJenisFilter(e.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option>Semua</option>
                  <option>Masuk</option>
                  <option>Keluar</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="relative flex-1 min-w-[180px] xl:max-w-[260px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Cari</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Kode, nama, keterangan..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Kode", "Nama", "Keterangan", "Nominal", "Tanggal", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data transaksi...</p>
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                    Tidak ada transaksi yang sesuai dengan filter saat ini.
                  </td>
                </tr>
              ) : pagedRows.map((row) => (
                <tr key={`${row.status}-${row.id}`}
                  className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.kode ?? "-"}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{row.nama ?? "-"}</td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-[220px] truncate">{row.keterangan || "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                    {row.status === "Masuk" ? "+" : "−"}{formatRupiah(row.nominal)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {row.tanggal
                      ? new Date(row.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                      : "-"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      row.status === "Masuk" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelectedRow(row)}
                      className="text-xs text-brand-600 font-medium hover:underline">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Halaman {page} dari {totalPages} • Total {allRows.length} transaksi
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const n = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                return (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition ${n === page ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Detail Transaksi</p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">{selectedRow.kode}</h3>
              </div>
              <button type="button" onClick={() => setSelectedRow(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 text-sm text-gray-700">
              {[
                ["Nama", selectedRow.nama ?? "-"],
                ["Kategori", selectedRow.kategori ?? "-"],
                ["Keterangan", selectedRow.keterangan ?? "-"],
                ["Nominal", `${selectedRow.status === "Masuk" ? "+" : "−"}${formatRupiah(selectedRow.nominal)}`],
                ["Tanggal", `${formatTanggal(selectedRow.tanggal)} • ${formatJam(selectedRow.tanggal)}`],
                ["Metode Pembayaran", selectedRow.metode ?? "-"],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[60%]">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  selectedRow.status === "Masuk" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>{selectedRow.status}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between gap-3">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError("");
                    setRowToDelete(selectedRow);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
                >
                  <Trash2 size={14} /> Hapus Transaksi
                </button>
              ) : <div />}
              <button type="button" onClick={() => setSelectedRow(null)}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={!!rowToDelete}
        onClose={() => {
          setRowToDelete(null);
          setDeleteError("");
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Transaksi?"
        message={
          rowToDelete ? (
            <span>
              Apakah Anda yakin ingin menghapus transaksi <strong>{rowToDelete.kode}</strong> (<strong>{rowToDelete.nama}</strong>) sebesar <strong>{formatRupiah(rowToDelete.nominal || 0)}</strong>? Saldo kas dan laporan keuangan akan otomatis terkoreksi kembali.
            </span>
          ) : ""
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
        errorMessage={deleteError}
      />
    </div>
  );
}
