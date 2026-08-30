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

        <div className="mx-auto flex min-h-[250px] items-center justify-center px-6 py-12 text-center sm:min-h-[280px] lg:min-h-[300px]">

          <div className="max-w-3xl">

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200 sm:text-sm">
              Tentang Kami
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Visi &amp; Misi
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
              Arah dan tujuan UPZ Zakat Universitas Siliwangi
              dalam mengelola zakat, infak, dan sedekah secara
              amanah, transparan, dan profesional.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          KONTEN
      ====================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">

        {/* KEMBALI */}

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

        <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-extrabold text-gray-900">
            Visi
          </h2>

          <div className="mt-4 border-l-4 border-brand-600 pl-5">

            <p className="text-base leading-8 text-gray-700 sm:text-lg">

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

        <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-extrabold text-gray-900">
            Misi
          </h2>

          <ul className="mt-5 space-y-4">

            {MISI.map((item, i) => (

              <li
                key={i}
                className="flex items-start gap-4 text-gray-700"
              >

                <span className="mt-2.5 flex h-2 w-2 shrink-0 rounded-full bg-brand-600" />

                <span className="text-sm leading-7 sm:text-base">
                  {item}
                </span>

              </li>

            ))}

          </ul>

        </section>

      </main>

    </div>
  );
}