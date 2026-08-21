import { useState, useEffect } from "react";
import {
  Wallet,
  HandCoins,
  Users,
  HeartHandshake,
} from "lucide-react";
import { getPublicLaporan } from "../services/donasiService";
import { useSettings } from "../services/settingService";

const DEFAULT_PENERIMAAN = [
  { label: "Zakat Penghasilan", amount: 850000000 },
  { label: "Infak & Sedekah", amount: 480000000 },
  { label: "Donasi Online", amount: 220000000 },
];

const DEFAULT_PENYALURAN = [
  { label: "Beasiswa Pendidikan", amount: 400000000 },
  { label: "Bantuan Kesehatan", amount: 250000000 },
  { label: "Santunan Yatim & Dhuafa", amount: 300000000 },
  { label: "Pemberdayaan Ekonomi", amount: 300000000 },
];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function RincianList({ title, items, total }) {
  const safeTotal = total > 0 ? total : 1;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {items.map((item) => {
          const percent = Math.min(100, Math.round((item.amount / safeTotal) * 100));

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {item.label}
                </span>

                <span className="font-semibold text-gray-900">
                  {formatRupiah(item.amount)}
                </span>
              </div>

              <div className="mt-1.5 w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">
          Total
        </span>

        <span className="text-sm font-bold text-brand-700">
          {formatRupiah(total)}
        </span>
      </div>
    </div>
  );
}

export default function LaporanPage() {
  const settings = useSettings();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLaporan() {
      setLoading(true);
      try {
        const res = await getPublicLaporan();
        if (res) {
          setData(res);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    loadLaporan();
  }, []);

  const totalPenerimaan = data?.penerimaan?.length
    ? data.penerimaan.reduce((sum, i) => sum + i.amount, 0)
    : DEFAULT_PENERIMAAN.reduce((sum, i) => sum + i.amount, 0);

  const totalPenyaluran = data?.penyaluran?.length
    ? data.penyaluran.reduce((sum, i) => sum + i.amount, 0)
    : DEFAULT_PENYALURAN.reduce((sum, i) => sum + i.amount, 0);

  const penerimaanList = data?.penerimaan?.length ? data.penerimaan : DEFAULT_PENERIMAAN;
  const penyaluranList = data?.penyaluran?.length ? data.penyaluran : DEFAULT_PENYALURAN;

  const stats = [
    {
      icon: Wallet,
      label: "Total Dana Terkumpul",
      value: formatRupiah(data?.total_masuk ?? totalPenerimaan),
      period: `Tahun ${data?.tahun || new Date().getFullYear()}`,
    },
    {
      icon: HandCoins,
      label: "Total Dana Disalurkan",
      value: formatRupiah(data?.total_keluar ?? totalPenyaluran),
      period: `Tahun ${data?.tahun || new Date().getFullYear()}`,
    },
    {
      icon: Users,
      label: "Total Muzakki Aktif",
      value: `${data?.total_muzakki ?? 1580} Orang`,
      period: `Terdaftar`,
    },
    {
      icon: HeartHandshake,
      label: "Total Mustahik Aktif",
      value: `${data?.total_mustahik ?? 3120} Orang`,
      period: `Penerima Manfaat`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Laporan Keuangan & Transparansi
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              {settings?.profil?.namaLembaga || "UPZ Unsil"} berkomitmen mengelola dana zakat, infak, dan sedekah
              secara transparan dan akuntabel. Berikut ringkasan penerimaan
              dan penyaluran dana publik.
            </p>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400">Memuat laporan dari database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon size={18} />
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-base sm:text-lg font-bold text-gray-900 truncate">
                    {stat.value}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    {stat.period}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Rincian */}
      <section className="max-w-4xl mx-auto px-6 pb-16 grid sm:grid-cols-2 gap-6">
        <RincianList
          title="Rincian Penerimaan"
          items={penerimaanList}
          total={totalPenerimaan}
        />

        <RincianList
          title="Rincian Penyaluran"
          items={penyaluranList}
          total={totalPenyaluran}
        />
      </section>

    </div>
  );
}