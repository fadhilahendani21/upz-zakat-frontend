import { ArrowLeft, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function KepengurusanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="flex min-h-[220px] w-full items-center justify-center px-6 py-10 text-center sm:min-h-[240px] lg:min-h-[260px]">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200">
              Tentang Kami
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Kepengurusan
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-green-50">
              Susunan pengurus Unit Pengumpul Zakat Universitas Siliwangi.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="w-full px-6 py-8 sm:px-8 sm:py-10 lg:px-12 xl:px-16">

        {/* =================================================
            TOMBOL KEMBALI
        ================================================== */}

        <Link
          to="/tentang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          <ArrowLeft size={16} />
          Kembali ke Tentang Kami
        </Link>


        {/* =================================================
            JUDUL
        ================================================== */}

        <div className="mb-7 mt-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Users size={20} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Struktur Organisasi
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Kepengurusan UPZ Zakat
              </h2>

            </div>

          </div>

        </div>


        {/* =================================================
            KEPENGURUSAN
        ================================================== */}

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* =================================================
              1. KEPENGURUSAN
          ================================================== */}

          <h3 className="text-lg font-bold text-gray-900">
            1. Kepengurusan
          </h3>


          {/* =================================================
              PENASEHAT
          ================================================== */}

          <div className="mt-7">

            <h4 className="text-base font-bold text-gray-900">
              Penasehat
            </h4>

            <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-6 text-gray-700">

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
              PENGURUS UTAMA
          ================================================== */}

          <div className="mt-9">

            <h4 className="text-base font-bold text-gray-900">
              Pengurus
            </h4>


            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* KETUA */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-brand-700">
                  Ketua
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Dr. Ir. Acep Irham Gufroni, M.Eng
                </p>

              </div>


              {/* WAKIL KETUA */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-brand-700">
                  Wakil Ketua
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Dr. Joni, S.E.I., M.E.Sy.
                </p>

              </div>


              {/* SEKRETARIS */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-brand-700">
                  Sekretaris
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Dr. Dita Agustian, M.Pd.
                </p>

              </div>


              {/* BENDAHARA */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-brand-700">
                  Bendahara
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Ir. Randi Rizal, Ph.D.
                </p>

              </div>


              {/* ADMINISTRASI */}

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-brand-700">
                  Administrasi
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Riza Nurdiana, S.E.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENGUMPULAN
          ================================================== */}

          <div className="mt-9">

            <h4 className="text-base font-bold text-gray-900">
              Bidang Pengumpulan
            </h4>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Drs. H. Asep Saepullah, M.Ag.
                </p>

              </div>


              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Adhi Amjad Mughni, S.E.I., M.E.Sy.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENDISTRIBUSIAN
          ================================================== */}

          <div className="mt-9">

            <h4 className="text-base font-bold text-gray-900">
              Bidang Pendistribusian
            </h4>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Andik Setiyono, S.K.M., M.Kes.
                </p>

              </div>


              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Medina Almunawwaroh, S.Mn., M.Ak.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              BIDANG PENDAYAGUNAAN
          ================================================== */}

          <div className="mt-9">

            <h4 className="text-base font-bold text-gray-900">
              Bidang Pendayagunaan
            </h4>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Koordinator
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  H. Acep Irham Gufroni, S.Kom., M.EI.
                </p>

              </div>


              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-700">
                  Anggota
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Dita Agustian, S.Pd., M.Pd.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              LEGAL FORMAL
          ================================================== */}

          <div className="mt-9 border-t border-gray-100 pt-7">

            <h4 className="text-base font-bold text-gray-900">
              Legal Formal
            </h4>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              SK Pengurus UPZ Universitas Siliwangi
            </p>

          </div>


          {/* =================================================
              ALAMAT KANTOR
          ================================================== */}

          <div className="mt-7 border-t border-gray-100 pt-7">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin size={19} />
              </div>

              <div>

                <h4 className="text-base font-bold text-gray-900">
                  Alamat Kantor
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Masjid Kampus Al-Muhajirin Universitas Siliwangi.
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  Jl. Siliwangi No. 24 Kel. Kahuripan Kec. Tawang
                  Kota Tasikmalaya 46115
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            TOMBOL KEMBALI
        ================================================== */}

        <div className="mt-7 text-center">

          <Link
            to="/tentang"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <ArrowLeft size={16} />
            Kembali ke Tentang Kami
          </Link>

        </div>

      </main>

    </div>
  );
}