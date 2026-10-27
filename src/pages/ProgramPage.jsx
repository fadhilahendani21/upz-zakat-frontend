
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
    slug: "beasiswa-pendidikan",
    icon: GraduationCap,
    title: "Beasiswa Pendidikan",
    description:
      "Bantuan biaya pendidikan bagi mahasiswa kurang mampu dan berprestasi di lingkungan Universitas Siliwangi.",
    target: 150000000,
    collected: 98500000,
  },
  {
    id: 2,
    slug: "bantuan-kesehatan",
    icon: HeartPulse,
    title: "Bantuan Kesehatan",
    description:
      "Dukungan biaya pengobatan dan layanan kesehatan bagi mustahik yang membutuhkan.",
    target: 80000000,
    collected: 52000000,
  },
  {
    id: 3,
    slug: "santunan-yatim-dhuafa",
    icon: HandHeart,
    title: "Santunan Yatim & Dhuafa",
    description:
      "Santunan rutin bulanan untuk anak yatim dan kaum dhuafa di sekitar lingkungan kampus.",
    target: 60000000,
    collected: 45750000,
  },
  {
    id: 4,
    slug: "pemberdayaan-ekonomi",
    icon: Store,
    title: "Pemberdayaan Ekonomi",
    description:
      "Modal usaha dan pelatihan kewirausahaan bagi mustahik agar mampu mandiri secara ekonomi.",
    target: 100000000,
    collected: 41200000,
  },
  {
    id: 5,
    slug: "bedah-rumah-dhuafa",
    icon: Home,
    title: "Bedah Rumah Dhuafa",
    description:
      "Renovasi rumah tidak layak huni milik keluarga dhuafa di sekitar Tasikmalaya.",
    target: 120000000,
    collected: 67000000,
  },
  {
    id: 6,
    slug: "air-bersih-sanitasi",
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
            slug: item.slug || item.nama?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(item.id),
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Program Penyaluran Zakat &amp; Infaq
            </h1>

            <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
              {settings?.profil?.namaSingkat || "UPZ Unsil"} menyalurkan zakat, infak, dan sedekah melalui
              berbagai program strategis yang transparan, akuntabel, dan berdampak langsung bagi mustahik.
            </p>
          </div>
        </div>
      </section>


      {/* Daftar Program */}
      <section className="w-full px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-7xl mx-auto">

          {/* Judul dan Ringkasan */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                Daftar Program
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Pilih program kebaikan untuk melihat detail capaian atau berdonasi langsung.
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200">
              {programs.length} Program Aktif
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Memuat program dari database...
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        <Icon size={22} />
                      </div>

                      <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                        {percent}% Tercapai
                      </span>
                    </div>

                    <Link to={`/program/${program.slug || program.id}`} className="group/title">
                      <h3 className="text-base font-bold text-gray-900 transition-colors group-hover/title:text-brand-700 sm:text-lg">
                        {program.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">
                      {program.description}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-3">
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-brand-700">
                          {formatRupiah(program.collected)}
                        </span>

                        <span className="text-gray-500">
                          Target {formatRupiah(program.target)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2 text-[11px] text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-brand-600" />
                          <span>
                            {(program.jumlah_donatur || 0).toLocaleString("id-ID")} Donatur
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Heart size={13} className="text-brand-600" />
                          <span>
                            {formatRupiah(program.nominal_terkumpul || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi Detail & Donasi */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to={`/program/${program.slug || program.id}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-300 bg-brand-50/70 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 active:scale-[0.98]"
                      >
                        <FileText size={14} />
                        Detail Program
                      </Link>

                      <Link
                        to={`/donasi?program=${program.slug || program.id}`}
                        state={{ programId: program.id }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98]"
                      >
                        <Heart size={14} />
                        Donasi
                      </Link>
                    </div>
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
