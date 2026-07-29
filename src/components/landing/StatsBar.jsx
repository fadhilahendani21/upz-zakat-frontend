import { Users, HeartHandshake, HandCoins, ClipboardList } from "lucide-react";
import { dummyLandingStats } from "../../data/dummyStats";
import { formatRupiahShort } from "../../utils/formatRupiah";

export default function StatsBar() {
  const s = dummyLandingStats;

  const items = [
    {
      icon: Users,
      value: s.muzakkiTerdaftar.toLocaleString("id-ID") + "+",
      label: "Muzakki Terdaftar",
    },
    {
      icon: HandCoins,
      value: "Rp " + formatRupiahShort(s.danaTerkumpul2024) + "+",
      label: "Dana Terkumpul (2024)",
    },
    {
      icon: HeartHandshake,
      value: s.mustahikTerbantu.toLocaleString("id-ID") + "+",
      label: "Mustahik Terbantu",
    },
    {
      icon: ClipboardList,
      value: s.programPenyaluran + "+",
      label: "Program Penyaluran",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      <div className="bg-brand-700 rounded-2xl px-8 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-white text-xl font-bold leading-tight">
                {item.value}
              </p>
              <p className="text-brand-100 text-xs">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
