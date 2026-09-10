import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  CreditCard,
  IdCard,
  Wallet,
  Calendar,
  CheckCircle,
  ArrowRight,
  Download,
  Calculator as CalcIcon,
  HandCoins,
  FileText,
  QrCode,
  Eye,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function MuzakkiDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUnauthorized(false);
      const token = localStorage.getItem("muzakki_token");
      
      if (!token) {
        setIsUnauthorized(true);
        setError("Sesi login telah berakhir atau token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await axios.get(`${API_URL}/muzakki/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      if (err.response?.status === 401) {
        setIsUnauthorized(true);
        localStorage.removeItem("muzakki_token");
        localStorage.removeItem("muzakki_user");
        setError("Sesi Anda telah berakhir atau tidak valid. Silakan masuk kembali.");
      } else {
        setError(err.response?.data?.message || "Gagal memuat data dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064f35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 font-medium">{error}</p>
          {isUnauthorized ? (
            <button 
              onClick={() => navigate("/muzakki/masuk")}
              className="mt-4 px-6 py-2.5 bg-[#064f35] hover:bg-[#05402b] text-white font-semibold rounded-lg transition"
            >
              Masuk Kembali
            </button>
          ) : (
            <button 
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-[#064f35] text-white rounded-lg"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  const { user, muzakki, stats, transaksi } = dashboardData || {};
  
  const statsDisplay = [
    { 
      label: `Total Zakat Tahun ${stats?.tahun || new Date().getFullYear()}`, 
      value: stats?.total_zakat_tahun_ini 
        ? `Rp ${stats.total_zakat_tahun_ini.toLocaleString("id-ID")}` 
        : "Rp 0" 
    },
    { 
      label: "Jumlah Pembayaran", 
      value: `${stats?.jumlah_pembayaran || 0} kali` 
    },
    { 
      label: "Zakat Bulanan (Rata-rata)", 
      value: stats?.zakat_bulanan 
        ? `Rp ${stats.zakat_bulanan.toLocaleString("id-ID")}` 
        : "Rp 0" 
    },
    { 
      label: "Status Muzakki", 
      value: "Aktif", 
      icon: CheckCircle 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#064f35] to-[#0b7548] p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Selamat Datang, {user?.name || "Muzakki"}!</h1>
          <p className="text-sm text-green-100 mt-1 max-w-lg">
            Terima kasih telah menjadi bagian dari gerakan kebaikan melalui zakat di Universitas Siliwangi.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-l-full flex items-center justify-end pr-6">
          <div className="text-right">
            <p className="text-xs text-green-100 font-medium">Zakat Membersihkan Harta</p>
            <p className="text-xs text-green-200">Menumbuhkan Keberkahan.</p>
          </div>
        </div>
      </div>

      {/* Profil Muzakki */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Profil Muzakki</h2>
          <button className="text-sm font-semibold text-[#08734f] hover:underline">
            Edit Profil
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-2xl shrink-0">
              {muzakki?.nama?.[0] || user?.name?.[0] || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-800">{muzakki?.nama || user?.name || "-"}</p>
              <p className="text-sm text-gray-500">{muzakki?.pekerjaan || muzakki?.kategori || "-"}</p>
              <div className="mt-1 space-y-0.5 text-sm">
                {muzakki?.nip && (
                  <p><span className="text-gray-500">NIP:</span> <span className="font-medium">{muzakki.nip}</span></p>
                )}
                {muzakki?.nik && (
                  <p><span className="text-gray-500">NIK:</span> <span className="font-medium">{muzakki.nik}</span></p>
                )}
                {muzakki?.unit_kerja && (
                  <p><span className="text-gray-500">Unit Kerja:</span> <span className="font-medium">{muzakki.unit_kerja}</span></p>
                )}
                {muzakki?.email && (
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium">{muzakki.email}</span></p>
                )}
                {muzakki?.no_hp && (
                  <p><span className="text-gray-500">No. Handphone:</span> <span className="font-medium">{muzakki.no_hp}</span></p>
                )}
              </div>
            </div>
          </div>
          <div className="md:ml-auto bg-green-50 border border-green-200 rounded-xl p-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <HandCoins size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-green-800">Zakat hari ini,</p>
                <p className="text-xs text-green-700">untuk keberkahan esok.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
              {stat.icon && (
                <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle size={14} />
                  <span>Aktif</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Riwayat Pembayaran Zakat</h2>
          <button className="text-sm font-semibold text-[#08734f] hover:underline">
            Lihat Semua →
          </button>
        </div>
        
        {transaksi && transaksi.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">No</th>
                  <th className="px-3 py-2 text-left">Tanggal</th>
                  <th className="px-3 py-2 text-left">Jenis Zakat</th>
                  <th className="px-3 py-2 text-left">Periode</th>
                  <th className="px-3 py-2 text-left">Nominal</th>
                  <th className="px-3 py-2 text-left">Metode</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transaksi.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-600">{idx + 1}</td>
                    <td className="px-3 py-2.5 text-gray-700">{item.tanggal}</td>
                    <td className="px-3 py-2.5 text-gray-700">{item.jenis_zakat}</td>
                    <td className="px-3 py-2.5 text-gray-700">{item.periode}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-800">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{item.metode}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada riwayat pembayaran zakat.</p>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: CalcIcon,
            label: "Hitung Zakat",
            desc: "Gunakan kalkulator untuk estimasi zakat Anda.",
            color: "green",
          },
          {
            icon: HandCoins,
            label: "Tunaikan Zakat",
            desc: "Lakukan pembayaran zakat sekarang.",
            color: "blue",
          },
          {
            icon: Download,
            label: "Unduh Laporan",
            desc: "Unduh rekapitulasi pembayaran zakat Anda.",
            color: "orange",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          const colorClasses = {
            green: "bg-green-50 text-green-600 border-green-200",
            blue: "bg-blue-50 text-blue-600 border-blue-200",
            orange: "bg-orange-50 text-orange-600 border-orange-200",
          };
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClasses[item.color]}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
