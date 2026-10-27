import { useState, useEffect } from "react";
import {
  Wallet,
  HandCoins,
  Users,
  HeartHandshake,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getPublicLaporan } from "../services/donasiService";
import { useSettings } from "../services/settingService";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function RincianList({ title, items, total, type = "penerimaan" }) {
  const safeTotal = total > 0 ? total : 1;
  const isPenerimaan = type === "penerimaan";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isPenerimaan
                ? "bg-emerald-50 text-emerald-600"
                : "bg-brand-50 text-brand-600"
            }`}
          >
            {isPenerimaan ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>

        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          {items.length} Kategori
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-gray-400">
            Belum ada data transaksi untuk tahun ini.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3.5">
            {items.map((item) => {
              const percent = Math.min(
                100,
                Math.round((item.amount / safeTotal) * 100)
              );

              return (
                <div key={item.label} className="group">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-700 font-medium">{item.label}</span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-normal">
                        {percent}%
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5 w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPenerimaan
                          ? "bg-emerald-500"
                          : "bg-brand-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Total {title}
            </span>

            <span
              className={`text-sm sm:text-base font-medium ${
                isPenerimaan ? "text-emerald-700" : "text-brand-700"
              }`}
            >
              {formatRupiah(total)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function LaporanPage() {
  const settings = useSettings();
  const [data, setData] = useState(null);
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
    : 0;

  const totalPenyaluran = data?.penyaluran?.length
    ? data.penyaluran.reduce((sum, i) => sum + i.amount, 0)
    : 0;

  const penerimaanList = data?.penerimaan?.length
    ? data.penerimaan
    : [];

  const penyaluranList = data?.penyaluran?.length
    ? data.penyaluran
    : [];

  const stats = [
    {
      icon: Wallet,
      label: "Total Dana Terkumpul",
      value: formatRupiah(data?.total_masuk ?? 0),
      period: `Tahun ${data?.tahun || new Date().getFullYear()
        }`,
    },
    {
      icon: HandCoins,
      label: "Total Dana Disalurkan",
      value: formatRupiah(data?.total_keluar ?? 0),
      period: `Tahun ${data?.tahun || new Date().getFullYear()
        }`,
    },
    {
      icon: Users,
      label: "Total Muzakki Aktif",
      value: `${data?.total_muzakki ?? 0} Orang`,
      period: `Terdaftar`,
    },
    {
      icon: HeartHandshake,
      label: "Total Mustahik Aktif",
      value: `${data?.total_mustahik ?? 0} Orang`,
      period: `Penerima Manfaat`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Laporan Keuangan &amp; Transparansi
            </h1>

            <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              {settings?.profil?.namaLembaga || "UPZ Unsil"} berkomitmen
              mengelola dana zakat, infak, dan sedekah secara transparan
              dan akuntabel. Berikut ringkasan penerimaan dan penyaluran
              dana publik.
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          STATISTIK
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 pt-6 pb-6 sm:px-6 sm:pt-10 sm:pb-8">

        {loading ? (

          <div className="text-center py-8">

            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2" />

            <p className="text-xs text-gray-400">
              Memuat laporan dari database...
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3.5 sm:p-5 flex items-center gap-3 sm:gap-3.5"
                >

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">

                    <Icon size={19} />

                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate">
                      {stat.label}
                    </p>

                    <p className="mt-0.5 text-xs sm:text-base lg:text-lg font-bold text-gray-900 leading-tight break-words">
                      {stat.value}
                    </p>

                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">
                      {stat.period}
                    </p>
                  </div>

                </div>

              );
            })}

          </div>

        )}

      </section>

      {/* =====================================================
          RINCIAN
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 pb-12 sm:px-6 sm:pb-16 grid sm:grid-cols-2 gap-4 sm:gap-6">

        <RincianList
          title="Rincian Penerimaan"
          items={penerimaanList}
          total={totalPenerimaan}
          type="penerimaan"
        />

        <RincianList
          title="Rincian Penyaluran"
          items={penyaluranList}
          total={totalPenyaluran}
          type="penyaluran"
        />

      </section>

    </div>
  );
}