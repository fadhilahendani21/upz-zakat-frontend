import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import berita1 from "../assets/images/berita 1.jpeg";
import berita2 from "../assets/images/berita 2.jpeg";
import berita3 from "../assets/images/berita 3.jpeg";
import berita4 from "../assets/images/berita 4.jpeg";
import berita5 from "../assets/images/berita 5.jpeg";
import berita6 from "../assets/images/berita 6.jpeg";

const NEWS = [
  {
    id: 1,
    category: "Kegiatan",
    title: "Penyaluran Beasiswa Semester Ganjil 2026 Resmi Dimulai",
    excerpt:
      "UPZ Zakat Universitas Siliwangi menyalurkan beasiswa kepada 85 mahasiswa kurang mampu untuk semester ganjil tahun akademik 2026/2027.",
    date: "12 Agustus 2026",
    image: berita1,
  },
  {
    id: 2,
    category: "Laporan",
    title: "Laporan Transparansi Dana Zakat Triwulan II 2026",
    excerpt:
      "Total dana zakat, infak, dan sedekah yang terkumpul pada triwulan kedua mencapai Rp 1,55 miliar, meningkat 25,6% dari periode sebelumnya.",
    date: "5 Agustus 2026",
    image: berita2,
  },
  {
    id: 3,
    category: "Kegiatan",
    title: "Bedah Rumah Dhuafa di Kecamatan Cibeureum",
    excerpt:
      "Tim UPZ bersama relawan mahasiswa menyelesaikan renovasi rumah milik salah satu mustahik yang tidak layak huni di Cibeureum, Tasikmalaya.",
    date: "28 Juli 2026",
    image: berita3,
  },
  {
    id: 4,
    category: "Pengumuman",
    title: "Pembukaan Pendaftaran Muzakki Baru Tahun 2026",
    excerpt:
      "Bagi sivitas akademika yang ingin mendaftar sebagai muzakki tetap, pendaftaran dibuka mulai 1 Agustus hingga 31 Agustus 2026.",
    date: "20 Juli 2026",
    image: berita4,
  },
  {
    id: 5,
    category: "Kegiatan",
    title: "Pelatihan Kewirausahaan untuk Penerima Manfaat",
    excerpt:
      "Sebanyak 30 mustahik mengikuti pelatihan kewirausahaan sebagai bagian dari program pemberdayaan ekonomi UPZ Zakat Unsil.",
    date: "10 Juli 2026",
    image: berita5,
  },
  {
    id: 6,
    category: "Laporan",
    title: "Audit Syariah Tahunan UPZ Zakat Unsil Tuntas Dilaksanakan",
    excerpt:
      "Proses audit syariah tahunan telah selesai dilaksanakan dan menyatakan pengelolaan dana zakat UPZ sesuai dengan ketentuan syariat Islam.",
    date: "2 Juli 2026",
    image: berita6,
  },
];

export default function BeritaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Berita Terbaru UPZ Zakat
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Ikuti perkembangan kegiatan, laporan, dan pengumuman terbaru
              seputar UPZ Zakat Universitas Siliwangi.
            </p>
          </div>
        </div>
      </section>

      {/* Daftar Berita */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-5 flex flex-col flex-1">
                <span className="inline-flex w-fit items-center text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                  {news.category}
                </span>

                <h3 className="mt-3 text-base font-bold text-gray-900 leading-snug">
                  {news.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
                  {news.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} />
                    {news.date}
                  </span>

                  <Link
                    to={`/berita/${news.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:gap-2 transition-all"
                  >
                    Baca
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}