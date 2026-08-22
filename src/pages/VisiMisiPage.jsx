import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import visiMisiPhoto from "../assets/images/visi-misi.jpeg";

const MISI = [
  "Mengoptimalkan penghimpunan zakat, infak, dan sedekah di lingkungan UNSIL.",
  "Menyalurkan dana zakat secara produktif dan tepat sasaran kepada mustahik yang berhak.",
  "Membangun sistem pengelolaan dana yang akuntabel dan transparan melalui teknologi digital.",
  "Meningkatkan kesadaran dan literasi civitas akademika tentang kewajiban berzakat.",
];

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
      {/* Banner */}
      <section className="relative h-72 sm:h-80 lg:h-[28rem] flex items-center justify-center text-center overflow-hidden">
        <img
          src={visiMisiPhoto}
          alt="Visi dan Misi UPZ Zakat Universitas Siliwangi"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative px-6">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-brand-300 uppercase">
            Tentang Kami
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
            Visi &amp; Misi
          </h1>
          <p className="mt-3 text-sm text-white/80">
            Arah dan tujuan UPZ Zakat Universitas Siliwangi dalam mengelola
            zakat, infak, dan sedekah.
          </p>
        </div>
      </section>

      {/* Konten */}
      <main className="max-w-5xl mx-auto px-6 py-10 sm:py-12">
        <Link
          to="/tentang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Tentang Kami
        </Link>

        <div className="mt-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Visi :</h2>
          <p className="mt-4 text-center text-lg italic text-gray-700 leading-relaxed">
            &ldquo;Menjadi Unit Pengumpul Zakat yang amanah, transparan, dan
            profesional dalam mengelola zakat, infak, dan sedekah untuk
            kesejahteraan umat di lingkungan civitas akademika Universitas
            Siliwangi dan masyarakat sekitar.&rdquo;
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-gray-900">Misi :</h2>
          <ul className="mt-4 space-y-4">
            {MISI.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}