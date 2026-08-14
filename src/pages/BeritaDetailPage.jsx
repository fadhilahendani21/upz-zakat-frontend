import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";

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
    date: "12 Agustus 2026",
    image: berita1,
    content: `UPZ Zakat Universitas Siliwangi resmi memulai penyaluran beasiswa untuk semester ganjil tahun akademik 2026/2027. Sebanyak 85 mahasiswa kurang mampu dan berprestasi menerima bantuan biaya pendidikan pada tahap ini.

Ketua UPZ Zakat menyampaikan bahwa program ini merupakan wujud komitmen dalam mengoptimalkan penghimpunan dan penyaluran zakat, infak, serta sedekah di lingkungan UNSIL agar tepat sasaran dan memberi manfaat nyata bagi mahasiswa.

Proses seleksi penerima beasiswa dilakukan secara transparan dengan mempertimbangkan kondisi ekonomi keluarga serta prestasi akademik masing-masing mahasiswa.`,
  },

  {
    id: 2,
    category: "Laporan",
    title: "Laporan Transparansi Dana Zakat Triwulan II 2026",
    date: "5 Agustus 2026",
    image: berita2,
    content: `Total dana zakat, infak, dan sedekah yang terkumpul pada triwulan kedua tahun 2026 mencapai Rp 1,55 miliar, meningkat 25,6% dibandingkan periode yang sama tahun sebelumnya.

Peningkatan ini didorong oleh bertambahnya jumlah muzakki tetap di lingkungan sivitas akademika serta program donasi online yang semakin dikenal luas.

Laporan lengkap dapat diakses melalui halaman Laporan Keuangan di website ini untuk menjaga transparansi kepada seluruh muzakki dan masyarakat.`,
  },

  {
    id: 3,
    category: "Kegiatan",
    title: "Bedah Rumah Dhuafa di Kecamatan Cibeureum",
    date: "28 Juli 2026",
    image: berita3,
    content: `Tim UPZ Zakat Universitas Siliwangi bersama relawan mahasiswa menyelesaikan renovasi rumah milik salah satu mustahik yang tidak layak huni di Kecamatan Cibeureum, Tasikmalaya.

Proses renovasi berlangsung selama dua minggu, meliputi perbaikan atap, dinding, dan sanitasi rumah yang sebelumnya dalam kondisi memprihatinkan.

Program bedah rumah ini merupakan bagian dari upaya UPZ Zakat dalam menyalurkan dana zakat secara langsung kepada mustahik yang paling membutuhkan, khususnya di sekitar lingkungan kampus.`,
  },

  {
    id: 4,
    category: "Pengumuman",
    title: "Pembukaan Pendaftaran Muzakki Baru Tahun 2026",
    date: "20 Juli 2026",
    image: berita4,
    content: `UPZ Zakat Universitas Siliwangi membuka pendaftaran bagi sivitas akademika yang ingin mendaftar sebagai muzakki tetap. Pendaftaran dibuka mulai 1 Agustus hingga 31 Agustus 2026.

Muzakki tetap akan mendapatkan kemudahan dalam pemotongan zakat penghasilan secara otomatis setiap bulan, beserta laporan penyaluran dana secara berkala.

Pendaftaran dapat dilakukan secara online melalui halaman Donasi Online, atau langsung datang ke Kantor UPZ Zakat di lingkungan kampus Universitas Siliwangi.`,
  },

  {
    id: 5,
    category: "Kegiatan",
    title: "Pelatihan Kewirausahaan untuk Penerima Manfaat",
    date: "10 Juli 2026",
    image: berita5,
    content: `Sebanyak 30 mustahik mengikuti pelatihan kewirausahaan sebagai bagian dari program pemberdayaan ekonomi UPZ Zakat Universitas Siliwangi.

Pelatihan yang berlangsung selama tiga hari ini mencakup materi dasar manajemen usaha, strategi pemasaran digital, dan pengelolaan keuangan sederhana bagi pelaku usaha mikro.

Setelah mengikuti pelatihan, peserta yang memenuhi kriteria akan mendapatkan bantuan modal usaha dari dana zakat untuk memulai atau mengembangkan usahanya secara mandiri.`,
  },

  {
    id: 6,
    category: "Laporan",
    title: "Audit Syariah Tahunan UPZ Zakat Unsil Tuntas Dilaksanakan",
    date: "2 Juli 2026",
    image: berita6,
    content: `Proses audit syariah tahunan UPZ Zakat Universitas Siliwangi telah selesai dilaksanakan oleh lembaga pengawas syariah independen.

Hasil audit menyatakan bahwa seluruh proses pengelolaan dana zakat, mulai dari penghimpunan hingga penyaluran, telah sesuai dengan ketentuan syariat Islam dan regulasi yang berlaku.

Audit ini rutin dilakukan setiap tahun sebagai bentuk komitmen UPZ Zakat dalam menjaga kepercayaan muzakki dan memastikan pengelolaan dana yang amanah dan akuntabel.`,
  },
];

export default function BeritaDetailPage() {
  const { id } = useParams();
  const news = NEWS.find((item) => String(item.id) === id);

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600">Berita tidak ditemukan.</p>

          <Link
            to="/berita"
            className="mt-4 inline-flex items-center gap-2 text-brand-700 font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <article className="max-w-6xl mx-auto px-6 lg:px-10 pt-8 pb-16">

        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar berita
        </Link>


        <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
          {news.title}
        </h1>

        <span className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar size={14} />
          {news.date}
        </span>

        {/* FOTO BERITA SESUAI ID */}
        <img
          src={news.image}
          alt={news.title}
          className="mt-6 w-full h-72 sm:h-96 object-cover rounded-2xl"
        />

        {/* ISI BERITA */}
        <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line text-justify">
          {news.content}
          </div>

      </article>
    </div>
  );
}