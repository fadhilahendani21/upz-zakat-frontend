import { useState, useEffect, useCallback } from "react";
import {
  Heart, UserCheck, UserX, Plus, Search,
  ChevronLeft, ChevronRight, X, Pencil, Trash2,
  Phone, MapPin,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  getMustahik, createMustahik, updateMustahik, deleteMustahik,
} from "../../services/mustahikService";

// ── Konstanta ─────────────────────────────────────────────────────────────────
const KATEGORI_OPTIONS = [
  "Fakir Miskin", "Gharim", "Muallaf", "Ibnu Sabil", "Fi Sabilillah", "Amil",
];

const KATEGORI_COLORS = {
  "Fakir Miskin":  "bg-red-50 text-red-700",
  "Gharim":        "bg-orange-50 text-orange-700",
  "Muallaf":       "bg-purple-50 text-purple-700",
  "Ibnu Sabil":    "bg-blue-50 text-blue-700",
  "Fi Sabilillah": "bg-green-50 text-green-700",
  "Amil":          "bg-yellow-50 text-yellow-700",
};

function Field({ label, field, type = "text", placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
          ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Modal Form ────────────────────────────────────────────────────────────────
function ModalForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    nama:     initial?.nama ?? "",
    no_hp:    initial?.no_hp ?? "",
    alamat:   initial?.alamat ?? "",
    kategori: initial?.kategori ?? "Fakir Miskin",
    status:   initial?.status ?? "aktif",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim()) errs.nama = "Nama wajib diisi.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) await updateMustahik(initial.id, form);
      else         await createMustahik(form);
      onSaved();
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-[fadeInUp_0.2s_ease]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit Mustahik" : "Tambah Mustahik"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {errors._global && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors._global}
              </div>
            )}

            <Field label="Nama Lengkap *" field="nama" value={form.nama} onChange={set} error={errors.nama} placeholder="Nama mustahik" />
            <Field label="No. HP" field="no_hp" value={form.no_hp} onChange={set} error={errors.no_hp} placeholder="08xxxxxxxxxx" />
            <Field label="Alamat" field="alamat" value={form.alamat} onChange={set} error={errors.alamat} placeholder="Alamat lengkap mustahik" />

            {/* Kategori Asnaf */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Asnaf</label>
              <select
                value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              >
                {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className="flex gap-3">
                {[{ val: "aktif", label: "Aktif" }, { val: "tidak_aktif", label: "Tidak Aktif" }].map(({ val, label }) => (
                  <label key={val} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition
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
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Hapus ───────────────────────────────────────────────────────────────
function ModalHapus({ mustahik, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteMustahik(mustahik.id);
      onDeleted();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-[fadeInUp_0.2s_ease] p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-1">Hapus Mustahik?</h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-800">{mustahik.nama}</span> akan dihapus dari sistem.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Batal</Button>
          <button
            onClick={handleDelete} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Mustahik() {
  const [data, setData]           = useState([]);
  const [meta, setMeta]           = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("");
  const [kategoriFilter, setKategori] = useState("");
  const [page, setPage]           = useState(1);
  const [modalForm, setModalForm] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMustahik({ search, status: statusFilter, kategori: kategoriFilter, page, perPage: 10 });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, kategoriFilter, page]);

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

  const aktif = meta.total_aktif || 0;
  const tidakAktif = meta.total_tidak_aktif || 0;

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Mustahik
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Mustahik", value: meta.total, icon: Heart, color: "red", sub: "Terdaftar di sistem" },
          { label: "Mustahik Aktif", value: aktif, icon: UserCheck, color: "green", sub: "Status aktif" },
          { label: "Tidak Aktif",    value: tidakAktif, icon: UserX, color: "gray", sub: "Perlu ditinjau" },
        ].map((s) => (
          <Card key={s.label} className="!p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3
              ${s.color === "red" ? "bg-red-50 text-red-500" : s.color === "green" ? "bg-brand-50 text-brand-600" : "bg-gray-100 text-gray-500"}`}>
              <s.icon size={20} />
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Cari nama, alamat, atau kategori..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ val: "", label: "Semua" }, { val: "aktif", label: "Aktif" }, { val: "tidak_aktif", label: "Tidak Aktif" }].map(({ val, label }) => (
              <button key={val} onClick={() => { setStatus(val); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${statusFilter === val ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {label}
              </button>
            ))}
            <select
              value={kategoriFilter}
              onChange={(e) => { setKategori(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Nama", "Kontak & Alamat", "Kategori", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center">
                  <div className="w-7 h-7 border-3 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                  {search ? "Tidak ada mustahik yang cocok dengan pencarian." : "Belum ada data mustahik."}
                </td></tr>
              ) : data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm shrink-0">
                        {row.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{row.nama}</p>
                        <p className="text-xs text-gray-400">#{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      {row.no_hp && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={11} className="text-gray-400" /> {row.no_hp}
                        </p>
                      )}
                      {row.alamat && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 max-w-xs truncate">
                          <MapPin size={11} className="text-gray-400 shrink-0" /> {row.alamat}
                        </p>
                      )}
                      {!row.no_hp && !row.alamat && <span className="text-gray-300 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${KATEGORI_COLORS[row.kategori] ?? "bg-gray-100 text-gray-600"}`}>
                      {row.kategori ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.status === "aktif" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {row.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModalForm({ mode: "edit", data: row })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setModalHapus(row)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Halaman {meta.current_page} dari {meta.last_page} • Total {meta.total} mustahik
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
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
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
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
          mustahik={modalHapus}
          onClose={() => setModalHapus(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
