import { useState } from "react";
import { User, Mail, Phone, Briefcase, MapPin, Edit2, Save, X } from "lucide-react";

export default function ProfilSaya() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("muzakki_user");
    return stored ? JSON.parse(stored) : {};
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
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("muzakki_user", JSON.stringify(updatedUser));
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi profil Anda
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Edit2 size={16} />
            Edit Profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <X size={16} />
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Save size={16} />
              Simpan
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0) || "M"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user.name || "-"}</p>
              )}
            </div>

            {/* NIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP
              </label>
              <p className="text-gray-900">{user.nip || "-"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail size={14} className="inline mr-1" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.email || "-"}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={14} className="inline mr-1" />
                  No. Handphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone || "-"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fakultas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Briefcase size={14} className="inline mr-1" />
                  Fakultas
                </label>
                <p className="text-gray-900">{user.faculty || "-"}</p>
              </div>

              {/* Program Studi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={14} className="inline mr-1" />
                  Program Studi
                </label>
                <p className="text-gray-900">{user.study_program || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Muzakki */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Muzakki</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Status Akun</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">Aktif</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Terdaftar Sejak</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Jan 2025</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Pembayaran</p>
            <p className="text-xl font-bold text-gray-900 mt-1">12 kali</p>
          </div>
        </div>
      </div>
    </div>
  );
}
