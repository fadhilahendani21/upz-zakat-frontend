import {
  Mail,
  Globe,
  X,
  Users,
  Target,
  Building2,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/common/Card";

import {
  dummyPengurus,
  dummyLegalitas,
} from "../data/dummyTentang";

import { useSettings } from "../services/settingService";


import kepengurusanImage from "../assets/images/kepengurusan.jpeg";
import visiMisiImage from "../assets/images/visi-misi.jpeg";
import profilUnsilImage from "../assets/images/profil-unsil.jpeg";


// =========================================================
// SOCIAL ICONS
// =========================================================

const InstagramIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle
      cx="17.2"
      cy="6.8"
      r="1.2"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />

    <path
      d="M7.5 10.5v6.5h-2.5v-6.5h2.5Zm-1.25-2.25a1.37 1.37 0 1 1 0-2.74 1.37 1.37 0 0 1 0 2.74ZM10.7 10.5h2.4v.9h.1c.3-.6 1.1-1.3 2.3-1.3 2.5 0 3 1.7 3 3.8v3.1h-2.5v-2.8c0-.9 0-2-1.2-2s-1.4 1-1.4 2v2.8h-2.5v-6.5Z"
      fill="white"
    />
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M13.7 21v-8.2h2.8l.4-3.2h-3.2V7.4c0-.9.3-1.6 1.7-1.6h1.8V2.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.5H7.2v3.2h2.8V21h3.7Z" />
  </svg>
);

const XIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M4 4l16 16" />
    <path d="M20 4L4 20" />
  </svg>
);

const WhatsAppIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M12.1 2.2a9.8 9.8 0 0 0-8.5 15.1L2.2 22l4.9-1.4A9.8 9.8 0 1 0 12.1 2.2Zm5.3 14.1c-.2.6-1.1 1.1-1.8 1.3-.5.1-1.1.1-3.4-.7-2.9-.9-4.7-3.6-4.8-3.8-.1-.2-1-1.3-1-2.6 0-1.2.6-1.8.8-2.1.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .5-.1.7l-.3.4c-.1.1-.2.3-.1.5.2.4.9 1.4 1.9 2.2 1.3 1.1 2.4 1.5 2.8 1.7.2.1.3.1.5 0l.8-.9c.2-.2.5-.2.8-.1l1.5.9c.2.1.3.3.3.5.1.4.1.7-.1 1.1Z" />
  </svg>
);

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  email: Mail,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  twitter: XIcon,
  x: XIcon,
  whatsapp: WhatsAppIcon,
};


// =========================================================
// TENTANG PAGE
// =========================================================

