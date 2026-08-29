import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  RefreshCw,
  Wallet,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboardSaldo } from "../../services/transaksiService";
import { useSettings } from "../../services/settingService";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function RekeningKas() {
  const settings = useSettings();
  const [saldo, setSaldo]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  async function fetchSaldo() {
    setLoading(true);
    setError("");
    try {
      const res = await getDashboardSaldo();
      setSaldo(res);
    } catch (err) {
      setError(err.message ?? "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSaldo(); }, []);

  const cards = saldo
    ? [
        {
          label: "Saldo Kas Bersih",
          value: formatRupiah(saldo.saldo),
          sub: "Total masuk dikurangi total keluar",
          icon: Wallet,
          color: saldo.saldo >= 0 ? "green" : "red",
        },
        {
          label: "Total Dana Masuk",
          value: formatRupiah(saldo.totalMasuk),
          sub: "Akumulasi seluruh pengumpulan zakat & infaq",
          icon: ArrowDownLeft,
          color: "green",
        },
        {
          label: "Total Dana Keluar",
          value: formatRupiah(saldo.totalKeluar),
          sub: "Akumulasi seluruh penyaluran kepada mustahik",
          icon: ArrowUpRight,
          color: "amber",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 shrink-0">
          <Landmark size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-brand-900">
            Saldo Kas {settings?.profil?.namaSingkat || "UPZ Unsil"}
          </p>
          <p className="text-sm text-brand-700 mt-0.5">
            Saldo dihitung secara otomatis berdasarkan seluruh transaksi pengumpulan dan penyaluran yang tercatat di sistem.
          </p>
        </div>
        <button
          onClick={fetchSaldo}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 transition shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet}       label="Saldo Kas Bersih" value={saldo ? formatRupiah(saldo.saldo)       : "—"} color={saldo && saldo.saldo < 0 ? "red" : "brand"} loading={loading} />
        <StatCard icon={ArrowDownLeft} label="Total Dana Masuk" value={saldo ? formatRupiah(saldo.totalMasuk) : "—"} color="emerald" loading={loading} />
        <StatCard icon={ArrowUpRight}  label="Total Dana Keluar" value={saldo ? formatRupiah(saldo.totalKeluar) : "—"} color="amber" loading={loading} />
      </div>

      {/* Detail breakdown */}
      {!loading && saldo && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Rincian Arus Dana</h3>
            <p className="text-sm text-gray-500 mt-0.5">Perbandingan dana masuk dan keluar secara keseluruhan</p>
          </div>
          <div className="p-5 space-y-4">
            {/* Masuk bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ArrowDownLeft size={15} className="text-emerald-500" /> Dana Masuk
                </span>
                <span className="text-sm font-bold text-emerald-700">{formatRupiah(saldo.totalMasuk)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Keluar bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ArrowUpRight size={15} className="text-amber-500" /> Dana Keluar
                </span>
                <span className="text-sm font-bold text-amber-700">{formatRupiah(saldo.totalKeluar)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{
                    width: saldo.totalMasuk > 0
                      ? `${Math.min(100, (saldo.totalKeluar / saldo.totalMasuk) * 100).toFixed(1)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Saldo bersih */}
            <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
              saldo.saldo >= 0 ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
            }`}>
              <span className={`text-sm font-semibold ${saldo.saldo >= 0 ? "text-emerald-800" : "text-red-700"}`}>
                Saldo Bersih
              </span>
              <span className={`text-lg font-bold ${saldo.saldo >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                {saldo.saldo >= 0 ? "" : "−"}{formatRupiah(Math.abs(saldo.saldo))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Note */}
      <p className="text-xs text-gray-400 text-center">
        Data diperbarui secara real-time dari seluruh transaksi yang tercatat di sistem. Klik <strong>Refresh</strong> untuk memperbarui.
      </p>
    </div>
  );
}
