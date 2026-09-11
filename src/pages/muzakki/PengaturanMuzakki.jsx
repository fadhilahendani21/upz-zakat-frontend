import { useState } from "react";
import {
  Lock,
  Bell,
  Globe,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

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

    setPasswordData({
      current: "",
      new: "",
      confirm: "",
    });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem(
      "muzakki_notifications",
      JSON.stringify(notifications)
    );

    alert("Pengaturan notifikasi berhasil disimpan!");
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

        {/* =====================================================
            UBAH PASSWORD
        ===================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Lock
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Ubah Password
              </h3>

              <p className="text-xs text-gray-500">
                Perbarui password akun Anda
              </p>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-3.5"
          >
            {/* Password Lama */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Password Lama
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Password Baru
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                minLength={6}
              />

              <p className="text-[11px] text-gray-500 mt-1">
                Minimal 6 karakter
              </p>
            </div>

            {/* Konfirmasi */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Konfirmasi Password Baru
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Ubah Password
            </button>
          </form>
        </div>

        {/* =====================================================
            NOTIFIKASI
        ===================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Bell
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Notifikasi
              </h3>

              <p className="text-xs text-gray-500">
                Atur preferensi notifikasi Anda
              </p>
            </div>
          </div>

          <div className="space-y-0">

            {/* Email */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Notifikasi Email
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Terima notifikasi via email
                </p>
              </div>

              <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 transition-colors" />

                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:border-white" />
              </label>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Notifikasi WhatsApp
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Terima notifikasi via WhatsApp
                </p>
              </div>

              <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      whatsapp: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 transition-colors" />

                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:border-white" />
              </label>
            </div>

            {/* Reminder */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Pengingat Zakat
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Ingatkan saya setiap bulan
                </p>
              </div>

              <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminder}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      reminder: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 transition-colors" />

                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:border-white" />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSaveNotifications}
              className="w-full mt-4 px-4 py-2.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>

        {/* =====================================================
            PRIVASI & KEAMANAN
        ===================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Shield
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Privasi & Keamanan
              </h3>

              <p className="text-xs text-gray-500">
                Lindungi keamanan akun Anda
              </p>
            </div>
          </div>

          <div className="space-y-2.5">

            {/* 2FA */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Aktifkan verifikasi 2 langkah untuk
                  keamanan tambahan
                </p>

                <button
                  type="button"
                  className="text-xs text-emerald-600 font-medium mt-2 hover:underline"
                >
                  Aktifkan →
                </button>
              </div>
            </div>

            {/* Login History */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Riwayat Login
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Lihat aktivitas login akun Anda
                </p>

                <button
                  type="button"
                  className="text-xs text-emerald-600 font-medium mt-2 hover:underline"
                >
                  Lihat Riwayat →
                </button>
              </div>
            </div>

            {/* Data Pribadi */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Data Pribadi
                </p>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Kelola data pribadi dan preferensi Anda
                </p>

                <button
                  type="button"
                  className="text-xs text-emerald-600 font-medium mt-2 hover:underline"
                >
                  Kelola →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            BAHASA & REGIONAL
        ===================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Globe
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                Bahasa & Regional
              </h3>

              <p className="text-xs text-gray-500">
                Atur preferensi bahasa dan regional
              </p>
            </div>
          </div>

          <div className="space-y-3.5">

            {/* Bahasa */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Bahasa
              </label>

              <select
                defaultValue="Bahasa Indonesia"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option>
                  Bahasa Indonesia
                </option>

                <option>
                  English
                </option>

                <option>
                  العربية (Arabic)
                </option>
              </select>
            </div>

            {/* Zona Waktu */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Zona Waktu
              </label>

              <select
                defaultValue="WIB (GMT+7)"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option>
                  WIB (GMT+7)
                </option>

                <option>
                  WITA (GMT+8)
                </option>

                <option>
                  WIT (GMT+9)
                </option>
              </select>
            </div>

            {/* Mata Uang */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Format Mata Uang
              </label>

              <select
                defaultValue="Rupiah (Rp)"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option>
                  Rupiah (Rp)
                </option>

                <option>
                  US Dollar ($)
                </option>
              </select>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}