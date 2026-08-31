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
import { getPublicBerita } from "../services/beritaService";

const DEFAULT_BERITA = [
  {
    id: 1,
    tanggal: "12 Agustus 2026",
    judul: "Penyaluran Beasiswa Semester Ganjil 2026 Resmi Dimulai",
    deskripsi: "UPZ Zakat Universitas Siliwangi kembali menyalurkan bantuan beasiswa bagi mahasiswa yang membutuhkan.",
    image: null,
  },
  {
    id: 2,
    tanggal: "5 Agustus 2026",
    judul: "Gerai Zakat UPZ Unsil Kembali Melayani Muzakki",
    deskripsi: "Layanan gerai zakat hadir untuk memudahkan civitas akademika dan masyarakat dalam menunaikan zakat.",
    image: null,
  },
  {
    id: 3,
    tanggal: "30 Juli 2026",
    judul: "Penyaluran Beras untuk Mustahik UPZ Universitas Siliwangi",
    deskripsi: "Bantuan pangan disalurkan kepada penerima manfaat sebagai bentuk kepedulian UPZ Unsil.",
    image: null,
  },
  {
    id: 4,
    tanggal: "25 Juli 2026",
    judul: "Penyaluran Al-Qur'an kepada Masyarakat",
    deskripsi: "UPZ Unsil menyalurkan Al-Qur'an sebagai bagian dari program pembinaan dan kepedulian sosial.",
    image: null,
  },
];

// =========================================================
// LANDING PAGE
// =========================================================

export default function LandingPage() {
  const [beritaList, setBeritaList] = useState(DEFAULT_BERITA);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await getPublicBerita({ perPage: 4 });
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            judul: item.judul,
            deskripsi:
              item.ringkasan ||
              (item.konten ? item.konten.replace(/<[^>]*>?/gm, "").slice(0, 120) : "Berita seputar UPZ Unsil."),
            tanggal: item.published_at
              ? new Date(item.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Terbaru",
            image: item.gambar || null,
          }));
          setBeritaList(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat berita publik:", err);
      }
    }
    loadNews();
  }, []);

  const beritaUtama = beritaList[0] || DEFAULT_BERITA[0];
  const beritaLainnya = beritaList.slice(1, 4); // Maksimal 3 berita lainnya

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

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

      <section className="w-full bg-white px-6 py-10 lg:py-12">

        <div className="mx-auto max-w-6xl">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Berita &amp; Informasi
              </h2>

            </div>

            {/* LIHAT SEMUA */}

            <Link
              to="/berita"
              className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-brand-200 px-3.5 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 sm:inline-flex"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>

          </div>

          {/* =================================================
              GRID BERITA
          ================================================== */}

          <div className="grid items-start gap-4 lg:grid-cols-[1fr_0.88fr]">

            {/* =================================================
                BERITA TERBARU
            ================================================== */}

            <Link
              to={`/berita/${beritaUtama.id}`}
              className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* FOTO UTAMA */}

              {beritaUtama.image ? (
                <div className="relative h-[190px] overflow-hidden sm:h-[220px]">
                  <img
                    src={beritaUtama.image}
                    alt={beritaUtama.judul}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                    Berita Terbaru
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/85">
                      <CalendarDays size={11} />
                      {beritaUtama.tanggal}
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                      {beritaUtama.judul}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="relative h-[190px] sm:h-[220px] bg-gradient-to-br from-brand-700 via-brand-800 to-emerald-900 p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                      Berita Terbaru
                    </span>
                    <Newspaper size={24} className="text-white/40" />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/80">
                      <CalendarDays size={11} />
                      {beritaUtama.tanggal}
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-white sm:text-xl line-clamp-2">
                      {beritaUtama.judul}
                    </h3>
                  </div>
                </div>
              )}

              {/* DESKRIPSI */}

              <div className="p-4">

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
                BERITA LAINNYA
            ================================================== */}

            <div>

              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Berita Lainnya
              </h3>

              <div className="space-y-2.5">

                {beritaLainnya.map((berita) => (

                  <Link
                    key={berita.id}
                    to={`/berita/${berita.id}`}
                    className="group flex gap-2.5 rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition duration-300 hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-sm"
                  >

                    {/* FOTO KECIL / ICON */}

                    <div className="h-[58px] w-[76px] shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-[64px] sm:w-[84px] flex items-center justify-center">

                      {berita.image ? (
                        <img
                          src={berita.image}
                          alt={berita.judul}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-50 flex items-center justify-center text-brand-600">
                          <Newspaper size={20} className="opacity-60" />
                        </div>
                      )}

                    </div>

                    {/* ISI */}

                    <div className="flex min-w-0 flex-1 flex-col justify-center">

                      <div className="flex items-center gap-1 text-[9px] text-gray-400">

                        <CalendarDays size={9} />

                        {berita.tanggal}

                      </div>

                      <h4 className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-4 text-gray-900 transition-colors group-hover:text-brand-700 sm:text-xs sm:leading-4"
                      >
                        {berita.judul}
                      </h4>

                    </div>

                    {/* PANAH */}

                    <ArrowRight
                      size={12}
                      className="mt-2 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
                    />

                  </Link>

                ))}

              </div>

            </div>

          </div>

          {/* =================================================
              MOBILE - LIHAT SEMUA
          ================================================== */}

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