import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Newspaper,
  Calendar,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Clock,
  User,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/dashboard/StatCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import TipTapEditor from "../../components/common/TipTapEditor";
import { Pagination, SearchInput, FilterSelect } from "../../components/dashboard/ui";
import {
  getBerita,
  createBerita,
  updateBerita,
  deleteBerita,
  uploadBeritaImage,
} from "../../services/beritaService";

const KATEGORI_OPTIONS = [
  "Kegiatan",
  "Penyaluran",
  "Pemberdayaan",
  "Sosialisasi",
  "Pengumuman",
  "Lainnya",
];

const STATUS_LABEL = {
  published: "Dipublikasikan",
  draft: "Draf",
};

// ── Helper Modal Form Berita ───────────────────────────────────────────────────
function ModalFormBerita({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    judul: initial?.judul ?? "",
    kategori: initial?.kategori ?? "Kegiatan",
    ringkasan: initial?.ringkasan ?? "",
    konten: initial?.konten ?? "",
    gambar: initial?.gambar ?? "",
    status: initial?.status ?? "published",
    published_at: initial?.published_at
      ? new Date(initial.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [errors, setErrors] = useState({});

  function setField(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.judul.trim()) errs.judul = "Judul berita wajib diisi.";
    if (!form.kategori.trim()) errs.kategori = "Kategori wajib dipilih.";
    if (!form.konten || form.konten.trim() === "<p></p>" || !form.konten.trim()) {
      errs.konten = "Konten / isi berita wajib diisi.";
    }
    return errs;
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    try {
      const res = await uploadBeritaImage(file);
      if (res.url) {
        setField("gambar", res.url);
      }
    } catch (err) {
      alert("Gagal mengunggah thumbnail: " + err.message);
    } finally {
      setUploadingThumb(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        judul: form.judul,
        kategori: form.kategori,
        ringkasan: form.ringkasan || undefined,
        konten: form.konten,
        gambar: form.gambar || null,
        status: form.status,
        published_at: form.status === "published" ? form.published_at : null,
      };

      if (isEdit) {
        await updateBerita(initial.id, payload);
      } else {
        await createBerita(payload);
      }
      onSaved();
    } catch (err) {
      setErrors({ form: err.message || "Gagal menyimpan berita." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 mb-0.5">
              {isEdit ? "Sunting Berita" : "Tambah Berita"}
            </p>
            <h2 className="font-semibold text-gray-900">
              {isEdit ? "Sunting Berita" : "Buat Berita Baru"}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {errors.form}
            </div>
          )}

          {/* Judul Berita */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Berita <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Penyaluran Bantuan Beasiswa Mahasiswa UPZ Unsil 2026"
              value={form.judul}
              onChange={(e) => setField("judul", e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white ${
                errors.judul ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={form.kategori}
                onChange={(e) => setField("kategori", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
              >
                {KATEGORI_OPTIONS.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Publikasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
              >
                <option value="published">Dipublikasikan</option>
                <option value="draft">Draf</option>
              </select>
            </div>

            {/* Tanggal Publikasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tanggal Publikasi
              </label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setField("published_at", e.target.value)}
                disabled={form.status === "draft"}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* Gambar Sampul (Thumbnail) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Gambar Sampul (Thumbnail Berita)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {form.gambar ? (
                <div className="relative group w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                  <img
                    src={form.gambar}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setField("gambar", "")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 transition shadow-sm"
                    title="Hapus gambar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-full sm:w-48 h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs shrink-0 bg-gray-50/50">
                  <ImageIcon size={24} className="mb-1 text-gray-300" />
                  <span>Belum ada gambar</span>
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition">
                    <Upload size={14} />
                    {uploadingThumb ? "Mengunggah..." : "Unggah Gambar"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumb}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400">atau</span>
                </div>
                <input
                  type="url"
                  placeholder="Masukkan URL gambar langsung (https://...)"
                  value={form.gambar}
                  onChange={(e) => setField("gambar", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Format disarankan: JPG, PNG, atau WebP (Maksimal 5MB).
                </p>
              </div>
            </div>
          </div>

          {/* Ringkasan Singkat (Excerpt) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Ringkasan Singkat (Opsional)
              </label>
              <span className="text-[11px] text-gray-400">
                Otomatis diambil dari konten jika dikosongkan
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Tulis ringkasan 1-2 kalimat mengenai inti berita..."
              value={form.ringkasan}
              onChange={(e) => setField("ringkasan", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white resize-none"
            />
          </div>

          {/* Konten Lengkap (TipTap Editor) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Konten / Isi Berita <span className="text-red-500">*</span>
            </label>
            <TipTapEditor
              content={form.konten}
              onChange={(html) => setField("konten", html)}
              placeholder="Tuliskan berita lengkap di sini..."
            />
            {errors.konten && (
              <p className="text-xs text-red-500 mt-1">{errors.konten}</p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Terbitkan Berita"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Detail Preview Modal ──────────────────────────────────────────────────────
function ModalPreviewBerita({ berita, onClose, onEdit, onDelete }) {
  if (!berita) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 mb-0.5">
              Detail Berita
            </p>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{berita.judul}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-gray-700">
          {/* Metadata */}
          <div className="space-y-3 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">Kategori</span>
              <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
                {berita.kategori}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">Status</span>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  berita.status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {STATUS_LABEL[berita.status] || berita.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">Tanggal Publikasi</span>
              <span className="font-medium text-gray-900 text-right">
                {berita.published_at
                  ? new Date(berita.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Belum dipublikasikan (Draf)"}
              </span>
            </div>
            {berita.author?.name && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Penulis</span>
                <span className="font-medium text-gray-900 text-right">
                  {berita.author.name}
                </span>
              </div>
            )}
          </div>

          {/* Gambar Berita */}
          {berita.gambar && (
            <div className="w-full max-h-72 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Ringkasan */}
          {berita.ringkasan && (
            <div className="p-4 rounded-xl bg-gray-50 border-l-4 border-brand-500 text-xs sm:text-sm text-gray-600 italic leading-relaxed">
              &ldquo;{berita.ringkasan}&rdquo;
            </div>
          )}

          {/* HTML Render */}
          <div
            className="prose prose-sm max-w-none text-gray-800 pt-1 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(berita);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition border border-brand-200"
            >
              <Pencil size={13} /> Sunting
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(berita);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
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

// ── Main Page Component ───────────────────────────────────────────────────────
export default function BeritaAdmin() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBerita({
        search,
        kategori,
        status,
        page,
        perPage: 10,
      });
      setData(res.data || []);
      setMeta(res.meta || { current_page: 1, last_page: 1, total: 0 });
    } catch (err) {
      console.error("Gagal memuat berita:", err);
    } finally {
      setLoading(false);
    }
  }, [search, kategori, status, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!confirmDelete.item?.id) return;
    setIsDeleting(true);
    try {
      await deleteBerita(confirmDelete.item.id);
      setConfirmDelete({ open: false, item: null });
      fetchData();
    } catch (err) {
      alert("Gagal menghapus berita: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPublished = data.filter((d) => d.status === "published").length;
  const totalDraft = data.filter((d) => d.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Top Action Button */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <Button
          icon={Plus}
          onClick={() => {
            setEditingItem(null);
            setModalFormOpen(true);
          }}
        >
          Tambah Berita
        </Button>
      </div>

      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Newspaper}
          label="Total Berita"
          value={meta.total || data.length || 0}
          color="brand"
          loading={loading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Dipublikasikan"
          value={totalPublished}
          color="emerald"
          loading={loading}
        />
        <StatCard
          icon={FileText}
          label="Draf"
          value={totalDraft}
          color="amber"
          loading={loading}
        />
      </div>

      {/* Main Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari judul berita..."
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FilterSelect
              value={kategori}
              onChange={(e) => {
                setKategori(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_OPTIONS.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Status</option>
              <option value="published">Dipublikasikan</option>
              <option value="draft">Draf</option>
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Berita", "Kategori", "Status", "Tanggal", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
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
                    <p className="text-gray-400 text-sm mt-3">Memuat data berita...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                    {search || kategori || status
                      ? "Tidak ada berita yang cocok dengan filter."
                      : "Belum ada data berita."}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3">
                        {item.gambar ? (
                          <img
                            src={item.gambar}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 border border-gray-100">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 line-clamp-1">
                            {item.judul}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                            {item.ringkasan || "Tidak ada ringkasan"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
                        {item.kategori}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          item.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {STATUS_LABEL[item.status] || item.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 text-xs">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="text-xs text-brand-600 font-medium hover:underline"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalFormOpen(true);
                          }}
                          className="text-gray-400 hover:text-brand-600 transition p-1 rounded-lg hover:bg-brand-50"
                          title="Sunting Berita"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              open: true,
                              item,
                            })
                          }
                          className="text-gray-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50"
                          title="Hapus Berita"
                        >
                          <Trash2 size={13} />
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
          label="berita"
        />
      </Card>

      {/* Modal Form */}
      {modalFormOpen && (
        <ModalFormBerita
          initial={editingItem}
          onClose={() => setModalFormOpen(false)}
          onSaved={() => {
            setModalFormOpen(false);
            fetchData();
          }}
        />
      )}

      {/* Modal Preview / Detail */}
      {previewItem && (
        <ModalPreviewBerita
          berita={previewItem}
          onClose={() => setPreviewItem(null)}
          onEdit={(item) => {
            setEditingItem(item);
            setModalFormOpen(true);
          }}
          onDelete={(item) => {
            setConfirmDelete({
              open: true,
              item,
            });
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Hapus Berita?"
        message={
          confirmDelete.item ? (
            <span>
              Apakah Anda yakin ingin menghapus berita <strong>{confirmDelete.item.judul}</strong>? Tindakan ini tidak dapat dibatalkan.
            </span>
          ) : ""
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
