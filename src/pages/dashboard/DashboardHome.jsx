import { useState, useEffect } from "react";
import { Wallet, HandCoins, Landmark, Users, ChevronDown } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import TransactionList from "../../components/dashboard/TransactionList";
import ProgramProgress from "../../components/dashboard/ProgramProgress";
import { getAllDashboardData } from "../../services/dashboardService";
import { isDemoMode } from "../../services/authService";
import { formatRupiah } from "../../utils/formatRupiah";

const IS_DEMO = isDemoMode();

// Buat opsi tahun: 3 tahun ke belakang + tahun ini + All Time
const THIS_YEAR  = new Date().getFullYear();
const TAHUN_OPTIONS = [
  { label: "Semua Waktu", value: "all" },
  ...Array.from({ length: 4 }, (_, i) => THIS_YEAR - i).map((y) => ({
    label: String(y),
    value: y,
  })),
];

export default function DashboardHome() {
  const [tahun, setTahun]     = useState(THIS_YEAR);
  const [stats, setStats]       = useState(null);
  const [ringkasan, setRingkasan] = useState([]);
  const [grafik, setGrafik]     = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [program, setProgram]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  async function fetchData(selectedTahun) {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDashboardData(selectedTahun);
      setStats(data.stats);
      setRingkasan(data.ringkasanDana);
      setGrafik(data.grafik);
      setTransaksi(data.transaksi);
      setProgram(data.program);
    } catch (err) {
      setError(err.message ?? "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !IS_DEMO) {
      window.location.href = "/masuk";
      return;
    }
    fetchData(tahun);
  }, []);

  function handleTahunChange(val) {
    const parsed = val === "all" ? "all" : parseInt(val, 10);
    setTahun(parsed);
    fetchData(parsed);
  }

  const selectedLabel = TAHUN_OPTIONS.find((o) => String(o.value) === String(tahun))?.label ?? String(tahun);

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
          onClick={() => fetchData(tahun)}
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
            Hubungkan ke backend dengan mengisi{" "}
            <code className="bg-amber-100 px-1 rounded">VITE_API_URL</code> di file{" "}
            <code className="bg-amber-100 px-1 rounded">.env</code> untuk data real.
          </span>
        </div>
      )}

      {/* Filter Tahun */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          Menampilkan data:{" "}
          <span className="font-semibold text-gray-800">{selectedLabel}</span>
        </p>

        <div className="relative">
          <select
            value={String(tahun)}
            onChange={(e) => handleTahunChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition cursor-pointer shadow-sm"
          >
            {TAHUN_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={Wallet}
          label="Total Dana Terkumpul"
          value={formatRupiah(stats?.totalDanaTerkumpul ?? 0)}
          sub={tahun === "all" ? "Semua waktu" : `Tahun ${tahun}`}
          change={stats?.perubahanDanaTerkumpul}
          color="green"
        />
        <StatCard
          icon={HandCoins}
          label="Total Dana Disalurkan"
          value={formatRupiah(stats?.totalDanaDisalurkan ?? 0)}
          sub={tahun === "all" ? "Semua waktu" : `Tahun ${tahun}`}
          change={stats?.perubahanDanaDisalurkan}
          color="blue"
        />
        <StatCard
          icon={Landmark}
          label="Saldo Kas & Bank"
          value={formatRupiah(stats?.saldoKasBank ?? 0)}
          sub="Per hari ini (all time)"
          color="yellow"
        />
        <StatCard
          icon={Users}
          label="Total Muzakki"
          value={`${(stats?.totalMuzakki ?? 0).toLocaleString("id-ID")} Orang`}
          sub={tahun === "all" ? "Semua waktu" : `Tahun ${tahun}`}
          change={stats?.perubahanMuzakki}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <LineChartCard data={grafik} isAllTime={tahun === "all"} />
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
