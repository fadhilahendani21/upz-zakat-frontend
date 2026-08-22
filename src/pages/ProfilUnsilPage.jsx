import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import profilImage from "../assets/images/profil-unsil.jpeg";

const UPZ_PADA = [
  "Lembaga negara;",
  "Kementrian/lembaga pemerintah non kementrian;",
  "Badan usaha milik negara;",
  "Perusahaan swasta nasional dan asing;",
  "Perwakilan Republik Indonesia di luar negeri;",
  "Kantor-kantor perwakilan negara asing/lembaga asing; dan",
  "Masjid negara.",
];

const FUNGSI = [
  "Sosialisasi dan edukasi zakat pada masing-masing institusi yang menaungi UPZ.",
  "Pengumpulan zakat pada masing-masing institusi yang menaungi UPZ.",
  "Pendataan dan layanan muzaki pada masing-masing institusi yang menaungi UPZ.",
  "Penyerahan Nomor Pokok Wajib Zakat (NPWZ) dan Bukti Setor Zakat (BSZ) yang diterbitkan oleh BAZNAS Provinsi kepada muzakki di institusi masing-masing.",
  "Penyusunan RKAT UPZ untuk program pengumpulan dan pembantuan pendistribusian dan pendayagunaan zakat BAZNAS Provinsi; dan",
  "Penyusunan laporan kegiatan pengumpulan dan tugas pembantuan pendistribusian dan pendayagunaan zakat BAZNAS Provinsi.",
];

const TUGAS_PENGURUS = [
  "Menetapkan RKAT UPZ setelah mendapat pertimbangan penasehat.",
  "Melakukan evaluasi atas pelaksanaan tugas dan fungsi UPZ.",
  "Menyusun perencanaan pengumpulan zakat.",
  "Melaksanakan pengumpulan zakat.",
  "Melaksanakan pengelolaan data muzaki.",
  "Melaksanakan sosialisasi dan edukasi zakat.",
  "Memberikan layanan konsultasi zakat; dan",
  "Menyerahkan hasil pengumpulan zakat ke BAZNAS Provinsi.",
];

export default function ProfilUnsilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-72 sm:h-80 lg:h-[28rem]">
          <img
            src={profilImage}
            alt="Profil Lembaga UPZ Universitas Siliwangi"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="text-center text-white">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
                Tentang Kami
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Profil Lembaga UPZ UNSIL
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
                Landasan hukum, fungsi, dan tugas Unit Pengumpul Zakat
                Universitas Siliwangi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Konten */}
      <main className="max-w-6xl mx-auto px-6 py-10 sm:py-12">
        <Link
          to="/tentang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Tentang Kami
        </Link>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Unit Pengumpul Zakat (UPZ) Universitas Siliwangi adalah Lembaga
            resmi pengumpul zakat, infak dan sedekah, merupakan satuan
            organisasi yang dibentuk oleh BAZNAS Jawa Barat untuk membantu
            mengumpulkan zakat. Dibentuk sesuai dengan amanat Undang-Undang
            No. 23 Tahun 2011 BAB VI tentang Lingkup Kewenangan Pengumpulan
            Zakat Pasal 53 ayat 2 yang berbunyi:
          </p>

          <p className="mt-6 text-sm sm:text-base font-semibold text-gray-900">
            Pengumpulan zakat melalui UPZ sebagaimana dimaksud pada ayat (1)
            dilakukan dengan cara membentuk UPZ pada :
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {UPZ_PADA.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>

          <h3 className="mt-10 text-lg sm:text-xl font-bold text-gray-900">
            UPZ Melaksanakan Fungsi
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            (Pasal 8 dalam Peraturan BAZNAS Nomor 2 Tahun 2016)
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {FUNGSI.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>

          <h3 className="mt-10 text-lg sm:text-xl font-bold text-gray-900">
            Tugas Pengurus UPZ
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {TUGAS_PENGURUS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/tentang"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <ArrowLeft size={16} />
            Kembali ke Tentang Kami
          </Link>
        </div>
      </main>
    </div>
  );
}