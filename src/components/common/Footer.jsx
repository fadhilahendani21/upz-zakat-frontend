import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logoUnsil from "../../assets/images/logo-unsil.jpeg";

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
  return (
    <footer className="bg-[#175621] text-white">

      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-4">
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-x-4 gap-y-6 lg:gap-7">

          {/* BRAND */}
          <div className="col-span-3 lg:col-span-5">
            <div className="flex items-center gap-3">

              {/* Logo */}
              <div className="w-9 h-9 rounded-lg bg-white p-1 shadow-sm">
                <img
                  src={logoUnsil}
                  alt="Logo Universitas Siliwangi"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>

              <div>
                <h3 className="text-base font-bold">
                  UPZ Zakat UNSIL
                </h3>

                <p className="text-[11px] text-green-300 mt-0.5">
                  Universitas Siliwangi
                </p>
              </div>
            </div>

            <p className="mt-3 max-w-md text-xs text-green-100 leading-5">
              Unit Pengumpul Zakat Universitas Siliwangi yang berkomitmen
              dalam mengelola dan menyalurkan zakat, infak, dan sedekah
              secara amanah, transparan, dan tepat sasaran.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2 mt-3">

              {/* Instagram */}

             <a 
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
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
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
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
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
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

          {/* NAVIGASI */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-semibold text-white text-sm">
              Navigasi
            </h4>

            <div className="w-7 h-0.5 bg-green-400 rounded-full mt-1.5 mb-2.5" />

            <ul className="space-y-1.5">
              {navigasi.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-green-100 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LAYANAN */}
<div className="col-span-1 lg:col-span-2">
  <h4 className="font-semibold text-white text-sm">
    Layanan
  </h4>

  <div className="w-7 h-0.5 bg-green-400 rounded-full mt-1.5 mb-2.5" />

  <ul className="space-y-1.5">
    {layanan.map((item) => (
      <li key={item.to}>
        <Link
          to={item.to}
          className="relative z-10 text-xs text-green-100 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>
          {/* KONTAK */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className="font-semibold text-white text-sm">
              Hubungi Kami
            </h4>

            <div className="w-7 h-0.5 bg-green-400 rounded-full mt-1.5 mb-2.5" />

            <div className="space-y-2.5">

              {/* Address */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin size={13} />
                </div>

                <div>
                  <p className="text-[11px] text-green-300 mb-0.5">
                    Alamat
                  </p>

                  <p className="text-xs text-green-100 leading-4">
                    Universitas Siliwangi
                    <br />
                    Tasikmalaya
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xs">☎</span>
                </div>

                <div>
                  <p className="text-[11px] text-green-300 mb-0.5">
                    Telepon
                  </p>

                  <p className="text-xs text-green-100">
                    +62-8123-4567-8910
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xs">✉</span>
                </div>

                <div>
                  <p className="text-[11px] text-green-300 mb-0.5">
                    Email
                  </p>

                  <p className="text-xs text-green-100">
                    Upz@unsil.ac.id
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2.5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-1.5">

            <p className="text-[11px] text-green-200 text-center md:text-left">
              © 2026 UPZ Zakat Universitas Siliwangi. All rights reserved.
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-green-200">
              <span>Amanah</span>
              <span className="text-green-400">•</span>
              <span>Transparan</span>
              <span className="text-green-400">•</span>
              <span>Tepat Sasaran</span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}