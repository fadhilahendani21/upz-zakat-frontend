import { ArrowLeft, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import kepengurusanImage from "../assets/images/kepengurusan.jpeg";

export default function KepengurusanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative w-full overflow-hidden">

        {/* Foto */}
        <div className="relative h-[280px] sm:h-[340px] lg:h-[400px]">

          <img
            src={kepengurusanImage}
            alt="Kepengurusan UPZ Zakat Universitas Siliwangi"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Isi Hero */}
          <div className="relative z-10 flex h-full items-center justify-center px-6">

            <div className="text-center text-white">

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
                Tentang Kami
              </p>

              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Kepengurusan
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-green-50 leading-relaxed">
                Susunan pengurus Unit Pengumpul Zakat Universitas Siliwangi
                periode berjalan.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-6 py-10 sm:py-12">

        {/* Tombol kembali */}

        <Link
          to="/tentang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Tentang Kami
        </Link>


        {/* =====================================================
            JUDUL
        ===================================================== */}

        <div className="mt-8 mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Users size={22} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Struktur Organisasi
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                Kepengurusan UPZ Zakat
              </h2>

            </div>

          </div>

        </div>


        {/* =====================================================
            KEPENGURUSAN
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

          {/* Judul */}

          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            1. Kepengurusan
          </h3>


          {/* =================================================
              PENASEHAT
          ================================================= */}

          <div className="mt-7">

            <h4 className="font-bold text-gray-900">
              Penasehat
            </h4>


            <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm sm:text-base text-gray-700 leading-relaxed">

              <li>
                Rektor Universitas Siliwangi
              </li>

              <li>
                Kepala Biro Umum dan Keuangan (BUK)
              </li>

              <li>
                Kepala Biro Akademik, Kemahasiswaan, Perencanaan dan
                Kerjasama (BAKPK)
              </li>

              <li>
                Dekan Fakultas di Lingkungan Universitas Siliwangi
              </li>

              <li>
                Ketua Lembaga Penelitian dan Pengabdian kepada Masyarakat
                dan Penjamin Mutu (LP2M-PM)
              </li>

              <li>
                Ketua DKM Al-Muhajirin Universitas Siliwangi
              </li>

            </ol>

          </div>


          {/* =================================================
              PENGURUS
          ================================================= */}

          <div className="mt-9">

            <h4 className="font-bold text-gray-900">
              Pengurus
            </h4>


            <div className="mt-5 space-y-5">

              {/* Ketua */}

              <div>

                <p className="text-sm sm:text-base font-semibold text-brand-700">
                  Ketua
                </p>

                <p className="mt-1 text-sm sm:text-base text-gray-700">
                  Dr. H. Cucu Hidayat, M.Pd.
                </p>

              </div>


              {/* Wakil Ketua */}

              <div>

                <p className="text-sm sm:text-base font-semibold text-brand-700">
                  Wakil Ketua
                </p>

                <p className="mt-1 text-sm sm:text-base text-gray-700">
                  Dr. H. Acep Zoni Saefuk Mubarok, M.Ag.
                </p>

              </div>


              {/* Sekretaris */}

              <div>

                <p className="text-sm sm:text-base font-semibold text-brand-700">
                  Sekretaris
                </p>

                <p className="mt-1 text-sm sm:text-base text-gray-700">
                  Darwis Darmawan, S.Pd., M.Pd.
                </p>

              </div>


              {/* Bendahara */}

              <div>

                <p className="text-sm sm:text-base font-semibold text-brand-700">
                  Bendahara
                </p>

                <p className="mt-1 text-sm sm:text-base text-gray-700">
                  Hj. Euis Rosidah, S.E., M.Ak.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENGUMPULAN
          ================================================= */}

          <div className="mt-9">

            <h4 className="font-bold text-gray-900">
              Bidang Pengumpulan
            </h4>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Drs. H. Asep Saepullah, M.Ag.
                </p>
              </div>


              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Adhi Amjad Mughni, S.E.I., M.E.Sy.
                </p>
              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENDISTRIBUSIAN
          ================================================= */}

          <div className="mt-9">

            <h4 className="font-bold text-gray-900">
              Bidang Pendistribusian
            </h4>

            <div className="mt-5 space-y-4">

              <div>

                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Andik Setiyono, S.K.M., M.Kes.
                </p>

              </div>


              <div>

                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Medina Almunawwaroh, S.Mn., M.Ak.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENDAYAGUNAAN
          ================================================= */}

          <div className="mt-9">

            <h4 className="font-bold text-gray-900">
              Bidang Pendayagunaan
            </h4>

            <div className="mt-5 space-y-4">

              <div>

                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  H. Acep Irham Gufroni, S.Kom., M.EI.
                </p>

              </div>


              <div>

                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Dita Agustian, S.Pd., M.Pd.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              LEGAL FORMAL
          ================================================= */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h4 className="font-bold text-gray-900">
              • Legal Formal
            </h4>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
              SK Pengurus UPZ Universitas Siliwangi
            </p>

          </div>


          {/* =================================================
              ALAMAT KANTOR
          ================================================= */}

          <div className="mt-8 border-t border-gray-100 pt-8">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin size={19} />
              </div>

              <div>

                <h4 className="font-bold text-gray-900">
                  • Alamat Kantor
                </h4>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700">
                  Masjid Kampus Al-Muhajirin Universitas Siliwangi.
                </p>

                <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700">
                  Jl. Siliwangi No. 24 Kel. Kahuripan Kec. Tawang
                  Kota Tasikmalaya 46115
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            TOMBOL KEMBALI
        ===================================================== */}

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