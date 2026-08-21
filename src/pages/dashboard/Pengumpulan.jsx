import { useState, useEffect, useCallback } from "react";
import {
  ArrowDownToLine, Plus, Search,
  Download, TrendingUp, Wallet, Users,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Combobox from "../../components/common/Combobox";
import StatCard from "../../components/dashboard/StatCard";
import { Pagination, SearchInput, FilterSelect, Modal, FormField, inputCls } from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import { getMuzakkiOptions } from "../../services/muzakkiService";
import { getPengumpulan, savePengumpulan } from "../../services/transaksiService";
import { useSettings, getSettings } from "../../services/settingService";
import { NumericFormat } from "react-number-format";
// ── Konstanta ─────────────────────────────────────────────────────────────────
const BULAN_OPTIONS = [
  { label: "Semua Bulan", value: 0 },
  { label: "Januari",   value: 1 },  { label: "Februari",  value: 2 },
  { label: "Maret",     value: 3 },  { label: "April",     value: 4 },
  { label: "Mei",       value: 5 },  { label: "Juni",      value: 6 },
  { label: "Juli",      value: 7 },  { label: "Agustus",   value: 8 },
  { label: "September", value: 9 },  { label: "Oktober",   value: 10 },
  { label: "November",  value: 11 }, { label: "Desember",  value: 12 },
];

const KATEGORI_BADGE = {
  "Zakat Fitrah": "bg-green-50 text-green-700",
  "Zakat Maal":   "bg-emerald-50 text-emerald-700",
  Infaq:          "bg-blue-50 text-blue-700",
  Sedekah:        "bg-purple-50 text-purple-700",
  "Dana Lainnya": "bg-gray-100 text-gray-600",
};

// ── Modal Tambah ──────────────────────────────────────────────────────────────
function ModalTambah({ onClose, onSaved }) {
  const [muzakki, setMuzakki] = useState(null);
  const kategoriOptions = getSettings()?.kategori?.jenisDanaList || ["Zakat Fitrah", "Zakat Maal", "Infaq", "Sedekah", "Dana Lainnya"];
  const [form, setForm] = useState({
    kategori: kategoriOptions[0] || "Zakat Fitrah", nominal: "", metode: "Transfer Bank", keterangan: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!muzakki) { setError("Pilih muzakki terlebih dahulu."); return; }
    if (!form.nominal || Number(form.nominal) <= 0) { setError("Nominal harus diisi dan lebih dari 0."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await savePengumpulan({ muzakki_id: muzakki.id, ...form });
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
          <h2 className="font-semibold text-gray-900">Tambah Pengumpulan</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Muzakki</label>
              <Combobox
                value={muzakki}
                onChange={(v) => { setMuzakki(v); setError(""); }}
                onSearch={getMuzakkiOptions}
                placeholder="Ketik nama muzakki..."
              />
              {muzakki?.unit_kerja && (
                <p className="text-xs text-gray-400 mt-1 ml-1">{muzakki.unit_kerja}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <select
                  value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  className={inputCls}
                >
                  {kategoriOptions.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Metode</label>
                <select
                  value={form.metode} onChange={(e) => setForm({ ...form, metode: e.target.value })}
                  className={inputCls}
                >
                  {["Transfer Bank", "Tunai", "QRIS"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
              <NumericFormat
                placeholder="0"
                value={form.nominal}
                onValueChange={(values) => setForm({ ...form, nominal: values.value })}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
              <textarea
                rows={2} placeholder="Opsional"
                value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" icon={ArrowDownToLine} disabled={loading}>
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
    { label: "Muzakki",    value: row.nama },
    { label: "Kategori",   value: row.kategori },
    { label: "Nominal",    value: formatRupiah(row.nominal) },
    { label: "Metode",     value: row.metode || "—" },
    { label: "Tanggal",    value: new Date(row.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) },
    { label: "Keterangan", value: row.keterangan || "—" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 mb-0.5">Detail</p>
            <h2 className="font-semibold text-gray-900">Transaksi Pengumpulan</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition">
            <X size={16} />
          </button>
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
export default function Pengumpulan() {
  const settings = useSettings();
  const kategoriOptions = settings?.kategori?.jenisDanaList || ["Zakat Fitrah", "Zakat Maal", "Infaq", "Sedekah", "Dana Lainnya"];
  const [data, setData]   = useState([]);
  const [meta, setMeta]   = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [kategori, setKategori] = useState("");
  const [bulan, setBulan]     = useState(0);
  const [page, setPage]       = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPengumpulan({ search, kategori, bulan, page, perPage: 10 });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, kategori, bulan, page]);

  // Debounce search, langsung untuk filter lainnya
  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  function handleExport() {
    if (!data.length) return alert("Tidak ada data untuk diekspor");
    const headers = ["Kode", "Muzakki", "Kategori", "Nominal", "Metode", "Tanggal", "Keterangan"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.kode,
        `"${row.nama}"`,
        `"${row.kategori}"`,
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
    link.download = `Data_Pengumpulan_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExport} className="hidden sm:inline-flex">Ekspor</Button>
          <Button icon={Plus} onClick={() => setShowModal(true)}>Tambah</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Wallet}    label="Total Transaksi" value={meta.total}                         color="brand"   sub="Terdaftar di database" loading={loading} />
        <StatCard icon={TrendingUp} label="Total Nominal"  value={formatRupiah(meta.total_nominal || 0)} color="emerald" sub="Akumulasi pengumpulan"   loading={loading} />
        <StatCard icon={Users}     label="Halaman"        value={`${meta.current_page} / ${meta.last_page}`} color="blue" sub="Navigasi tabel"      loading={loading} />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama muzakki atau kode..."
          />
          <div className="flex items-center gap-2">
            <FilterSelect value={kategori} onChange={(e) => { setKategori(e.target.value); setPage(1); }}>
              <option value="">Semua Kategori</option>
              {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </FilterSelect>
            <FilterSelect value={bulan} onChange={(e) => { setBulan(Number(e.target.value)); setPage(1); }}>
              {BULAN_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Kode", "Muzakki", "Kategori", "Nominal", "Metode", "Tanggal", ""].map((h) => (
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
                    <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search || kategori || bulan ? "Tidak ada data yang cocok dengan filter." : "Belum ada data pengumpulan."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.kode}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{row.nama}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${KATEGORI_BADGE[row.kategori] ?? "bg-gray-100 text-gray-600"}`}>
                        {row.kategori}
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
      {detailRow && <ModalDetail row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  );
}
