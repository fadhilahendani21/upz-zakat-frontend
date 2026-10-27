import { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  UserCheck,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  ArrowUpDown,
  Search,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import { formatImageUrl } from "../../services/beritaService";
import {
  getAdminPengurus,
  createPengurus,
  updatePengurus,
  deletePengurus,
  resetPengurusToDefault,
} from "../../services/pengurusService";

const SUGGESTED_JABATAN = [
  "Ketua UPZ",
  "Wakil Ketua UPZ",
  "Sekretaris",
  "Bendahara",
  "Administrasi",
  "Divisi Pengumpulan",
  "Divisi Penyaluran",
  "Divisi TI & Publikasi",
];

export default function PengurusAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // State Modal Form (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formValues, setFormValues] = useState({
    nama: "",
    jabatan: "",
    urutan: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // State Konfirmasi Hapus
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPengurus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminPengurus();
      setList(data);
    } catch (err) {
      setError(err.message || "Gagal memuat data pengurus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengurus();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (item) =>
        item.nama?.toLowerCase().includes(term) ||
        item.jabatan?.toLowerCase().includes(term)
    );
  }, [list, searchTerm]);

  const openAddModal = () => {
    setEditingItem(null);
    const maxUrutan = list.length > 0 ? Math.max(...list.map((p) => Number(p.urutan) || 0)) : 0;
    setFormValues({
      nama: "",
      jabatan: "",
      urutan: maxUrutan + 1,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      nama: item.nama,
      jabatan: item.jabatan,
      urutan: item.urutan ?? 0,
    });
    setSelectedFile(null);
    setPreviewUrl(item.foto ? formatImageUrl(item.foto) : null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setFormError("Ukuran file foto maksimal 3MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.nama.trim() || !formValues.jabatan.trim()) {
      setFormError("Nama dan Jabatan wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const formData = new FormData();
      formData.append("nama", formValues.nama.trim());
      formData.append("jabatan", formValues.jabatan.trim());
      formData.append("urutan", formValues.urutan);

      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      let res;
      if (editingItem) {
        res = await updatePengurus(editingItem.id, formData);
      } else {
        res = await createPengurus(formData);
      }

      setIsModalOpen(false);
      showToast(res.message || "Data pengurus berhasil disimpan.");
      fetchPengurus();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan data pengurus.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await deletePengurus(deleteId);
      setDeleteId(null);
      showToast(res.message || "Pengurus berhasil dihapus.");
      fetchPengurus();
    } catch (err) {
      alert(err.message || "Gagal menghapus pengurus.");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetData = () => {
    if (confirm("Kembalikan data pengurus ke susunan awal? Perubahan lokal akan di-reset.")) {
      resetPengurusToDefault();
      fetchPengurus();
      showToast("Data susunan pengurus dikembalikan ke pengaturan awal.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[70] flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-600/20 text-xs sm:text-sm animate-[fadeIn_0.2s_ease]">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetData}
            title="Reset ke data awal"
            className="flex items-center gap-1.5 text-xs py-2 px-3 text-gray-600 hover:text-gray-900"
          >
            <RotateCcw size={14} />
            Reset Data
          </Button>

          <Button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm py-2 px-3.5 text-xs sm:text-sm font-semibold"
          >
            <Plus size={16} />
            Tambah Pengurus
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table Card */}
      <Card className="overflow-hidden p-0 border border-gray-100 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-20 text-center">Urutan</th>
                <th className="py-3.5 px-4 w-24">Foto</th>
                <th className="py-3.5 px-4">Nama Lengkap & Gelar</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4 text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin inline-block mr-2 text-brand-600" />
                    Memuat data kepengurusan...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <UserCheck size={36} className="mx-auto mb-2 text-gray-300" />
                    {searchTerm
                      ? "Tidak ada pengurus yang cocok dengan kata kunci pencarian."
                      : "Belum ada data pengurus. Klik 'Tambah Pengurus' untuk memulai."}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const resolvedImg = item.foto ? formatImageUrl(item.foto) : null;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Urutan */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200">
                          #{item.urutan}
                        </span>
                      </td>

                      {/* Foto */}
                      <td className="py-3.5 px-4">
                        {resolvedImg ? (
                          <img
                            src={resolvedImg}
                            alt={item.nama}
                            className="w-11 h-14 object-cover rounded-xl border border-gray-200 bg-gray-50 shadow-xs"
                          />
                        ) : (
                          <div className="w-11 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>

                      {/* Nama */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-900 leading-snug">
                          {item.nama}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          ID: {item.id}
                        </p>
                      </td>

                      {/* Jabatan */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100/80">
                          {item.jabatan}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit data pengurus"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(item.id)}
                            title="Hapus pengurus"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={17} />
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
      </Card>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 animate-[scaleUp_0.15s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                    {editingItem ? "Edit Data Pengurus" : "Tambah Pengurus Baru"}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {editingItem
                      ? "Perbarui informasi pengurus yang dipilih."
                      : "Lengkapi data untuk susunan kepengurusan baru."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Upload Foto & Live Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Foto Profil Pengurus
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-gray-300" size={26} />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-1.5 px-3 text-xs flex items-center gap-2 font-medium"
                    >
                      <Upload size={14} />
                      {previewUrl ? "Ganti Foto" : "Unggah Foto"}
                    </Button>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Format JPG, PNG, atau WebP. Foto bergaya formal portrait direkomendasikan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Nama & Gelar */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ir. Acep Irham Gufroni, M.Eng."
                  value={formValues.nama}
                  onChange={(e) => setFormValues({ ...formValues, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>

              {/* Input Jabatan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Jabatan / Posisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ketua UPZ, Bendahara, dsb."
                  value={formValues.jabatan}
                  onChange={(e) => setFormValues({ ...formValues, jabatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />

                {/* Rekomendasi Pilihan Cepat */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-gray-400 self-center mr-1">
                    Saran:
                  </span>
                  {SUGGESTED_JABATAN.map((jab) => (
                    <button
                      key={jab}
                      type="button"
                      onClick={() => setFormValues({ ...formValues, jabatan: jab })}
                      className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 text-[11px] transition"
                    >
                      {jab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Urutan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowUpDown size={13} className="text-gray-400" />
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.urutan}
                  onChange={(e) =>
                    setFormValues({ ...formValues, urutan: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Urutan #1 tampil paling pertama (kiri atas) di halaman "Tentang UPZ".
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="py-2 px-4 text-xs font-medium"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2 py-2 px-5 text-xs font-semibold"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  {editingItem ? "Simpan Perubahan" : "Simpan Pengurus"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pengurus"
        message="Apakah Anda yakin ingin menghapus pengurus ini dari daftar struktur? Foto dan jabatan terkait akan dihapus."
        confirmText={deleting ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
