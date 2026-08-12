import { useState, useEffect, useCallback } from "react";
import {
  ArrowUpFromLine, Plus, Search, Download,
  TrendingUp, HandCoins, Users, Target,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Combobox from "../../components/common/Combobox";
import { formatRupiah } from "../../utils/formatRupiah";
import { getMustahikOptions } from "../../services/mustahikService";
import { getPenyaluran, savePenyaluran } from "../../services/transaksiService";
import { getProgramOptions } from "../../services/programService";
import { NumericFormat } from "react-number-format";
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-[fadeInUp_0.2s_ease]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Tambah Penyaluran</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
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
              {mustahik?.kategori && (
                <p className="text-xs text-gray-400 mt-1 ml-1">{mustahik.kategori}</p>
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
function ModalDetail({ row, onClose }) {
  const fields = [
    { label: "Kode",       value: row.kode },
    { label: "Mustahik",   value: row.nama },
    { label: "Program",    value: row.program || "—" },
    { label: "Nominal",    value: formatRupiah(row.nominal) },
    { label: "Metode",     value: row.metode || "—" },
    { label: "Tanggal",    value: new Date(row.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) },
    { label: "Keterangan", value: row.keterangan || "—" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-[fadeInUp_0.2s_ease]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Detail Penyaluran</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-400 shrink-0">{label}</span>
              <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Penyaluran() {
  const [data, setData]     = useState([]);
  const [meta, setMeta]     = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPenyaluran({ search, page, perPage: 10 });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  function handleExport() {
    if (!data.length) return alert("Tidak ada data untuk diekspor");
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
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExport} className="hidden sm:inline-flex">Ekspor</Button>
          <Button icon={Plus} className="!bg-red-500 hover:!bg-red-600" onClick={() => setShowModal(true)}>
            Tambah
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="!p-5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-50 text-red-500 mb-3">
            <HandCoins size={20} />
          </div>
          <p className="text-sm text-gray-500">Total Penyaluran</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{meta.total}</p>
          <p className="text-xs text-gray-400 mt-1">Data dari database</p>
        </Card>
        <Card className="!p-5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm text-gray-500">Total Disalurkan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatRupiah(meta.total_nominal || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Data dari database</p>
        </Card>
        <Card className="!p-5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 mb-3">
            <Users size={20} />
          </div>
          <p className="text-sm text-gray-500">Halaman</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{meta.current_page} / {meta.last_page}</p>
          <p className="text-xs text-gray-400 mt-1">Navigasi tabel</p>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Cari nama mustahik atau kode..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
            />
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

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Total {meta.total} transaksi • Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                const n = meta.current_page <= 3 ? i + 1
                  : meta.current_page >= meta.last_page - 2 ? meta.last_page - 4 + i
                  : meta.current_page - 2 + i;
                return (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition ${n === page ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <ModalTambah
          onClose={() => setShowModal(false)}
          onSaved={() => { setPage(1); fetchData(); }}
        />
      )}
      {detailRow && <ModalDetail row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  );
}
