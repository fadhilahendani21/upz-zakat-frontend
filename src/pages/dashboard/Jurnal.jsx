import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Receipt,
  Pencil,
  Trash2,
  Eye,
  CalendarRange,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import {
  Pagination,
  SearchInput,
  FilterSelect,
  inputCls,
} from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import {
  getJurnal,
  createJurnal,
  updateJurnal,
  deleteJurnal,
} from "../../services/jurnalService";
import { NumericFormat } from "react-number-format";

const AKUN_PRESETS = [
  { kode: "1-1101", nama: "Kas Bank BSI UPZ", jenis: "masuk" },
  { kode: "1-1102", nama: "Kas Tunai Operasional", jenis: "masuk" },
  { kode: "4-4101", nama: "Penerimaan Zakat Profesi", jenis: "masuk" },
  { kode: "4-4102", nama: "Penerimaan Zakat Maal", jenis: "masuk" },
  { kode: "4-4201", nama: "Penerimaan Infaq & Sedekah", jenis: "masuk" },
  { kode: "4-4301", nama: "Penerimaan Donasi Online", jenis: "masuk" },
  { kode: "5-5101", nama: "Penyaluran Beasiswa Mahasiswa", jenis: "keluar" },
  { kode: "5-5102", nama: "Santunan Fakir Miskin & Dhuafa", jenis: "keluar" },
  { kode: "5-5103", nama: "Bantuan Modal Usaha UMKM", jenis: "keluar" },
  { kode: "5-5104", nama: "Bantuan Kesehatan & Medis", jenis: "keluar" },
  { kode: "5-5201", nama: "Hak Amil & Biaya Operasional", jenis: "keluar" },
];

