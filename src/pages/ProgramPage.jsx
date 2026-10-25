
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  HeartPulse,
  HandHeart,
  Store,
  Home,
  Droplets,
  FolderHeart,
  Heart,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import Card from "../components/common/Card";
import { getPublicPrograms } from "../services/programService";
import { useSettings } from "../services/settingService";

const DEFAULT_PROGRAMS = [
  {
    id: 1,
    icon: GraduationCap,
    title: "Beasiswa Pendidikan",
    description:
      "Bantuan biaya pendidikan bagi mahasiswa kurang mampu dan berprestasi di lingkungan Universitas Siliwangi.",
    target: 150000000,
    collected: 98500000,
  },
  {
    id: 2,
    icon: HeartPulse,
    title: "Bantuan Kesehatan",
    description:
      "Dukungan biaya pengobatan dan layanan kesehatan bagi mustahik yang membutuhkan.",
    target: 80000000,
    collected: 52000000,
  },
  {
    id: 3,
    icon: HandHeart,
    title: "Santunan Yatim & Dhuafa",
    description:
      "Santunan rutin bulanan untuk anak yatim dan kaum dhuafa di sekitar lingkungan kampus.",
    target: 60000000,
    collected: 45750000,
  },
  {
    id: 4,
    icon: Store,
    title: "Pemberdayaan Ekonomi",
    description:
      "Modal usaha dan pelatihan kewirausahaan bagi mustahik agar mampu mandiri secara ekonomi.",
    target: 100000000,
    collected: 41200000,
  },
  {
    id: 5,
    icon: Home,
    title: "Bedah Rumah Dhuafa",
    description:
      "Renovasi rumah tidak layak huni milik keluarga dhuafa di sekitar Tasikmalaya.",
    target: 120000000,
    collected: 67000000,
  },
  {
    id: 6,
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
  const settings = useSettings();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getPublicPrograms();
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            title: item.nama,
            description:
              item.deskripsi || "Program penyaluran bantuan UPZ Unsil.",
            target: item.target_nominal || 10000000,
            collected:
              item.nominal_terkumpul || item.nominal_disalurkan || 0,
            jumlah_donatur: item.jumlah_donatur || 0,
            nominal_terkumpul: item.nominal_terkumpul || 0,
            icon: FolderHeart,
          }));
          setPrograms(mapped);
        } else {
          setPrograms(DEFAULT_PROGRAMS);
        }
      } catch {
        setPrograms(DEFAULT_PROGRAMS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* Header */}

      <section className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-9">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Program Penyaluran Zakat & Infaq
            </h1>

            <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              {settings?.profil?.namaSingkat || "UPZ Unsil"} menyalurkan zakat, infak, dan sedekah melalui
              berbagai program strategis yang transparan, akuntabel, dan berdampak langsung bagi mustahik.
            </p>
          </div>
        </div>
      </section>


      {/* Daftar Program */}
      <section className="w-full px-6 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Judul dan tombol Detail Program */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Daftar Program
            </h2>

            <Link
              to="/program/detail"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-brand-600 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 sm:px-4 sm:text-sm"
            >
              <FileText size={15} />
              Detail Program
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Memuat program dari database...
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, idx) => {
                const Icon = program.icon || FolderHeart;

                const percent = Math.min(
                  100,
                  Math.round(
                    (program.collected / (program.target || 1)) * 100
                  )
                );

                return (
                  <Card
                    key={program.id || program.title || idx}
                    className="flex flex-col"
                  >
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
                          className="h-full bg-brand-500 rounded-full transition-all duration-500"
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

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <Users size={12} />
                        <span>
                          {(program.jumlah_donatur || 0).toLocaleString("id-ID")} Donatur
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <Heart size={12} />
                        <span>
                          {formatRupiah(program.nominal_terkumpul || 0) + " Tersalurkan"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/donasi?program=${program.id || ""}`}
                      state={{ programId: program.id }}
                      className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98]"
                    >
                      <Heart size={14} />
                      Donasi Sekarang
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
