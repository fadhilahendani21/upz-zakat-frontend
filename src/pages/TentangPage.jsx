import { Eye, Target, ScrollText, ShieldCheck } from "lucide-react";
import Card from "../components/common/Card";
import {
  visiMisi,
  dummyPengurus,
  dummyLegalitas,
} from "../data/dummyTentang";
import { getInitials } from "../utils/getInitials";

const AVATAR_COLORS = [
  "bg-brand-100 text-brand-700",
  "bg-blue-100 text-blue-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
 <section className="w-full bg-brand-700 text-white">
  <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
        UPZ Zakat Universitas Siliwangi
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

    {/* Daftar Pengurus */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {dummyPengurus.map((p, i) => (
        <Card
          key={p.nama}
          className="flex items-start gap-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
              AVATAR_COLORS[i % AVATAR_COLORS.length]
            }`}
          >
            {getInitials(p.nama)}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-snug">
              {p.nama}
            </p>

            <p className="text-brand-600 text-xs font-medium mt-1">
              {p.jabatan}
            </p>

            <p className="text-gray-400 text-xs mt-1">
              {p.periode}
            </p>
          </div>
        </Card>
      ))}
    </div>

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
