import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Building2,
  Landmark,
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
  const whatsapp = profil.whatsapp || dummyKontak.whatsapp;
  const email = profil.email || dummyKontak.email;
  const orgName = profil.namaLembaga || "UPZ Zakat Universitas Siliwangi";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Kami Siap Membantu Anda
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Ada pertanyaan seputar zakat, infak, sedekah, atau program
              penyaluran? Hubungi tim {orgName} lewat
              salah satu kanal di bawah.
            </p>
          </div>
        </div>
      </section>

      {/* Info Kontak Singkat */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 grid sm:grid-cols-3 gap-5">

        <Card className="text-center">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3 mx-auto">
            <MapPin size={20} />
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            Alamat Kantor
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {alamat}
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3 mx-auto">
            <Phone size={20} />
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            WhatsApp & Layanan
          </h3>

          <p className="text-sm text-gray-800 font-semibold mt-1">
            {whatsapp}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Layanan Aktif Jam Kerja
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3 mx-auto">
            <Mail size={20} />
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            Email Resmi
          </h3>

          <p className="text-sm text-gray-800 font-medium mt-1">
            {email}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Respon Cepat 1x24 Jam
          </p>
        </Card>

      </section>

      {/* Peta + Jam Operasional & Sosial Media */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid lg:grid-cols-3 gap-5">

       {/* Peta */}
<Card className="lg:col-span-2 p-0 overflow-hidden">
  <iframe
    title="Lokasi Universitas Siliwangi"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4603646424735!2d108.22021287404235!3d-7.350249372311004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5765c64bb1f9%3A0xd8b04746f0f62ad4!2sUniversitas%20Siliwangi!5e1!3m2!1sid!2sid!4v1786676648205!5m2!1sid!2sid"
    className="w-full h-72 lg:h-full min-h-[280px] border-0"
    allowFullScreen
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
  />
</Card>

        {/* Jam Operasional + Sosial Media */}
        <div className="space-y-5">

          {/* Jam Operasional */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-brand-600" />

              <h3 className="font-semibold text-gray-900 text-sm">
                Jam Operasional
              </h3>
            </div>

            <ul className="space-y-2">
              {dummyKontak.jamOperasional.map((item) => (
                <li
                  key={item.hari}
                  className="flex justify-between text-sm text-gray-600 gap-3"
                >
                  <span>{item.hari}</span>

                  <span className="font-medium text-gray-800 text-right">
                    {item.jam}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Sosial Media */}
          <Card>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
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
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-700 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
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