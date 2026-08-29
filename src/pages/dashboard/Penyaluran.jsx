import { useState, useEffect, useCallback } from "react";
import {
  ArrowUpFromLine, Plus, Download,
  TrendingUp, HandCoins, Users,
  X, Trash2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Combobox from "../../components/common/Combobox";
import StatCard from "../../components/dashboard/StatCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Pagination, SearchInput, FilterSelect, inputCls } from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import { getMustahikOptions } from "../../services/mustahikService";
import { getPenyaluran, savePenyaluran, deleteTransaksi } from "../../services/transaksiService";
import { getUser } from "../../services/authService";
import { getProgramOptions } from "../../services/programService";
import { NumericFormat } from "react-number-format";

// ── Konstanta ─────────────────────────────────────────────────────────────────
const THIS_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = [
  { label: "Semua Tahun", value: 0 },
  ...Array.from({ length: 5 }, (_, i) => ({
    label: `Tahun ${THIS_YEAR - i}`,
    value: THIS_YEAR - i,
  })),
];

const BULAN_OPTIONS = [
  { label: "Semua Bulan", value: 0 },
  { label: "Januari",   value: 1 },  { label: "Februari",  value: 2 },
  { label: "Maret",     value: 3 },  { label: "April",     value: 4 },
  { label: "Mei",       value: 5 },  { label: "Juni",      value: 6 },
  { label: "Juli",      value: 7 },  { label: "Agustus",   value: 8 },
  { label: "September", value: 9 },  { label: "Oktober",   value: 10 },
  { label: "November",  value: 11 }, { label: "Desember",  value: 12 },
];
// ── Modal Tambah ──────────────────────────────────────────────────────────────
function ModalTambah({ onClose, onSaved }) {
  const [mustahik, setMustahik] = useState(null);
  const [programOptions, setProgramOptions] = useState([]);
  const [form, setForm] = useState({
    program_id: "", nominal: "", metode: "Transfer Bank", keterangan: "",
  });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const year = new Date().getFullYear();
        const data = await getProgramOptions(year);
        setProgramOptions(data);
        if (data.length > 0) {
          setForm(f => ({ ...f, program_id: data[0].id }));
        }
      } catch (err) {
        console.error("Gagal memuat program penyaluran:", err);
      }
    }
    loadPrograms();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mustahik) { setError("Pilih mustahik / penerima terlebih dahulu."); return; }
    if (!form.program_id) { setError("Pilih program terlebih dahulu."); return; }
    if (!form.nominal || Number(form.nominal) <= 0) { setError("Nominal harus diisi dan lebih dari 0."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await savePenyaluran({ mustahik_id: mustahik.id, ...form });
      onSaved?.(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Tambah Penyaluran</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mustahik / Penerima</label>
              <Combobox
                value={mustahik}
                onChange={(v) => { setMustahik(v); setError(""); }}
                onSearch={getMustahikOptions}
                placeholder="Ketik nama mustahik..."
              />
              {mustahik?.no_hp && (
                <p className="text-xs text-gray-400 mt-1 ml-1">{mustahik.no_hp} {mustahik.alamat ? `· ${mustahik.alamat}` : ""}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Penyaluran</label>
                <select
                  value={form.program_id} onChange={(e) => setForm({ ...form, program_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
                >
                  {programOptions.length === 0 ? (
                    <option value="">Tidak ada program aktif</option>
                  ) : (
                    programOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama} ({p.kode})</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
                <NumericFormat
                  placeholder="0"
                  value={form.nominal}
                  onValueChange={(values) => setForm({ ...form, nominal: values.value })}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Metode</label>
                <select
                  value={form.metode} onChange={(e) => setForm({ ...form, metode: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
                >
                  {["Transfer Bank", "Tunai", "Cek"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
              <textarea
                rows={2} placeholder="Opsional"
                value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" icon={ArrowUpFromLine} className="!bg-red-500 hover:!bg-red-600" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Detail ──────────────────────────────────────────────────────────────
function ModalDetail({ row, onClose, onDelete, isAdmin }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Detail Transaksi</p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">{row.kode}</h3>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 text-sm text-gray-700">
          {[
            ["Nama", row.nama ?? "-"],
            ["Program", row.program || "—"],
            ["Keterangan", row.keterangan || "—"],
            ["Nominal", `−${formatRupiah(row.nominal)}`],
            ["Tanggal", new Date(row.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
            ["Metode Pembayaran", row.metode || "—"],
          ].map(([label, val]) => (
            <div key={label} className="flex items-start justify-between gap-3">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-900 text-right max-w-[60%]">{val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Status</span>
            <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700">
              Keluar
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between gap-3">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => onDelete?.(row)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
            >
              <Trash2 size={14} /> Hapus Transaksi
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Penyaluran() {
  const user = getUser();
  const isAdmin = user?.role === "administrator";
  const [data, setData]     = useState([]);
  const [meta, setMeta]     = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bulan, setBulan]   = useState(0);
  const [tahun, setTahun]   = useState(0);
  const [page, setPage]     = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPenyaluran({ search, bulan, tahun, page, perPage: 10 });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, bulan, tahun, page]);

  async function handleConfirmDelete() {
    if (!rowToDelete?.id) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteTransaksi(rowToDelete.id);
      setRowToDelete(null);
      if (detailRow?.id === rowToDelete.id) {
        setDetailRow(null);
      }
      setToastMsg("Transaksi penyaluran berhasil dihapus.");
      setTimeout(() => setToastMsg(""), 3000);
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

  const [toastMsg, setToastMsg] = useState("");

  function handleExport() {
    if (!data.length) {
      setToastMsg("Tidak ada data penyaluran untuk diekspor.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }
    const headers = ["Kode", "Mustahik", "Program", "Nominal", "Metode", "Tanggal", "Keterangan"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.kode,
        `"${row.nama}"`,
        `"${row.program || "-"}"`,
        row.nominal,
        `"${row.metode || "-"}"`,
        `"${new Date(row.tanggal).toLocaleDateString("id-ID")}"`,
        `"${row.keterangan || "-"}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Penyaluran_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToastMsg("Data penyaluran berhasil diekspor ke CSV!");
    setTimeout(() => setToastMsg(""), 3000);
  }

  return (
    <div>
      {/* Toast Notice */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-medium shadow-lg animate-[fadeIn_0.15s_ease] flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExport} className="hidden sm:inline-flex">Ekspor</Button>
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            Tambah
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={HandCoins}  label="Total Penyaluran" value={meta.total}                          color="amber"   loading={loading} />
        <StatCard icon={TrendingUp} label="Total Disalurkan" value={formatRupiah(meta.total_nominal || 0)} color="emerald" loading={loading} />
        <StatCard icon={Users}      label="Halaman"          value={`${meta.current_page} / ${meta.last_page}`} color="blue" loading={loading} />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama mustahik atau kode..."
          />
          <div className="flex items-center gap-2">
            <FilterSelect value={bulan} onChange={(e) => { setBulan(Number(e.target.value)); setPage(1); }}>
              {BULAN_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </FilterSelect>
            <FilterSelect value={tahun} onChange={(e) => { setTahun(Number(e.target.value)); setPage(1); }}>
              {TAHUN_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Kode", "Mustahik", "Program", "Nominal", "Metode", "Tanggal", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-3 border-gray-200 border-t-red-400 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search ? "Tidak ada data yang cocok." : "Belum ada data penyaluran."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.kode}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-medium">
                        {row.program || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      {formatRupiah(row.nominal)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{row.metode || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(row.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setDetailRow(row)}
                        className="text-xs text-brand-600 font-medium hover:underline"
                      >Detail</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} label="transaksi" />
      </Card>

      {showModal && (
        <ModalTambah
          onClose={() => setShowModal(false)}
          onSaved={() => { setPage(1); fetchData(); }}
        />
      )}
      {detailRow && (
        <ModalDetail
          row={detailRow}
          isAdmin={isAdmin}
          onClose={() => setDetailRow(null)}
          onDelete={(row) => {
            setDeleteError("");
            setRowToDelete(row);
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={!!rowToDelete}
        onClose={() => {
          setRowToDelete(null);
          setDeleteError("");
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi Penyaluran?"
        message={
          rowToDelete ? (
            <span>
              Apakah Anda yakin ingin menghapus transaksi penyaluran <strong>{rowToDelete.kode}</strong> kepada <strong>{rowToDelete.nama}</strong> sebesar <strong>{formatRupiah(rowToDelete.nominal || 0)}</strong>? Tindakan ini akan mengoreksi total penyaluran kas.
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
