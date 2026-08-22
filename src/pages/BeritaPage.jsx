import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../services/settingService";

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
    title: "Gerai Zakat UPZ Unsil Hadirkan Kemudahan Berzakat",
    excerpt:
      "UPZ Zakat Universitas Siliwangi membuka layanan Gerai Zakat sebagai sarana bagi sivitas akademika dan masyarakat untuk menunaikan zakat, infak, dan sedekah dengan lebih mudah.",
    date: "15 Agustus 2026",
    image: berita1,
  },
  {
    id: 2,
    category: "Penyaluran",
    title: "UPZ Unsil Salurkan Bantuan Beras bagi Keluarga Membutuhkan",
    excerpt:
      "Sebagai bentuk kepedulian terhadap masyarakat, UPZ Zakat Universitas Siliwangi menyalurkan bantuan beras kepada sejumlah keluarga penerima manfaat untuk membantu memenuhi kebutuhan pangan sehari-hari.",
    date: "10 Agustus 2026",
    image: berita2,
  },
  {
    id: 3,
    category: "Penyaluran",
    title: "Penyaluran Rutin UPZ Unsil Terus Berikan Manfaat",
    excerpt:
      "UPZ Zakat Universitas Siliwangi secara rutin menyalurkan dana zakat kepada penerima manfaat yang telah terdata sebagai bagian dari komitmen untuk memastikan dana zakat tepat sasaran.",
    date: "5 Agustus 2026",
    image: berita3,
  },
  {
    id: 4,
    category: "Kegiatan",
    title: "UPZ Unsil Salurkan Al-Qur’an untuk Masyarakat",
    excerpt:
      "UPZ Zakat Universitas Siliwangi menyalurkan bantuan Al-Qur’an kepada masyarakat dan lembaga yang membutuhkan sebagai bentuk dukungan terhadap kegiatan keagamaan.",
    date: "28 Juli 2026",
    image: berita4,
  },
  {
    id: 5,
    category: "Pemberdayaan",
    title: "Bantuan Modal Usaha Dorong Kemandirian Mustahik",
    excerpt:
      "UPZ Zakat Universitas Siliwangi memberikan bantuan modal usaha kepada sejumlah mustahik untuk membantu mengembangkan usaha kecil dan meningkatkan kemandirian ekonomi.",
    date: "20 Juli 2026",
    image: berita5,
  },
  {
    id: 6,
    category: "Penyaluran",
    title: "UPZ Unsil Bantu Renovasi Rumah Tidak Layak Huni",
    excerpt:
      "Melalui program Rutilahu, UPZ Zakat Universitas Siliwangi membantu renovasi rumah tidak layak huni agar keluarga penerima manfaat dapat memiliki tempat tinggal yang lebih aman dan nyaman.",
    date: "12 Juli 2026",
    image: berita6,
  },
];

export default function BeritaPage() {
  const settings = useSettings();

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  const brandName =
    settings?.profil?.namaSingkat ||
    "UPZ Unsil";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Berita Terbaru {brandName}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Ikuti perkembangan kegiatan, laporan, dan pengumuman terbaru
              seputar {orgName}.
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
              {/* Gambar Berita */}
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-40 object-cover"
              />

              {/* Isi Card */}
              <div className="p-5 flex flex-col flex-1">

                {/* Kategori */}
                <span className="inline-flex w-fit items-center text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                  {news.category}
                </span>

                {/* Judul */}
                <h3 className="mt-3 text-base font-bold text-gray-900 leading-snug">
                  {news.title}
                </h3>

                {/* Deskripsi */}
                <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
                  {news.excerpt}
                </p>

                {/* Tanggal + Baca */}
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