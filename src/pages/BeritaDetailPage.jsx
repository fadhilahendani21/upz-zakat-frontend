import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, ArrowRight, User, Newspaper } from "lucide-react";
import { getPublicBerita, getPublicBeritaDetail } from "../services/beritaService";

const FALLBACK_NEWS = [
  {
    id: 1,
    category: "Kegiatan",
    title: "Gerai Zakat UPZ Unsil Hadirkan Kemudahan Berzakat",
    date: "15 Agustus 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi menghadirkan layanan Gerai Zakat sebagai salah satu upaya untuk memberikan kemudahan kepada sivitas akademika dan masyarakat dalam menunaikan zakat, infak, dan sedekah.

Gerai Zakat menjadi salah satu layanan yang dapat dimanfaatkan oleh masyarakat untuk memperoleh informasi mengenai zakat sekaligus menyalurkan dana zakat dengan lebih mudah. Kehadiran layanan ini diharapkan dapat meningkatkan kesadaran masyarakat untuk menunaikan kewajiban zakat serta memperkuat budaya berbagi di lingkungan Universitas Siliwangi.

Melalui Gerai Zakat, UPZ Zakat Universitas Siliwangi terus berkomitmen untuk memberikan pelayanan yang amanah, transparan, dan mudah dijangkau oleh masyarakat. Dana yang dihimpun selanjutnya akan dikelola dan disalurkan kepada penerima manfaat sesuai dengan ketentuan yang berlaku.`,
  },
  {
    id: 2,
    category: "Penyaluran",
    title: "UPZ Unsil Salurkan Bantuan Beras bagi Keluarga Membutuhkan",
    date: "10 Agustus 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi kembali melaksanakan penyaluran bantuan beras kepada sejumlah keluarga yang membutuhkan. Kegiatan ini merupakan bentuk kepedulian UPZ terhadap kondisi masyarakat, khususnya keluarga yang memiliki keterbatasan dalam memenuhi kebutuhan pangan sehari-hari.

Bantuan beras diberikan kepada penerima manfaat yang telah melalui proses pendataan dan verifikasi. Penyaluran dilakukan secara langsung agar bantuan dapat diterima oleh masyarakat yang benar-benar membutuhkan.

Program bantuan pangan ini diharapkan dapat membantu meringankan beban pengeluaran keluarga penerima manfaat. UPZ Zakat Universitas Siliwangi akan terus berupaya menghadirkan program penyaluran yang memberikan manfaat nyata dan tepat sasaran bagi masyarakat.`,
  },
  {
    id: 3,
    category: "Penyaluran",
    title: "Penyaluran Rutin UPZ Unsil Terus Berikan Manfaat",
    date: "5 Agustus 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi secara rutin melaksanakan penyaluran dana zakat kepada masyarakat yang telah ditetapkan sebagai penerima manfaat. Program ini menjadi salah satu bentuk komitmen UPZ dalam memastikan dana zakat yang telah dihimpun dapat memberikan manfaat secara langsung.

Penyaluran dilakukan berdasarkan data penerima manfaat yang telah dikumpulkan dan diverifikasi oleh tim UPZ. Bantuan diberikan sesuai dengan kebutuhan dan kondisi masing-masing penerima sehingga diharapkan dapat memberikan dampak yang lebih tepat sasaran.

Kegiatan penyaluran rutin ini juga menjadi bagian dari upaya UPZ untuk menjaga kepercayaan para muzakki. Dengan pengelolaan dan penyaluran yang dilakukan secara berkelanjutan, dana zakat diharapkan dapat membantu meningkatkan kesejahteraan masyarakat yang membutuhkan.`,
  },
  {
    id: 4,
    category: "Kegiatan",
    title: "UPZ Unsil Salurkan Al-Qur’an untuk Masyarakat",
    date: "28 Juli 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi menyalurkan bantuan Al-Qur’an kepada masyarakat dan lembaga yang membutuhkan. Program ini menjadi salah satu bentuk kepedulian UPZ dalam mendukung kegiatan keagamaan serta meningkatkan akses masyarakat terhadap Al-Qur’an.

Bantuan Al-Qur’an disalurkan kepada beberapa penerima yang membutuhkan, termasuk tempat-tempat yang digunakan untuk kegiatan pembelajaran dan pengajian masyarakat. Penyaluran dilakukan sebagai bagian dari pemanfaatan dana zakat, infak, dan sedekah untuk kegiatan yang memberikan manfaat bagi masyarakat.

Melalui program ini, UPZ berharap bantuan yang diberikan tidak hanya memenuhi kebutuhan sarana keagamaan, tetapi juga dapat mendorong semangat masyarakat untuk membaca, mempelajari, dan mengamalkan nilai-nilai yang terkandung dalam Al-Qur’an.`,
  },
  {
    id: 5,
    category: "Pemberdayaan",
    title: "Bantuan Modal Usaha Dorong Kemandirian Mustahik",
    date: "20 Juli 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi memberikan bantuan modal usaha kepada sejumlah mustahik sebagai bagian dari program pemberdayaan ekonomi masyarakat. Bantuan ini ditujukan untuk membantu penerima manfaat dalam memulai maupun mengembangkan usaha yang telah dijalankan.

Bantuan modal diberikan berdasarkan kondisi dan kebutuhan penerima manfaat. Selain memberikan bantuan berupa modal, UPZ juga mendorong penerima manfaat agar dapat mengelola usaha secara mandiri dan berkelanjutan sehingga mampu meningkatkan pendapatan keluarga.

Program pemberdayaan ekonomi ini diharapkan dapat menjadi langkah awal bagi mustahik untuk meningkatkan kesejahteraan dan kemandirian ekonomi. UPZ Zakat Universitas Siliwangi berkomitmen untuk terus mengembangkan program yang tidak hanya bersifat konsumtif, tetapi juga memberikan manfaat jangka panjang bagi penerima zakat.`,
  },
  {
    id: 6,
    category: "Penyaluran",
    title: "UPZ Unsil Bantu Renovasi Rumah Tidak Layak Huni",
    date: "12 Juli 2026",
    image: null,
    content: `UPZ Zakat Universitas Siliwangi turut membantu renovasi rumah tidak layak huni melalui program Rutilahu. Program ini ditujukan bagi keluarga yang memiliki keterbatasan ekonomi dan tinggal di rumah dengan kondisi yang kurang layak.

Proses renovasi dilakukan pada beberapa bagian rumah yang membutuhkan perbaikan, seperti atap, dinding, lantai, dan fasilitas dasar lainnya. Bantuan diberikan agar penerima manfaat dapat memiliki tempat tinggal yang lebih aman, nyaman, dan layak untuk ditempati bersama keluarga.

Program Rutilahu merupakan salah satu bentuk kepedulian UPZ terhadap kesejahteraan masyarakat. Melalui penyaluran dana zakat yang tepat sasaran, UPZ berharap program ini dapat memberikan perubahan positif bagi kehidupan keluarga penerima manfaat.`,
  },
];

export default function BeritaDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        // 1. Ambil detail berita aktif
        const resDetail = await getPublicBeritaDetail(id);
        if (resDetail?.data) {
          const d = resDetail.data;
          setNews({
            id: d.id,
            category: d.kategori || "Kegiatan",
            title: d.judul,
            date: d.published_at
              ? new Date(d.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Terbaru",
            image: d.gambar || null,
            content: d.konten,
            author: d.author?.name || null,
          });
        } else {
          // Cek di fallback data
          const found = FALLBACK_NEWS.find((item) => String(item.id) === String(id));
          setNews(found || null);
        }

        // 2. Ambil daftar berita lainnya (maksimal 3 berita)
        const resList = await getPublicBerita({ perPage: 6 });
        if (resList?.data && resList.data.length > 0) {
          const others = resList.data
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 3)
            .map((item) => ({
              id: item.id,
              category: item.kategori || "Kegiatan",
              title: item.judul,
              excerpt:
                item.ringkasan ||
                (item.konten ? item.konten.replace(/<[^>]*>?/gm, "").slice(0, 100) : ""),
              date: item.published_at
                ? new Date(item.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Terbaru",
              image: item.gambar || null,
            }));
          setOtherNews(others);
        } else {
          const fallbackOthers = FALLBACK_NEWS.filter(
            (item) => String(item.id) !== String(id)
          ).slice(0, 3);
          setOtherNews(fallbackOthers);
        }
      } catch (err) {
        console.error("Gagal memuat detail berita:", err);
        const found = FALLBACK_NEWS.find((item) => String(item.id) === String(id));
        setNews(found || null);
        setOtherNews(FALLBACK_NEWS.filter((item) => String(item.id) !== String(id)).slice(0, 3));
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // =======================================================
  // LOADING STATE
  // =======================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Memuat detail berita...</p>
        </div>
      </div>
    );
  }

  // =======================================================
  // BERITA TIDAK DITEMUKAN
  // =======================================================
  if (!news) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            Berita tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Berita yang Anda cari belum tersedia atau telah dihapus.
          </p>
          <Link
            to="/berita"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <ArrowLeft size={14} />
            Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  const isHtml = news.content && news.content.includes("<");

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-12">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/berita"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-700 transition"
          >
            <ArrowLeft size={14} />
            Kembali ke Daftar Berita
          </Link>
        </div>

        {/* =================================================
            HEADER BERITA
        ================================================== */}

        <article className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">

          {/* KATEGORI */}
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            {news.category}
          </span>

          {/* JUDUL */}
          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            {news.title}
          </h1>

          {/* TANGGAL & PENULIS */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-1.5">
              <Calendar size={15} />
              <span>{news.date}</span>
            </div>
            {news.author && (
              <div className="flex items-center gap-1.5">
                <User size={15} />
                <span>Oleh: {news.author}</span>
              </div>
            )}
          </div>

          {/* =================================================
              FOTO
          ================================================== */}

          {news.image && (
            <div className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-xs max-h-[420px] flex items-center justify-center">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* =================================================
              ISI BERITA
          ================================================== */}

          <div className="mt-8 text-gray-800 leading-relaxed text-sm sm:text-base">
            {isHtml ? (
              <div
                className="prose prose-brand max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            ) : (
              <div className="whitespace-pre-line text-justify leading-7 sm:leading-8">
                {news.content}
              </div>
            )}
          </div>

        </article>

        {/* =================================================
            BERITA LAINNYA (MAKSIMAL 3 BERITA)
        ================================================== */}

        {otherNews.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Berita Lainnya
              </h2>
              <Link
                to="/berita"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:gap-1.5 transition-all"
              >
                Lihat Semua
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition duration-200"
                >
                  <div className="w-full h-36 bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-brand-50 to-brand-100 flex items-center justify-center text-brand-600">
                        <Newspaper size={28} className="opacity-60" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="inline-flex w-fit items-center text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-brand-700 transition">
                      {item.title}
                    </h3>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {item.date}
                      </span>
                      <span className="text-brand-700 font-semibold flex items-center gap-0.5">
                        Baca <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

    </div>
  );
}