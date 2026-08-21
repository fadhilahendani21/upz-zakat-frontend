// Data buat halaman Tentang — visi misi, struktur pengurus, legalitas
import ketuaImg from "../assets/img/Dr. H. Cucu Hidayat, M.Pd..jpg";
import wakilImg from "../assets/img/Dr. H. Acep Zoni Saefuk Mubarok, M.Ag..jpg";
import sekretarisImg from "../assets/img/Darwis Darmawan, S.Pd., M.Pd..jpg";
import bendaharaImg from "../assets/img/Hj. Euis Rosidah, S.E., M.Ak..jpg";
import logoUnsilImg from "../assets/images/logo-unsil.jpeg";

export const visiMisi = {
  visi:
    "Menjadi Unit Pengumpul Zakat yang amanah, transparan, dan profesional dalam mengelola zakat, infak, dan sedekah untuk kesejahteraan umat di lingkungan civitas akademika Universitas Siliwangi dan masyarakat sekitar.",
  misi: [
    "Mengoptimalkan pengumpulan zakat, infak, dan sedekah dari civitas akademika secara mudah dan amanah.",
    "Menyalurkan dana zakat secara tepat sasaran kepada mustahik sesuai syariat Islam.",
    "Membangun sistem pengelolaan zakat yang transparan dan akuntabel berbasis teknologi.",
    "Meningkatkan kesadaran berzakat di lingkungan kampus melalui edukasi dan sosialisasi.",
    "Menjalin kerja sama dengan lembaga amil zakat resmi untuk memperluas manfaat zakat.",
  ],
};

export const dummyPengurus = [
  {
    nama: "Dr. H. Cucu Hidayat, M.Pd.",
    jabatan: "Ketua UPZ",
    periode: "2023 – 2026",
    deskripsi: "Memimpin arah strategis, koordinasi program, dan pengelolaan zakat secara amanah, transparan, dan profesional.",
    foto: ketuaImg,
    socials: {
      instagram: "https://instagram.com",
      email: "mailto:ketua@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },
  {
    nama: "Dr. H. Acep Zoni Saefuk Mubarok, M.Ag.",
    jabatan: "Wakil Ketua UPZ",
    periode: "2023 – 2026",
    deskripsi: "Mendukung penguatan program dan koordinasi internal untuk mengoptimalkan pengumpulan serta penyaluran dana zakat secara efektif.",
    foto: wakilImg,
    socials: {
      instagram: "https://instagram.com",
      email: "mailto:wakil@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },
  {
    nama: "Darwis Darmawan, S.Pd., M.Pd.",
    jabatan: "Sekretaris UPZ",
    periode: "2023 – 2026",
    deskripsi: "Mengelola administrasi, dokumentasi, dan komunikasi organisasi agar tata kelola UPZ berjalan tertib, rapi, dan akuntabel.",
    foto: sekretarisImg,
    socials: {
      instagram: "https://instagram.com",
      email: "mailto:sekretaris@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },
  {
    nama: "Hj. Euis Rosidah, S.E., M.Ak.",
    jabatan: "Bendahara UPZ",
    periode: "2023 – 2026",
    deskripsi: "Mengelola laporan keuangan, anggaran, dan pengelolaan dana UPZ agar transparan, tepat sasaran, dan terkontrol.",
    foto: bendaharaImg,
    socials: {
      instagram: "https://instagram.com",
      email: "mailto:bendahara@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },
];

export const dummyLegalitas = [
  {
    judul: "Undang-Undang No. 23 Tahun 2011",
    keterangan: "Tentang Pengelolaan Zakat sebagai landasan hukum utama pengelolaan zakat di Indonesia.",
  },
  {
    judul: "Peraturan Pemerintah No. 14 Tahun 2014",
    keterangan: "Tentang Pelaksanaan Undang-Undang No. 23 Tahun 2011 tentang Pengelolaan Zakat.",
  },
  {
    judul: "Keputusan Rektor Universitas Siliwangi",
    keterangan: "Tentang Pembentukan Unit Pengumpul Zakat (UPZ) di lingkungan Universitas Siliwangi.",
  },
  {
    judul: "Surat Keputusan BAZNAS",
    keterangan: "Tentang Pengukuhan UPZ Universitas Siliwangi sebagai unit pengumpul zakat resmi yang terdaftar di BAZNAS.",
  },
];
