import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  GraduationCap, HeartHandshake, HeartPulse, Store,
  FolderKanban, X, Pencil, Trash2,
  Users, Target,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import { Pagination, SearchInput } from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import { getProgram, createProgram, updateProgram, deleteProgram } from "../../services/programService";
import { NumericFormat } from "react-number-format";

// ── Helpers ───────────────────────────────────────────────────────────────────
const THIS_YEAR = new Date().getFullYear();

const ICON_MAP = {
  "Beasiswa Mahasiswa Mustahik": GraduationCap,
  "Santunan Yatim & Dhuafa":     HeartHandshake,
  "Bantuan Kesehatan":           HeartPulse,
  "Bantuan UMKM Mustahik":       Store,
};

const STATUS_BADGE = {
  aktif:   "bg-green-50 text-green-700",
  selesai: "bg-blue-50 text-blue-700",
};

const STATUS_LABEL = { aktif: "Aktif", selesai: "Selesai" };

function ProgressBar({ value, color = "brand" }) {
  const colors = {
    brand: "bg-brand-500",
    green: "bg-green-500",
    blue:  "bg-blue-500",
  };
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${colors[color] ?? colors.brand}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

function Field({ label, field, type = "text", placeholder, required, value, onChange, error, isCurrency }) {
  const className = `w-full px-3 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`;
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {isCurrency ? (
        <NumericFormat
          placeholder={placeholder}
          value={value}
          onValueChange={(values) => onChange(field, values.value)}
          thousandSeparator="."
          decimalSeparator=","
          prefix="Rp "
          className={className}
        />
      ) : (
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(field, e.target.value)}
          className={className}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Modal Form ────────────────────────────────────────────────────────────────
function ModalForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    nama:           initial?.nama ?? "",
    deskripsi:      initial?.deskripsi ?? "",
    target_nominal: initial?.target_nominal ?? "",
    status:         initial?.status ?? "aktif",
    tahun:          initial?.tahun ?? THIS_YEAR,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim())    errs.nama = "Nama program wajib diisi.";
    if (!form.target_nominal || Number(form.target_nominal) <= 0)
      errs.target_nominal = "Target nominal wajib diisi dan lebih dari 0.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        target_nominal: Number(form.target_nominal),
        tahun:          Number(form.tahun),
      };
      if (isEdit) await updateProgram(initial.id, payload);
      else        await createProgram(payload);
      onSaved();
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit Program" : "Tambah Program"}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {errors._global && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors._global}
              </div>
            )}

            <Field label="Nama Program" field="nama" value={form.nama} onChange={set} error={errors.nama} placeholder="Nama program penyaluran" required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
              <textarea
                rows={3} value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                placeholder="Deskripsi singkat program..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Target Nominal (Rp)" field="target_nominal" isCurrency value={form.target_nominal} onChange={set} error={errors.target_nominal} placeholder="0" required />
              <Field label="Tahun" field="tahun" type="number" value={form.tahun} onChange={set} error={errors.tahun} placeholder={String(THIS_YEAR)} />
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-600">
              ℹ️ <strong>Jumlah penerima</strong> dan <strong>nominal disalurkan</strong> dihitung otomatis dari transaksi penyaluran yang terhubung ke program ini.
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-600 mb-2">
                ℹ️ Status akan otomatis menjadi <strong>Selesai</strong> ketika target nominal terpenuhi (progress 100%).
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { val: "aktif",   label: "Aktif" },
                  { val: "selesai", label: "Selesai" },
                ].map(({ val, label }) => (
                  <label key={val} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition
                    ${form.status === val ? "bg-brand-50 border-brand-500 text-brand-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    <input type="radio" name="status" value={val} checked={form.status === val}
                      onChange={() => set("status", val)} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Program"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Hapus ───────────────────────────────────────────────────────────────
function ModalHapus({ program, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDelete() {
    setLoading(true);
    setErrorMsg("");
    try {
      await deleteProgram(program.id);
      onDeleted();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menghapus program.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 animate-[scaleUp_0.15s_ease]">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-1">Hapus Program?</h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-800">{program.nama}</span> akan dihapus permanen.
        </p>
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {errorMsg}
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Batal</Button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50">
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Program() {
  const [data, setData]           = useState([]);
  const [meta, setMeta]           = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("aktif");
  const [tahunFilter, setTahun]   = useState(String(THIS_YEAR));
  const [page, setPage]           = useState(1);
  const [modalForm, setModalForm] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProgram({
        search,
        status: statusFilter,
        tahun:  tahunFilter,
        page,
        perPage: 10,
      });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, tahunFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  function handleSaved() { setModalForm(null); fetchData(); }
  function handleDeleted() {
    setModalHapus(null);
    if (data.length === 1 && page > 1) setPage((p) => p - 1);
    else fetchData();
  }

  // Stat summary dari data halaman (bukan all-time, tapi cukup representatif)
  const totalTarget     = data.reduce((s, p) => s + p.target_nominal, 0);
  const totalDisalurkan = data.reduce((s, p) => s + p.nominal_disalurkan, 0);
  const totalPenerima   = data.reduce((s, p) => s + p.jumlah_penerima, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Program
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FolderKanban} label="Total Program"    value={meta.total}                                        color="brand"   loading={loading} />
        <StatCard icon={Users}        label="Total Penerima"   value={`${totalPenerima.toLocaleString("id-ID")} orang`} color="blue"    loading={loading} />
        <StatCard icon={Target}       label="Total Disalurkan" value={formatRupiah(totalDisalurkan)}                    color="emerald" loading={loading} />
      </div>

      {/* Toolbar */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama atau kode program..."
          />
          <div className="flex gap-2 flex-wrap">
            {[{ val: "", label: "Semua Status" }, { val: "aktif", label: "Aktif" }, { val: "selesai", label: "Selesai" }]
              .map(({ val, label }) => (
                <button key={val} onClick={() => { setStatus(val); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${statusFilter === val ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            <select value={tahunFilter} onChange={(e) => { setTahun(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none bg-white">
              <option value="">Semua Tahun</option>
              {Array.from({ length: 4 }, (_, i) => THIS_YEAR - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-5">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm mt-3">Memuat program...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              {search ? "Tidak ada program yang cocok." : "Belum ada program untuk filter ini."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((prog) => {
                const Icon = ICON_MAP[prog.nama] ?? FolderKanban;
                const progressPct = prog.progress;
                // Auto-selesai jika target terpenuhi
                const effectiveStatus = progressPct >= 100 ? "selesai" : prog.status;
                return (
                  <div key={prog.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{prog.nama}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{prog.kode} · {prog.tahun}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[effectiveStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABEL[effectiveStatus] ?? effectiveStatus}
                        </span>
                      </div>
                    </div>

                    {prog.deskripsi && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{prog.deskripsi}</p>
                    )}

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">
                          {formatRupiah(prog.nominal_disalurkan)} disalurkan
                        </span>
                        <span className="font-semibold text-brand-700">{progressPct}%</span>
                      </div>
                      <ProgressBar value={progressPct} />
                      <p className="text-xs text-gray-400 mt-1">Target: {formatRupiah(prog.target_nominal)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users size={12} />
                        <span>{prog.jumlah_penerima.toLocaleString("id-ID")} Penerima</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModalForm({ mode: "edit", data: prog })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setModalHapus(prog)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Pagination page={page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} label="program" />
      </Card>

      {/* Modals */}
      {modalForm && (
        <ModalForm
          initial={modalForm.mode === "edit" ? modalForm.data : null}
          onClose={() => setModalForm(null)}
          onSaved={handleSaved}
        />
      )}
      {modalHapus && (
        <ModalHapus
          program={modalHapus}
          onClose={() => setModalHapus(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
