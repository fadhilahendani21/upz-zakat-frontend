
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { dummyPengurus } from "../data/dummyTentang";
import { useSettings } from "../services/settingService";
import { getPublicPengurus } from "../services/pengurusService";
import { formatImageUrl } from "../services/beritaService";

import kepengurusanImage from "../assets/images/kepengurusan.jpeg";
import visiMisiImage from "../assets/images/visi-misi.jpeg";
import profilUnsilImage from "../assets/images/profil-unsil.jpeg";

// =========================================================
// DATA PENGURUS
// =========================================================

const DATA_PENGURUS = [
  {
    nama: "Dr. Ir. Acep Irham Gufroni, M.Eng.",
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
  const [pengurusList, setPengurusList] = useState([]);
  const [loadingPengurus, setLoadingPengurus] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPublicPengurus()
      .then((data) => {
        if (mounted) {
          if (Array.isArray(data) && data.length > 0) {
            setPengurusList(data);
          } else {
            setPengurusList(DATA_PENGURUS);
          }
        }
      })
      .catch(() => {
        if (mounted) setPengurusList(DATA_PENGURUS);
      })
      .finally(() => {
        if (mounted) setLoadingPengurus(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">


      {/* =====================================================
    HEADER
====================================================== */}

      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-9">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Tentang UPZ
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              Mengenal lebih dekat {orgName} dan berbagai kegiatan yang dijalankan
              dalam pengelolaan zakat, infak, dan sedekah.
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          STRUKTUR PENGURUS
      ====================================================== */}

      <section className="w-full px-4 pb-12 pt-10 sm:px-6">

        <div className="mx-auto max-w-7xl">

          {/* JUDUL */}

          <div className="mb-7 text-center">

            <h2 className="text-2xl font-bold text-gray-900">
              Struktur Pengurus
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Susunan pengurus UPZ Zakat Universitas Siliwangi.
            </p>

            {/* PERIODE KEPENGURUSAN */}

            <p className="mt-2 text-sm font-semibold text-brand-700">
              Periode 2026/2029
            </p>

          </div>

          {/* =================================================
              GRID PENGURUS
          ================================================== */}

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {loadingPengurus ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-3 shadow-xs animate-pulse flex flex-col items-center"
                >
                  <div className="h-[180px] w-full rounded-xl bg-gray-100 mb-3" />
                  <div className="h-3.5 w-3/4 bg-gray-200 rounded mb-1.5" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              ))
            ) : (
              pengurusList.map((p, idx) => {
                const fotoSrc = p.foto ? formatImageUrl(p.foto) : null;
                return (
                  <div
                    key={p.id || p.nama || idx}
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
                        FOTO PENGURUS
                    ================================================== */}

                    <div className="flex h-[180px] w-full shrink-0 items-center justify-center overflow-hidden bg-gray-50">
                      {fotoSrc ? (
                        <img
                          src={fotoSrc}
                          alt={`Foto ${p.nama}`}
                          className="
                            h-full
                            w-full
                            object-contain
                            object-center
                            transition
                            duration-500
                            group-hover:scale-[1.03]
                          "
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          Foto Pengurus
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        INFORMASI PENGURUS
                    ================================================== */}

                    <div className="flex flex-col items-center justify-start px-2 pb-1.5 pt-2 text-center">
                      {/* NAMA PENGURUS */}
                      <p className="w-full break-words text-xs font-bold leading-tight text-gray-900">
                        {p.nama}
                      </p>

                      {/* JABATAN */}
                      <p className="mt-0.5 pb-1 text-xs font-semibold leading-tight text-brand-600 sm:text-sm">
                        {p.jabatan}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          TENTANG KAMI
      ====================================================== */}

      <section className="w-full px-4 pb-14 pt-4 sm:px-6">

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
