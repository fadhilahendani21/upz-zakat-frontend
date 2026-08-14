import {
  Wallet,
  HandCoins,
  Users,
  HeartHandshake,
} from "lucide-react";

const STATS = [
  {
    icon: Wallet,
    label: "Total Dana Terkumpul",
    value: "Rp 1,55 M",
    period: "Tahun 2026",
  },
  {
    icon: HandCoins,
    label: "Total Dana Disalurkan",
    value: "Rp 1,25 M",
    period: "Tahun 2026",
  },
  {
    icon: Users,
    label: "Total Muzakki",
    value: "1.580 Orang",
    period: "Tahun 2026",
  },
  {
    icon: HeartHandshake,
    label: "Total Penerima Manfaat",
    value: "3.120 Orang",
    period: "Kumulatif",
  },
];

const PENERIMAAN = [
  { label: "Zakat Penghasilan", amount: 850000000 },
  { label: "Infak & Sedekah", amount: 480000000 },
  { label: "Donasi Online", amount: 220000000 },
];

const PENYALURAN = [
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
  }).format(value);
}

function RincianList({ title, items, total }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {items.map((item) => {
          const percent = Math.round((item.amount / total) * 100);

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
                  className="h-full bg-brand-500 rounded-full"
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
  const totalPenerimaan = PENERIMAAN.reduce(
    (sum, i) => sum + i.amount,
    0
  );

  const totalPenyaluran = PENYALURAN.reduce(
    (sum, i) => sum + i.amount,
    0
  );

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
              Kami berkomitmen mengelola dana zakat, infak, dan sedekah
              secara transparan dan akuntabel. Berikut ringkasan penerimaan
              dan penyaluran dana yang dapat diakses oleh publik.
            </p>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
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

              <p className="mt-1 text-lg font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="text-[11px] text-gray-400">
                {stat.period}
              </p>
            </div>
          );
        })}
      </section>

      {/* Rincian */}
      <section className="max-w-4xl mx-auto px-6 pb-16 grid sm:grid-cols-2 gap-6">
        <RincianList
          title="Rincian Penerimaan"
          items={PENERIMAAN}
          total={totalPenerimaan}
        />

        <RincianList
          title="Rincian Penyaluran"
          items={PENYALURAN}
          total={totalPenyaluran}
        />
      </section>

    </div>
  );
}