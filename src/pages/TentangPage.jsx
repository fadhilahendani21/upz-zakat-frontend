import {
  Eye,
  Target,
  ScrollText,
  ShieldCheck,
  Mail,
  Globe,
  X,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import Card from "../components/common/Card";
import {
  visiMisi,
  dummyPengurus,
  dummyLegalitas,
} from "../data/dummyTentang";
import { useSettings } from "../services/settingService";

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7.5 10.5v6.5h-2.5v-6.5h2.5Zm-1.25-2.25a1.37 1.37 0 1 1 0-2.74 1.37 1.37 0 0 1 0 2.74ZM10.7 10.5h2.4v.9h.1c.3-.6 1.1-1.3 2.3-1.3 2.5 0 3 1.7 3 3.8v3.1h-2.5v-2.8c0-.9 0-2-1.2-2s-1.4 1-1.4 2v2.8h-2.5v-6.5Z" fill="white" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.7 21v-8.2h2.8l.4-3.2h-3.2V7.4c0-.9.3-1.6 1.7-1.6h1.8V2.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.5H7.2v3.2h2.8V21h3.7Z" />
  </svg>
);

const XIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
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

export default function TentangPage() {
  const settings = useSettings();
  const [selectedPengurus, setSelectedPengurus] = useState(null);
  const orgName = settings?.profil?.namaLembaga || "UPZ Zakat Universitas Siliwangi";
  const brandName = settings?.profil?.namaSingkat || "UPZ Unsil";
  const nomorSk = settings?.profil?.nomorSk || "SK Rektor & BAZNAS";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {orgName}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Unit Pengumpul Zakat yang berkomitmen mengelola zakat, infak, dan
              sedekah secara amanah, transparan, dan tepat sasaran demi
              kesejahteraan umat.
            </p>
          </div>
        </div>
      </section>

     {/* Visi & Misi */}
<section className="w-full px-6 py-12">
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Visi dan Misi UPZ Zakat
      </h2>

      <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">
        Arah dan komitmen UPZ Zakat Universitas Siliwangi dalam mengelola
        zakat, infak, dan sedekah.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      
      {/* Visi */}
      <Card>
       <div className="flex items-center gap-3 mb-4">
  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
    <Eye size={20} />
  </div>

  <h3 className="font-semibold text-gray-900">
    Visi
  </h3>
</div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {visiMisi.visi}
        </p>
      </Card>

      {/* Misi */}
      <Card>
     <div className="flex items-center gap-3 mb-4">
  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
    <Target size={20} />
  </div>

  <h3 className="font-semibold text-gray-900">
    Misi
  </h3>
</div>

        <ul className="space-y-2.5">
          {visiMisi.misi.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm text-gray-600 leading-relaxed"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

    </div>
  </div>
</section>

      {/* Struktur Pengurus */}
<section className="w-full px-6 pb-14">
  <div className="max-w-7xl mx-auto">
<div className="text-center mb-8">
  <h2 className="text-2xl font-bold text-gray-900">
    Struktur Pengurus
  </h2>

  <p className="text-sm text-gray-500 mt-2">
    Susunan pengurus UPZ Zakat Universitas Siliwangi periode berjalan.
  </p>
</div>

    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {dummyPengurus.map((p) => {
        const socialLinks = Object.entries(p.socials || {});

        return (
          <button
            key={p.nama}
            type="button"
            onClick={() => setSelectedPengurus(p)}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <div className="relative">
              <img
                src={p.foto}
                alt={p.nama}
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-base leading-snug">
                    {p.nama}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-brand-600">
                    {p.jabatan}
                  </p>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 whitespace-nowrap">
                    {p.periode}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
                {p.deskripsi}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                {socialLinks.map(([platform, url]) => {
                  const Icon = SOCIAL_ICONS[platform] || Globe;

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

    {selectedPengurus && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h3 className="text-lg font-bold text-gray-900">Profil Pengurus</h3>
            <button
              type="button"
              onClick={() => setSelectedPengurus(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              aria-label="Tutup detail pengurus"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <img
                src={selectedPengurus.foto}
                alt={selectedPengurus.nama}
                className="h-52 w-full rounded-2xl object-cover sm:h-64 sm:w-52"
              />

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

                <div className="mt-5 flex items-center gap-2">
                  {Object.entries(selectedPengurus.socials || {}).map(([platform, url]) => {
                    const Icon = SOCIAL_ICONS[platform] || Globe;

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

     {/* Legalitas & Landasan Hukum */}
<section className="w-full px-6 pb-16">
  <div className="max-w-7xl mx-auto">

    {/* Judul Section */}
   <div className="text-center mb-8">
  <h2 className="text-2xl font-bold text-gray-900">
    Legalitas & Landasan Hukum
  </h2>

  <p className="text-sm text-gray-500 mt-2">
    Pengelolaan zakat kami berlandaskan pada peraturan dan ketentuan
    resmi berikut.
  </p>
</div>

    {/* Daftar Legalitas */}
    <div className="space-y-4">
      {settings?.profil?.nomorSk && (
        <Card className="flex gap-4 items-start border-2 border-brand-200 bg-brand-50/40">
          <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
              Legalitas Resmi Aktif
            </span>
            <h3 className="font-bold text-gray-900 text-sm mt-1">
              {settings.profil.nomorSk}
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Dasar hukum operasional Unit Pengumpul Zakat (UPZ) yang berlaku dan terverifikasi pada sistem {brandName}.
            </p>
          </div>
        </Card>
      )}

      {dummyLegalitas.map((item) => (
        <Card
          key={item.judul}
          className="flex gap-4 items-start"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
            <ScrollText size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">
              {item.judul}
            </h3>

            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {item.keterangan}
            </p>
          </div>
        </Card>
      ))}
    </div>

  </div>
</section>

    </div>
  );
}
