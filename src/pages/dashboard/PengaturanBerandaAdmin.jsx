import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Quote,
  BarChart3,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import gedungDefault from "../../assets/images/gedung-unsil.jpeg";
import { fileToDataUrl } from "../../services/beritaService";
import {
  getPengaturanAdmin,
  savePengaturanAdmin,
} from "../../services/pengaturanService";

// ============================================================================
// DUMMY DATA AWAL (Sebelum Backend Laravel selesai)
// ============================================================================
const DUMMY_BERANDA_SETTINGS = {
  hero: {
    badge: "Transparan • Amanah • Profesional",
    judul: "Menunaikan Zakat, Membersamai Umat",
    deskripsi:
      "Unit Pengumpul Zakat (UPZ) Universitas Siliwangi hadir untuk memudahkan sivitas akademika dan masyarakat dalam menunaikan zakat, infak, dan sedekah secara aman, transparan, dan terpercaya.",
    foto: null, // null = gunakan gedungDefault
  },
  kutipan: {
    isi: "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka.",
    sumber: "QS. At-Taubah: 103",
  },
  infoTambahan: {
    taglineBanner: "Bersama zakat, kita bangun kebaikan dan keberkahan.",
    labelMuzakki: "Muzakki Terdaftar",
    labelMustahik: "Mustahik Terbantu",
  },
};

