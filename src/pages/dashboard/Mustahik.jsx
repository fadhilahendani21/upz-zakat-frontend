import { useState, useEffect, useCallback } from "react";
import {
  Heart, Phone, MapPin, Plus, Users,
  X, Pencil, Trash2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import { Pagination, SearchInput, FilterSelect } from "../../components/dashboard/ui";
import {
  getMustahik, createMustahik, updateMustahik, deleteMustahik,
} from "../../services/mustahikService";
import { getSettings } from "../../services/settingService";

const DEFAULT_ASNAF = [
  "Fakir",
  "Miskin",
  "Gharim",
  "Muallaf",
  "Ibnu Sabil",
  "Fi Sabilillah",
  "Amil",
  "Riqab",
];

const KATEGORI_COLORS = {
  "Fakir":         "bg-red-50 text-red-700 border-red-200",
  "Miskin":        "bg-orange-50 text-orange-700 border-orange-200",
  "Fakir Miskin":  "bg-red-50 text-red-700 border-red-200",
  "Gharim":        "bg-amber-50 text-amber-700 border-amber-200",
  "Muallaf":       "bg-purple-50 text-purple-700 border-purple-200",
  "Ibnu Sabil":    "bg-blue-50 text-blue-700 border-blue-200",
  "Fi Sabilillah": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Amil":          "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Riqab":         "bg-pink-50 text-pink-700 border-pink-200",
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
  const asnafOptions = getSettings()?.kategori?.asnafList || DEFAULT_ASNAF;

  const [form, setForm] = useState({
    nama:     initial?.nama ?? "",
    nik:      initial?.nik ?? "",
    no_hp:    initial?.no_hp ?? "",
    alamat:   initial?.alamat ?? "",
    kategori: initial?.kategori ?? (asnafOptions[0] || "Fakir"),
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
    if (!form.kategori) errs.kategori = "Kategori Asnaf wajib dipilih.";
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
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit Mustahik" : "Tambah Mustahik"}
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

            <Field label="Nama Lengkap *" field="nama" value={form.nama} onChange={set} error={errors.nama} placeholder="Nama lengkap mustahik" />
            <Field label="NIK (Nomor Induk Kependudukan)" field="nik" value={form.nik} onChange={set} error={errors.nik} placeholder="Contoh: 3278011503800001" />

            {/* Kategori Asnaf */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Asnaf *</label>
              <select
                value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white"
              >
                {asnafOptions.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {errors.kategori && <p className="text-xs text-red-500 mt-1">{errors.kategori}</p>}
            </div>

            <Field label="No. HP / WhatsApp" field="no_hp" value={form.no_hp} onChange={set} error={errors.no_hp} placeholder="08xxxxxxxxxx" />
            <Field label="Alamat Domisili" field="alamat" value={form.alamat} onChange={set} error={errors.alamat} placeholder="Alamat lengkap mustahik" />
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
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDelete() {
    setLoading(true);
    setErrorMsg("");
    try {
      await deleteMustahik(mustahik.id);
      onDeleted();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menghapus mustahik.");
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
        <h3 className="text-center font-semibold text-gray-900 mb-1">Hapus Mustahik?</h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-800">{mustahik.nama}</span> akan dihapus dari data mustahik.
        </p>
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {errorMsg}
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Batal</Button>
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Mustahik() {
  const [data, setData]             = useState([]);
  const [meta, setMeta]             = useState({ total: 0, total_kontak: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [modalForm, setModalForm]   = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const asnafOptions = getSettings()?.kategori?.asnafList || DEFAULT_ASNAF;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMustahik({ search, kategori: kategoriFilter, page, perPage: 10 });
      setData(res.data || []);
      setMeta(res.meta || { total: 0, total_kontak: 0, current_page: 1, last_page: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, kategoriFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  function handleSaved() {
    setModalForm(null);
    fetchData();
  }

  function handleDeleted() {
    setModalHapus(null);
    if (data.length === 1 && page > 1) setPage((p) => p - 1);
    else fetchData();
  }

  return (
    <div>
      {/* Header Actions — posisinya seragam dengan halaman lain */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Mustahik
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Heart} label="Total Mustahik"    value={meta.total}                                color="red"     loading={loading} />
        <StatCard icon={Phone} label="Terdata Kontak"   value={meta.total_kontak ?? 0}                    color="emerald" loading={loading} />
        <StatCard icon={Users} label="Halaman"          value={`${meta.current_page} / ${meta.last_page}`} color="blue"    loading={loading} />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama, NIK, alamat, atau asnaf..."
          />
          <div className="flex items-center gap-2">
            <FilterSelect
              value={kategoriFilter}
              onChange={(e) => { setKategoriFilter(e.target.value); setPage(1); }}
            >
              <option value="">Semua Kategori Asnaf</option>
              {asnafOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Nama Mustahik", "Kategori Asnaf", "No. HP / Kontak", "Alamat Domisili", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search ? "Tidak ada mustahik yang cocok dengan pencarian." : "Belum ada data mustahik."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm shrink-0">
                          {row.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{row.nama}</p>
                          <p className="text-xs text-gray-400">NIK: {row.nik || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        KATEGORI_COLORS[row.kategori] ?? "bg-gray-50 text-gray-700 border-gray-200"
                      }`}>
                        {row.kategori || "Fakir"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {row.no_hp ? (
                        <p className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <Phone size={12} className="text-gray-400" /> {row.no_hp}
                        </p>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {row.alamat ? (
                        <p className="flex items-center gap-1.5 text-xs text-gray-600 max-w-sm">
                          <MapPin size={12} className="text-gray-400 shrink-0" /> {row.alamat}
                        </p>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setModalForm({ mode: "edit", data: row })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
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

        <Pagination
          page={page}
          lastPage={meta.last_page}
          total={meta.total}
          onPageChange={setPage}
          label="mustahik"
        />
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
