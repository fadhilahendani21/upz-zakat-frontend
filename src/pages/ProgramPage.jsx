import {
  GraduationCap,
  HeartPulse,
  HandHeart,
  Store,
  Home,
  Droplets,
} from "lucide-react";
import Card from "../components/common/Card";

const PROGRAMS = [
  {
    icon: GraduationCap,
    title: "Beasiswa Pendidikan",
    description:
      "Bantuan biaya pendidikan bagi mahasiswa kurang mampu dan berprestasi di lingkungan Universitas Siliwangi.",
    target: 150000000,
    collected: 98500000,
  },
  {
    icon: HeartPulse,
    title: "Bantuan Kesehatan",
    description:
      "Dukungan biaya pengobatan dan layanan kesehatan bagi mustahik yang membutuhkan.",
    target: 80000000,
    collected: 52000000,
  },
  {
    icon: HandHeart,
    title: "Santunan Yatim & Dhuafa",
    description:
      "Santunan rutin bulanan untuk anak yatim dan kaum dhuafa di sekitar lingkungan kampus.",
    target: 60000000,
    collected: 45750000,
  },
  {
    icon: Store,
    title: "Pemberdayaan Ekonomi",
    description:
      "Modal usaha dan pelatihan kewirausahaan bagi mustahik agar mampu mandiri secara ekonomi.",
    target: 100000000,
    collected: 41200000,
  },
  {
    icon: Home,
    title: "Bedah Rumah Dhuafa",
    description:
      "Renovasi rumah tidak layak huni milik keluarga dhuafa di sekitar Tasikmalaya.",
    target: 120000000,
    collected: 67000000,
  },
  {
    icon: Droplets,
    title: "Air Bersih & Sanitasi",
    description:
      "Penyediaan akses air bersih dan sanitasi layak bagi masyarakat di daerah terdampak kekeringan.",
    target: 50000000,
    collected: 12500000,
  },
];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Program Penyaluran Zakat
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Zakat, infak, dan sedekah yang terkumpul disalurkan melalui
              berbagai program yang tepat sasaran, transparan, dan bermanfaat
              langsung bagi mustahik.
            </p>
          </div>
        </div>
      </section>

      {/* Daftar Program */}
      <section className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((program) => {
              const Icon = program.icon;

              const percent = Math.min(
                100,
                Math.round((program.collected / program.target) * 100)
              );

              return (
                <Card key={program.title} className="flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {program.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
                    {program.description}
                  </p>

                  <div className="mt-5">
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-700">
                        {formatRupiah(program.collected)}
                      </span>

                      <span className="text-gray-500">
                        dari {formatRupiah(program.target)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}