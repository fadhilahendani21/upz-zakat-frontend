import { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
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
import { getPublicPengaturan } from "../services/pengaturanService";

const SOSMED_ICON = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  "Twitter / X": TwitterIcon,
  YouTube: YoutubeIcon,
};

export default function KontakPage() {
  const settings = useSettings();
  const profil = settings.profil || {};

  // Membaca pengaturan dinamis kontak dari Admin (backend database / cache)
  const [customSettings, setCustomSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("upz_kontak_settings");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Ambil data terbaru dari backend database
    getPublicPengaturan("kontak").then((data) => {
      if (data) setCustomSettings(data);
    });

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
    customSettings?.kantor?.alamat ||
    customSettings?.infoUtama?.alamat ||
    profil.alamat ||
    dummyKontak.alamat;

  // Nomor WhatsApp
  const whatsapp =
    customSettings?.kantor?.whatsapp ||
    customSettings?.infoUtama?.whatsapp ||
    profil.whatsapp ||
    dummyKontak.whatsapp ||
    "081992300590";

  const subteksWa =
    customSettings?.infoUtama?.subteksWa || "Layanan Aktif Jam Kerja";

  const whatsappClean = whatsapp.replace(/\D/g, "");

  const whatsappHref = `https://wa.me/${whatsappClean.startsWith("0")
      ? "62" + whatsappClean.slice(1)
      : whatsappClean
    }`;

  const email =
    customSettings?.kantor?.email ||
    customSettings?.infoUtama?.email ||
    profil.email ||
    dummyKontak.email;

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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Kami Siap Membantu Anda
            </h1>

            <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              Ada pertanyaan seputar zakat, infak, sedekah, atau program
              penyaluran? Hubungi tim {orgName} lewat salah satu kanal di bawah.
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          INFO KONTAK SINGKAT
      ====================================================== */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 pb-6 pt-6 sm:grid-cols-3 sm:gap-5 sm:px-6 sm:pb-10 sm:pt-10">

        {/* =================================================
            ALAMAT (100% DI MOBILE)
        ================================================== */}
        <Card className="col-span-2 sm:col-span-1 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mt-0.5">
              <MapPin size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Alamat Kantor
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {alamat}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <a
              href="https://maps.google.com/?q=Universitas+Siliwangi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98]"
            >
              <ExternalLink size={13} />
              <span>Petunjuk Arah</span>
            </a>
          </div>
        </Card>


        {/* =================================================
            WHATSAPP (50% DI MOBILE)
        ================================================== */}
        <Card className="col-span-1 flex flex-col justify-between p-3.5 sm:p-5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-brand-50 text-brand-600 mt-0.5">
              <Phone size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                WhatsApp
              </h3>

              <p className="mt-0.5 text-xs sm:text-sm font-medium text-brand-700 truncate">
                {whatsapp}
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 truncate">
                {subteksWa}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98]"
            >
              <MessageCircle size={14} />
              <span className="truncate">Chat WA</span>
            </a>
          </div>
        </Card>


        {/* =================================================
            EMAIL (50% DI MOBILE)
        ================================================== */}
        <Card className="col-span-1 flex flex-col justify-between p-3.5 sm:p-5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-brand-50 text-brand-600 mt-0.5">
              <Mail size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                Email
              </h3>

              <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-700 truncate">
                {email}
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 truncate">
                {subteksEmail}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <a
              href={`mailto:${email}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98]"
            >
              <Mail size={13} />
              <span className="truncate">Kirim Email</span>
            </a>
          </div>
        </Card>

      </section>


      {/* =====================================================
          PETA + JAM OPERASIONAL + SOSIAL MEDIA
      ====================================================== */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-5 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-3">

        {/* =================================================
            PETA
        ================================================== */}
        <Card className="overflow-hidden p-0 lg:col-span-2 relative">
          <iframe
            title="Lokasi Universitas Siliwangi"
            src={mapsUrl}
            className="min-h-[260px] h-64 sm:h-72 w-full border-0 lg:h-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </Card>


        {/* =================================================
            JAM OPERASIONAL + SOSIAL MEDIA
        ================================================== */}
        <div className="space-y-4 sm:space-y-5">

          {/* =================================================
              JAM OPERASIONAL
          ================================================== */}
          <Card className="p-4 sm:p-5">

            <div className="mb-3.5 flex items-center gap-2">
              <Clock
                size={18}
                className="text-brand-600"
              />

              <h3 className="text-sm font-semibold text-gray-900">
                Jam Operasional
              </h3>
            </div>

            <ul className="space-y-2.5">

              <li className="flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-600 rounded-lg bg-gray-50/70 p-2.5">
                <span className="font-medium text-gray-700">
                  {jamOperasional.hariKerja}
                </span>

                <span className="text-right font-bold text-brand-700">
                  {jamOperasional.jamKerja}
                </span>
              </li>

              <li className="flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-600 rounded-lg bg-gray-50/70 p-2.5">
                <span className="font-medium text-gray-500">
                  {jamOperasional.hariLibur}
                </span>

                <span className="text-right font-semibold text-gray-400">
                  {jamOperasional.jamLibur}
                </span>
              </li>

            </ul>

          </Card>


          {/* =================================================
              SOSIAL MEDIA
          ================================================== */}
          <Card className="p-4 sm:p-5">

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Ikuti Kami
            </h3>

            <ul className="space-y-2">

              {sosialMediaList.map((s) => {

                const Icon =
                  SOSMED_ICON[s.label] || MessageCircle;

                return (

                  <li key={s.label}>

                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl p-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-brand-50/60 hover:text-brand-700 border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Icon size={15} />
                        </span>

                        <span className="font-medium">{s.handle}</span>
                      </div>

                      <ExternalLink size={13} className="text-gray-400" />
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