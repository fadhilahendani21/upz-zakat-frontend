import { useState, useEffect, useCallback } from "react";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Lock,
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Crown,
  UserCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { inputCls } from "../../components/dashboard/ui";
import {
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/penggunaService";
import { logout, getUser } from "../../services/authService";
import ConfirmModal from "../../components/common/ConfirmModal";

// ─── Komponen Modal Tambah / Edit Pengguna ────────────────────────────────────
function UserModal({ isOpen, onClose, onSaved, editData = null }) {
  const isEdit = !!editData;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(editData?.name || "");
      setEmail(editData?.email || "");
      setRole(editData?.role || "operator");
      setPassword("");
      setError("");
    }
  }, [isOpen, editData]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isEdit && password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (isEdit && password && password.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateUser(editData.id, { name, email, password: password || undefined, role });
      } else {
        await createUser({ name, email, password, role });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEdit ? "bg-blue-50 text-blue-600" : "bg-brand-50 text-brand-600"}`}>
            {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </h2>
            <p className="text-xs text-gray-400">
              {isEdit ? "Perbarui data akun pengguna." : "Buat akun akses baru untuk staf UPZ."}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama pengguna"
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
              placeholder="email@upz-unsil.ac.id"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              {isEdit ? "Kata Sandi Baru (opsional)" : "Kata Sandi *"}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "Kosongkan jika tidak ingin diubah" : "Min. 8 karakter"}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Peran / Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputCls}
            >
              <option value="administrator">Administrator — Akses Penuh</option>
              <option value="operator">Operator — Akses Transaksi</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {role === "administrator"
                ? "Administrator dapat mengelola semua fitur termasuk pengaturan sistem dan manajemen pengguna."
                : "Operator dapat mencatat pengumpulan, penyaluran, dan data mustahik/muzakki. Tidak dapat mengakses pengaturan sistem."}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const isAdmin = role === "administrator";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
        isAdmin
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-blue-50 text-blue-700 border border-blue-200"
      }`}
    >
      {isAdmin ? <Crown size={10} /> : <UserCheck size={10} />}
      {isAdmin ? "Administrator" : "Operator"}
    </span>
  );
}

// ─── Tab: Manajemen Pengguna ──────────────────────────────────────────────────
function TabManajemenPengguna({ currentUserId }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({ search, role: roleFilter, page });
      setData(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  function handleSaved() {
    setSuccessMsg("Data pengguna berhasil disimpan.");
    setTimeout(() => setSuccessMsg(""), 4000);
    fetchUsers();
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteUser(deleteTarget.id);
      setSuccessMsg(`Pengguna "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus pengguna.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Stat mini */}
      {meta && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Pengguna", value: meta.total, color: "bg-brand-50 text-brand-700" },
            { label: "Administrator", value: meta.total_admin, color: "bg-amber-50 text-amber-700" },
            { label: "Operator", value: meta.total_operator, color: "bg-blue-50 text-blue-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3 ${s.color} border border-current/10`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] font-medium mt-0.5 opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">Semua Role</option>
            <option value="administrator">Administrator</option>
            <option value="operator">Operator</option>
          </select>
        </div>
        <Button icon={Plus} onClick={() => { setEditTarget(null); setShowModal(true); }}>
          Tambah Pengguna
        </Button>
      </div>

      {/* Tabel */}
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">Peran</th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">Dibuat</th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Tidak ada pengguna ditemukan.</td>
                </tr>
              ) : (
                data.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            {isSelf && (
                              <span className="text-[10px] text-brand-600 font-semibold">● Akun Anda</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setEditTarget(u); setShowModal(true); }}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => { setDeleteError(""); setDeleteTarget(u); }}
                            disabled={isSelf}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isSelf ? "Tidak bisa menghapus akun sendiri" : "Hapus"}
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

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Hal. {meta.current_page} dari {meta.last_page} ({meta.total} pengguna)
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal tambah/edit */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSaved={handleSaved}
        editData={editTarget}
      />

      {/* Konfirmasi hapus */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Pengguna?"
        message={
          deleteTarget
            ? `Akun "${deleteTarget.name}" (${deleteTarget.email}) akan dihapus secara permanen dan tidak dapat dikembalikan. Semua sesi login pengguna ini juga akan diakhiri.`
            : ""
        }
        confirmText={deleting ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        variant="danger"
        errorMessage={deleteError}
      />
    </div>
  );
}

// ─── Halaman Utama Pengguna ───────────────────────────────────────────────────
export default function Pengguna() {
  const currentUser = getUser();
  const isAdmin = currentUser?.role === "administrator";

  const [activeTab, setActiveTab] = useState("profil");
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    setSavingProfile(true);
    setProfileSuccess("");
    setProfileError("");
    try {
      const res = await updateProfile({ name, email });
      // updateProfile mengembalikan { message, user } — ambil user-nya
      const updatedUser = res?.user || res;
      setProfile(updatedUser);
      setProfileSuccess("Profil berhasil diperbarui!");
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
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword({
        current_password: currentPassword,
        new_password: newPassword,                    // ← sesuai nama field di backend
        new_password_confirmation: confirmPassword,   // ← sesuai nama field di backend
      });
      setPasswordSuccess("Password berhasil diubah!");
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

  async function handleConfirmLogout() {
    await logout();
    window.location.href = "/masuk";
  }

  const initialLetter = (profile.name || "A").charAt(0).toUpperCase();

  const tabs = [
    { id: "profil", label: "Profil Saya", icon: User },
    { id: "keamanan", label: "Keamanan & Sandi", icon: Lock },
    { id: "sesi", label: "Sesi & Hak Akses", icon: Shield },
    ...(isAdmin ? [{ id: "manajemen", label: "Manajemen Pengguna", icon: Users }] : []),
  ];

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
                <RoleBadge role={profile.role || "administrator"} />
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
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
            >
              <LogOut size={14} />
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 mt-6 pt-4 overflow-x-auto">
          {tabs.map((tab) => {
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
            <h2 className="text-base font-semibold text-gray-900">Informasi Akun</h2>
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
            <h2 className="text-base font-semibold text-gray-900">Ganti Password</h2>
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
                  placeholder="Min. 8 karakter"
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
                <li>Gunakan minimal 8 karakter kombinasi huruf dan angka.</li>
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
                <h3 className="font-semibold text-gray-900 text-sm">Tingkat Hak Akses</h3>
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
                <span className={`font-medium ${isAdmin ? "text-emerald-600" : "text-red-500"}`}>
                  {isAdmin ? "Penuh (Full Access)" : "Tidak Ada Akses"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Manajemen Pengguna:</span>
                <span className={`font-medium ${isAdmin ? "text-emerald-600" : "text-red-500"}`}>
                  {isAdmin ? "Penuh (Full Access)" : "Tidak Ada Akses"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Pengaturan Sistem:</span>
                <span className={`font-medium ${isAdmin ? "text-emerald-600" : "text-red-500"}`}>
                  {isAdmin ? "Penuh (Full Access)" : "Tidak Ada Akses"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Sesi Login Aktif</h3>
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
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Akhiri Sesi Login Ini
            </button>
          </Card>
        </div>
      )}

      {/* Tab 4: Manajemen Pengguna (Admin only) */}
      {activeTab === "manajemen" && isAdmin && (
        <TabManajemenPengguna currentUserId={profile.id} />
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Keluar dari Sistem?"
        message="Apakah Anda yakin ingin mengakhiri sesi login saat ini? Anda harus memasukkan kredensial akun kembali untuk mengakses dashboard."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
