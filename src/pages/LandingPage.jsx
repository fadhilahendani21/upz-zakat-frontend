import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { Link } from "react-router-dom";

import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/FeatureCard";
import StatsBar from "../components/landing/StatsBar";

// =========================================================
// FOTO BERITA
// =========================================================

import berita1Image from "../assets/images/berita 1.jpeg";
import berita2Image from "../assets/images/berita 2.jpeg";
import berita3Image from "../assets/images/berita 3.jpeg";
import berita4Image from "../assets/images/berita 4.jpeg";
import berita5Image from "../assets/images/berita 5.jpeg";
import berita6Image from "../assets/images/berita 6.jpeg";

// =========================================================
// DATA BERITA
// 1 BERITA TERBARU + 5 BERITA LAINNYA
// =========================================================

const BERITA = [
  {
    id: 1,
    tanggal: "12 Agustus 2026",
    judul:
      "Penyaluran Beasiswa Semester Ganjil 2026 Resmi Dimulai",
    deskripsi:
      "UPZ Zakat Universitas Siliwangi kembali menyalurkan bantuan beasiswa bagi mahasiswa yang membutuhkan.",
    image: berita1Image,
  },

  {
    id: 2,
    tanggal: "5 Agustus 2026",
    judul:
      "Gerai Zakat UPZ Unsil Kembali Melayani Muzakki",
    deskripsi:
      "Layanan gerai zakat hadir untuk memudahkan civitas akademika dan masyarakat dalam menunaikan zakat.",
    image: berita2Image,
  },

  {
    id: 3,
    tanggal: "30 Juli 2026",
    judul:
      "Penyaluran Beras untuk Mustahik UPZ Universitas Siliwangi",
    deskripsi:
      "Bantuan pangan disalurkan kepada penerima manfaat sebagai bentuk kepedulian UPZ Unsil.",
    image: berita3Image,
  },

  {
    id: 4,
    tanggal: "25 Juli 2026",
    judul:
      "Penyaluran Al-Qur'an kepada Masyarakat",
    deskripsi:
      "UPZ Unsil menyalurkan Al-Qur'an sebagai bagian dari program pembinaan dan kepedulian sosial.",
    image: berita4Image,
  },

  {
    id: 5,
    tanggal: "18 Juli 2026",
    judul:
      "Bantuan Modal Usaha untuk Mustahik UPZ Unsil",
    deskripsi:
      "Program pemberdayaan ekonomi kembali dilakukan untuk membantu mustahik mengembangkan usaha.",
    image: berita5Image,
  },

  {
    id: 6,
    tanggal: "10 Juli 2026",
    judul:
      "Program Rutilahu UPZ Unsil Bantu Renovasi Rumah Dhuafa",
    deskripsi:
      "UPZ Zakat Universitas Siliwangi membantu renovasi rumah tidak layak huni bagi keluarga yang membutuhkan.",
    image: berita6Image,
  },
];

// =========================================================
// LANDING PAGE
// =========================================================

export default function LandingPage() {
  const beritaUtama = BERITA[0];
  const beritaLainnya = BERITA.slice(1);

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

              <div className="relative h-[190px] overflow-hidden sm:h-[220px]">

                <img
                  src={beritaUtama.image}
                  alt={beritaUtama.judul}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* BADGE */}

                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                  Berita Terbaru
                </span>

                {/* INFO */}

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

                    {/* FOTO KECIL */}

                    <div className="h-[58px] w-[76px] shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-[64px] sm:w-[84px]">

                      <img
                        src={berita.image}
                        alt={berita.judul}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

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