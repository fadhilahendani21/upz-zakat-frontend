import { useState, useEffect } from "react";
import { Wallet, HandCoins, Landmark, Users } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import TransactionList from "../../components/dashboard/TransactionList";
import ProgramProgress from "../../components/dashboard/ProgramProgress";
import { getAllDashboardData, getCachedDashboardData, clearDashboardCache } from "../../services/dashboardService";
import { isDemoMode } from "../../services/authService";
import { formatRupiah } from "../../utils/formatRupiah";

const IS_DEMO = isDemoMode();

// Baca cache localStorage SEKARANG (synchronous, sebelum component render)
// → data langsung tersedia sebagai initial state
const _cached = getCachedDashboardData();

export default function DashboardHome() {
  // Initial state dari localStorage — render langsung tanpa loading
  const [stats, setStats]       = useState(_cached?.stats ?? null);
  const [ringkasan, setRingkasan] = useState(_cached?.ringkasanDana ?? []);
  const [grafik, setGrafik]     = useState(_cached?.grafik ?? []);
  const [transaksi, setTransaksi] = useState(_cached?.transaksi ?? []);
  const [program, setProgram]   = useState(_cached?.program ?? []);

  // loading hanya true jika belum ada cache sama sekali
  const [loading, setLoading] = useState(!_cached && !IS_DEMO);
  const [refreshing, setRefreshing] = useState(!!_cached); // background refresh indicator
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kalau belum login (dan bukan demo), redirect ke login
    const token = localStorage.getItem("token");
    if (!token && !IS_DEMO) {
      window.location.href = "/masuk";
      return;
    }

    async function fetchFresh() {
      // Kalau ada cache → fetch diam-diam (tidak tampilkan loading penuh)
      // Kalau tidak ada cache → tampilkan loading spinner
      if (!_cached) setLoading(true);
      setRefreshing(true);

      try {
        const data = await getAllDashboardData();
        setStats(data.stats);
        setRingkasan(data.ringkasanDana);
        setGrafik(data.grafik);
        setTransaksi(data.transaksi);
        setProgram(data.program);
        setError(null);
      } catch (err) {
        // Kalau ada cache, jangan tampilkan error — biarkan data lama tetap tampil
        if (!_cached) setError(err.message ?? "Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }

    fetchFresh();
  }, []);

  // Paksa refresh: hapus localStorage cache lalu fetch ulang dari API
  async function forceRefresh() {
    clearDashboardCache();
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDashboardData();
      setStats(data.stats);
      setRingkasan(data.ringkasanDana);
      setGrafik(data.grafik);
      setTransaksi(data.transaksi);
      setProgram(data.program);
    } catch (err) {
      setError(err.message ?? "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={forceRefresh}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>

      {/* Banner Mode Demo */}
      {IS_DEMO && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5 rounded-xl mb-5">
          <span className="text-base">⚠️</span>
          <span>
            <strong>Mode Demo</strong> — Data yang ditampilkan adalah data dummy.
            Hubungkan ke backend dengan mengisi <code className="bg-amber-100 px-1 rounded">VITE_API_URL</code> di file <code className="bg-amber-100 px-1 rounded">.env</code> untuk data real.
          </span>
        </div>
      )}

      {/* Indikator background refresh + tombol force refresh */}
      <div className="flex items-center justify-between mb-3">
        {refreshing && !IS_DEMO ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
            <span>Memperbarui data...</span>
          </div>
        ) : <span />}
        {!IS_DEMO && (
          <button
            onClick={forceRefresh}
            title="Paksa ambil data terbaru dari server"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
              <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            Refresh
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={Wallet}
          label="Total Dana Terkumpul"
          value={formatRupiah(stats?.totalDanaTerkumpul ?? 0)}
          sub="Tahun ini"
          change={stats?.perubahanDanaTerkumpul}
          color="green"
        />
        <StatCard
          icon={HandCoins}
          label="Total Dana Disalurkan"
          value={formatRupiah(stats?.totalDanaDisalurkan ?? 0)}
          sub="Tahun ini"
          change={stats?.perubahanDanaDisalurkan}
          color="blue"
        />
        <StatCard
          icon={Landmark}
          label="Saldo Kas & Bank"
          value={formatRupiah(stats?.saldoKasBank ?? 0)}
          sub="Per hari ini"
          color="yellow"
        />
        <StatCard
          icon={Users}
          label="Total Muzakki"
          value={`${(stats?.totalMuzakki ?? 0).toLocaleString("id-ID")} Orang`}
          sub="Tahun ini"
          change={stats?.perubahanMuzakki}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <LineChartCard data={grafik} />
        <DonutChartCard data={ringkasan} />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TransactionList data={transaksi} />
        <ProgramProgress data={program} />
      </div>
    </div>
  );
}
