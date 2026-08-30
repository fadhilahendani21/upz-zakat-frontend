import { useParams } from "react-router-dom";
import { Calendar } from "lucide-react";

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
    date: "15 Agustus 2026",
    image: berita1,
    content: `UPZ Zakat Universitas Siliwangi menghadirkan layanan Gerai Zakat sebagai salah satu upaya untuk memberikan kemudahan kepada sivitas akademika dan masyarakat dalam menunaikan zakat, infak, dan sedekah.

Gerai Zakat menjadi salah satu layanan yang dapat dimanfaatkan oleh masyarakat untuk memperoleh informasi mengenai zakat sekaligus menyalurkan dana zakat dengan lebih mudah. Kehadiran layanan ini diharapkan dapat meningkatkan kesadaran masyarakat untuk menunaikan kewajiban zakat serta memperkuat budaya berbagi di lingkungan Universitas Siliwangi.

Melalui Gerai Zakat, UPZ Zakat Universitas Siliwangi terus berkomitmen untuk memberikan pelayanan yang amanah, transparan, dan mudah dijangkau oleh masyarakat. Dana yang dihimpun selanjutnya akan dikelola dan disalurkan kepada penerima manfaat sesuai dengan ketentuan yang berlaku.`,
  },

  {
    id: 2,
    category: "Penyaluran",
    title: "UPZ Unsil Salurkan Bantuan Beras bagi Keluarga Membutuhkan",
    date: "10 Agustus 2026",
    image: berita2,
    content: `UPZ Zakat Universitas Siliwangi kembali melaksanakan penyaluran bantuan beras kepada sejumlah keluarga yang membutuhkan. Kegiatan ini merupakan bentuk kepedulian UPZ terhadap kondisi masyarakat, khususnya keluarga yang memiliki keterbatasan dalam memenuhi kebutuhan pangan sehari-hari.

Bantuan beras diberikan kepada penerima manfaat yang telah melalui proses pendataan dan verifikasi. Penyaluran dilakukan secara langsung agar bantuan dapat diterima oleh masyarakat yang benar-benar membutuhkan.

Program bantuan pangan ini diharapkan dapat membantu meringankan beban pengeluaran keluarga penerima manfaat. UPZ Zakat Universitas Siliwangi akan terus berupaya menghadirkan program penyaluran yang memberikan manfaat nyata dan tepat sasaran bagi masyarakat.`,
  },

  {
    id: 3,
    category: "Penyaluran",
    title: "Penyaluran Rutin UPZ Unsil Terus Berikan Manfaat",
    date: "5 Agustus 2026",
    image: berita3,
    content: `UPZ Zakat Universitas Siliwangi secara rutin melaksanakan penyaluran dana zakat kepada masyarakat yang telah ditetapkan sebagai penerima manfaat. Program ini menjadi salah satu bentuk komitmen UPZ dalam memastikan dana zakat yang telah dihimpun dapat memberikan manfaat secara langsung.

Penyaluran dilakukan berdasarkan data penerima manfaat yang telah dikumpulkan dan diverifikasi oleh tim UPZ. Bantuan diberikan sesuai dengan kebutuhan dan kondisi masing-masing penerima sehingga diharapkan dapat memberikan dampak yang lebih tepat sasaran.

Kegiatan penyaluran rutin ini juga menjadi bagian dari upaya UPZ untuk menjaga kepercayaan para muzakki. Dengan pengelolaan dan penyaluran yang dilakukan secara berkelanjutan, dana zakat diharapkan dapat membantu meningkatkan kesejahteraan masyarakat yang membutuhkan.`,
  },

  {
    id: 4,
    category: "Kegiatan",
    title: "UPZ Unsil Salurkan Al-Qur’an untuk Masyarakat",
    date: "28 Juli 2026",
    image: berita4,
    content: `UPZ Zakat Universitas Siliwangi menyalurkan bantuan Al-Qur’an kepada masyarakat dan lembaga yang membutuhkan. Program ini menjadi salah satu bentuk kepedulian UPZ dalam mendukung kegiatan keagamaan serta meningkatkan akses masyarakat terhadap Al-Qur’an.

Bantuan Al-Qur’an disalurkan kepada beberapa penerima yang membutuhkan, termasuk tempat-tempat yang digunakan untuk kegiatan pembelajaran dan pengajian masyarakat. Penyaluran dilakukan sebagai bagian dari pemanfaatan dana zakat, infak, dan sedekah untuk kegiatan yang memberikan manfaat bagi masyarakat.

Melalui program ini, UPZ berharap bantuan yang diberikan tidak hanya memenuhi kebutuhan sarana keagamaan, tetapi juga dapat mendorong semangat masyarakat untuk membaca, mempelajari, dan mengamalkan nilai-nilai yang terkandung dalam Al-Qur’an.`,
  },

  {
    id: 5,
    category: "Pemberdayaan",
    title: "Bantuan Modal Usaha Dorong Kemandirian Mustahik",
    date: "20 Juli 2026",
    image: berita5,
    content: `UPZ Zakat Universitas Siliwangi memberikan bantuan modal usaha kepada sejumlah mustahik sebagai bagian dari program pemberdayaan ekonomi masyarakat. Bantuan ini ditujukan untuk membantu penerima manfaat dalam memulai maupun mengembangkan usaha yang telah dijalankan.

Bantuan modal diberikan berdasarkan kondisi dan kebutuhan penerima manfaat. Selain memberikan bantuan berupa modal, UPZ juga mendorong penerima manfaat agar dapat mengelola usaha secara mandiri dan berkelanjutan sehingga mampu meningkatkan pendapatan keluarga.

Program pemberdayaan ekonomi ini diharapkan dapat menjadi langkah awal bagi mustahik untuk meningkatkan kesejahteraan dan kemandirian ekonomi. UPZ Zakat Universitas Siliwangi berkomitmen untuk terus mengembangkan program yang tidak hanya bersifat konsumtif, tetapi juga memberikan manfaat jangka panjang bagi penerima zakat.`,
  },

  {
    id: 6,
    category: "Penyaluran",
    title: "UPZ Unsil Bantu Renovasi Rumah Tidak Layak Huni",
    date: "12 Juli 2026",
    image: berita6,
    content: `UPZ Zakat Universitas Siliwangi turut membantu renovasi rumah tidak layak huni melalui program Rutilahu. Program ini ditujukan bagi keluarga yang memiliki keterbatasan ekonomi dan tinggal di rumah dengan kondisi yang kurang layak.

Proses renovasi dilakukan pada beberapa bagian rumah yang membutuhkan perbaikan, seperti atap, dinding, lantai, dan fasilitas dasar lainnya. Bantuan diberikan agar penerima manfaat dapat memiliki tempat tinggal yang lebih aman, nyaman, dan layak untuk ditempati bersama keluarga.

Program Rutilahu merupakan salah satu bentuk kepedulian UPZ terhadap kesejahteraan masyarakat. Melalui penyaluran dana zakat yang tepat sasaran, UPZ berharap program ini dapat memberikan perubahan positif bagi kehidupan keluarga penerima manfaat.`,
  },
];

export default function BeritaDetailPage() {
  const { id } = useParams();

  const news = NEWS.find(
    (item) => String(item.id) === String(id)
  );

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
            Berita yang Anda cari belum tersedia.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-12">

        {/* =================================================
            HEADER BERITA
        ================================================== */}

        <article>

          {/* KATEGORI */}

          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            {news.category}
          </span>

          {/* JUDUL */}

          <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            {news.title}
          </h1>

          {/* TANGGAL */}

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">

            <Calendar size={15} />

            <span>
              {news.date}
            </span>

          </div>

          {/* =================================================
              FOTO
          ================================================== */}

          <div className="mt-7 flex justify-center">

            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">

              <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-[280px] lg:h-[320px]">

                <img
                  src={news.image}
                  alt={news.title}
                  className="h-full w-full object-contain"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              ISI BERITA
          ================================================== */}

          <div className="mx-auto mt-8 max-w-4xl">

            <div className="whitespace-pre-line text-justify text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
              {news.content}
            </div>

          </div>

        </article>

      </main>

    </div>
  );
}