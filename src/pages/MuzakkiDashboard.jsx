import { useState } from "react";
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

export default function MuzakkiDashboard() {
  const user = JSON.parse(localStorage.getItem("muzakki_user") || "{}");

  const paymentHistory = [
    { date: "10 Sep 2025", type: "Zakat Penghasilan", period: "September 2025", amount: 500000, method: "Transfer Bank", status: "Lunas" },
    { date: "10 Agu 2025", type: "Zakat Penghasilan", period: "Agustus 2025", amount: 500000, method: "QRIS", status: "Lunas" },
    { date: "10 Jul 2025", type: "Zakat Penghasilan", period: "Juli 2025", amount: 500000, method: "Transfer Bank", status: "Lunas" },
    { date: "10 Jun 2025", type: "Zakat Penghasilan", period: "Juni 2025", amount: 500000, method: "Virtual Account", status: "Lunas" },
    { date: "10 Mei 2025", type: "Zakat Penghasilan", period: "Mei 2025", amount: 500000, method: "Transfer Bank", status: "Lunas" },
  ];

  const stats = [
    { label: "Total Zakat Tahun 2025", value: "Rp 6.000.000" },
    { label: "Jumlah Pembayaran", value: "12 kali" },
    { label: "Zakat Bulanan", value: "Rp 500.000" },
    { label: "Status Muzakki", value: "Aktif", icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#064f35] to-[#0b7548] p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Selamat Datang, {user.name || "Muzakki"}!</h1>
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
              {user.name?.[0] || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-800">{user.name || "Muzakki"}</p>
              <p className="text-sm text-gray-500">Dosen</p>
              <div className="mt-1 space-y-0.5 text-sm">
                <p><span className="text-gray-500">NIP:</span> <span className="font-medium">{user.nip || "198012052005011002"}</span></p>
                <p><span className="text-gray-500">Fakultas:</span> <span className="font-medium">{user.faculty || "Fakultas Teknik"}</span></p>
                <p><span className="text-gray-500">Program Studi:</span> <span className="font-medium">{user.study_program || "Teknik Informatika"}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-medium">{user.email || "randi.rizal@unsil.ac.id"}</span></p>
                <p><span className="text-gray-500">No. Handphone:</span> <span className="font-medium">{user.phone || "0812 3456 7890"}</span></p>
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

      {/* Cards: Kartu Muzakki & NPWZ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">KARTU MUZAKKI</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Aktif</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Nama:</span> <span className="font-medium">{user.name || "Ir. Randi Rizal, PhD."}</span></p>
            <p><span className="text-gray-500">NIP:</span> <span className="font-medium">{user.nip || "198012052005011002"}</span></p>
            <p><span className="text-gray-500">Unit Kerja:</span> <span className="font-medium">{user.faculty || "Fakultas Teknik"}</span></p>
            <p><span className="text-gray-500">No. Kartu:</span> <span className="font-medium">MZK-2025-000123</span></p>
          </div>
          <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
              <QrCode size={28} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500">Scan untuk verifikasi</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">BAZNASCARD</h3>
            <span className="text-xs text-gray-500">NPWZ</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">NPWZ:</span> <span className="font-medium">3171100 1 2655941</span></p>
            <p><span className="text-gray-500">MUZAKI:</span> <span className="font-medium">{user.name || "Ir. Randi Rizal, PhD."}</span></p>
            <p><span className="text-gray-500">TERDAFTAR:</span> <span className="font-medium">17/01/2015</span></p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic">Amanah, Transparan dan Profesional</p>
            <div className="mt-2 h-8 w-12 bg-green-100 rounded flex items-center justify-center text-xs text-green-700 font-bold">
              BAZNAS
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
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
                <th className="px-3 py-2 text-left">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.date}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.type}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.period}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-800">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{item.method}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                      <CheckCircle size={12} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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