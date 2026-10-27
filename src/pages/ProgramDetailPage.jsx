import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderHeart,
  Users,
  Heart,
  Target,
  HandCoins,
  CheckCircle2,
  Calendar,
  Share2,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { getPublicProgramDetail, getPublicPrograms } from "../services/programService";
import { useSettings } from "../services/settingService";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function ProgramDetailPage() {
  const { idOrSlug, id } = useParams();
  const navigate = useNavigate();
  const settings = useSettings();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [otherPrograms, setOtherPrograms] = useState([]);

  const currentIdentifier = idOrSlug || id;

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      try {
        let identifier = currentIdentifier;

        // Jika rute /program/detail tanpa id/slug, coba ambil dari program pertama
        if (!identifier) {
          const listRes = await getPublicPrograms();
          if (listRes?.data && listRes.data.length > 0) {
            identifier = listRes.data[0].slug || listRes.data[0].id;
          }
        }

        if (identifier) {
          const detail = await getPublicProgramDetail(identifier);
          if (mounted && detail) {
            setProgram(detail);
          }
        }

        // Ambil program lain untuk rekomendasi di bagian bawah
        const listRes = await getPublicPrograms();
        if (mounted && Array.isArray(listRes?.data)) {
          setOtherPrograms(
            listRes.data.filter((p) => String(p.slug || p.id) !== String(identifier) && String(p.id) !== String(identifier)).slice(0, 3)
          );
        }
      } catch (err) {
        console.error("Gagal memuat detail program:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [currentIdentifier]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const orgName = settings?.profil?.namaSingkat || "UPZ Unsil";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
        <section className="w-full bg-brand-700 text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="h-4 w-32 animate-pulse rounded bg-white/20 mb-4" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-white/30 mb-3" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/20" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-48 animate-pulse rounded-2xl bg-white p-6 shadow-xs border border-gray-100" />
              <div className="h-64 animate-pulse rounded-2xl bg-white p-6 shadow-xs border border-gray-100" />
            </div>
            <div className="h-80 animate-pulse rounded-2xl bg-white p-6 shadow-xs border border-gray-100" />
          </div>
        </section>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df] flex flex-col justify-center items-center px-4 py-16">
        <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Program Tidak Ditemukan
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Program yang Anda tuju belum terdaftar atau telah dinonaktifkan. Silakan periksa daftar program lainnya.
          </p>
          <Link
            to="/program"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Program
          </Link>
        </div>
      </div>
    );
  }

  const target = Number(program.target_nominal) || 0;
  const terkumpul = Number(program.nominal_terkumpul) || 0;
  const tersalurkan = Number(program.nominal_disalurkan) || 0;
  const sisa = Math.max(0, target - terkumpul);
  const percent = target > 0 ? Math.min(100, Math.round((terkumpul / target) * 100)) : 0;
  const percentSalur = target > 0 ? Math.min(100, Math.round((tersalurkan / target) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
      {/* =====================================================
          HEADER DETAIL PROGRAM
      ====================================================== */}
      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Breadcrumb & Navigasi Balik */}
          <Link
            to="/program"
            className="inline-flex items-center gap-2 text-xs text-green-100 transition hover:text-white mb-4"
          >
            <ArrowLeft size={15} />
            Kembali ke Semua Program
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
              {program.status === "aktif" ? "Program Aktif" : program.status || "Aktif"}
            </span>

            {program.kode && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-100">
                Kode: {program.kode}
              </span>
            )}

            {program.tahun && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-100 flex items-center gap-1">
                <Calendar size={11} />
                Tahun {program.tahun}
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold leading-tight sm:text-3xl text-white">
            {program.nama || program.title}
          </h1>

          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
            Program resmi penyaluran zakat, infak, dan sedekah di bawah pengelolaan {orgName} Universitas Siliwangi.
          </p>
        </div>
      </section>

      {/* =====================================================
          BODY KONTEN DETAIL
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* KOLOM KIRI (KONTEN UTAMA) */}
          <div className="space-y-6 lg:col-span-2">
            {/* 1. KARTU PENCAPAIAN DANA */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                      Capaian &amp; Target Donasi
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Perkembangan pengumpulan dana secara real-time
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                  {percent}% Tercapai
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Rincian Angka */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-gray-50 pt-4 text-center">
                <div className="rounded-xl bg-gray-50/70 p-3">
                  <p className="text-[11px] text-gray-500">Dana Terkumpul</p>
                  <p className="mt-1 text-xs font-bold text-brand-700 sm:text-sm">
                    {formatRupiah(terkumpul)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/70 p-3">
                  <p className="text-[11px] text-gray-500">Target Nominal</p>
                  <p className="mt-1 text-xs font-bold text-gray-800 sm:text-sm">
                    {formatRupiah(target)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/70 p-3">
                  <p className="text-[11px] text-gray-500">Jumlah Donatur</p>
                  <p className="mt-1 text-xs font-bold text-gray-800 sm:text-sm">
                    {(program.jumlah_donatur || 0).toLocaleString("id-ID")} Orang
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/70 p-3">
                  <p className="text-[11px] text-gray-500">Mustahik Terbantu</p>
                  <p className="mt-1 text-xs font-bold text-emerald-700 sm:text-sm">
                    {(program.jumlah_penerima || 0).toLocaleString("id-ID")} Penerima
                  </p>
                </div>
              </div>

              {/* Sisa Kebutuhan */}
              {sisa > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50/70 px-4 py-2.5 text-xs text-amber-800 border border-amber-200/60">
                  <span>Kekurangan dana untuk mencapai target:</span>
                  <span className="font-bold">{formatRupiah(sisa)}</span>
                </div>
              )}
            </div>

            {/* 2. KARTU DESKRIPSI LENGKAP PROGRAM */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg mb-3 flex items-center gap-2">
                <FolderHeart size={20} className="text-brand-600" />
                Deskripsi Program
              </h2>

              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {program.deskripsi || "Informasi deskripsi program belum ditambahkan di database."}
              </div>

              {/* Standar Pengelolaan */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Prinsip Penyaluran UPZ UNSIL
                </h3>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700">
                    <CheckCircle2 size={16} className="text-brand-600 shrink-0" />
                    <span>Tepat Sasaran (Asnaf)</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700">
                    <CheckCircle2 size={16} className="text-brand-600 shrink-0" />
                    <span>Laporan Akuntabel</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700">
                    <CheckCircle2 size={16} className="text-brand-600 shrink-0" />
                    <span>Diawasi BAZNAS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DAFTAR DONATUR TERBARU */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users size={20} className="text-brand-600" />
                  Donatur Program ({program.jumlah_donatur || 0})
                </h2>
                <span className="text-xs text-brand-700 font-semibold bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                  {formatRupiah(terkumpul)} Terkumpul
                </span>
              </div>

              {Array.isArray(program.riwayat_donasi) && program.riwayat_donasi.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {program.riwayat_donasi.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-bold text-xs uppercase">
                          {item.nama_donatur ? item.nama_donatur.charAt(0) : "H"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.nama_donatur}</p>
                          <p className="text-[11px] text-gray-500">{item.tanggal}</p>
                        </div>
                      </div>
                      <span className="font-bold text-brand-700">
                        {formatRupiah(item.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50/70 p-4 text-center text-xs text-gray-500">
                  <p className="font-medium text-gray-700">Belum ada transaksi donasi untuk program ini.</p>
                  <p className="mt-1">Jadilah donatur pertama yang menorehkan kebaikan melalui program ini!</p>
                </div>
              )}
            </div>

            {/* 3. RIWAYAT TRANSPARANSI PENYALURAN (JIKA ADA DARI BACKEND) */}
            {Array.isArray(program.riwayat_penyaluran) && program.riwayat_penyaluran.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <HandCoins size={20} className="text-brand-600" />
                    Riwayat Penyaluran Terkini
                  </h2>
                  <span className="text-xs text-gray-500">
                    Total tersalur: {formatRupiah(tersalurkan)}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {program.riwayat_penyaluran.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-gray-900">{item.penerima}</p>
                        <p className="text-[11px] text-gray-500">{item.deskripsi} • {item.tanggal}</p>
                      </div>
                      <span className="font-bold text-emerald-700">
                        {formatRupiah(item.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (SIDEBAR ACTION & DONASI) */}
          <div className="space-y-6">
            {/* KARTU CTA DONASI */}
            <div className="sticky top-20 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 text-center">
                <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 mb-2">
                  Mari Berbagi Berkah
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Dukung Program Kebaikan Ini
                </h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Salurkan donasi, infak, atau sedekah Anda dengan mudah, aman, dan tercatat otomatis.
                </p>
              </div>

              {/* Ringkasan Cepat */}
              <div className="mb-5 rounded-xl bg-brand-50/70 p-3.5 border border-brand-100 text-xs text-brand-900 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama Program:</span>
                  <span className="font-semibold">{program.nama || program.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Penyelenggara:</span>
                  <span className="font-semibold">{orgName}</span>
                </div>
              </div>

              {/* Tombol Donasi Sekarang */}
              <Link
                to={`/donasi?program=${program.id}`}
                state={{ programId: program.id }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-md shadow-brand-700/20 transition-all hover:bg-brand-700 active:scale-[0.98]"
              >
                <Heart size={16} />
                Donasi Sekarang
              </Link>

              {/* Tombol Bagikan Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600">Tautan Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Bagikan Program Kebaikan</span>
                  </>
                )}
              </button>

              {/* Keamanan & Legalitas */}
              <div className="mt-5 border-t border-gray-100 pt-4 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-brand-600 shrink-0" />
                  <span>Transaksi diverifikasi sistem keuangan resmi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-brand-600 shrink-0" />
                  <span>Dikelola resmi oleh UPZ Universitas Siliwangi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            REKOMENDASI PROGRAM LAINNYA
        ====================================================== */}
        {otherPrograms.length > 0 && (
          <div className="mt-12 border-t border-gray-200/60 pt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Program Penyaluran Lainnya
                </h3>
                <p className="text-xs text-gray-500">
                  Telusuri program kebaikan lainnya yang sedang membutuhkan uluran tangan Anda
                </p>
              </div>

              <Link
                to="/program"
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherPrograms.map((op) => {
                const opTarget = Number(op.target_nominal) || 1;
                const opTerkumpul = Number(op.nominal_terkumpul) || 0;
                const opPercent = Math.min(100, Math.round((opTerkumpul / opTarget) * 100));

                return (
                  <div
                    key={op.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                          {opPercent}% Tercapai
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {op.tahun ? `Tahun ${op.tahun}` : ""}
                        </span>
                      </div>

                      <Link to={`/program/${op.slug || op.id}`}>
                        <h4 className="text-sm font-bold text-gray-900 hover:text-brand-700 transition">
                          {op.nama}
                        </h4>
                      </Link>

                      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {op.deskripsi || "Program penyaluran kebaikan UPZ UNSIL."}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-gray-50 pt-3">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-brand-700">
                          {formatRupiah(opTerkumpul)}
                        </span>
                        <span className="text-gray-400">
                          Target {formatRupiah(opTarget)}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-3">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${opPercent}%` }}
                        />
                      </div>

                      <Link
                        to={`/program/${op.slug || op.id}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50/50 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                      >
                        Lihat Detail Program
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
