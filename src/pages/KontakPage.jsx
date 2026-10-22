import { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
} from "lucide-react";
import Card from "../components/common/Card";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../components/common/SocialIcons";
import { dummyKontak } from "../data/dummyKontak";
import { useSettings } from "../services/settingService";

const SOSMED_ICON = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  "Twitter / X": TwitterIcon,
  YouTube: YoutubeIcon,
};

export default function KontakPage() {
  const settings = useSettings();
  const profil = settings.profil || {};

  // Membaca pengaturan dinamis kontak dari Admin (localStorage / state)
  const [customSettings, setCustomSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("upz_kontak_settings");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Sinkronisasi realtime jika ada perubahan dari Dashboard Admin
    const handleUpdate = (e) => {
      if (e.detail) setCustomSettings(e.detail);
    };
    const handleStorage = (e) => {
      if (e.key === "upz_kontak_settings" && e.newValue) {
        try {
          setCustomSettings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("upz_kontak_updated", handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("upz_kontak_updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const alamat =
    customSettings?.infoUtama?.alamat || profil.alamat || dummyKontak.alamat;

  // Nomor WhatsApp
  const whatsapp =
    customSettings?.infoUtama?.whatsapp ||
    profil.whatsapp ||
    dummyKontak.whatsapp ||
    "0812-3456-7890";

  const subteksWa =
    customSettings?.infoUtama?.subteksWa || "Layanan Aktif Jam Kerja";

  const whatsappClean = whatsapp.replace(/\D/g, "");

  const whatsappHref = `https://wa.me/${
    whatsappClean.startsWith("0")
      ? "62" + whatsappClean.slice(1)
      : whatsappClean
  }`;

  const email =
    customSettings?.infoUtama?.email || profil.email || dummyKontak.email;

  const subteksEmail =
    customSettings?.infoUtama?.subteksEmail || "Respon Cepat 1x24 Jam";

  const mapsUrl =
    customSettings?.googleMaps?.embedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4603646424735!2d108.22021287404235!3d-7.350249372311004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5765c64bb1f9%3A0xd8b04746f0f62ad4!2sUniversitas%20Siliwangi!5e1!3m2!1sid!2sid!4v1786676648205!5m2!1sid!2sid";

  const jamOperasional = customSettings?.jamOperasional || {
    hariKerja: "Senin – Jumat",
    jamKerja: "09.00 – 16.00 WIB",
    hariLibur: "Sabtu, Minggu, & Hari Libur",
    jamLibur: "Tutup",
  };

  const sosialMediaList = customSettings?.sosialMedia
    ? [
        {
          label: "Facebook",
          handle:
            customSettings.sosialMedia.facebook?.handle || "@upzzakatunsil",
          url: customSettings.sosialMedia.facebook?.url || "#",
        },
        {
          label: "Instagram",
          handle:
            customSettings.sosialMedia.instagram?.handle ||
            "@upzzakat.unsil",
          url: customSettings.sosialMedia.instagram?.url || "#",
        },
        {
          label: "Twitter / X",
          handle:
            customSettings.sosialMedia.twitter?.handle || "@upzzakatunsil",
          url: customSettings.sosialMedia.twitter?.url || "#",
        },
        {
          label: "YouTube",
          handle:
            customSettings.sosialMedia.youtube?.handle || "UPZ Zakat Unsil",
          url: customSettings.sosialMedia.youtube?.url || "#",
        },
      ]
    : dummyKontak.sosialMedia;

  const orgName =
    profil.namaLembaga || "UPZ Zakat Universitas Siliwangi";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="w-full bg-brand-700 text-white">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-14">

          <div className="text-center">

            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Kami Siap Membantu Anda
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-green-50 sm:text-base">
              Ada pertanyaan seputar zakat, infak, sedekah, atau program
              penyaluran? Hubungi tim {orgName} lewat salah satu kanal di bawah.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          INFO KONTAK SINGKAT
          MAX-WIDTH DIUBAH DARI 5XL -> 7XL
      ====================================================== */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 pb-10 pt-12 sm:grid-cols-3">

        {/* =================================================
            ALAMAT
        ================================================== */}
        <Card className="text-center">

          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">

            <MapPin size={20} />

          </div>

          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            Alamat Kantor
          </h3>

          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            {alamat}
          </p>

        </Card>


        {/* =================================================
            WHATSAPP
        ================================================== */}
        <Card className="text-center">

          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">

            <Phone size={20} />

          </div>

          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            WhatsApp &amp; Layanan
          </h3>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm font-semibold text-brand-700 hover:underline"
          >
            {whatsapp}
          </a>

          <p className="mt-1 text-xs text-gray-500">
            {subteksWa}
          </p>

        </Card>


        {/* =================================================
            EMAIL
        ================================================== */}
        <Card className="text-center">

          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">

            <Mail size={20} />

          </div>

          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            Email Resmi
          </h3>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {email}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {subteksEmail}
          </p>

        </Card>

      </section>


      {/* =====================================================
          PETA + JAM OPERASIONAL + SOSIAL MEDIA
          MAX-WIDTH DIUBAH DARI 5XL -> 7XL
      ====================================================== */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 pb-16 lg:grid-cols-3">

        {/* =================================================
            PETA
        ================================================== */}
        <Card className="overflow-hidden p-0 lg:col-span-2">

          <iframe
            title="Lokasi Universitas Siliwangi"
            src={mapsUrl}
            className="min-h-[280px] h-72 w-full border-0 lg:h-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />

        </Card>


        {/* =================================================
            JAM OPERASIONAL + SOSIAL MEDIA
        ================================================== */}
        <div className="space-y-5">

          {/* =================================================
              JAM OPERASIONAL
          ================================================== */}
          <Card>

            <div className="mb-3 flex items-center gap-2">

              <Clock
                size={18}
                className="text-brand-600"
              />

              <h3 className="text-sm font-semibold text-gray-900">
                Jam Operasional
              </h3>

            </div>

            <ul className="space-y-2">

              <li className="flex justify-between gap-3 text-sm text-gray-600">

                <span>
                  {jamOperasional.hariKerja}
                </span>

                <span className="text-right font-medium text-gray-800">
                  {jamOperasional.jamKerja}
                </span>

              </li>

              <li className="flex justify-between gap-3 text-sm text-gray-600">

                <span>
                  {jamOperasional.hariLibur}
                </span>

                <span className="text-right font-medium text-gray-800">
                  {jamOperasional.jamLibur}
                </span>

              </li>

            </ul>

          </Card>


          {/* =================================================
              SOSIAL MEDIA
          ================================================== */}
          <Card>

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Ikuti Kami
            </h3>

            <ul className="space-y-2.5">

              {sosialMediaList.map((s) => {

                const Icon =
                  SOSMED_ICON[s.label] || MessageCircle;

                return (

                  <li key={s.label}>

                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-brand-700"
                    >

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">

                        <Icon size={16} />

                      </span>

                      {s.handle}

                    </a>

                  </li>

                );

              })}

            </ul>

          </Card>

        </div>

      </section>

    </div>
  );
}