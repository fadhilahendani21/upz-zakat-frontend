import { useState, useEffect, useCallback } from "react";
import {
  Users, UserCheck, UserX, Plus,
  X, Pencil, Trash2,
  Phone, Mail, Building2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import { Pagination, SearchInput } from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import {
  getMuzakki, createMuzakki, updateMuzakki, deleteMuzakki,
} from "../../services/muzakkiService";

// ── Konstanta ─────────────────────────────────────────────────────────────────
const UNIT_KERJA_OPTIONS = [
  "Rektorat", "FKIP", "Fakultas Hukum", "Fakultas Ekonomi & Bisnis",
  "Fakultas Pertanian", "Fakultas Teknik", "Fakultas Ilmu Kesehatan",
  "Fakultas MIPA", "Pascasarjana", "Unit Kerja Lainnya",
];

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
    nama: initial?.nama ?? "",
    email: initial?.email ?? "",
    no_hp: initial?.no_hp ?? "",
    unit_kerja: initial?.unit_kerja ?? "",
    status: initial?.status ?? "aktif",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim()) errs.nama = "Nama wajib diisi.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Format email tidak valid.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await updateMuzakki(initial.id, form);
      } else {
        await createMuzakki(form);
      }
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
            {isEdit ? "Edit Muzakki" : "Tambah Muzakki"}
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

            <Field label="Nama Lengkap *" field="nama" value={form.nama} onChange={set} error={errors.nama} placeholder="Nama muzakki" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" field="email" type="email" value={form.email} onChange={set} error={errors.email} placeholder="email@unsil.ac.id" />
              <Field label="No. HP" field="no_hp" value={form.no_hp} onChange={set} error={errors.no_hp} placeholder="08xxxxxxxxxx" />
            </div>

            {/* Unit Kerja — select bisa diketik via datalist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit Kerja / Fakultas</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  list="unit-kerja-list"
                  value={form.unit_kerja}
                  onChange={(e) => set("unit_kerja", e.target.value)}
                  placeholder="Pilih atau ketik unit kerja..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
                <datalist id="unit-kerja-list">
                  {UNIT_KERJA_OPTIONS.map((u) => <option key={u} value={u} />)}
                </datalist>
              </div>
            </div>

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

// ── Modal Konfirmasi Hapus ────────────────────────────────────────────────────
function ModalHapus({ muzakki, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDelete() {
    setLoading(true);
    setErrorMsg("");
    try {
      await deleteMuzakki(muzakki.id);
      onDeleted();
    } catch (err) {
      setErrorMsg(err.message || "Gagal menghapus muzakki.");
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
        <h3 className="text-center font-semibold text-gray-900 mb-1">Hapus Muzakki?</h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-800">{muzakki.nama}</span> akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
        </p>
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {errorMsg}
          </div>
        )}
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
export default function MuzakkiMustahik() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalForm, setModalForm] = useState(null); // null | { mode: 'add'|'edit', data?: obj }
  const [modalHapus, setModalHapus] = useState(null); // null | obj

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMuzakki({ search, status: statusFilter, page, perPage: 10 });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 350 : 0);
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

  const aktif = meta.total_aktif || 0;
  const tidakAktif = meta.total_tidak_aktif || 0;

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Muzakki
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users}     label="Total Muzakki"  value={meta.total} color="brand"   sub="Terdaftar di sistem" loading={loading} />
        <StatCard icon={UserCheck} label="Muzakki Aktif"  value={aktif}      color="emerald" sub="Status aktif"        loading={loading} />
        <StatCard icon={UserX}     label="Tidak Aktif"    value={tidakAktif} color="red"     sub="Perlu ditinjau"      loading={loading} />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama, email, atau unit kerja..."
          />
          <div className="flex gap-2">
            {[
              { val: "", label: "Semua" },
              { val: "aktif", label: "Aktif" },
              { val: "tidak_aktif", label: "Tidak Aktif" },
            ].map(({ val, label }) => (
              <button key={val} onClick={() => { setStatusFilter(val); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${statusFilter === val ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Nama", "Unit Kerja", "Kontak", "Transaksi", "Status", ""].map((h) => (
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
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search ? "Tidak ada muzakki yang cocok dengan pencarian." : "Belum ada data muzakki."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm shrink-0">
                          {row.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{row.nama}</p>
                          <p className="text-xs text-gray-400">#{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {row.unit_kerja ? (
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Building2 size={13} className="text-gray-400" />
                          {row.unit_kerja}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        {row.email && (
                          <p className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Mail size={11} className="text-gray-400" /> {row.email}
                          </p>
                        )}
                        {row.no_hp && (
                          <p className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone size={11} className="text-gray-400" /> {row.no_hp}
                          </p>
                        )}
                        {!row.email && !row.no_hp && <span className="text-gray-300 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-700">
                        {row.transaksi_count ?? 0}
                        <span className="text-gray-400 font-normal text-xs ml-1">transaksi</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        row.status === "aktif"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {row.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
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

        <Pagination page={page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} label="muzakki" />
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
          muzakki={modalHapus}
          onClose={() => setModalHapus(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
