import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// =========================================================
// DATA
// =========================================================

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

// =========================================================
// PROFIL UNSIL PAGE
// =========================================================

export default function ProfilUnsilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HERO / BANNER
      ====================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="flex min-h-[230px] w-full items-center justify-center px-6 py-10 text-center sm:min-h-[250px] sm:py-12">

          <div className="w-full">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200 sm:text-sm">
              Tentang Kami
            </p>

            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Profil Lembaga UPZ UNSIL
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-green-50">
              Landasan hukum, fungsi, dan tugas Unit Pengumpul Zakat
              Universitas Siliwangi.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-12">

        {/* =================================================
            KEMBALI
        ================================================== */}

        <Link
          to="/tentang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          <ArrowLeft size={16} />
          Kembali ke Tentang Kami
        </Link>


        {/* =================================================
            KONTEN UTAMA
        ================================================== */}

        <div className="mt-7 w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">


          {/* =================================================
              PENJELASAN UMUM
          ================================================== */}

          <div>

            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Profil Lembaga
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              Unit Pengumpul Zakat (UPZ) Universitas Siliwangi adalah
              lembaga resmi pengumpul zakat, infak, dan sedekah,
              merupakan satuan organisasi yang dibentuk oleh BAZNAS
              Jawa Barat untuk membantu mengumpulkan zakat. Dibentuk
              sesuai dengan amanat Undang-Undang No. 23 Tahun 2011
              BAB VI tentang Lingkup Kewenangan Pengumpulan Zakat
              Pasal 53 ayat 2 yang berbunyi:
            </p>

          </div>


          {/* =================================================
              UPZ PADA
          ================================================== */}

          <div className="mt-8">

            <h3 className="text-base font-bold leading-relaxed text-gray-900 sm:text-lg">
              Pengumpulan zakat melalui UPZ sebagaimana dimaksud
              pada ayat (1) dilakukan dengan cara membentuk UPZ pada:
            </h3>

            <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-gray-700">

              {UPZ_PADA.map((item, i) => (
                <li key={i}>
                  {item}
                </li>
              ))}

            </ol>

          </div>


          {/* =================================================
              FUNGSI UPZ
          ================================================== */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              UPZ Melaksanakan Fungsi
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              (Pasal 8 dalam Peraturan BAZNAS Nomor 2 Tahun 2016)
            </p>

            <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-gray-700">

              {FUNGSI.map((item, i) => (
                <li key={i}>
                  {item}
                </li>
              ))}

            </ol>

          </div>


          {/* =================================================
              TUGAS PENGURUS
          ================================================== */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Tugas Pengurus UPZ
            </h2>

            <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-gray-700">

              {TUGAS_PENGURUS.map((item, i) => (
                <li key={i}>
                  {item}
                </li>
              ))}

            </ol>

          </div>


        </div>


        {/* =================================================
            TOMBOL KEMBALI
        ================================================== */}

        <div className="mt-8 flex justify-start">

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