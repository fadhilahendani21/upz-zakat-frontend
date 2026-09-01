import { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  TrendingUp,
  Users,
  Download,
  CreditCard,
  History,
  X,
  CheckCircle2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import HighlightText from "../../components/common/HighlightText";
import StatCard from "../../components/dashboard/StatCard";
import {
  Pagination,
  SearchInput,
  FilterSelect,
  inputCls,
} from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import { getTagihan, catatPembayaranTagihan } from "../../services/tagihanService";
import { NumericFormat } from "react-number-format";

// ── Konstanta ─────────────────────────────────────────────────────────────────
const THIS_YEAR = new Date().getFullYear();
const THIS_MONTH = new Date().getMonth() + 1;

const TAHUN_OPTIONS = [
  { label: "Semua Tahun", value: 0 },
  ...Array.from({ length: 5 }, (_, i) => ({
    label: `Tahun ${THIS_YEAR - i}`,
    value: THIS_YEAR - i,
  })),
];

const BULAN_OPTIONS = [
  { label: "Semua Bulan", value: 0 },
  { label: "Januari",   value: 1 },  { label: "Februari",  value: 2 },
  { label: "Maret",     value: 3 },  { label: "April",     value: 4 },
  { label: "Mei",       value: 5 },  { label: "Juni",      value: 6 },
  { label: "Juli",      value: 7 },  { label: "Agustus",   value: 8 },
  { label: "September", value: 9 },  { label: "Oktober",   value: 10 },
  { label: "November",  value: 11 }, { label: "Desember",  value: 12 },
];

const STATUS_BADGE = {
  lunas:         "bg-emerald-50 text-emerald-700",
  sebagian:      "bg-blue-50 text-blue-700",
  belum_bayar:   "bg-amber-50 text-amber-700",
  bebas_tagihan: "bg-gray-100 text-gray-600",
};

const STATUS_LABEL = {
  lunas:         "Lunas",
  sebagian:      "Sebagian",
  belum_bayar:   "Belum Bayar",
  bebas_tagihan: "Bebas Tagihan",
};

// ── Modal Catat Pelunasan Manual ──────────────────────────────────────────────
function ModalCatatBayar({ item, bulan, tahun, onClose, onSaved }) {
  const [nominal, setNominal] = useState(String(item.sisa_tagihan || item.target_nominal || ""));
  const [metode, setMetode] = useState("Transfer Bank");
  const [kategori, setKategori] = useState(
    item.rincian_kesepakatan?.[0]?.jenis || "Zakat Penghasilan"
  );
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const namaBulan = BULAN_OPTIONS.find((b) => b.value === bulan)?.label || `Bulan ${bulan}`;

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanNominal = Number(String(nominal).replace(/\D/g, ""));
    if (!cleanNominal || cleanNominal <= 0) {
      setError("Nominal pembayaran harus diisi dan lebih dari 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await catatPembayaranTagihan({
        muzakki_id: item.muzakki_id,
        nominal: cleanNominal,
        kategori,
        metode,
        tahun: tahun === 0 ? THIS_YEAR : tahun,
        bulan: bulan === 0 ? THIS_MONTH : bulan,
        keterangan: keterangan || `Pelunasan Zakat ${namaBulan} ${tahun || THIS_YEAR} oleh ${item.nama}`,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal mencatat pembayaran.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Catat Pembayaran Zakat</h2>
            <p className="text-xs text-gray-500 mt-0.5">{item.nama}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Info Tagihan */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Target Periode:</span>
                <span className="font-semibold text-gray-800">{formatRupiah(item.target_nominal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sudah Dibayar:</span>
                <span className="font-semibold text-emerald-600">{formatRupiah(item.total_dibayar)}</span>
              </div>
              <div className="flex justify-between text-gray-700 pt-1 border-t border-gray-200 font-bold">
                <span>Sisa Tagihan:</span>
                <span className="text-brand-600">{formatRupiah(item.sisa_tagihan)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Zakat</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className={inputCls}
              >
                <option value="Zakat Penghasilan">Zakat Penghasilan</option>
                <option value="Zakat Maal">Zakat Maal</option>
                <option value="Zakat Fitrah">Zakat Fitrah</option>
                <option value="Infaq & Sedekah">Infaq & Sedekah</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Metode</label>
                <select
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  className={inputCls}
                >
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Tunai">Tunai</option>
                  <option value="E-Wallet">E-Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
                <NumericFormat
                  placeholder="0"
                  value={nominal}
                  onValueChange={(values) => setNominal(values.value)}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  className={inputCls}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
              <textarea
                rows={2}
                placeholder="Opsional (misal: transfer BSI no ref...)"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" icon={CreditCard} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Riwayat Transaksi ───────────────────────────────────────────────────
function ModalRiwayat({ row, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Riwayat Pembayaran</p>
            <h3 className="font-semibold text-gray-900 text-base">{row.nama}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {(row.transaksi_terkait || []).length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Belum ada transaksi pembayaran yang tercatat pada periode ini.
            </div>
          ) : (
            row.transaksi_terkait.map((trx) => (
              <div key={trx.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-brand-600">{trx.kode}</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(trx.nominal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-[11px]">
                  <span>{trx.kategori} • {trx.metode}</span>
                  <span>{trx.tanggal}</span>
                </div>
                {trx.keterangan && (
                  <p className="text-[11px] text-gray-600 italic bg-white p-2 rounded-lg border border-gray-100 mt-1">
                    "{trx.keterangan}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page: Tagihan Zakat ──────────────────────────────────────────────────
export default function Tagihan() {
  const [data, setData]       = useState([]);
  const [meta, setMeta]       = useState({ total: 0, current_page: 1, last_page: 1, total_nominal: 0, total_dibayar: 0, total_belum: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("all");
  const [kategori, setKategori] = useState("all");
  const [bulan, setBulan]       = useState(THIS_MONTH);
  const [tahun, setTahun]       = useState(THIS_YEAR);
  const [page, setPage]         = useState(1);

  // Modals & Toast
  const [modalBayar, setModalBayar]     = useState(null);
  const [modalRiwayat, setModalRiwayat] = useState(null);
  const [toastMsg, setToastMsg]         = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTagihan({
        search,
        status,
        kategori,
        bulan,
        tahun,
        page,
        perPage: 10,
      });
      setData(res.data || []);
      setMeta(res.meta || { total: 0, current_page: 1, last_page: 1, total_nominal: 0, total_dibayar: 0, total_belum: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, kategori, bulan, tahun, page]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  function handleExport() {
    if (!data.length) {
      setToastMsg("Tidak ada data untuk diekspor pada filter ini.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }
    const headers = ["Nama Muzakki", "NIP/NIK", "Komitmen", "Target Tagihan", "Sudah Dibayar", "Sisa Tagihan", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.map((row) => [
        `"${row.nama}"`,
        `"${row.nip || row.nik || "-"}"`,
        `"${(row.rincian_kesepakatan || []).map((k) => `${k.jenis} (${k.frekuensi}: ${formatRupiah(k.nominal)})`).join("; ") || "-"}"`,
        row.target_nominal,
        row.total_dibayar,
        row.sisa_tagihan,
        row.status_bayar,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Tagihan_Zakat_${bulan || "Semua"}_${tahun || "Semua"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToastMsg("Data berhasil diekspor ke CSV!");
    setTimeout(() => setToastMsg(""), 3000);
  }

  return (
    <div>
      {/* Toast Notice */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-medium shadow-lg animate-[fadeIn_0.15s_ease] flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-end mb-4 -mt-3 relative z-20">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExport} className="hidden sm:inline-flex">
            Ekspor
          </Button>
        </div>
      </div>

      {/* Stat Cards - Identik dengan halaman Pengumpulan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Wallet}
          label="Total Tagihan"
          value={formatRupiah(meta.total_nominal || 0)}
          color="brand"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Sudah Terkumpul"
          value={formatRupiah(meta.total_dibayar || 0)}
          color="emerald"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Sisa Tunggakan"
          value={formatRupiah(meta.total_belum || 0)}
          color="amber"
          loading={loading}
        />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama muzakki atau NIP/NIK..."
          />
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="all">Semua Status</option>
              <option value="belum_bayar">Belum Bayar</option>
              <option value="sebagian">Sebagian</option>
              <option value="lunas">Lunas</option>
            </FilterSelect>
            <FilterSelect value={kategori} onChange={(e) => { setKategori(e.target.value); setPage(1); }}>
              <option value="all">Semua Kategori</option>
              <option value="dosen_staf">Dosen & Staf UNSIL</option>
              <option value="umum">Muzakki Umum</option>
            </FilterSelect>
            <FilterSelect value={bulan} onChange={(e) => { setBulan(Number(e.target.value)); setPage(1); }}>
              {BULAN_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </FilterSelect>
            <FilterSelect value={tahun} onChange={(e) => { setTahun(Number(e.target.value)); setPage(1); }}>
              {TAHUN_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </FilterSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Muzakki
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Komitmen Kesepakatan
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Target Tagihan
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Sudah Dibayar
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Sisa Tagihan
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Memuat data tagihan...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    {search || status !== "all" || kategori !== "all"
                      ? "Tidak ada data tagihan yang cocok dengan filter."
                      : "Belum ada data tagihan muzakki."}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Nama Muzakki & NIP/NIK di bawahnya */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs shrink-0">
                          {row.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800"><HighlightText text={row.nama} query={search} /></p>
                          <p className="text-xs text-gray-400 font-mono">
                            {row.nip ? `NIP: ${row.nip}` : row.nik ? `NIK: ${row.nik}` : "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Komitmen Kesepakatan (Semua Jenis Zakat) */}
                    <td className="px-5 py-3.5 text-xs text-gray-600">
                      {row.rincian_kesepakatan && row.rincian_kesepakatan.length > 0 ? (
                        <div className="space-y-1 min-w-[220px]">
                          {row.rincian_kesepakatan.map((k, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-gray-800">{k.jenis}</span>
                              <span className="text-[11px] text-gray-400">
                                ({k.frekuensi}: {formatRupiah(k.nominal)})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada komitmen</span>
                      )}
                    </td>

                    {/* Target Tagihan */}
                    <td className="px-5 py-3.5 text-right font-medium text-gray-800 whitespace-nowrap">
                      {formatRupiah(row.target_nominal)}
                    </td>

                    {/* Sudah Dibayar */}
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                      {formatRupiah(row.total_dibayar)}
                    </td>

                    {/* Sisa Tagihan */}
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {row.sisa_tagihan > 0 ? (
                        <span className="text-amber-600">{formatRupiah(row.sisa_tagihan)}</span>
                      ) : (
                        <span className="text-emerald-600">Rp 0</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[row.status_bayar] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[row.status_bayar] ?? row.status_bayar}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {row.status_bayar !== "lunas" && (
                          <button
                            type="button"
                            onClick={() => setModalBayar(row)}
                            className="text-xs text-brand-600 font-medium hover:underline"
                          >
                            Catat Bayar
                          </button>
                        )}
                        {row.transaksi_terkait && row.transaksi_terkait.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setModalRiwayat(row)}
                            className="text-xs text-gray-500 font-medium hover:underline"
                          >
                            Riwayat
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Konsisten */}
        <Pagination
          page={page}
          lastPage={meta.last_page}
          total={meta.total}
          onPageChange={setPage}
          label="muzakki"
        />
      </Card>

      {/* Modal Catat Bayar */}
      {modalBayar && (
        <ModalCatatBayar
          item={modalBayar}
          bulan={bulan}
          tahun={tahun}
          onClose={() => setModalBayar(null)}
          onSaved={() => {
            setToastMsg("Pembayaran berhasil dicatat.");
            setTimeout(() => setToastMsg(""), 3000);
            fetchData();
          }}
        />
      )}

      {/* Modal Riwayat */}
      {modalRiwayat && (
        <ModalRiwayat
          row={modalRiwayat}
          onClose={() => setModalRiwayat(null)}
        />
      )}
    </div>
  );
}
