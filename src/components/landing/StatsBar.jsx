import { useState, useEffect } from "react";
import { Users, HeartHandshake, HandCoins, ClipboardList } from "lucide-react";
import { getPublicLaporan } from "../../services/donasiService";
import { formatRupiahShort } from "../../utils/formatRupiah";

export default function StatsBar() {
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      value: totalMuzakki > 0 ? `${totalMuzakki.toLocaleString("id-ID")}+` : `${totalMuzakki}`,
      label: "Muzakki Terdaftar",
    },
    {
      icon: HandCoins,
      value: `Rp ${formatRupiahShort(totalMasuk)}${totalMasuk > 0 ? "+" : ""}`,
      label: `Dana Terkumpul (${tahun})`,
    },
    {
      icon: HeartHandshake,
      value: totalMustahik > 0 ? `${totalMustahik.toLocaleString("id-ID")}+` : `${totalMustahik}`,
      label: "Mustahik Terbantu",
    },
    {
      icon: ClipboardList,
      value: totalProgram > 0 ? `${totalProgram}+` : `${totalProgram}`,
      label: "Program Penyaluran",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 pb-8">
      <div className="bg-brand-700 rounded-2xl px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-white/15 gap-6 lg:gap-0 shadow-sm">
        <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:pr-8">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                {loading ? (
                  <div className="h-6 w-20 bg-white/20 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-white text-xl font-bold leading-tight">
                    {item.value}
                  </p>
                )}
                <p className="text-brand-100 text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 lg:pl-8 lg:w-72 shrink-0">
          <span className="text-white/70 text-3xl leading-none font-serif">
            &ldquo;
          </span>
          <p className="text-white text-sm leading-relaxed">
            Bersama zakat, kita bangun kebaikan dan keberkahan.
          </p>
        </div>
      </div>
    </section>
  );
}

