import { useState, useEffect } from "react";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Lock,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { inputCls } from "../../components/dashboard/ui";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../../services/penggunaService";
import { logout } from "../../services/authService";

export default function Pengguna() {
  const [activeTab, setActiveTab] = useState("profil"); // 'profil' | 'keamanan' | 'sesi'
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "administrator",
    created_at: null,
  });
  const [loading, setLoading] = useState(true);

  // Form profil state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Form password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!name.trim()) {
      setProfileError("Nama tidak boleh kosong.");
      return;
    }
    if (!email.trim()) {
      setProfileError("Email tidak boleh kosong.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateProfile({ name, email });
      setProfileSuccess(res.message || "Profil berhasil diperbarui!");
      setProfile((prev) => ({ ...prev, name, email }));
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err.message || "Gagal memperbarui profil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Password saat ini wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setPasswordSuccess(res.message || "Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      setPasswordError(err.message || "Gagal mengubah password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleLogout() {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      await logout();
      window.location.href = "/masuk";
    }
  }

  const initialLetter = (profile.name || "A").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-brand-600/20 shrink-0">
              {initialLetter}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {loading ? "Memuat..." : profile.name}
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {profile.role || "Administrator"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Mail size={13} className="text-gray-400" />
                {loading ? "..." : profile.email}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <Building2 size={13} className="text-gray-400" />
                UPZ Universitas Siliwangi (Tasikmalaya)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
            >
              <LogOut size={14} />
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 mt-6 pt-4 overflow-x-auto">
          {[
            { id: "profil", label: "Profil Saya", icon: User },
            { id: "keamanan", label: "Keamanan & Sandi", icon: Lock },
            { id: "sesi", label: "Sesi & Hak Akses", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Profil */}
      {activeTab === "profil" && (
        <Card className="!p-6 max-w-2xl">
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Informasi Akun
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Perbarui identitas dan kontak login akun pengelola UPZ.
            </p>
          </div>

          {profileSuccess && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama admin"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Alamat Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unsil.ac.id"
                className={inputCls}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Email digunakan untuk login ke portal sistem dashboard UPZ.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Instansi / Lembaga
              </label>
              <input
                type="text"
                disabled
                value="Unit Pengumpul Zakat (UPZ) Universitas Siliwangi"
                className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Keamanan */}
      {activeTab === "keamanan" && (
        <Card className="!p-6 max-w-2xl">
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Ganti Password
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Gunakan kombinasi password yang kuat untuk menjaga keamanan data keuangan UPZ.
            </p>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Password Saat Ini *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Password Baru *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Konfirmasi Password Baru *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-600 space-y-1">
              <p className="font-semibold text-gray-700">Tips Keamanan Akun:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                <li>Gunakan minimal 6 karakter kombinasi huruf dan angka.</li>
                <li>Jangan gunakan tanggal lahir atau kata yang mudah ditebak.</li>
                <li>Jangan bagikan password kepada pihak lain tanpa otorisasi.</li>
              </ul>
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Mengubah Password..." : "Perbarui Password"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Sesi & Hak Akses */}
      {activeTab === "sesi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          <Card className="!p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Tingkat Hak Akses
                </h3>
                <p className="text-xs text-gray-400">Role & Perizinan Sistem</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Role Utama:</span>
                <span className="font-semibold text-brand-700 capitalize">
                  {profile.role || "Administrator"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Izin Pengumpulan:</span>
                <span className="text-emerald-600 font-medium">Baca & Tulis</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Izin Penyaluran:</span>
                <span className="text-emerald-600 font-medium">Baca & Tulis</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Izin Jurnal & Rekening:</span>
                <span className="text-emerald-600 font-medium">Penuh (Full Access)</span>
              </div>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Sesi Login Aktif
                </h3>
                <p className="text-xs text-gray-400">Status Token & Keamanan</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Status Sesi:</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif & Terautentikasi
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Tipe Token:</span>
                <span className="font-mono text-gray-700">Bearer Sanctum Token</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Device/Browser:</span>
                <span className="text-gray-700">Browser Aktif</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Akhiri Sesi Login Ini
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
