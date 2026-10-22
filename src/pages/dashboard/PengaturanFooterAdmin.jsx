import { useState, useEffect } from "react";
import {
  LayoutTemplate,
  MapPin,
  Phone,
  Mail,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "../../components/common/SocialIcons";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

// ============================================================================
// DUMMY DATA AWAL (Sebelum Backend Laravel selesai)
// ============================================================================
const DUMMY_FOOTER_SETTINGS = {
  deskripsi:
    "Unit Pengumpul Zakat (UPZ) Universitas Siliwangi berkomitmen dalam mengelola dan menyalurkan zakat, infak, dan sedekah secara amanah, transparan, dan tepat sasaran untuk kemaslahatan civitas akademika dan masyarakat.",
  sosialMedia: {
    instagram: "https://instagram.com/upzunsil",
    facebook: "https://facebook.com/upzunsil",
    youtube: "https://youtube.com/@upzunsil",
  },
  kontak: {
    alamat:
      "Jl. Siliwangi No. 24, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115",
    telepon: "081234567890",
    email: "upz@unsil.ac.id",
  },
};

const STORAGE_KEY = "upz_footer_settings";

export default function PengaturanFooterAdmin() {
  // 1. STATE FORM & STATUS
  const [formData, setFormData] = useState(DUMMY_FOOTER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // 2. FUNGSI FETCH DATA AWAL (handleFetch)
  const handleFetch = async () => {
    try {
      setLoading(true);

      // ======================================================================
      // TODO: Ganti dengan Axios / Fetch ke API Backend Laravel jika sudah siap:
      //
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/public/pengaturan-footer`, {
      //   headers: { Accept: "application/json" }
      // });
      // const json = await res.json();
      // if (res.ok && json.data) {
      //   setFormData(json.data);
      //   return;
      // }
      // ======================================================================

      // SIMULASI DUMMY DATA / LOCALSTORAGE SEMENTARA:
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulasi jeda network
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      } else {
        setFormData(DUMMY_FOOTER_SETTINGS);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan footer:", err);
      showToast("error", "Gagal memuat data pengaturan footer.");
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

  // Helper perubahan input bertingkat
  const handleChangeDeskripsi = (val) => {
    setFormData((prev) => ({ ...prev, deskripsi: val }));
  };

  const handleChangeSosmed = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      sosialMedia: { ...prev.sosialMedia, [field]: val },
    }));
  };

  const handleChangeKontak = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      kontak: { ...prev.kontak, [field]: val },
    }));
  };

  // 3. FUNGSI SIMPAN PERUBAHAN (handleSave)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // ======================================================================
      // TODO: Ganti dengan Axios / Fetch PUT atau POST ke API Backend Laravel:
      //
      // const token = localStorage.getItem("token");
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/pengaturan-footer`, {
      //   method: "POST", // atau "PUT"
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const json = await res.json();
      // if (!res.ok) throw new Error(json.message || "Gagal menyimpan ke server");
      // ======================================================================

      // SIMULASI PENYIMPANAN SEMENTARA KE LOCALSTORAGE:
      await new Promise((resolve) => setTimeout(resolve, 600)); // Jeda simulasi server
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      // Kirim event agar footer publik bisa update langsung jika sedang di-tab yang sama
      window.dispatchEvent(
        new CustomEvent("upz_footer_updated", { detail: formData })
      );

      showToast("success", "Pengaturan footer berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan footer:", err);
      showToast("error", err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  // 4. RESET KE DATA DEFAULT
  const handleReset = () => {
    if (confirm("Kembalikan informasi footer ke nilai default awal?")) {
      setFormData(DUMMY_FOOTER_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("upz_footer_updated", { detail: DUMMY_FOOTER_SETTINGS })
      );
      showToast("success", "Pengaturan footer dikembalikan ke default.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 size={32} className="animate-spin text-brand-600 mb-3" />
        <p className="text-sm font-medium">Memuat formulir pengaturan footer...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notifikasi Feedback */}
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
              Pengaturan Footer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100">
              Halaman Publik
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Kelola teks deskripsi lembaga, tautan sosial media resmi, dan kontak yang tampil di footer.
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
            SEKSI 1: DESKRIPSI SINGKAT
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Deskripsi Singkat Lembaga
              </h2>
              <p className="text-[11px] text-gray-500">
                Teks ringkasan komitmen UPZ yang tampil tepat di bawah logo pada kolom utama footer.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Teks Deskripsi / Profil Singkat
            </label>
            <textarea
              rows={4}
              required
              value={formData.deskripsi}
              onChange={(e) => handleChangeDeskripsi(e.target.value)}
              placeholder="Tuliskan deskripsi singkat profil dan komitmen lembaga..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
              <span>Disarankan 2 - 4 kalimat padat agar footer tetap proporsional.</span>
              <span>{formData.deskripsi.length} karakter</span>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            SEKSI 2: SOSIAL MEDIA RESMI
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <InstagramIcon size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Tautan Media Sosial Resmi
              </h2>
              <p className="text-[11px] text-gray-500">
                Ikon tombol sosial media di footer akan mengarah ke alamat URL berikut.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <InstagramIcon size={14} className="text-pink-600" />
                URL Instagram
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://instagram.com/upzunsil"
                  value={formData.sosialMedia.instagram}
                  onChange={(e) => handleChangeSosmed("instagram", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FacebookIcon size={14} className="text-blue-600" />
                URL Facebook
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://facebook.com/upzunsil"
                  value={formData.sosialMedia.facebook}
                  onChange={(e) => handleChangeSosmed("facebook", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <YoutubeIcon size={14} className="text-red-600" />
                URL YouTube
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://youtube.com/@upzunsil"
                  value={formData.sosialMedia.youtube}
                  onChange={(e) => handleChangeSosmed("youtube", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            SEKSI 3: INFORMASI KONTAK & ALAMAT
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Informasi Kontak & Layanan
              </h2>
              <p className="text-[11px] text-gray-500">
                Kontak pada kolom "Hubungi Kami" di footer website publik.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Alamat Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600" />
                Alamat Kantor / Sekretariat
              </label>
              <textarea
                rows={2}
                required
                value={formData.kontak.alamat}
                onChange={(e) => handleChangeKontak("alamat", e.target.value)}
                placeholder="Alamat lengkap gedung / kampus..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp / Telepon */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-600" />
                  Nomor WhatsApp / Hotline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.kontak.telepon}
                  onChange={(e) => handleChangeKontak("telepon", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Akan otomatis ditautkan ke link wa.me pada footer publik.
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-600" />
                  Alamat Email Resmi
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: upz@unsil.ac.id"
                  value={formData.kontak.email}
                  onChange={(e) => handleChangeKontak("email", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================================================
            SEKSI 4: LIVE PREVIEW MINI FOOTER
        =================================================================== */}
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-gray-50/50 space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={16} className="text-brand-600" />
            <h3 className="text-xs sm:text-sm font-bold">
              Pratinjau Langsung (Live Preview di Footer Publik)
            </h3>
          </div>

          <div className="bg-[#175621] text-white p-5 rounded-xl text-xs space-y-3">
            <p className="text-green-100 leading-relaxed text-[11px] max-w-xl">
              {formData.deskripsi || "(Deskripsi belum diisi)"}
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <span className="text-green-300 text-[10px]">Sosmed:</span>
              <span className="text-white font-mono text-[10px]">
                IG: {formData.sosialMedia.instagram ? "Aktif" : "-"} | FB:{" "}
                {formData.sosialMedia.facebook ? "Aktif" : "-"} | YT:{" "}
                {formData.sosialMedia.youtube ? "Aktif" : "-"}
              </span>
            </div>

            <div className="text-[10px] text-green-200 space-y-0.5 pt-1">
              <p>📍 {formData.kontak.alamat || "(Alamat belum diisi)"}</p>
              <p>📞 WA: {formData.kontak.telepon || "-"} | ✉️ {formData.kontak.email || "-"}</p>
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
