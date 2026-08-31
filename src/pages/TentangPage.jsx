import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { dummyPengurus } from "../data/dummyTentang";
import { useSettings } from "../services/settingService";

import kepengurusanImage from "../assets/images/kepengurusan.jpeg";
import visiMisiImage from "../assets/images/visi-misi.jpeg";
import profilUnsilImage from "../assets/images/profil-unsil.jpeg";

// =========================================================
// DATA PENGURUS
// =========================================================

const DATA_PENGURUS = [
  {
    nama: "Pak Acep Irham",
    jabatan: "Ketua UPZ",
    foto: dummyPengurus[0]?.foto,
  },
  {
    nama: "Dr. Joni, S.E.I., M.E.Sy.",
    jabatan: "Wakil Ketua UPZ",
    foto: dummyPengurus[1]?.foto,
  },
  {
    nama: "Dr. Dita Agustian, M.Pd.",
    jabatan: "Sekretaris UPZ",
    foto: dummyPengurus[2]?.foto,
  },
  {
    nama: "Ir. Randi Rizal, Ph.D.",
    jabatan: "Bendahara UPZ",
    foto: dummyPengurus[3]?.foto,
  },
  {
    nama: "Riza Nurdiana, S.E.",
    jabatan: "Administrasi",
    foto: dummyPengurus[4]?.foto,
  },
];

// =========================================================
// TENTANG PAGE
// =========================================================

export default function TentangPage() {
  const settings = useSettings();

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
          <div className="text-center">

            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Tentang UPZ
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-green-50 sm:text-base">
              Mengenal lebih dekat {orgName} dan berbagai
              kegiatan yang dijalankan dalam pengelolaan zakat,
              infak, dan sedekah.
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          STRUKTUR PENGURUS
      ====================================================== */}

      <section className="w-full px-4 pb-14 pt-12 sm:px-6">

        <div className="mx-auto max-w-7xl">

          {/* JUDUL */}

          <div className="mb-8 text-center">

            <h2 className="text-2xl font-bold text-gray-900">
              Struktur Pengurus
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Susunan pengurus UPZ Zakat Universitas Siliwangi.
            </p>

          </div>


          {/* =================================================
              GRID PENGURUS

              DESKTOP:
              5 CARD DALAM 1 BARIS
              PENUH DARI KIRI SAMPAI KANAN

              TABLET:
              2 CARD PER BARIS

              MOBILE:
              1 CARD PER BARIS
          ================================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {DATA_PENGURUS.map((p) => (

              <div
                key={p.nama}
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                "
              >

                {/* =================================================
                    FOTO
                ================================================== */}

                <div className="flex h-[210px] w-full items-center justify-center overflow-hidden bg-gray-50">

                  {p.foto ? (

                    <img
                      src={p.foto}
                      alt={p.nama}
                      className="
                        h-full
                        w-full
                        object-contain
                        transition
                        duration-500
                        group-hover:scale-[1.02]
                      "
                    />

                  ) : (

                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Foto Pengurus
                    </div>

                  )}

                </div>


                {/* =================================================
                    INFORMASI
                ================================================== */}

                <div className="flex min-h-[110px] flex-1 flex-col items-center justify-center px-4 py-5 text-center">

                  {/* NAMA */}

                  <p className="text-sm font-bold leading-snug text-gray-900">
                    {p.nama}
                  </p>


                  {/* JABATAN */}

                  <p className="mt-3 text-xs font-semibold text-brand-600 sm:text-sm">
                    {p.jabatan}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          TENTANG KAMI
      ====================================================== */}

      <section className="w-full px-4 pb-14 sm:px-6">

        <div className="mx-auto max-w-7xl">

          {/* JUDUL */}

          <div className="mb-8 text-center">

            <h2 className="text-2xl font-bold text-gray-900">
              Tentang Kami
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
              Kenali lebih jauh tentang UPZ Zakat Universitas
              Siliwangi melalui informasi berikut.
            </p>

          </div>


          {/* =================================================
              3 PILIHAN HALAMAN
          ================================================== */}

          <div className="grid gap-6 md:grid-cols-3">


            {/* =================================================
                KEPENGURUSAN
            ================================================== */}

            <Link
              to="/tentang/kepengurusan"
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="h-52 w-full overflow-hidden bg-gray-100">

                <img
                  src={kepengurusanImage}
                  alt="Kepengurusan UPZ Zakat Universitas Siliwangi"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

              </div>


              <div className="p-5">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  KEPENGURUSAN
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  Kepengurusan
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Mengenal susunan pengurus UPZ Zakat Universitas
                  Siliwangi beserta peran dan tanggung jawabnya.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-700">

                  Lihat selengkapnya

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </div>

            </Link>


            {/* =================================================
                VISI & MISI
            ================================================== */}

            <Link
              to="/tentang/visi-misi"
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="h-52 w-full overflow-hidden bg-gray-100">

                <img
                  src={visiMisiImage}
                  alt="Visi dan Misi UPZ Zakat Universitas Siliwangi"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

              </div>


              <div className="p-5">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  VISI &amp; MISI
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  Visi &amp; Misi
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Mengetahui visi dan misi UPZ dalam mewujudkan
                  pengelolaan zakat yang amanah dan terpercaya.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-700">

                  Lihat selengkapnya

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </div>

            </Link>


            {/* =================================================
                PROFIL LEMBAGA
            ================================================== */}

            <Link
              to="/tentang/profil-unsil"
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="h-52 w-full overflow-hidden bg-gray-100">

                <img
                  src={profilUnsilImage}
                  alt="Profil Lembaga Universitas Siliwangi"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

              </div>


              <div className="p-5">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  PROFIL LEMBAGA
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  Profil Lembaga UNSIL
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Mengenal Universitas Siliwangi sebagai lembaga
                  pendidikan tempat UPZ Zakat Universitas Siliwangi
                  berada.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-700">

                  Lihat selengkapnya

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </div>

            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}