import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Share2,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../components/common/SocialIcons";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

// ============================================================================
// DUMMY DATA AWAL (Sebelum Backend Laravel selesai)
// ============================================================================
const DUMMY_KONTAK_SETTINGS = {
  infoUtama: {
    alamat:
      "Gedung Rektorat Universitas Siliwangi, Jl. Siliwangi No. 24, Tasikmalaya, Jawa Barat 46115",
    whatsapp: "0812-3456-7890",
    subteksWa: "Layanan Aktif Jam Kerja",
    email: "upzzakat@unsil.ac.id",
    subteksEmail: "Respon Cepat 1x24 Jam",
  },
  googleMaps: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4603646424735!2d108.22021287404235!3d-7.350249372311004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5765c64bb1f9%3A0xd8b04746f0f62ad4!2sUniversitas%20Siliwangi!5e1!3m2!1sid!2sid!4v1786676648205!5m2!1sid!2sid",
  },
  jamOperasional: {
    hariKerja: "Senin – Jumat",
    jamKerja: "09.00 – 16.00 WIB",
    hariLibur: "Sabtu, Minggu, & Hari Libur",
    jamLibur: "Tutup",
  },
  sosialMedia: {
    facebook: {
      handle: "@upzzakatunsil",
      url: "https://facebook.com/upzzakatunsil",
    },
    instagram: {
      handle: "@upzzakat.unsil",
      url: "https://instagram.com/upzzakat.unsil",
    },
    twitter: {
      handle: "@upzzakatunsil",
      url: "https://twitter.com/upzzakatunsil",
    },
    youtube: {
      handle: "UPZ Zakat Unsil",
      url: "https://youtube.com/@upzzakatunsil",
    },
  },
};

const STORAGE_KEY = "upz_kontak_settings";

