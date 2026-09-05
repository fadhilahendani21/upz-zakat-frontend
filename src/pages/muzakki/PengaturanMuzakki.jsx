import { useState } from "react";
import { Lock, Bell, Globe, Shield, Eye, EyeOff } from "lucide-react";

export default function PengaturanMuzakki() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    reminder: false,
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    alert("Password berhasil diubah!");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("muzakki_notifications", JSON.stringify(notifications));
    alert("Pengaturan notifikasi berhasil disimpan!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola preferensi dan keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Ubah Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Ubah Password
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Notifikasi</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-500">
                  Terima notifikasi via email
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Notifikasi WhatsApp</p>
                <p className="text-sm text-gray-500">
                  Terima notifikasi via WhatsApp
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={(e) =>
                    setNotifications({ ...notifications, whatsapp: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Pengingat Zakat</p>
                <p className="text-sm text-gray-500">
                  Ingatkan saya setiap bulan
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.reminder}
                  onChange={(e) =>
                    setNotifications({ ...notifications, reminder: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <button
              onClick={handleSaveNotifications}
              className="w-full mt-4 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Privasi & Keamanan</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5"></div>
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-gray-600 mt-1">
                  Aktifkan verifikasi 2 langkah untuk keamanan tambahan
                </p>
                <button className="text-emerald-600 font-medium mt-2 hover:underline">
                  Aktifkan →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5"></div>
              <div>
                <p className="font-medium text-gray-900">Riwayat Login</p>
                <p className="text-gray-600 mt-1">
                  Lihat aktivitas login akun Anda
                </p>
                <button className="text-emerald-600 font-medium mt-2 hover:underline">
                  Lihat Riwayat →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5"></div>
              <div>
                <p className="font-medium text-gray-900">Data Pribadi</p>
                <p className="text-gray-600 mt-1">
                  Kelola data pribadi dan preferensi Anda
                </p>
                <button className="text-emerald-600 font-medium mt-2 hover:underline">
                  Kelola →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Bahasa & Regional</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bahasa
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Bahasa Indonesia</option>
                <option>English</option>
                <option>العربية (Arabic)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona Waktu
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>WIB (GMT+7)</option>
                <option>WITA (GMT+8)</option>
                <option>WIT (GMT+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format Mata Uang
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Rupiah (Rp)</option>
                <option>US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
