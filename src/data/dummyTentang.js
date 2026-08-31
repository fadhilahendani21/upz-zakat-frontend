// Data buat halaman Tentang — visi misi, struktur pengurus, legalitas

import ketuaImg from "../assets/img/acep-irham.jpeg";
import wakilImg from "../assets/img/joni.jpeg";
import sekretarisImg from "../assets/img/dita-agustian.jpeg";
import bendaharaImg from "../assets/img/randi-rizal.jpeg";
import administrasiImg from "../assets/img/riza-nurdiana.jpeg";
import logoUnsilImg from "../assets/img/logo-upz.png";


// =========================================================
// VISI & MISI
// =========================================================

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


// =========================================================
// DATA PENGURUS
// =========================================================

export const dummyPengurus = [
  {
    nama: "Pak Aceo Irham",
    jabatan: "Ketua UPZ",
    deskripsi:
      "Memimpin arah strategis, koordinasi program, dan pengelolaan zakat secara amanah, transparan, dan profesional.",
    foto: ketuaImg,

    socials: {
      instagram: "https://instagram.com",
      email: "mailto:ketua@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },

  {
    nama: "Dr. Joni, S.E.I., M.E.Sy.",
    jabatan: "Wakil Ketua UPZ",
    deskripsi:
      "Mendukung penguatan program dan koordinasi internal untuk mengoptimalkan pengumpulan serta penyaluran dana zakat secara efektif.",
    foto: wakilImg,

    socials: {
      instagram: "https://instagram.com",
      email: "mailto:wakil@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },

  {
    nama: "Dr. Dita Agustian, M.Pd.",
    jabatan: "Sekretaris UPZ",
    deskripsi:
      "Mengelola administrasi, dokumentasi, dan komunikasi organisasi agar tata kelola UPZ berjalan tertib, rapi, dan akuntabel.",
    foto: sekretarisImg,

    socials: {
      instagram: "https://instagram.com",
      email: "mailto:sekretaris@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },

  {
    nama: "Ir. Randi Rizal, Ph.D.",
    jabatan: "Bendahara UPZ",
    deskripsi:
      "Mengelola laporan keuangan, anggaran, dan pengelolaan dana UPZ agar transparan, tepat sasaran, dan terkontrol.",
    foto: bendaharaImg,

    socials: {
      instagram: "https://instagram.com",
      email: "mailto:bendahara@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },

  {
    nama: "Riza Nurdiana, S.E.",
    jabatan: "Administrasi",
    deskripsi:
      "Mengelola administrasi, pendataan, dokumentasi, dan pelayanan administrasi UPZ agar kegiatan organisasi berjalan tertib dan terorganisir.",
    foto: administrasiImg,

    socials: {
      instagram: "https://instagram.com",
      email: "mailto:administrasi@upz.unsil.ac.id",
      linkedin: "https://linkedin.com",
    },
  },
];


// =========================================================
// LEGALITAS
// =========================================================

export const dummyLegalitas = [
  {
    judul: "Undang-Undang No. 23 Tahun 2011",

    keterangan:
      "Tentang Pengelolaan Zakat sebagai landasan hukum utama pengelolaan zakat di Indonesia.",
  },

  {
    judul: "Peraturan Pemerintah No. 14 Tahun 2014",

    keterangan:
      "Tentang Pelaksanaan Undang-Undang No. 23 Tahun 2011 tentang Pengelolaan Zakat.",
  },

  {
    judul: "Keputusan Rektor Universitas Siliwangi",

    keterangan:
      "Tentang Pembentukan Unit Pengumpul Zakat (UPZ) di lingkungan Universitas Siliwangi.",
  },

  {
    judul: "Surat Keputusan BAZNAS",

    keterangan:
      "Tentang Pengukuhan UPZ Universitas Siliwangi sebagai unit pengumpul zakat resmi yang terdaftar di BAZNAS.",
  },
];


// =========================================================
// LOGO
// =========================================================

export { logoUnsilImg };