export default function PengaturanKontakAdmin() {
  // 1. STATE FORM & STATUS
  const [formData, setFormData] = useState(DUMMY_KONTAK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // 2. FUNGSI FETCH DATA AWAL (handleFetch)
  const handleFetch = async () => {
    try {
      setLoading(true);

      // ======================================================================
      // TODO: Ganti dengan Axios / Fetch GET ke API Backend Laravel jika sudah siap:
      //
      // const response = await axios.get(`${import.meta.env.VITE_API_URL}/public/pengaturan-kontak`);
      // if (response.data?.data) {
      //   setFormData(response.data.data);
      //   return;
      // }
      // ======================================================================

      // SIMULASI DUMMY DATA SEMENTARA (localStorage fallback agar bisa langsung diuji):
      await new Promise((resolve) => setTimeout(resolve, 300));
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      } else {
        setFormData(DUMMY_KONTAK_SETTINGS);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan kontak:", err);
      showToast("error", "Gagal memuat data pengaturan kontak.");
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
  const handleChangeInfo = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      infoUtama: { ...prev.infoUtama, [field]: val },
    }));
  };

  const handleChangeMaps = (val) => {
    // Otomatis ekstrak URL jika admin mem-paste tag <iframe> utuh
    let cleanUrl = val.trim();
    if (cleanUrl.includes("<iframe") && cleanUrl.includes("src=\"")) {
      const match = cleanUrl.match(/src="([^"]+)"/);
      if (match && match[1]) cleanUrl = match[1];
    }
    setFormData((prev) => ({
      ...prev,
      googleMaps: { ...prev.googleMaps, embedUrl: cleanUrl },
    }));
  };

  const handleChangeJam = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      jamOperasional: { ...prev.jamOperasional, [field]: val },
    }));
  };

  const handleChangeSosmed = (platform, field, val) => {
    setFormData((prev) => ({
      ...prev,
      sosialMedia: {
        ...prev.sosialMedia,
        [platform]: { ...prev.sosialMedia[platform], [field]: val },
      },
    }));
  };

  // 3. FUNGSI SIMPAN PERUBAHAN (handleSave)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // ======================================================================
      // TODO: Ganti dengan Axios PUT/POST ke API Backend Laravel nanti:
      //
      // const token = localStorage.getItem("token");
      // await axios.post(`${import.meta.env.VITE_API_URL}/pengaturan-kontak`, formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     Accept: "application/json",
      //   },
      // });
      // ======================================================================

      // SIMULASI PENYIMPANAN SEMENTARA KE LOCALSTORAGE:
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      // Kirim event agar Halaman Kontak publik langsung ter-update secara realtime
      window.dispatchEvent(
        new CustomEvent("upz_kontak_updated", { detail: formData })
      );

      showToast("success", "Pengaturan kontak berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan kontak:", err);
      showToast("error", err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  // 4. RESET KE DATA DEFAULT
  const handleReset = () => {
    if (confirm("Kembalikan informasi kontak ke nilai default awal?")) {
      setFormData(DUMMY_KONTAK_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("upz_kontak_updated", { detail: DUMMY_KONTAK_SETTINGS })
      );
      showToast("success", "Pengaturan kontak dikembalikan ke default.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 size={32} className="animate-spin text-brand-600 mb-3" />
        <p className="text-sm font-medium">Memuat formulir pengaturan kontak...</p>
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

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Pengaturan Kontak
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100">
              Halaman Publik
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Kelola alamat kantor, WhatsApp, email, tautan peta Google Maps, jam kerja, dan sosial media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs py-2.5 px-3 text-gray-600 hover:text-gray-900"
          >
            <RotateCcw size={14} />
            Reset Default
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm py-2.5 px-5 text-xs sm:text-sm font-semibold"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ===================================================================
            KELOMPOK 1: INFO UTAMA (Alamat, WhatsApp, Email)
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                1. Informasi Utama Kontak
              </h2>
              <p className="text-[11px] text-gray-500">
                Data pada 3 kartu utama (Alamat, WhatsApp &amp; Layanan, serta Email).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Alamat Kantor */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600" />
                Alamat Kantor Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.infoUtama.alamat}
                onChange={(e) => handleChangeInfo("alamat", e.target.value)}
                placeholder="Contoh: Gedung Rektorat Universitas Siliwangi, Jl. Siliwangi No. 24..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition leading-relaxed"
              />
            </div>

            {/* Baris WhatsApp & Subteks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-600" />
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.infoUtama.whatsapp}
                  onChange={(e) => handleChangeInfo("whatsapp", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subteks Keterangan WA
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Layanan Aktif Jam Kerja"
                  value={formData.infoUtama.subteksWa}
                  onChange={(e) => handleChangeInfo("subteksWa", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>

            {/* Baris Email & Subteks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-600" />
                  Email Resmi <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: upzzakat@unsil.ac.id"
                  value={formData.infoUtama.email}
                  onChange={(e) => handleChangeInfo("email", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subteks Keterangan Email
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Respon Cepat 1x24 Jam"
                  value={formData.infoUtama.subteksEmail}
                  onChange={(e) => handleChangeInfo("subteksEmail", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            KELOMPOK 2: GOOGLE MAPS EMBED
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                2. Lokasi Google Maps
              </h2>
              <p className="text-[11px] text-gray-500">
                Tautan embed peta lokasi kantor UPZ yang tampil pada iframe halaman kontak.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              URL Embed Google Maps (atau kode &lt;iframe&gt;)
            </label>
            <input
              type="text"
              required
              value={formData.googleMaps.embedUrl}
              onChange={(e) => handleChangeMaps(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-mono transition"
            />
            <p className="text-[11px] text-gray-400 mt-1 leading-normal">
              Tips: Anda bisa menyalin link langsung dari Google Maps (Bagikan &gt; Sematkan Peta &gt; Salin tautan src iframe).
            </p>
          </div>
        </Card>

        {/* ===================================================================
            KELOMPOK 3: JAM OPERASIONAL
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                3. Jam Operasional Kantor
              </h2>
              <p className="text-[11px] text-gray-500">
                Jadwal pelayanan sekretariat UPZ untuk muzakki dan mustahik.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Hari & Jam Kerja Normal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Label Hari Kerja
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Senin – Jumat"
                  value={formData.jamOperasional.hariKerja}
                  onChange={(e) => handleChangeJam("hariKerja", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Waktu Operasional Kerja
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 09.00 – 16.00 WIB"
                  value={formData.jamOperasional.jamKerja}
                  onChange={(e) => handleChangeJam("jamKerja", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>

            {/* Hari & Keterangan Libur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Label Hari Libur
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sabtu, Minggu, & Hari Libur"
                  value={formData.jamOperasional.hariLibur}
                  onChange={(e) => handleChangeJam("hariLibur", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Keterangan Status Libur
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tutup"
                  value={formData.jamOperasional.jamLibur}
                  onChange={(e) => handleChangeJam("jamLibur", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            KELOMPOK 4: SOSIAL MEDIA (IKUTI KAMI)
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                4. Akun Media Sosial (Ikuti Kami)
              </h2>
              <p className="text-[11px] text-gray-500">
                Nama username/handle serta link profil akun media sosial resmi.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Facebook */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <FacebookIcon size={14} className="text-blue-600" />
                  Handle Facebook
                </label>
                <input
                  type="text"
                  placeholder="@upzzakatunsil"
                  value={formData.sosialMedia.facebook.handle}
                  onChange={(e) => handleChangeSosmed("facebook", "handle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Facebook
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/upzzakatunsil"
                  value={formData.sosialMedia.facebook.url}
                  onChange={(e) => handleChangeSosmed("facebook", "url", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <InstagramIcon size={14} className="text-pink-600" />
                  Handle Instagram
                </label>
                <input
                  type="text"
                  placeholder="@upzzakat.unsil"
                  value={formData.sosialMedia.instagram.handle}
                  onChange={(e) => handleChangeSosmed("instagram", "handle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Instagram
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/upzzakat.unsil"
                  value={formData.sosialMedia.instagram.url}
                  onChange={(e) => handleChangeSosmed("instagram", "url", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>

            {/* Twitter / X */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <TwitterIcon size={14} className="text-gray-900" />
                  Handle Twitter / X
                </label>
                <input
                  type="text"
                  placeholder="@upzzakatunsil"
                  value={formData.sosialMedia.twitter.handle}
                  onChange={(e) => handleChangeSosmed("twitter", "handle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Twitter / X
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/upzzakatunsil"
                  value={formData.sosialMedia.twitter.url}
                  onChange={(e) => handleChangeSosmed("twitter", "url", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <YoutubeIcon size={14} className="text-red-600" />
                  Handle YouTube
                </label>
                <input
                  type="text"
                  placeholder="UPZ Zakat Unsil"
                  value={formData.sosialMedia.youtube.handle}
                  onChange={(e) => handleChangeSosmed("youtube", "handle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL YouTube
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@upzzakatunsil"
                  value={formData.sosialMedia.youtube.url}
                  onChange={(e) => handleChangeSosmed("youtube", "url", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            SEKSI 5: PRATINJAU LANGSUNG (LIVE PREVIEW)
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-gray-50/50 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={16} className="text-brand-600" />
            <h3 className="text-xs sm:text-sm font-bold">
              Pratinjau Informasi Halaman Kontak Publik
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Preview Alamat */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1">
              <span className="inline-block p-2 rounded-lg bg-emerald-50 text-emerald-700 mb-1">
                <MapPin size={16} />
              </span>
              <p className="font-bold text-gray-900 text-xs">Alamat Kantor</p>
              <p className="text-[11px] text-gray-600 leading-tight">
                {formData.infoUtama.alamat || "-"}
              </p>
            </div>

            {/* Preview WhatsApp */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1">
              <span className="inline-block p-2 rounded-lg bg-emerald-50 text-emerald-700 mb-1">
                <Phone size={16} />
              </span>
              <p className="font-bold text-gray-900 text-xs">WhatsApp &amp; Layanan</p>
              <p className="text-[11px] font-semibold text-emerald-700">
                {formData.infoUtama.whatsapp || "-"}
              </p>
              <p className="text-[10px] text-gray-400">
                {formData.infoUtama.subteksWa || "-"}
              </p>
            </div>

            {/* Preview Email */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1">
              <span className="inline-block p-2 rounded-lg bg-emerald-50 text-emerald-700 mb-1">
                <Mail size={16} />
              </span>
              <p className="font-bold text-gray-900 text-xs">Email Resmi</p>
              <p className="text-[11px] font-semibold text-gray-800">
                {formData.infoUtama.email || "-"}
              </p>
              <p className="text-[10px] text-gray-400">
                {formData.infoUtama.subteksEmail || "-"}
              </p>
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