export default function TentangPage() {
  const settings = useSettings();

  const [selectedPengurus, setSelectedPengurus] = useState(null);

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">

          <div className="text-center">

            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Tentang UPZ
            </h1>

            <p className="mt-3 max-w-3xl mx-auto text-sm sm:text-base text-green-50 leading-relaxed">
              Mengenal lebih dekat {orgName} dan berbagai
              kegiatan yang dijalankan dalam pengelolaan zakat,
              infak, dan sedekah.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          STRUKTUR PENGURUS
      ===================================================== */}

      <section className="w-full px-6 pt-12 pb-14">

        <div className="max-w-7xl mx-auto">


          {/* JUDUL */}

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Struktur Pengurus
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Susunan pengurus UPZ Zakat Universitas Siliwangi
              periode berjalan.
            </p>

          </div>


          {/* GRID PENGURUS */}

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">

            {dummyPengurus.map((p) => {

              const socialLinks = Object.entries(p.socials || {});

              return (

                <button
                  key={p.nama}
                  type="button"
                  onClick={() => setSelectedPengurus(p)}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-200"
                >

                  {/* FOTO */}

                  <div
                    className="relative w-full shrink-0 overflow-hidden bg-gray-100"
                    style={{
                      height: "240px",
                      minHeight: "240px",
                      maxHeight: "240px",
                    }}
                  >

                    <img
                      src={p.foto}
                      alt={p.nama}
                      className="absolute inset-0 block w-full object-cover object-center"
                      style={{
                        height: "240px",
                        minHeight: "240px",
                        maxHeight: "240px",
                        width: "100%",
                      }}
                    />

                  </div>


                  {/* INFORMASI */}

                  <div className="flex flex-1 flex-col p-5">


                    {/* NAMA */}

                    <div
                      className="flex items-start"
                      style={{
                        minHeight: "48px",
                      }}
                    >

                      <p className="w-full font-bold text-gray-900 text-base leading-snug">
                        {p.nama}
                      </p>

                    </div>


                    {/* JABATAN */}

                    <div
                      className="mt-2 flex items-center justify-between gap-2"
                      style={{
                        minHeight: "28px",
                      }}
                    >

                      <p className="text-sm font-semibold text-brand-600">
                        {p.jabatan}
                      </p>

                      <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 whitespace-nowrap">
                        {p.periode}
                      </span>

                    </div>


                    {/* DESKRIPSI */}

                    <div
                      className="mt-3"
                      style={{
                        minHeight: "72px",
                      }}
                    >

                      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {p.deskripsi}
                      </p>

                    </div>


                    {/* SOCIAL */}

                    <div className="mt-auto pt-4 flex items-center justify-center gap-2">

                      {socialLinks.map(([platform]) => {

                        const Icon =
                          SOCIAL_ICONS[platform] || Globe;

                        return (

                          <span
                            key={platform}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600"
                            aria-label={platform}
                            title={platform}
                          >
                            <Icon size={15} />
                          </span>

                        );

                      })}

                    </div>

                  </div>

                </button>

              );

            })}

          </div>


          {/* =====================================================
              MODAL DETAIL PENGURUS
          ===================================================== */}

          {selectedPengurus && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">

              <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">


                {/* HEADER MODAL */}

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                  <h3 className="text-lg font-bold text-gray-900">
                    Profil Pengurus
                  </h3>

                  <button
                    type="button"
                    onClick={() => setSelectedPengurus(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                    aria-label="Tutup detail pengurus"
                  >
                    <X size={18} />
                  </button>

                </div>


                {/* ISI MODAL */}

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">


                    {/* FOTO */}

                    <img
                      src={selectedPengurus.foto}
                      alt={selectedPengurus.nama}
                      className="h-52 w-full rounded-2xl object-cover object-top sm:h-64 sm:w-52"
                    />


                    {/* DETAIL */}

                    <div className="flex-1">

                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">
                        {selectedPengurus.jabatan}
                      </p>

                      <h4 className="mt-2 text-2xl font-bold text-gray-900">
                        {selectedPengurus.nama}
                      </h4>

                      <p className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {selectedPengurus.periode}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-gray-600">
                        {selectedPengurus.deskripsi}
                      </p>


                      {/* SOCIAL MODAL */}

                      <div className="mt-5 flex items-center gap-2">

                        {Object.entries(
                          selectedPengurus.socials || {}
                        ).map(([platform, url]) => {

                          const Icon =
                            SOCIAL_ICONS[platform] || Globe;

                          return (

                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                              aria-label={platform}
                              title={platform}
                            >
                              <Icon size={16} />
                            </a>

                          );

                        })}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          TENTANG KAMI
      ===================================================== */}

      <section className="w-full px-6 pb-14">

        <div className="max-w-7xl mx-auto">


          {/* JUDUL */}

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Tentang Kami
            </h2>

            <p className="mt-2 max-w-2xl mx-auto text-sm text-gray-500">
              Kenali lebih jauh tentang UPZ Zakat Universitas
              Siliwangi melalui informasi berikut.
            </p>

          </div>


          {/* =================================================
              3 PILIHAN HALAMAN
          ================================================= */}

          <div className="grid md:grid-cols-3 gap-6">


            {/* =================================================
                KEPENGURUSAN
            ================================================= */}

            <Link
              to="/tentang/kepengurusan"
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="w-full h-52 overflow-hidden bg-gray-100">

                <img
                  src={kepengurusanImage}
                  alt="Kepengurusan UPZ Zakat Universitas Siliwangi"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
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
            ================================================= */}

            <Link
              to="/tentang/visi-misi"
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="w-full h-52 overflow-hidden bg-gray-100">

                <img
                  src={visiMisiImage}
                  alt="Visi dan Misi UPZ Zakat Universitas Siliwangi"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />

              </div>


              <div className="p-5">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  VISI & MISI
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  Visi & Misi
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
            ================================================= */}

            <Link
              to="/tentang/profil-unsil"
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="w-full h-52 overflow-hidden bg-gray-100">

                <img
                  src={profilUnsilImage}
                  alt="Profil Lembaga Universitas Siliwangi"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
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