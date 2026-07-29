import { Wallet, HandCoins, Landmark, Users } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import TransactionList from "../../components/dashboard/TransactionList";
import ProgramProgress from "../../components/dashboard/ProgramProgress";
import { dummyStats, dummyRingkasanDana } from "../../data/dummyStats";
import { dummyChartTahunan } from "../../data/dummyChart";
import { dummyTransaksi } from "../../data/dummyTransaksi";
import { dummyProgramAktif } from "../../data/dummyProgram";
import { formatRupiah } from "../../utils/formatRupiah";

export default function DashboardHome() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={Wallet}
          label="Total Dana Terkumpul"
          value={formatRupiah(dummyStats.totalDanaTerkumpul)}
          sub="Tahun 2025"
          change={dummyStats.perubahanDanaTerkumpul}
          color="green"
        />
        <StatCard
          icon={HandCoins}
          label="Total Dana Disalurkan"
          value={formatRupiah(dummyStats.totalDanaDisalurkan)}
          sub="Tahun 2025"
          change={dummyStats.perubahanDanaDisalurkan}
          color="blue"
        />
        <StatCard
          icon={Landmark}
          label="Saldo Kas & Bank"
          value={formatRupiah(dummyStats.saldoKasBank)}
          sub="Per hari ini"
          color="yellow"
        />
        <StatCard
          icon={Users}
          label="Total Muzakki"
          value={`${dummyStats.totalMuzakki.toLocaleString("id-ID")} Orang`}
          sub="Tahun 2025"
          change={dummyStats.perubahanMuzakki}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <LineChartCard data={dummyChartTahunan} />
        <DonutChartCard data={dummyRingkasanDana} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TransactionList data={dummyTransaksi} />
        <ProgramProgress data={dummyProgramAktif} />
      </div>
    </div>
  );
}
