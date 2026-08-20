import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Globe,
  Heart,
  RefreshCw,
  Users,
  Wallet,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import { getLaporanRingkasan } from "../../services/donasiService";

function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(v ?? 0);
}

function formatTgl(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const KATEGORI_COLOR = [
  "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-amber-500",
  "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-indigo-500",
];

const THIS_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 5 }, (_, i) => THIS_YEAR - i);

export default function LaporanKeuangan() {
  const [laporan, setLaporan] = useState(null);
  const [tahun, setTahun]     = useState(THIS_YEAR);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLaporanRingkasan(tahun);
      setLaporan(res);
    } catch (err) {
      setError(err.message ?? "Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  }, [tahun]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Find max nominal for bar scale
  const maxBulan = laporan
    ? Math.max(...laporan.per_bulan.map((b) => Math.max(b.masuk, b.keluar)), 1)
    : 1;

  const maxKategori = laporan?.per_kategori?.[0]?.total ?? 1;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className="appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-9 text-sm font-semibold text-gray-700 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {TAHUN_OPTIONS.map((y) => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        {laporan && (
          <p className="text-xs text-gray-400">
            Data per {new Date().toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1,2,3,4].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : laporan && (
        <>
          {/* KPI Cards — row 1: financial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard icon={ArrowDownLeft} label="Total Dana Masuk"  value={formatRupiah(laporan.total_masuk)}  color="emerald" sub="Akumulasi pengumpulan"    loading={false} />
            <StatCard icon={ArrowUpRight}  label="Total Dana Keluar" value={formatRupiah(laporan.total_keluar)} color="amber"   sub="Akumulasi penyaluran"     loading={false} />
            <StatCard icon={Wallet}        label="Saldo Bersih"      value={formatRupiah(laporan.saldo_bersih)} color={laporan.saldo_bersih >= 0 ? "brand" : "red"} sub="Masuk − Keluar" loading={false} />
            <StatCard icon={Globe}         label="Donasi Online"     value={formatRupiah(laporan.total_donasi)} color="purple"  sub="Total donasi diterima"    loading={false} />
          </div>
          {/* KPI Cards — row 2: activity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard icon={Users}    label="Muzakki Aktif"       value={`${laporan.total_muzakki} orang`}   color="blue"   sub="Terdaftar & aktif"       loading={false} />
            <StatCard icon={Heart}    label="Mustahik Aktif"      value={`${laporan.total_mustahik} orang`}  color="pink"   sub="Terdaftar & aktif"       loading={false} />
            <StatCard icon={BarChart3} label="Jumlah Donasi Online" value={`${laporan.jumlah_donasi} donasi`} color="indigo" sub="Transaksi donasi publik" loading={false} />
          </div>

          {/* Per Bulan Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Arus Dana Per Bulan</h3>
            <p className="text-sm text-gray-500 mb-5">Perbandingan dana masuk dan keluar tiap bulan di tahun {tahun}</p>

            <div className="flex items-end gap-2 h-44">
              {laporan.per_bulan.map((b) => (
                <div key={b.bulan} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-36">
                    {/* Masuk bar */}
                    <div
                      className="flex-1 bg-emerald-400 rounded-t-sm min-h-[2px] transition-all duration-700"
                      style={{ height: `${Math.max(2, (b.masuk / maxBulan) * 100)}%` }}
                      title={`Masuk: ${formatRupiah(b.masuk)}`}
                    />
                    {/* Keluar bar */}
                    <div
                      className="flex-1 bg-amber-400 rounded-t-sm min-h-[2px] transition-all duration-700"
                      style={{ height: `${Math.max(2, (b.keluar / maxBulan) * 100)}%` }}
                      title={`Keluar: ${formatRupiah(b.keluar)}`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span className="text-xs text-gray-500">Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-amber-400" />
                <span className="text-xs text-gray-500">Keluar</span>
              </div>
            </div>
          </div>

          {/* Two columns: Per Kategori + Transaksi Terbaru */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Per Kategori */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-1">Distribusi Per Kategori</h3>
              <p className="text-sm text-gray-500 mb-5">Total dana masuk berdasarkan kategori zakat/infaq</p>
              {laporan.per_kategori.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data.</p>
              ) : (
                <div className="space-y-3">
                  {laporan.per_kategori.map((k, i) => (
                    <div key={k.kategori}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{k.kategori}</span>
                        <span className="font-bold text-gray-900">{formatRupiah(k.total)}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${KATEGORI_COLOR[i % KATEGORI_COLOR.length]}`}
                          style={{ width: `${Math.max(3, (k.total / maxKategori) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{k.jumlah} transaksi</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transaksi Terbaru */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Transaksi Terbaru</h3>
                <p className="text-sm text-gray-500">20 transaksi terakhir di tahun {tahun}</p>
              </div>
              <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                {laporan.transaksi_terbaru.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">Belum ada transaksi.</p>
                ) : laporan.transaksi_terbaru.map((t, i) => (
                  <div key={`${t.kode}-${i}`} className="flex items-center justify-between px-5 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold text-brand-700 truncate">{t.kode}</p>
                      <p className="text-xs text-gray-500 truncate">{t.kategori} · {formatTgl(t.tanggal)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${t.jenis === "masuk" ? "text-emerald-700" : "text-amber-700"}`}>
                        {t.jenis === "masuk" ? "+" : "−"}{formatRupiah(t.nominal)}
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        t.jenis === "masuk" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {t.jenis === "masuk" ? "Masuk" : "Keluar"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
