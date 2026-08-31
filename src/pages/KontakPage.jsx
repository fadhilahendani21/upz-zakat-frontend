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

  const alamat = profil.alamat || dummyKontak.alamat;

  // Nomor WhatsApp — dibaca dari pengaturan sistem
  const whatsapp =
    profil.whatsapp || dummyKontak.whatsapp || "081234567890";

  const whatsappClean = whatsapp.replace(/\D/g, "");

  const whatsappHref = `https://wa.me/${
    whatsappClean.startsWith("0")
      ? "62" + whatsappClean.slice(1)
      : whatsappClean
  }`;

  const email = profil.email || dummyKontak.email;

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
            Layanan Aktif Jam Kerja
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
            Respon Cepat 1x24 Jam
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4603646424735!2d108.22021287404235!3d-7.350249372311004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5765c64bb1f9%3A0xd8b04746f0f62ad4!2sUniversitas%20Siliwangi!5e1!3m2!1sid!2sid!4v1786676648205!5m2!1sid!2sid"
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
                  Senin – Jumat
                </span>

                <span className="text-right font-medium text-gray-800">
                  09.00 – 16.00 WIB
                </span>

              </li>

              <li className="flex justify-between gap-3 text-sm text-gray-600">

                <span>
                  Sabtu, Minggu, &amp; Hari Libur
                </span>

                <span className="text-right font-medium text-gray-800">
                  Tutup
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

              {dummyKontak.sosialMedia.map((s) => {

                const Icon =
                  SOSMED_ICON[s.label] || MessageCircle;

                return (

                  <li key={s.label}>

                    <a
                      href={s.url}
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