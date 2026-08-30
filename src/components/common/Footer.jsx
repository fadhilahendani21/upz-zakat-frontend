import { MapPin, LogIn, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logoUpz from "../../assets/img/logo-upz.png";
import { useSettings } from "../../services/settingService";

const navigasi = [
  { label: "Beranda", to: "/" },
  { label: "Tentang UPZ", to: "/tentang" },
  { label: "Program", to: "/program" },
  { label: "Berita", to: "/berita" },
  { label: "Laporan", to: "/laporan" },
  { label: "Kontak", to: "/kontak" },
];

const layanan = [
  { label: "Kalkulator Zakat", to: "/hitung-zakat" },
  { label: "Tunaikan Zakat", to: "/donasi" },
  { label: "Program Penyaluran", to: "/program" },
  { label: "Transparansi Dana", to: "/laporan" },
];

export default function Footer() {
  const settings = useSettings();

  const brandName =
    settings?.profil?.namaSingkat || "UPZ Unsil";

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  const alamat =
    settings?.profil?.alamat ||
    "Universitas Siliwangi, Tasikmalaya";

  const whatsapp = "085171014303";

  const email =
    settings?.profil?.email || "upz@unsil.ac.id";

  return (
    <footer className="bg-[#175621] text-white">

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-6 lg:px-10">

        <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-12 lg:gap-7">

          {/* ================= BRAND ================= */}
          <div className="col-span-3 lg:col-span-5">

            <div className="flex items-center gap-3">

              <div className="h-9 w-9 rounded-lg bg-white p-1 shadow-sm">

                <img
                  src={logoUpz}
                  alt="Logo UPZ Unsil"
                  className="h-full w-full rounded-md object-contain"
                />

              </div>

              <div>

                <h3 className="text-base font-bold">
                  {brandName}
                </h3>

                {/* DIBESARKAN */}
                <p className="mt-0.5 text-xs font-medium text-green-300">
                  Universitas Siliwangi
                </p>

              </div>

            </div>

            <p className="mt-3 max-w-md text-xs leading-5 text-green-100">

              {orgName} berkomitmen
              dalam mengelola dan menyalurkan zakat, infak, dan sedekah
              secara amanah, transparan, dan tepat sasaran.

            </p>

            {/* ================= SOCIAL MEDIA ================= */}
            <div className="mt-3 flex items-center gap-2">

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    width="20"
                    height="20"
                    x="2"
                    y="2"
                    rx="5"
                  />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line
                    x1="17.5"
                    x2="17.51"
                    y1="6.5"
                    y2="6.5"
                  />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 hover:bg-white hover:text-green-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>

            </div>

          </div>

          {/* ================= NAVIGASI ================= */}
          <div className="col-span-1 lg:col-span-2">

            <h4 className="text-sm font-semibold text-white">
              Navigasi
            </h4>

            <div className="mb-2.5 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

            <ul className="space-y-1.5">

              {navigasi.map((item) => (
                <li key={item.to}>

                  <Link
                    to={item.to}
                    className="inline-block text-xs text-green-100 transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* ================= LAYANAN ================= */}
          <div className="col-span-1 lg:col-span-2">

            <h4 className="text-sm font-semibold text-white">
              Layanan
            </h4>

            <div className="mb-2.5 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

            <ul className="space-y-1.5">

              {layanan.map((item) => (
                <li key={item.to}>

                  <Link
                    to={item.to}
                    className="inline-block text-xs text-green-100 transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* ================= HUBUNGI KAMI ================= */}
          <div className="col-span-1 lg:col-span-3">

            <h4 className="text-sm font-semibold text-white">
              Hubungi Kami
            </h4>

            <div className="mb-3 mt-1.5 h-0.5 w-7 rounded-full bg-green-400" />

            <div className="space-y-3">

              {/* ALAMAT */}
              <div className="flex items-start gap-2.5">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">

                  <MapPin size={14} />

                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-medium leading-4 text-green-300">
                    Alamat
                  </p>

                  <p className="text-xs leading-5 text-green-100">
                    {alamat}
                  </p>

                </div>

              </div>

              {/* WHATSAPP */}
              <div className="flex items-start gap-2.5">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">

                  <Phone size={14} />

                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-medium leading-4 text-green-300">
                    WhatsApp / Telepon
                  </p>

                  <a
                    href="https://wa.me/6285171014303"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs leading-5 text-green-100 transition-colors hover:text-white"
                  >
                    {whatsapp}
                  </a>

                </div>

              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-2.5">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">

                  <Mail size={14} />

                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-medium leading-4 text-green-300">
                    Email
                  </p>

                  <a
                    href={`mailto:${email}`}
                    className="break-all text-xs leading-5 text-green-100 transition-colors hover:text-white"
                  >
                    {email}
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 py-2.5 lg:px-10">

          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">

            {/* COPYRIGHT + LOGIN */}

            <div className="flex items-center gap-2 text-center md:text-left">

              <p className="text-[11px] text-green-200">

                © {new Date().getFullYear()} {orgName}.
                All rights reserved.

              </p>

              {/* ICON LOGIN */}

              <Link
                to="/masuk"
                aria-label="Masuk"
                title="Masuk"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-green-200/40 transition-all duration-200 hover:bg-white/10 hover:text-green-100"
              >

                <LogIn
                  size={13}
                  strokeWidth={1.8}
                />

              </Link>

            </div>

            {/* TAGLINE */}

            <div className="flex items-center gap-1.5 text-[11px] text-green-200">

              <span>Amanah</span>

              <span className="text-green-400">
                •
              </span>

              <span>Transparan</span>

              <span className="text-green-400">
                •
              </span>

              <span>Tepat Sasaran</span>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}