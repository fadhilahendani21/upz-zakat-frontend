import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MISI = [
  "Mengoptimalkan penghimpunan zakat, infak, dan sedekah di lingkungan UNSIL.",
  "Menyalurkan dana zakat secara produktif dan tepat sasaran kepada mustahik yang berhak.",
  "Membangun sistem pengelolaan dana yang akuntabel dan transparan melalui teknologi digital.",
  "Meningkatkan kesadaran dan literasi civitas akademika tentang kewajiban berzakat.",
];

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =====================================================
          BANNER
      ====================================================== */}

      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto flex min-h-[210px] items-center justify-center px-5 py-10 text-center sm:min-h-[230px] sm:px-6 lg:min-h-[240px]">

          <div className="w-full max-w-4xl">

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
              Tentang Kami
            </span>

            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
              Visi &amp; Misi
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-green-50 sm:text-[15px]">
              Arah dan tujuan UPZ Zakat Universitas Siliwangi
              dalam mengelola zakat, infak, dan sedekah secara
              amanah, transparan, dan profesional.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          KONTEN UTAMA
      ====================================================== */}

      <main className="w-full px-4 py-10 sm:px-6 lg:px-8 sm:py-12">

        <div className="mx-auto max-w-7xl">

          {/* =================================================
              KEMBALI
          ================================================== */}

          <Link
            to="/tentang"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            <ArrowLeft size={16} />
            Kembali ke Tentang Kami
          </Link>


          {/* =================================================
              VISI
          ================================================== */}

          <section className="mt-7 w-full rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-7">

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Visi
            </h2>

            <div className="mt-4 border-l-4 border-brand-600 pl-4 sm:pl-5">

              <p className="text-sm leading-7 text-gray-700 sm:text-[15px] sm:leading-7">
                “Menjadi Unit Pengumpul Zakat yang amanah,
                transparan, dan profesional dalam mengelola
                zakat, infak, dan sedekah untuk kesejahteraan
                umat di lingkungan civitas akademika Universitas
                Siliwangi dan masyarakat sekitar.”
              </p>

            </div>

          </section>


          {/* =================================================
              MISI
          ================================================== */}

          <section className="mt-6 w-full rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-7">

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Misi
            </h2>

            <ul className="mt-5 space-y-3.5">

              {MISI.map((item, i) => (

                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >

                  <span className="mt-[9px] flex h-2 w-2 shrink-0 rounded-full bg-brand-600" />

                  <span className="text-sm leading-6.5 sm:text-[15px] sm:leading-7">
                    {item}
                  </span>

                </li>

              ))}

            </ul>

          </section>

        </div>

      </main>

    </div>
  );
}