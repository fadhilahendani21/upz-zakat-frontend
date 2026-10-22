
import { useState, useEffect } from "react";
import {
  Users,
  HeartHandshake,
  HandCoins,
  ClipboardList,
} from "lucide-react";
import { getPublicLaporan } from "../../services/donasiService";
import { formatRupiahShort } from "../../utils/formatRupiah";

export default function StatsBar() {
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [berandaCustom, setBerandaCustom] = useState(() => {
    try {
      const saved = localStorage.getItem("upz_beranda_settings");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) setBerandaCustom(e.detail);
    };
    window.addEventListener("upz_beranda_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("upz_beranda_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getPublicLaporan(currentYear);
        if (res) {
          setStats(res);
        }
      } catch (err) {
        console.error("Gagal memuat statistik real:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [currentYear]);

  const totalMuzakki = stats?.total_muzakki ?? 0;
  const totalMasuk = stats?.total_masuk ?? 0;
  const totalMustahik = stats?.total_mustahik ?? 0;
  const totalProgram = stats?.total_program ?? 0;
  const tahun = stats?.tahun ?? currentYear;

  const items = [
    {
      icon: Users,
      value:
        totalMuzakki > 0
          ? `${totalMuzakki.toLocaleString("id-ID")}+`
          : `${totalMuzakki}`,
      label: berandaCustom?.infoTambahan?.labelMuzakki || "Muzakki Terdaftar",
    },
    {
      icon: HandCoins,
      value: `Rp ${formatRupiahShort(totalMasuk)}${totalMasuk > 0 ? "+" : ""}`,
      label: `Dana Terkumpul (${tahun})`,
    },
    {
      icon: HeartHandshake,
      value:
        totalMustahik > 0
          ? `${totalMustahik.toLocaleString("id-ID")}+`
          : `${totalMustahik}`,
      label: berandaCustom?.infoTambahan?.labelMustahik || "Mustahik Terbantu",
    },
    {
      icon: ClipboardList,
      value: totalProgram > 0 ? `${totalProgram}+` : `${totalProgram}`,
      label: "Program Penyaluran",
    },
  ];

  const taglineTeks =
    berandaCustom?.infoTambahan?.taglineBanner ||
    "Bersama zakat, kita bangun kebaikan dan keberkahan.";
  const kutipanSumber = berandaCustom?.kutipan?.sumber;

  return (
    <section className="mx-auto w-full max-w-none px-3 pt-0 pb-3 sm:px-5 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-brand-700 px-4 py-3 shadow-sm sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:gap-0 lg:px-6 lg:py-4 xl:px-8">
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-5 lg:pr-7">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-2.5 sm:gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white sm:h-11 sm:w-11">
                <item.icon size={19} />
              </div>

              <div className="min-w-0">
                {loading ? (
                  <div className="mb-1 h-5 w-16 animate-pulse rounded bg-white/20" />
                ) : (
                  <p className="break-words text-base font-bold leading-tight text-white sm:text-lg">
                    {item.value}
                  </p>
                )}

                <p className="mt-1 text-[10px] leading-snug text-brand-100 sm:text-xs">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-start gap-2 border-t border-white/15 pt-4 lg:w-56 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 xl:w-64 xl:pl-7">
          <span className="text-2xl font-serif leading-none text-white/70">
            &ldquo;
          </span>

          <div>
            <p className="text-xs leading-relaxed text-white sm:text-sm">
              {taglineTeks}
            </p>
            {kutipanSumber && (
              <p className="text-[10px] text-brand-200 mt-0.5 font-medium">
                — {kutipanSumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
