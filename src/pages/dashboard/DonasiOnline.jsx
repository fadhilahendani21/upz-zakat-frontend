import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Search,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import { getDonasiOnline } from "../../services/donasiService";

function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(v ?? 0);
}

function formatTgl(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const METODE_BADGE = {
  "Transfer Bank": "bg-blue-50 text-blue-700",
  "QRIS":          "bg-purple-50 text-purple-700",
  "E-Wallet":      "bg-pink-50 text-pink-700",
};

export default function DonasiOnline() {
  const [data, setData]     = useState([]);
  const [meta, setMeta]     = useState({ total: 0, total_nominal: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDonasiOnline({ search, page, perPage: 10 });
      setData(res.data ?? []);
      setMeta(res.meta ?? { total: 0, total_nominal: 0, current_page: 1, last_page: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp}  label="Total Donasi Diterima" value={formatRupiah(meta.total_nominal ?? 0)} color="emerald" loading={loading} />
        <StatCard icon={CheckCircle2} label="Jumlah Transaksi"      value={`${meta.total ?? 0} Transaksi`}        color="brand"   loading={loading} />
        <StatCard icon={CreditCard}  label="Metode Terbanyak"      value="Transfer Bank"                          color="purple"  loading={loading} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Riwayat Donasi Online</h3>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari kode / kategori..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-5 py-3">Kode</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Program</th>
                <th className="px-5 py-3">Keterangan</th>
                <th className="px-5 py-3">Metode</th>
                <th className="px-5 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data donasi...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Globe size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-500">Belum ada donasi online yang masuk.</p>
                    <p className="text-xs text-gray-400 mt-1">Donasi akan muncul di sini setelah publik mengisi form di halaman /donasi</p>
                  </td>
                </tr>
              ) : data.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-brand-700">{row.kode}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{formatTgl(row.tanggal)}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                      {row.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {row.program_nama ? (
                      <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {row.program_nama}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Umum</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[200px] truncate">{row.deskripsi ?? "-"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      METODE_BADGE[row.metode] ?? "bg-gray-100 text-gray-600"
                    }`}>
                      {row.metode ?? "-"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-700">{formatRupiah(row.nominal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Halaman {meta.current_page} dari {meta.last_page} • {meta.total} donasi
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}