export default function PengaturanBerandaAdmin() {
  // 1. STATE FORM & STATUS
  const [formData, setFormData] = useState(DUMMY_BERANDA_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  const fileInputRef = useRef(null);

  // 2. FUNGSI FETCH DATA AWAL (handleFetch)
  const handleFetch = async () => {
    try {
      setLoading(true);
      const data = await getPengaturanAdmin("beranda");
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
          hero: { ...prev.hero, ...(data.hero || {}) },
          kutipan: { ...prev.kutipan, ...(data.kutipan || {}) },
          infoTambahan: { ...prev.infoTambahan, ...(data.infoTambahan || {}) },
        }));
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan beranda:", err);
      showToast("error", "Gagal memuat data pengaturan beranda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Helper untuk menampilkan notifikasi toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper perubahan input
  const handleChangeHero = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }));
  };

  const handleFotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Ukuran foto maksimal 5MB.");
        return;
      }
      try {
        const dataUrl = await fileToDataUrl(file, 1600, 1000, 0.85);
        setFormData((prev) => ({
          ...prev,
          hero: { ...prev.hero, foto: dataUrl },
        }));
        showToast("success", "Foto latar berhasil diunggah ke pratinjau!");
      } catch (err) {
        console.error("Gagal membaca file foto:", err);
        showToast("error", "Gagal memproses file foto.");
      }
    }
  };

  const handleResetFoto = () => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, foto: null },
    }));
    showToast("success", "Foto dikembalikan ke foto gedung default.");
  };

  const handleChangeKutipan = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      kutipan: { ...prev.kutipan, [field]: val },
    }));
  };

  const handleChangeInfo = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      infoTambahan: { ...prev.infoTambahan, [field]: val },
    }));
  };

  // 3. FUNGSI SIMPAN PERUBAHAN (handleSave)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await savePengaturanAdmin("beranda", formData);
      showToast("success", "Pengaturan beranda & foto berhasil disimpan ke database!");
    } catch (err) {
      console.error("Gagal menyimpan beranda:", err);
      showToast("error", err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  // 4. RESET KE DATA DEFAULT
  const handleReset = async () => {
    if (confirm("Kembalikan seluruh teks & foto beranda ke nilai default awal?")) {
      try {
        setSaving(true);
        await savePengaturanAdmin("beranda", DUMMY_BERANDA_SETTINGS);
        setFormData(DUMMY_BERANDA_SETTINGS);
        showToast("success", "Pengaturan beranda dikembalikan ke default.");
      } catch (err) {
        console.error("Gagal reset beranda:", err);
        showToast("error", "Gagal mengembalikan pengaturan ke default.");
      } finally {
        setSaving(false);
      }
    }
  };

  const activeHeroPhoto = formData.hero.foto || gedungDefault;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 size={32} className="animate-spin text-brand-600 mb-3" />
        <p className="text-sm font-medium">Memuat formulir pengaturan beranda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[70] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium animate-[fadeIn_0.2s_ease] ${
            toast.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-red-600 text-white shadow-red-600/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs py-2 px-3 text-gray-600 hover:text-gray-900"
        >
          <RotateCcw size={14} />
          Reset Default
        </Button>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm py-2 px-4 text-xs sm:text-sm font-semibold"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Simpan Perubahan
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ===================================================================
            BAGIAN 1: FOTO LATAR HERO & KUTIPAN DI DALAM FOTO
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Foto Latar Hero &amp; Kutipan di Dalam Foto
              </h2>
              <p className="text-[11px] text-gray-500">
                Ganti foto gedung/kegiatan serta teks kutipan ayat yang berada di kartu sudut kanan bawah foto.
              </p>
            </div>
          </div>

          {/* Upload Foto Latar */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Foto Latar Gedung / Kampus
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/60">
              <div className="w-36 h-20 sm:w-44 sm:h-24 rounded-lg overflow-hidden border border-gray-300 bg-gray-200 shrink-0 shadow-xs">
                <img
                  src={activeHeroPhoto}
                  alt="Foto Hero"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFotoUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 py-1.5 px-3 text-xs"
                  >
                    <Upload size={14} />
                    Ganti Foto Gedung
                  </Button>

                  {formData.hero.foto && (
                    <button
                      type="button"
                      onClick={handleResetFoto}
                      className="text-xs text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Kembalikan Foto Bawaan
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-500 leading-normal">
                  Format: JPG, PNG, atau WebP (Disarankan rasio landscape 16:9 atau foto lebar gedung).
                </p>
              </div>
            </div>
          </div>

          {/* Kutipan yang ada di dalam Foto */}
          <div className="pt-2 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-2">
              <Quote size={16} className="text-emerald-700" />
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Teks Kutipan / Ayat (Di Dalam Foto Hero)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Isi Kutipan / Terjemahan Ayat <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.kutipan.isi}
                onChange={(e) => handleChangeKutipan("isi", e.target.value)}
                placeholder="Contoh: Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Sumber Kutipan / Dalil <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kutipan.sumber}
                onChange={(e) => handleChangeKutipan("sumber", e.target.value)}
                placeholder="Contoh: QS. At-Taubah: 103"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
              />
            </div>
          </div>
        </Card>

        {/* ===================================================================
            BAGIAN 2: TEKS UTAMA HERO
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Teks Judul &amp; Deskripsi Hero
              </h2>
              <p className="text-[11px] text-gray-500">
                Teks utama di sebelah kiri foto pada halaman depan.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Badge Teks Kecil */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Teks Badge / Tagline Kecil
              </label>
              <input
                type="text"
                required
                value={formData.hero.badge}
                onChange={(e) => handleChangeHero("badge", e.target.value)}
                placeholder="Contoh: Transparan • Amanah • Profesional"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
              />
            </div>

            {/* Judul Utama */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Judul Utama (H1 Hero) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.hero.judul}
                onChange={(e) => handleChangeHero("judul", e.target.value)}
                placeholder="Contoh: Menunaikan Zakat, Membersamai Umat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm font-semibold text-gray-900 transition"
              />
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Deskripsi Singkat Hero <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.hero.deskripsi}
                onChange={(e) => handleChangeHero("deskripsi", e.target.value)}
                placeholder="Deskripsi singkat seputar peran dan kemudahan menunaikan zakat di UPZ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition leading-relaxed"
              />
            </div>
          </div>
        </Card>

        {/* ===================================================================
            BAGIAN 3: INFO TAMBAHAN / BANNER STATISTIK
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Bagian Info Tambahan / Banner
              </h2>
              <p className="text-[11px] text-gray-500">
                Teks pendukung pada bar statistik beranda publik.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Tagline Singkat Banner
              </label>
              <input
                type="text"
                value={formData.infoTambahan.taglineBanner}
                onChange={(e) => handleChangeInfo("taglineBanner", e.target.value)}
                placeholder="Contoh: Bersama zakat, kita bangun kebaikan dan keberkahan."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
              />
            </div>
          </div>
        </Card>

        {/* ===================================================================
            SEKSI 4: PRATINJAU LANGSUNG (LIVE PREVIEW PERSIS SEPERTI HERO PUBLIK)
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-gray-50/50 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={16} className="text-brand-600" />
            <h3 className="text-xs sm:text-sm font-bold">
              Pratinjau Foto &amp; Kutipan Hero (Persis Tampilan Beranda)
            </h3>
          </div>

          {/* Kotak Simulasi Foto & Kartu Kutipan */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900 h-64 sm:h-72">
            {/* Foto Gedung */}
            <img
              src={activeHeroPhoto}
              alt="Foto Hero Preview"
              className="w-full h-full object-cover object-center opacity-95"
            />

            {/* Kartu Kutipan Melayang di Pojok Kanan Bawah */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 max-w-[260px] sm:max-w-xs z-10">
              <div className="relative rounded-xl sm:rounded-2xl bg-white/90 p-3 pt-4 sm:p-4 sm:pt-5 shadow-xl backdrop-blur-md border border-white/60">
                {/* Icon Quote Bulat Hijau */}
                <div className="absolute -top-3 left-3 sm:left-4 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald-800 text-white text-xs sm:text-sm font-serif shadow-md">
                  &ldquo;
                </div>

                <p className="text-[11px] sm:text-xs leading-relaxed text-gray-800 font-medium">
                  {formData.kutipan.isi || "Isi kutipan belum diisi..."}
                </p>

                <p className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                  – {formData.kutipan.sumber || "Sumber Kutipan"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tombol Simpan Bawah */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm py-2.5 px-6 text-xs sm:text-sm font-semibold"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
