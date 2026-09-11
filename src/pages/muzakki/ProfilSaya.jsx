import { useState } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Edit2,
  Save,
  X,
  UserRound,
  ShieldCheck,
} from "lucide-react";

export default function ProfilSaya() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("muzakki_user");

    try {
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    nip: user.nip || "",
    faculty: user.faculty || "",
    study_program: user.study_program || "",
  });

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
    };

    localStorage.setItem(
      "muzakki_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      nip: user.nip || "",
      faculty: user.faculty || "",
      study_program: user.study_program || "",
    });

    setIsEditing(false);
  };

  const initial =
    user.name?.charAt(0)?.toUpperCase() || "M";

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

        {/* Top Section */}
        <div className="p-4 sm:p-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0">
              {initial}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">
                Profil Muzakki
              </p>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {user.name || "Nama Muzakki"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {user.study_program || user.faculty || "Muzakki UPZ UNSIL"}
              </p>
            </div>

            {/* Action */}
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
              >
                <Edit2 size={16} />
                Edit Profil
              </button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  <X size={16} />
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                >
                  <Save size={16} />
                  Simpan
                </button>

              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            INFORMATION
        ===================================================== */}
        <div className="p-4 sm:p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Nama */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <div className="flex items-center gap-2 min-h-[40px]">
                  <UserRound
                    size={16}
                    className="text-gray-400 shrink-0"
                  />

                  <p className="text-sm text-gray-900">
                    {user.name || "-"}
                  </p>
                </div>
              )}
            </div>

            {/* NIP */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                NIP
              </label>

              <div className="flex items-center min-h-[40px]">
                <p className="text-sm text-gray-900">
                  {user.nip || "-"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>

              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <div className="flex items-center gap-2 min-h-[40px]">
                  <Mail
                    size={16}
                    className="text-gray-400 shrink-0"
                  />

                  <p className="text-sm text-gray-900 break-all">
                    {user.email || "-"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                No. Handphone
              </label>

              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <div className="flex items-center gap-2 min-h-[40px]">
                  <Phone
                    size={16}
                    className="text-gray-400 shrink-0"
                  />

                  <p className="text-sm text-gray-900">
                    {user.phone || "-"}
                  </p>
                </div>
              )}
            </div>

            {/* Fakultas */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Fakultas
              </label>

              <div className="flex items-center gap-2 min-h-[40px]">
                <Briefcase
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <p className="text-sm text-gray-900">
                  {user.faculty || "-"}
                </p>
              </div>
            </div>

            {/* Program Studi */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Program Studi
              </label>

              <div className="flex items-center gap-2 min-h-[40px]">
                <MapPin
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <p className="text-sm text-gray-900">
                  {user.study_program || "-"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          STATUS MUZAKKI
      ===================================================== */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-4 sm:p-5">

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <ShieldCheck
              size={17}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Status Muzakki
            </h3>

            <p className="text-xs text-gray-500">
              Informasi status akun Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Status Akun */}
          <div className="bg-white rounded-lg border border-gray-100 p-3.5">
            <p className="text-xs text-gray-500">
              Status Akun
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <p className="text-base font-bold text-emerald-600">
                Aktif
              </p>
            </div>
          </div>

          {/* Terdaftar */}
          <div className="bg-white rounded-lg border border-gray-100 p-3.5">
            <p className="text-xs text-gray-500">
              Terdaftar Sejak
            </p>

            <p className="text-base font-bold text-gray-900 mt-1.5">
              Jan 2025
            </p>
          </div>

          {/* Pembayaran */}
          <div className="bg-white rounded-lg border border-gray-100 p-3.5">
            <p className="text-xs text-gray-500">
              Total Pembayaran
            </p>

            <p className="text-base font-bold text-gray-900 mt-1.5">
              12 kali
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}