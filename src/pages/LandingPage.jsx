
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
} from "lucide-react";

import { Link } from "react-router-dom";

import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/FeatureCard";
import StatsBar from "../components/landing/StatsBar";
import { getPublicBerita, formatImageUrl } from "../services/beritaService";

import berita1 from "../assets/images/berita 1.jpeg";
import berita2 from "../assets/images/berita 2.jpeg";
import berita3 from "../assets/images/berita 3.jpeg";
import berita4 from "../assets/images/berita 4.jpeg";

const DEFAULT_BERITA = [
  {
    id: 1,
    tanggal: "12 Agustus 2026",
    judul: "Penyaluran Beasiswa Semester Ganjil 2026 Resmi Dimulai",
    deskripsi:
      "UPZ Zakat Universitas Siliwangi kembali menyalurkan bantuan beasiswa bagi mahasiswa yang membutuhkan.",
    image: berita1,
  },
  {
    id: 2,
    tanggal: "5 Agustus 2026",
    judul: "Gerai Zakat UPZ Unsil Kembali Melayani Muzakki",
    deskripsi:
      "Layanan gerai zakat hadir untuk memudahkan civitas akademika dan masyarakat dalam menunaikan zakat.",
    image: berita2,
  },
  {
    id: 3,
    tanggal: "30 Juli 2026",
    judul: "Penyaluran Beras untuk Mustahik UPZ Universitas Siliwangi",
    deskripsi:
      "Bantuan pangan disalurkan kepada penerima manfaat sebagai bentuk kepedulian UPZ Unsil.",
    image: berita3,
  },
  {
    id: 4,
    tanggal: "25 Juli 2026",
    judul: "Penyaluran Al-Qur'an kepada Masyarakat",
    deskripsi:
      "UPZ Unsil menyalurkan Al-Qur'an sebagai bagian dari program pembinaan dan kepedulian sosial.",
    image: berita4,
  },
];

// =========================================================
// LANDING PAGE
// =========================================================

export default function LandingPage() {
  const [beritaList, setBeritaList] = useState(DEFAULT_BERITA);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        
const res = await getPublicBerita({
  page: 1,
  perPage: 5,
});

console.log("Respons API:", res);
console.log(
  "Daftar berita:",
  res?.data?.map((item) => ({
    id: item.id,
    judul: item.judul,
    gambar: item.gambar,
  }))
);

        if (!active) return;

        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            judul: item.judul,
            deskripsi:
              item.ringkasan ||
              (item.konten
                ? item.konten.replace(/<[^>]*>?/gm, "").slice(0, 120)
                : "Berita seputar UPZ Unsil."),
            tanggal: item.published_at
              ? new Date(item.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Terbaru",
            image: formatImageUrl(item.gambar) || null,
          }));

          setBeritaList(mapped.slice(0, 5));
        }
      } catch (err) {
        console.error("Gagal memuat berita publik:", err);
      }
    }

    loadNews();

    return () => {
      active = false;
    };
  }, []);

  const beritaUtama = beritaList[0] || DEFAULT_BERITA[0];

const beritaLainnya = [
  ...beritaList.slice(1),
  ...DEFAULT_BERITA.filter(
    (defaultBerita) =>
      !beritaList.some(
        (berita) => String(berita.id) === String(defaultBerita.id)
      )
  ),
].slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <Hero />

      {/* =====================================================
          FEATURE
      ====================================================== */}

      <FeatureCard />

      {/* =====================================================
          STATS
      ====================================================== */}

      <StatsBar />

      {/* =====================================================
          BERITA & INFORMASI
      ====================================================== */}

      <section className="w-full bg-white px-6 pt-3 pb-6 sm:px-8 sm:pt-3 sm:pb-7 lg:px-6 xl:px-6">
        <div className="mx-auto w-full max-w-none">

          {/* HEADER */}

          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Berita &amp; Informasi
            </h2>

            <Link
              to="/berita"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-200 px-3.5 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 sm:px-4"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* GRID BERITA */}

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.05fr_0.95fr]">

            {/* =================================================
                BERITA UTAMA
            ================================================== */}

            <Link
              to={`/berita/${beritaUtama.id}`}
              className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* FOTO UTAMA */}

              {beritaUtama.image ? (
                <div className="relative h-[170px] shrink-0 overflow-hidden bg-brand-800 sm:h-[190px]">
                  <img
                    src={formatImageUrl(beritaUtama.image)}
                    alt={beritaUtama.judul}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                    Berita Terbaru
                  </span>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/90">
                      <CalendarDays size={11} />
                      {beritaUtama.tanggal}
                    </div>

                    <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                      {beritaUtama.judul}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="relative flex h-[170px] shrink-0 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-800 to-emerald-900 p-4 sm:h-[190px]">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                      Berita Terbaru
                    </span>
                    <Newspaper size={24} className="text-white/40" />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/80">
                      <CalendarDays size={11} />
                      {beritaUtama.tanggal}
                    </div>

                    <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white sm:text-xl">
                      {beritaUtama.judul}
                    </h3>
                  </div>
                </div>
              )}

              {/* DESKRIPSI */}

              <div className="p-3">
                <p className="line-clamp-2 text-xs leading-5 text-gray-600 sm:text-sm">
                  {beritaUtama.deskripsi}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                  Baca Selengkapnya

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>

            {/* =================================================
                EMPAT BERITA LAINNYA
            ================================================== */}

            <div className="flex min-w-0 flex-col gap-2">
              {beritaLainnya.map((berita) => (
                <Link
                  key={berita.id}
                  to={`/berita/${berita.id}`}
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition duration-300 hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-sm"
                >

                  {/* FOTO KECIL */}

                  <div className="relative h-[52px] w-[68px] shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-[58px] sm:w-[76px]">
                    {berita.image ? (
                      <>
                        <img
                          src={formatImageUrl(berita.image)}
                          alt={berita.judul}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".side-fallback"
                              );

                            if (fallback) {
                              fallback.classList.remove("hidden");
                              fallback.classList.add("flex");
                            }
                          }}
                        />

                        <div className="side-fallback absolute inset-0 hidden items-center justify-center bg-brand-50 text-brand-600">
                          <Newspaper size={20} className="opacity-60" />
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand-50 text-brand-600">
                        <Newspaper size={20} className="opacity-60" />
                      </div>
                    )}
                  </div>

                  {/* TANGGAL DAN JUDUL */}

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <CalendarDays size={9} />
                      {berita.tanggal}
                    </div>

                    <h4 className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-4 text-gray-900 transition-colors group-hover:text-brand-700 sm:text-xs sm:leading-4">
                      {berita.judul}
                    </h4>
                  </div>

                  {/* PANAH */}

                  <ArrowRight
                    size={13}
                    className="shrink-0 text-brand-700 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* MOBILE - LIHAT SEMUA */}

          <div className="mt-5 sm:hidden">
            <Link
              to="/berita"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 px-4 py-2.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Lihat Semua Berita
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