function formatTanggal(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Modal Tambah / Edit ──────────────────────────────────────────────────────
function ModalForm({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    tanggal: initial?.tanggal ?? new Date().toISOString().split("T")[0],
    jenis: initial?.jenis ?? "masuk",
    kode_akun: initial?.kode_akun ?? "",
    nama_akun: initial?.nama_akun ?? "",
    nominal: initial ? (initial.jenis === "masuk" ? initial.debit : initial.kredit) : "",
    referensi: initial?.referensi ?? "",
    keterangan: initial?.keterangan ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePresetChange(e) {
    const val = e.target.value;
    if (!val) return;
    const found = AKUN_PRESETS.find((p) => p.kode === val);
    if (found) {
      setForm((prev) => ({
        ...prev,
        kode_akun: found.kode,
        nama_akun: found.nama,
        jenis: found.jenis,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama_akun.trim()) {
      setError("Nama akun wajib diisi.");
      return;
    }
    if (!form.nominal || Number(form.nominal) <= 0) {
      setError("Nominal harus diisi dan lebih dari 0.");
      return;
    }

    const payload = {
      tanggal: form.tanggal,
      kode_akun: form.kode_akun || null,
      nama_akun: form.nama_akun,
      jenis: form.jenis,
      debit: form.jenis === "masuk" ? Number(form.nominal) : 0,
      kredit: form.jenis === "keluar" ? Number(form.nominal) : 0,
      referensi: form.referensi || null,
      keterangan: form.keterangan || null,
    };

    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await updateJurnal(initial.id, payload);
      } else {
        await createJurnal(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 mb-0.5">
              Jurnal Pembukuan
            </p>
            <h2 className="font-semibold text-gray-900">
              {isEdit ? "Edit Entri Jurnal" : "Tambah Entri Jurnal"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Quick preset selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Pilihan Akun Cepat
            </label>
            <select
              value={form.kode_akun}
              onChange={handlePresetChange}
              className={inputCls}
            >
              <option value="">-- Pilih dari daftar standar (opsional) --</option>
              {AKUN_PRESETS.map((p) => (
                <option key={p.kode} value={p.kode}>
                  {p.kode} - {p.nama} ({p.jenis === "masuk" ? "Debit/Masuk" : "Kredit/Keluar"})
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal & Jenis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                required
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Posisi / Jenis *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, jenis: "masuk" })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                    form.jenis === "masuk"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Debit (Masuk)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, jenis: "keluar" })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                    form.jenis === "keluar"
                      ? "bg-amber-50 border-amber-500 text-amber-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Kredit (Keluar)
                </button>
              </div>
            </div>
          </div>

          {/* Kode & Nama Akun */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Kode Akun
              </label>
              <input
                type="text"
                placeholder="misal: 1-1101"
                value={form.kode_akun}
                onChange={(e) => setForm({ ...form, kode_akun: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Nama Akun *
              </label>
              <input
                type="text"
                required
                placeholder="misal: Kas Bank BSI UPZ"
                value={form.nama_akun}
                onChange={(e) => setForm({ ...form, nama_akun: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Nominal & No Referensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Nominal (Rp) *
              </label>
              <NumericFormat
                required
                placeholder="Rp 0"
                value={form.nominal}
                onValueChange={(values) => setForm({ ...form, nominal: values.value })}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                No. Referensi / Bukti
              </label>
              <input
                type="text"
                placeholder="misal: TRX-2026-001"
                value={form.referensi}
                onChange={(e) => setForm({ ...form, referensi: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Keterangan Transaksi
            </label>
            <textarea
              rows={2}
              placeholder="Rincian deskripsi transaksi..."
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Entri"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Detail ─────────────────────────────────────────────────────────────
function ModalDetail({ jurnal, onClose }) {
  if (!jurnal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Detail Jurnal
            </p>
            <h2 className="font-semibold text-gray-900 text-base">{jurnal.nama_akun}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Tanggal:</span>
            <span className="font-medium text-gray-900">{formatTanggal(jurnal.tanggal)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Kode Akun:</span>
            <span className="font-mono text-gray-800">{jurnal.kode_akun || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Jenis:</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                jurnal.jenis === "masuk"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {jurnal.jenis === "masuk" ? "Debit (Masuk)" : "Kredit (Keluar)"}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Debit:</span>
            <span className="font-bold text-emerald-600">{formatRupiah(jurnal.debit)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Kredit:</span>
            <span className="font-bold text-amber-600">{formatRupiah(jurnal.kredit)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">No. Referensi:</span>
            <span className="font-mono text-xs text-gray-700">{jurnal.referensi || "—"}</span>
          </div>
          <div className="pt-2">
            <span className="text-gray-500 block mb-1">Keterangan:</span>
            <p className="bg-gray-50 p-3 rounded-lg text-gray-700 text-xs leading-relaxed">
              {jurnal.keterangan || "Tidak ada keterangan."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Hapus ──────────────────────────────────────────────────────────────
function ModalHapus({ jurnal, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteJurnal(jurnal.id);
      onDeleted?.();
      onClose();
    } catch (err) {
      alert(err.message || "Gagal menghapus entri.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-1">Hapus Entri Jurnal?</h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Akun <span className="font-medium text-gray-800">{jurnal.nama_akun}</span> (
          {formatTanggal(jurnal.tanggal)}) akan dihapus dari buku jurnal.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Halaman Utama Jurnal ──────────────────────────────────────────────────────
export default function Jurnal() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    total_debit: 0,
    total_kredit: 0,
    saldo_bersih: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Modals
  const [modalForm, setModalForm] = useState(null); // { mode: 'add' | 'edit', data?: obj }
  const [modalDetail, setModalDetail] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJurnal({
        search,
        jenis: jenisFilter,
        dateFrom,
        dateTo,
        page,
        perPage: 10,
      });
      setData(res.data || []);
      setMeta(
        res.meta || {
          total: 0,
          current_page: 1,
          last_page: 1,
          total_debit: 0,
          total_kredit: 0,
          saldo_bersih: 0,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, jenisFilter, dateFrom, dateTo, page]);

  useEffect(() => {
    const timer = setTimeout(fetchData, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, search]);

  function handleResetFilter() {
    setSearch("");
    setJenisFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-5 -mt-1 gap-2 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Entri Jurnal
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ArrowDownLeft}
          label="Total Debit (Masuk)"
          value={formatRupiah(meta.total_debit ?? 0)}
          color="emerald"
          sub="Penerimaan dana kas"
          loading={loading}
        />
        <StatCard
          icon={ArrowUpRight}
          label="Total Kredit (Keluar)"
          value={formatRupiah(meta.total_kredit ?? 0)}
          color="amber"
          sub="Pengeluaran & penyaluran"
          loading={loading}
        />
        <StatCard
          icon={Wallet}
          label="Posisi Saldo Jurnal"
          value={formatRupiah(meta.saldo_bersih ?? 0)}
          color={(meta.saldo_bersih ?? 0) >= 0 ? "brand" : "red"}
          sub="Debit dikurangi Kredit"
          loading={loading}
        />
        <StatCard
          icon={Receipt}
          label="Total Entri"
          value={`${meta.total ?? 0} Transaksi`}
          color="blue"
          sub="Jumlah baris jurnal tercatat"
          loading={loading}
        />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar Filter */}
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama akun, kode akun, keterangan, atau referensi..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect
              value={jenisFilter}
              onChange={(e) => {
                setJenisFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Posisi</option>
              <option value="masuk">Debit (Masuk)</option>
              <option value="keluar">Kredit (Keluar)</option>
            </FilterSelect>

            {/* Date inputs */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600">
              <CalendarRange size={13} className="text-gray-400 shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs text-gray-700 outline-none"
                title="Dari tanggal"
              />
              <span className="text-gray-300">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs text-gray-700 outline-none"
                title="Sampai tanggal"
              />
            </div>

            {(search || jenisFilter || dateFrom || dateTo) && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-2.5 py-2 text-xs font-medium text-brand-600 hover:text-brand-700 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Akun & Referensi
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Keterangan
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Debit (Rp)
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Kredit (Rp)
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data jurnal...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search || jenisFilter || dateFrom || dateTo
                      ? "Tidak ada entri jurnal yang cocok dengan filter."
                      : "Belum ada entri jurnal yang tercatat."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-600 font-medium">
                      {formatTanggal(row.tanggal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{row.nama_akun}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {row.kode_akun && (
                            <span className="font-mono text-[11px] text-gray-400">
                              {row.kode_akun}
                            </span>
                          )}
                          {row.referensi && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                              {row.referensi}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate text-xs text-gray-600">
                      {row.keterangan || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {row.debit > 0 ? (
                        <span className="font-bold text-emerald-600 text-sm">
                          {formatRupiah(row.debit)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {row.kredit > 0 ? (
                        <span className="font-bold text-amber-600 text-sm">
                          {formatRupiah(row.kredit)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setModalDetail(row)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalForm({ mode: "edit", data: row })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalHapus(row)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          lastPage={meta.last_page}
          total={meta.total}
          onPageChange={setPage}
          label="entri jurnal"
        />
      </Card>

      {/* Modals */}
      {modalForm && (
        <ModalForm
          initial={modalForm.mode === "edit" ? modalForm.data : null}
          onClose={() => setModalForm(null)}
          onSaved={fetchData}
        />
      )}

      {modalDetail && (
        <ModalDetail
          jurnal={modalDetail}
          onClose={() => setModalDetail(null)}
        />
      )}

      {modalHapus && (
        <ModalHapus
          jurnal={modalHapus}
          onClose={() => setModalHapus(null)}
          onDeleted={() => {
            if (data.length === 1 && page > 1) {
              setPage((p) => p - 1);
            } else {
              fetchData();
            }
          }}
        />
      )}
    </div>
  );
}
