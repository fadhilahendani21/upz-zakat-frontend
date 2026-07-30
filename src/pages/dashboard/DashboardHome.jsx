import { useState, useEffect } from "react";
import { Wallet, HandCoins, Landmark, Users } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import TransactionList from "../../components/dashboard/TransactionList";
import ProgramProgress from "../../components/dashboard/ProgramProgress";
import {
  getDashboardStats,
  getRingkasanDana,
  getGrafikTahunan,
  getTransaksiTerbaru,
  getProgramAktif,
} from "../../services/dashboardService";
import { isDemoMode } from "../../services/authService";
import { formatRupiah } from "../../utils/formatRupiah";

const IS_DEMO = isDemoMode();

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [ringkasan, setRingkasan] = useState([]);
  const [grafik, setGrafik] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kalau belum login, redirect ke login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/masuk";
      return;
    }

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // allSettled: tiap request independen, satu gagal tidak block yg lain
        const [sRes, rRes, gRes, tRes, pRes] = await Promise.allSettled([
          getDashboardStats(),
          getRingkasanDana(),
          getGrafikTahunan(),
          getTransaksiTerbaru(5),
          getProgramAktif(),
        ]);

        // Kalau stats gagal (paling kritis), tampilkan error
        if (sRes.status === "rejected") {
          throw new Error(sRes.reason?.message ?? "Gagal mengambil data statistik dashboard.");
        }

        setStats(sRes.value);
        if (rRes.status === "fulfilled") setRingkasan(rRes.value);
        if (gRes.status === "fulfilled") setGrafik(gRes.value);
        if (tRes.status === "fulfilled") setTransaksi(tRes.value);
        if (pRes.status === "fulfilled") setProgram(pRes.value);
      } catch (err) {
        setError(err.message ?? "Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

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
          onClick={() => window.location.reload()}
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
