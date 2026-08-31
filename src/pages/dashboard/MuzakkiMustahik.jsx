import { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, GraduationCap, Globe,
  X, Pencil, Trash2,
  Phone, Mail, Building2, BookOpen,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import { Pagination, SearchInput } from "../../components/dashboard/ui";
import {
  getMuzakki, createMuzakki, updateMuzakki, deleteMuzakki,
} from "../../services/muzakkiService";

// ── Struktur Data Fakultas & Jurusan Universitas Siliwangi ────────────────────
export const FAKULTAS_JURUSAN_UNSIL = {
  "Fakultas Keguruan dan Ilmu Pendidikan (FKIP)": [
    "Pendidikan Masyarakat",
    "Pendidikan Bahasa Indonesia",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Matematika",
    "Pendidikan Biologi",
    "Pendidikan Ekonomi",
    "Pendidikan Geografi",
    "Pendidikan Jasmani",
    "Pendidikan Sejarah",
    "Pendidikan Fisika",
    "Pendidikan Profesi Guru",
    "Pendidikan Kepelatihan Olahraga",
    "Pendidikan Seni Pertunjukan",
  ],
  "Fakultas Ekonomi dan Bisnis": [
    "Ekonomi Pembangunan",
    "Manajemen",
    "Akuntansi",
    "Perbankan dan Keuangan (D3)",
    "Perbankan dan Keuangan Digital (D4)",
  ],
  "Fakultas Teknik": [
    "Teknik Sipil",
    "Teknik Elektro",
    "Informatika",
    "Sistem Informasi",
    "Sains Data",
  ],
  "Fakultas Pertanian": [
    "Agroteknologi",
    "Agribisnis",
    "Teknologi Pangan dan Hasil Pertanian",
  ],
  "Fakultas Agama Islam": [
    "Ekonomi Syariah",
    "Manajemen Mutu Halal",
  ],
  "Fakultas Ilmu Kesehatan": [
    "Kesehatan Masyarakat",
    "Gizi",
  ],
  "Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)": [
    "Ilmu Politik",
    "Hukum Bisnis",
  ],
};

const FAKULTAS_LIST = Object.keys(FAKULTAS_JURUSAN_UNSIL);

function parseUnitKerja(unitKerjaStr) {
  if (!unitKerjaStr || unitKerjaStr === "Masyarakat Umum" || unitKerjaStr === "Umum") {
    return { isDosenStaf: false, fakultas: "", jurusan: "" };
  }
  
  // Format tersimpan: "Fakultas ... · Jurusan ..." atau "Fakultas ... - Jurusan ..."
  for (const fak of FAKULTAS_LIST) {
    if (unitKerjaStr.startsWith(fak)) {
      const remainder = unitKerjaStr.replace(fak, "").replace(/^[\s·\-\:]+/, "").trim();
      return { isDosenStaf: true, fakultas: fak, jurusan: remainder || FAKULTAS_JURUSAN_UNSIL[fak][0] };
    }
  }

  // Cek apakah kecocokan parsial
  const foundFak = FAKULTAS_LIST.find((f) => unitKerjaStr.toLowerCase().includes(f.toLowerCase()));
  if (foundFak) {
    return { isDosenStaf: true, fakultas: foundFak, jurusan: FAKULTAS_JURUSAN_UNSIL[foundFak][0] };
  }

  return { isDosenStaf: true, fakultas: FAKULTAS_LIST[0], jurusan: unitKerjaStr };
}

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
  const parsed = parseUnitKerja(initial?.unit_kerja);
  
  const [kategoriType, setKategoriType] = useState(
    initial ? (parsed.isDosenStaf ? "dosen_staf" : "umum") : "dosen_staf"
  );
  const [selectedFakultas, setSelectedFakultas] = useState(parsed.fakultas || FAKULTAS_LIST[0]);
  const [selectedJurusan, setSelectedJurusan]   = useState(
    parsed.jurusan || FAKULTAS_JURUSAN_UNSIL[FAKULTAS_LIST[0]][0]
  );
  const [form, setForm] = useState({
    nama: initial?.nama ?? "",
    nik: initial?.nik ?? "",
    nip: initial?.nip ?? "",
    jenis_kelamin: initial?.jenis_kelamin ?? "Laki-laki",
    tempat_lahir: initial?.tempat_lahir ?? "",
    tanggal_lahir: initial?.tanggal_lahir ?? "",
    pekerjaan: initial?.pekerjaan ?? "",
    alamat_lengkap: initial?.alamat_lengkap ?? "",
    email: initial?.email ?? "",
    no_hp: initial?.no_hp ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleFakultasChange(e) {
    const fak = e.target.value;
    setSelectedFakultas(fak);
    const jurusanList = FAKULTAS_JURUSAN_UNSIL[fak] || [];
    setSelectedJurusan(jurusanList[0] || "");
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim()) errs.nama = "Nama wajib diisi.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Format email tidak valid.";
    if (kategoriType === "dosen_staf") {
      if (!selectedFakultas) errs.fakultas = "Fakultas wajib dipilih.";
      if (!selectedJurusan)  errs.jurusan = "Jurusan wajib dipilih.";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const finalUnitKerja = kategoriType === "umum"
        ? "Masyarakat Umum"
        : `${selectedFakultas} · ${selectedJurusan}`;

      const payload = {
        nama: form.nama,
        nik: form.nik || null,
        nip: form.nip || null,
        jenis_kelamin: form.jenis_kelamin || null,
        tempat_lahir: form.tempat_lahir || null,
        tanggal_lahir: form.tanggal_lahir || null,
        pekerjaan: form.pekerjaan || null,
        alamat_lengkap: form.alamat_lengkap || null,
        email: form.email || null,
        no_hp: form.no_hp || null,
        kategori: kategoriType === "umum" ? "Muzakki Umum" : "Dosen & Staf UNSIL",
        unit_kerja: finalUnitKerja,
      };

      if (isEdit) {
        await updateMuzakki(initial.id, payload);
      } else {
        await createMuzakki(payload);
      }
      onSaved();
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setLoading(false);
    }
  }

  const currentJurusanOptions = FAKULTAS_JURUSAN_UNSIL[selectedFakultas] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit Muzakki" : "Tambah Muzakki"}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {errors._global && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors._global}
              </div>
            )}

            <Field label="Nama Lengkap *" field="nama" value={form.nama} onChange={set} error={errors.nama} placeholder="Nama lengkap muzakki" />

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-2.5">
                {["Laki-laki", "Perempuan"].map((jk) => (
                  <button
                    key={jk}
                    type="button"
                    onClick={() => set("jenis_kelamin", jk)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                      form.jenis_kelamin === jk
                        ? "bg-brand-50 border-brand-500 text-brand-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {jk}
                  </button>
                ))}
              </div>
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tempat Lahir" field="tempat_lahir" value={form.tempat_lahir} onChange={set} placeholder="Contoh: Tasikmalaya" />
              <Field label="Tanggal Lahir" field="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={set} />
            </div>

            {/* Pekerjaan */}
            <Field label="Pekerjaan" field="pekerjaan" value={form.pekerjaan} onChange={set} placeholder="Contoh: Dosen / Wiraswasta / Karyawan" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" field="email" type="email" value={form.email} onChange={set} error={errors.email} placeholder="email@unsil.ac.id" />
              <Field label="No. HP / WA" field="no_hp" value={form.no_hp} onChange={set} error={errors.no_hp} placeholder="08xxxxxxxxxx" />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap</label>
              <textarea
                value={form.alamat_lengkap}
                onChange={(e) => set("alamat_lengkap", e.target.value)}
                rows={2}
                placeholder="Alamat domisili lengkap"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
              />
            </div>

            {/* Pilihan Kategori Muzakki */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Muzakki *</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { val: "dosen_staf", label: "Dosen / Staf Civitas", icon: GraduationCap },
                  { val: "umum", label: "Masyarakat Umum", icon: Globe },
                ].map(({ val, label, icon: Icon }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setKategoriType(val)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                      kategoriType === val
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-xs"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field NIP / NIK sesuai Kategori */}
            {kategoriType === "dosen_staf" ? (
              <Field label="NIP (Nomor Induk Pegawai)" field="nip" value={form.nip} onChange={set} error={errors.nip} placeholder="Contoh: 198501302012121009" />
            ) : (
              <Field label="NIK (Nomor Induk Kependudukan)" field="nik" value={form.nik} onChange={set} error={errors.nik} placeholder="Contoh: 3278011204850001" />
            )}

            {/* Fakultas & Jurusan Bertingkat (Jika Dosen / Staf) */}
            {kategoriType === "dosen_staf" && (
              <div className="space-y-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    1. Pilih Fakultas *
                  </label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedFakultas}
                      onChange={handleFakultasChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white"
                    >
                      {FAKULTAS_LIST.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  {errors.fakultas && <p className="text-xs text-red-500 mt-1">{errors.fakultas}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    2. Pilih Jurusan / Program Studi *
                  </label>
                  <div className="relative">
                    <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedJurusan}
                      onChange={(e) => setSelectedJurusan(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white"
                    >
                      {currentJurusanOptions.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>
                  {errors.jurusan && <p className="text-xs text-red-500 mt-1">{errors.jurusan}</p>}
                </div>
              </div>
            )}
          </div>


          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
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
          <span className="font-medium text-gray-800">{muzakki.nama}</span> akan dihapus dari sistem.
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
export default function MuzakkiMustahik() {
  const [data, setData]             = useState([]);
  const [meta, setMeta]             = useState({ total: 0, total_dosen_staf: 0, total_umum: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [modalForm, setModalForm]   = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMuzakki({ search, kategori: kategoriFilter, page, perPage: 10 });
      setData(res.data || []);
      setMeta(res.meta || { total: 0, total_dosen_staf: 0, total_umum: 0, current_page: 1, last_page: 1 });
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
      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button icon={Plus} onClick={() => setModalForm({ mode: "add" })}>
          Tambah Muzakki
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users}         label="Total Muzakki"    value={meta.total}            color="brand"   loading={loading} />
        <StatCard icon={GraduationCap} label="Dosen & Staf"     value={meta.total_dosen_staf} color="emerald" loading={loading} />
        <StatCard icon={Globe}         label="Masyarakat Umum"  value={meta.total_umum}       color="blue"    loading={loading} />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama, NIP/NIK, email, fakultas..."
          />
          <div className="flex gap-2">
            {[
              { val: "", label: "Semua Kategori" },
              { val: "dosen_staf", label: "Dosen / Staf" },
              { val: "umum", label: "Umum" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => { setKategoriFilter(val); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  kategoriFilter === val
                    ? "bg-brand-600 text-white shadow-xs"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
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
                {["Nama Muzakki", "Fakultas & Jurusan", "Kontak", "Total Transaksi", ""].map((h) => (
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
                    {search ? "Tidak ada muzakki yang cocok dengan pencarian." : "Belum ada data muzakki."}
                  </td>
                </tr>
              ) : (
                data.map((row) => {
                  const parsedInfo = parseUnitKerja(row.unit_kerja);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm shrink-0">
                            {row.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{row.nama}</p>
                            <p className="text-xs text-gray-400">
                              {parsedInfo.isDosenStaf ? `NIP: ${row.nip || "-"}` : `NIK: ${row.nik || "-"}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {parsedInfo.isDosenStaf ? (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <GraduationCap size={12} className="shrink-0 text-emerald-700" />
                              <span className="truncate max-w-[260px]">{parsedInfo.fakultas}</span>
                            </span>
                            <div className="flex items-center gap-1.5 pl-[9px] text-xs font-medium text-gray-700">
                              <BookOpen size={12} className="text-gray-400 shrink-0" />
                              <span>{parsedInfo.jurusan}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            <Globe size={12} />
                            Masyarakat Umum
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          {row.email && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail size={11} className="text-gray-400 shrink-0" /> {row.email}
                            </p>
                          )}
                          {row.no_hp && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone size={11} className="text-gray-400 shrink-0" /> {row.no_hp}
                            </p>
                          )}
                          {!row.email && !row.no_hp && (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 font-medium text-xs">
                        {row.transaksi_count ?? 0} kali
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          lastPage={meta.last_page}
          total={meta.total}
          onPageChange={setPage}
          label="muzakki"
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
          muzakki={modalHapus}
          onClose={() => setModalHapus(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
