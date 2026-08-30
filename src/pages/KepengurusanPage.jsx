import { ArrowLeft, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function KepengurusanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="mx-auto flex min-h-[260px] items-center justify-center px-6 py-12 text-center sm:min-h-[290px] lg:min-h-[310px]">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200 sm:text-sm">
              Tentang Kami
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Kepengurusan
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
              Susunan pengurus Unit Pengumpul Zakat Universitas Siliwangi
              periode berjalan.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-12">

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

        <div className="mb-8 mt-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Users size={22} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Struktur Organisasi
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                Kepengurusan UPZ Zakat
              </h2>

            </div>

          </div>

        </div>

        {/* =================================================
            KEPENGURUSAN
        ================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* =================================================
              1. KEPENGURUSAN
          ================================================== */}

          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            1. Kepengurusan
          </h3>

          {/* =================================================
              PENASEHAT
          ================================================== */}

          <div className="mt-7">

            <h4 className="font-bold text-gray-900">
              Penasehat
            </h4>

            <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-gray-700 sm:text-base">

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
          ================================================== */}

          <div className="mt-9">

            <h4 className="font-bold text-gray-900">
              Pengurus
            </h4>

            <div className="mt-5 space-y-5">

              {/* KETUA */}

              <div>

                <p className="text-sm font-semibold text-brand-700 sm:text-base">
                  Ketua
                </p>

                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                  Dr. H. Cucu Hidayat, M.Pd.
                </p>

              </div>

              {/* WAKIL KETUA */}

              <div>

                <p className="text-sm font-semibold text-brand-700 sm:text-base">
                  Wakil Ketua
                </p>

                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                  Dr. H. Acep Zoni Saefuk Mubarok, M.Ag.
                </p>

              </div>

              {/* SEKRETARIS */}

              <div>

                <p className="text-sm font-semibold text-brand-700 sm:text-base">
                  Sekretaris
                </p>

                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                  Darwis Darmawan, S.Pd., M.Pd.
                </p>

              </div>

              {/* BENDAHARA */}

              <div>

                <p className="text-sm font-semibold text-brand-700 sm:text-base">
                  Bendahara
                </p>

                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                  Hj. Euis Rosidah, S.E., M.Ak.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              BIDANG PENGUMPULAN
          ================================================== */}

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
          ================================================== */}

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
          ================================================== */}

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
          ================================================== */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h4 className="font-bold text-gray-900">
              Legal Formal
            </h4>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
              SK Pengurus UPZ Universitas Siliwangi
            </p>

          </div>

          {/* =================================================
              ALAMAT KANTOR
          ================================================== */}

          <div className="mt-8 border-t border-gray-100 pt-8">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin size={19} />
              </div>

              <div>

                <h4 className="font-bold text-gray-900">
                  Alamat Kantor
                </h4>

                <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  Masjid Kampus Al-Muhajirin Universitas Siliwangi.
                </p>

                <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
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