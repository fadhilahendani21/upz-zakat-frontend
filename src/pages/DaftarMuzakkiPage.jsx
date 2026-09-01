import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  GraduationCap,
  ArrowRight,
  UsersRound,
  CheckCircle2,
  Search,
  RefreshCw,
  AlertCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { getPublicMuzakki } from "../services/muzakkiService";

export default function DaftarMuzakkiPage() {
  const [muzakkiList, setMuzakkiList] = useState([]);
  const [stats, setStats] = useState({ total: 0, dosen_staf: 0, umum: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeKategori, setActiveKategori] = useState("semua"); // "semua" | "unsil" | "umum"
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const res = await getPublicMuzakki({
          search,
          kategori: activeKategori !== "semua" ? activeKategori : "",
        });
        if (isMounted) {
          setMuzakkiList(res.data || []);
          if (res.stats) {
            setStats(res.stats);
          }
          setPage(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Gagal memuat data muzakki dari server.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(loadData, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [search, activeKategori]);

  // Client-side pagination for smooth UI
  const totalItems = muzakkiList.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const paginatedList = muzakkiList.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#064f35] via-[#08613d] to-[#0b7548]">

        {/* DEKORASI */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[24px] border-white/10" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full border-[18px] border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Daftar sebagai Muzakki
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50">
            Bergabunglah menjadi bagian dari Muzakki UPZ Zakat Universitas Siliwangi dan bersama-sama mendukung pengelolaan zakat yang amanah, transparan, dan tepat sasaran.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/90">
            <span>Beranda</span>
            <span>›</span>
            <span>Daftar sebagai Muzakki</span>
          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="px-4 py-10 md:px-6 md:py-12">

        <div className="mx-auto max-w-6xl">

          {/* =================================================
              PILIH JENIS PENDAFTARAN
          ================================================== */}

          <div className="text-center">

            <h2 className="text-2xl font-bold text-[#126b43] md:text-3xl">
              Pilih Jenis Pendaftaran
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-gray-500">
              Silakan pilih kategori pendaftaran sesuai dengan status Anda untuk melanjutkan proses pendaftaran sebagai Muzakki.
            </p>

          </div>

          {/* =================================================
              CARD PENDAFTARAN
          ================================================== */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            {/* MUZAKKI UMUM */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8f2]">
                <UserRound
                  size={27}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                Muzakki Umum
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Untuk masyarakat umum yang ingin mendaftar dan menunaikan zakat melalui UPZ Zakat Universitas Siliwangi.
              </p>

              <Link
                to="/daftar-muzakki/umum"
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar sebagai Muzakki Umum
                <ArrowRight size={15} />
              </Link>

            </div>

            {/* DOSEN & STAF UNSIL */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8f2]">
                <GraduationCap
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                Dosen &amp; Staf UNSIL
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Khusus dosen dan tenaga kependidikan/staf Universitas Siliwangi yang ingin terdaftar sebagai Muzakki.
              </p>

              <Link
                to="/daftar-muzakki/unsil"
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar Dosen &amp; Staf UNSIL
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

          {/* =================================================
              TRANSPARANSI MUZAKKI
          ================================================== */}

          <section className="mt-12">

            {/* HEADER */}
            <div className="text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8f2] text-[#13804f]">
                <UsersRound size={21} />
              </div>

              <h2 className="mt-3 text-xl font-bold text-gray-900 md:text-2xl">
                Muzakki yang Telah Terdaftar
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
                Transparansi data real pendaftaran Muzakki dari database sistem sebagai bentuk keterbukaan dan kepercayaan publik.
              </p>

            </div>

            {/* RINGKASAN STATS */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {/* TOTAL */}
              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                  <UsersRound size={16} />
                </div>
                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {loading ? "..." : stats.total}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Total Muzakki Terdaftar
                </p>
              </div>

              {/* UMUM */}
              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                  <UserRound size={16} />
                </div>
                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {loading ? "..." : stats.umum}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Muzakki Umum
                </p>
              </div>

              {/* UNSIL */}
              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                  <GraduationCap size={16} />
                </div>
                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {loading ? "..." : stats.dosen_staf}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Dosen &amp; Staf UNSIL
                </p>
              </div>

            </div>

            {/* =================================================
                FILTER & PENCARIAN
            ================================================== */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* TABS KATEGORI */}
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveKategori("semua")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeKategori === "semua"
                      ? "bg-[#08734f] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Semua ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveKategori("unsil")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeKategori === "unsil"
                      ? "bg-[#08734f] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Dosen & Staf UNSIL ({stats.dosen_staf})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveKategori("umum")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeKategori === "umum"
                      ? "bg-[#08734f] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Masyarakat Umum ({stats.umum})
                </button>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau unit..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* =================================================
                TABEL DATA REAL
            ================================================== */}

            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              {/* HEADER TABEL */}
              <div className="border-b border-gray-100 bg-green-50/60 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-[#08734f]"
                    />
                    <h3 className="text-xs font-semibold text-[#08734f] sm:text-sm">
                      Daftar Muzakki Real Time (Database UPZ)
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Menampilkan {totalItems} muzakki
                  </span>
                </div>
              </div>

              {/* ERROR STATE */}
              {error && (
                <div className="flex items-center gap-3 p-6 text-xs text-red-600 bg-red-50/50">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* TABLE */}
              <div className="overflow-x-auto">

                <table className="w-full min-w-[620px] text-left">

                  <thead>
                    <tr className="border-b border-gray-100 bg-slate-50/50">
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 w-12 text-center">
                        No.
                      </th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Nama Muzakki
                      </th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Kategori &amp; Unit Kerja
                      </th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Pekerjaan
                      </th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 text-center">
                        Tanggal Terdaftar
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <RefreshCw size={16} className="animate-spin text-[#08734f]" />
                            <span>Memuat data muzakki dari server...</span>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                          Tidak ada data muzakki yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedList.map((item, index) => {
                        const rowNum = (page - 1) * perPage + index + 1;
                        const isUnsil = item.kategori === "Dosen & Staf UNSIL" || (item.unit_kerja && item.unit_kerja !== "Masyarakat Umum" && item.unit_kerja !== "Umum");

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-green-50/30 transition-colors"
                          >
                            <td className="px-4 py-3 text-xs text-gray-400 text-center font-mono">
                              {rowNum}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isUnsil ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>
                                  {isUnsil ? <GraduationCap size={14} /> : <UserRound size={13} />}
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-gray-800 block">
                                    {item.nama}
                                  </span>
                                  {item.unit_kerja && item.unit_kerja !== "Masyarakat Umum" && (
                                    <span className="text-[10px] text-slate-500 block leading-tight">
                                      {item.unit_kerja}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-xs">
                              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                                isUnsil
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                                  : "bg-slate-100 text-slate-700 border border-slate-200/60"
                              }`}>
                                {isUnsil ? <Building2 size={11} /> : <UserRound size={10} />}
                                {item.kategori}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-xs text-slate-600">
                              {item.pekerjaan || "-"}
                            </td>

                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200/60">
                                <Calendar size={11} className="text-slate-400" />
                                {item.tanggal_daftar || (item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-")}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}

                  </tbody>


                </table>

              </div>

              {/* PAGINATION */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                  <span>
                    Halaman {page} dari {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* INFO PRIVASI */}
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2.5">
              <p className="text-[10px] leading-4 text-blue-700 sm:text-xs sm:leading-5">
                Data yang ditampilkan merupakan informasi pendaftaran muzakki resmi untuk kebutuhan transparansi publik dan tidak menampilkan data pribadi yang bersifat rahasia.
              </p>
            </div>

          </section>

        </div>

      </section>

    </div>
  );
}
