import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    FolderHeart,
    Users,
    Heart,
} from "lucide-react";
import { getPublicPrograms } from "../services/programService";
import { useSettings } from "../services/settingService";

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

export default function ProgramDetailPage() {
    const settings = useSettings();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPrograms() {
            try {
                const res = await getPublicPrograms();
                setPrograms(Array.isArray(res?.data) ? res.data : []);
            } catch (error) {
                console.error("Gagal memuat detail program:", error);
                setPrograms([]);
            } finally {
                setLoading(false);
            }
        }

        loadPrograms();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

            {/* Header Detail Program */}
            <section className="w-full bg-brand-700 text-white">
                <div className="mx-auto flex min-h-[160px] max-w-7xl items-center px-6 py-8 sm:py-9">
                    <div className="relative w-full text-center">
                        <Link
                            to="/program"
                            className="absolute left-0 top-1 inline-flex items-center gap-2 text-xs text-green-50 transition hover:text-white"
                        >
                            <ArrowLeft size={15} />
                            Kembali ke Program
                        </Link>

                        <h1 className="text-xl font-bold leading-tight sm:text-2xl">
                            Detail Program
                        </h1>

                        <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-green-50 sm:text-sm">
                            Informasi program penyaluran zakat, infak, dan sedekah{" "}
                            {settings?.profil?.namaSingkat || "UPZ Unsil"}.
                        </p>
                    </div>
                </div>
            </section>

            {/* Daftar Detail Program */}
            <section className="w-full px-6 py-10">
                <div className="mx-auto max-w-7xl">
                    {loading ? (
                        <div className="py-16 text-center">
                            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />

                            <p className="text-sm text-gray-500">
                                Memuat informasi program...
                            </p>
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="rounded-xl border border-brand-100 bg-white p-5 text-center shadow-sm">
                            <FolderHeart
                                size={28}
                                className="mx-auto mb-2 text-brand-600"
                            />

                            <h2 className="text-base font-bold text-gray-900">
                                Belum Ada Informasi Program
                            </h2>

                            <p className="mt-2 text-xs leading-relaxed text-gray-600">
                                Informasi program belum tersedia. Silakan periksa kembali nanti.
                            </p>

                            <Link
                                to="/program"
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                            >
                                <ArrowLeft size={14} />
                                Kembali ke Daftar Program
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {programs.map((program, index) => {
                                const target = Number(program.target_nominal) || 0;

                                const collected =
                                    Number(program.nominal_terkumpul) ||
                                    Number(program.nominal_disalurkan) ||
                                    0;

                                const percent =
                                    target > 0
                                        ? Math.min(
                                            100,
                                            Math.round((collected / target) * 100)
                                        )
                                        : 0;

                                return (
                                    <article
                                        key={program.id || index}
                                        className="overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm"
                                    >
                                        <div className="p-5 sm:p-6">
                                            {/* Judul dan Deskripsi */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                                                    PROGRAM {index + 1}
                                                </p>

                                                <h2 className="mt-1 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                                                    {program.nama || "Program Penyaluran"}
                                                </h2>

                                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                                    {program.deskripsi ||
                                                        "Deskripsi program belum tersedia."}
                                                </p>
                                            </div>

                                            {/* Informasi Donatur dan Dana */}
                                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Users
                                                            size={16}
                                                            className="shrink-0 text-brand-600"
                                                        />
                                                        Jumlah Donatur
                                                    </div>

                                                    <p className="mt-2 text-base font-bold text-brand-700 sm:text-lg">
                                                        {(
                                                            Number(program.jumlah_donatur) || 0
                                                        ).toLocaleString("id-ID")}{" "}
                                                        <span className="text-xs font-medium">
                                                            donatur
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Heart
                                                            size={16}
                                                            className="shrink-0 text-brand-600"
                                                        />
                                                        Dana Terkumpul / Tersalurkan
                                                    </div>

                                                    <p className="mt-2 text-base font-bold text-brand-700 sm:text-lg">
                                                        {formatRupiah(collected)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Capaian Dana */}
                                            <div className="mt-5">
                                                <div className="flex items-center justify-between gap-3 text-sm">
                                                    <span className="font-medium text-gray-700">
                                                        Capaian Dana
                                                    </span>

                                                    <span className="font-bold text-brand-700">
                                                        {percent}%
                                                    </span>
                                                </div>

                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
                                                    <div
                                                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>

                                                <p className="mt-2 text-xs text-gray-500">
                                                    Target dana: {formatRupiah(target)}
                                                </p>
                                            </div>

                                            {/* Informasi Terbaru */}
                                            <div className="mt-5 border-t border-brand-100 pt-4">
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    Informasi Terbaru
                                                </h3>

                                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                                    {program.informasi_terbaru ||
                                                        program.info_terbaru ||
                                                        "Belum ada informasi terbaru yang dipublikasikan untuk program ini."}
                                                </p>
                                            </div>

                                            {/* Tombol Donasi */}
                                            <div className="mt-5">
                                                <Link
                                                    to={`/donasi?program=${program.id || ""}`}
                                                    state={{ programId: program.id }}
                                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-[0.98] sm:w-auto"
                                                >
                                                    <Heart size={14} />
                                                    Donasi untuk Program Ini
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}