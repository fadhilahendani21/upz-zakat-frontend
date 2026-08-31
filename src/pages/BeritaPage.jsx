import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../services/settingService";
import { getPublicBerita, formatImageUrl } from "../services/beritaService";

import berita1 from "../assets/images/berita 1.jpeg";
import berita2 from "../assets/images/berita 2.jpeg";
import berita3 from "../assets/images/berita 3.jpeg";
import berita4 from "../assets/images/berita 4.jpeg";
import berita5 from "../assets/images/berita 5.jpeg";
import berita6 from "../assets/images/berita 6.jpeg";

const FALLBACK_NEWS = [
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
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  const brandName =
    settings?.profil?.namaSingkat ||
    "UPZ Unsil";

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getPublicBerita({ page, perPage: 9 });
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            category: item.kategori || "Kegiatan",
            title: item.judul,
            excerpt:
              item.ringkasan ||
              (item.konten ? item.konten.replace(/<[^>]*>?/gm, "").slice(0, 150) : "Berita seputar kegiatan dan penyaluran zakat UPZ Unsil."),
            date: item.published_at
              ? new Date(item.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Terbaru",
            image: formatImageUrl(item.gambar) || null,
          }));
          setNewsList(mapped);
          setMeta(res.meta || { current_page: 1, last_page: 1, total: mapped.length });
        } else {
          setNewsList(FALLBACK_NEWS);
          setMeta({ current_page: 1, last_page: 1, total: FALLBACK_NEWS.length });
        }
      } catch (err) {
        console.error("Gagal memuat berita:", err);
        setNewsList(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page]);

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
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-200"
              >
                {/* Gambar Berita / Placeholder */}
                {news.image ? (
                  <div className="w-full h-44 bg-gray-100 overflow-hidden relative flex items-center justify-center">
                    <img
                      src={formatImageUrl(news.image)}
                      alt={news.title}
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement?.querySelector(".news-fallback");
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                    <div className="news-fallback hidden w-full h-full bg-gradient-to-br from-emerald-50 via-brand-50 to-brand-100 flex items-center justify-center text-brand-600">
                      <Newspaper size={36} className="opacity-60" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-emerald-50 via-brand-50 to-brand-100 flex items-center justify-center text-brand-600">
                    <Newspaper size={36} className="opacity-60" />
                  </div>
                )}

                {/* Isi Card */}
                <div className="p-5 flex flex-col flex-1">

                  {/* Kategori */}
                  <span className="inline-flex w-fit items-center text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                    {news.category}
                  </span>

                  {/* Judul */}
                  <h3 className="mt-3 text-base font-bold text-gray-900 leading-snug line-clamp-2">
                    {news.title}
                  </h3>

                  {/* Deskripsi */}
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">
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
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white rounded-xl border border-gray-200">
              Halaman {page} dari {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

    </div>
  );
}