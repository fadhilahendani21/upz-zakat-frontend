/**
 * StatCard — Unified stat card component used across all dashboard pages.
 *
 * Props:
 *  - icon: Lucide icon component
 *  - label: string
 *  - value: string | number
 *  - sub: string (optional)
 *  - color: "brand" | "emerald" | "amber" | "red" | "blue" | "purple" | "pink" | "indigo"
 *  - loading: boolean (shows skeleton)
 */

const COLOR_MAP = {
  brand:   { bg: "bg-brand-50",   text: "text-brand-600",   sub: "text-brand-600"   },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", sub: "text-emerald-600" },
  green:   { bg: "bg-emerald-50", text: "text-emerald-600", sub: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   sub: "text-amber-600"   },
  yellow:  { bg: "bg-amber-50",   text: "text-amber-600",   sub: "text-amber-600"   },
  orange:  { bg: "bg-orange-50",  text: "text-orange-600",  sub: "text-orange-600"  },
  red:     { bg: "bg-red-50",     text: "text-red-500",     sub: "text-red-500"     },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    sub: "text-blue-600"    },
  purple:  { bg: "bg-purple-50",  text: "text-purple-600",  sub: "text-purple-600"  },
  pink:    { bg: "bg-pink-50",    text: "text-pink-600",    sub: "text-pink-600"    },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  sub: "text-indigo-600"  },
  gray:    { bg: "bg-gray-100",   text: "text-gray-600",    sub: "text-gray-500"    },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "brand",
  loading = false,
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.brand;

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
        <div className={`w-11 h-11 rounded-xl mb-4 ${c.bg}`} />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-2.5 bg-gray-100 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.bg} ${c.text}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1 leading-tight">{value}</p>
      {sub && <p className={`text-xs font-medium mt-1.5 ${c.sub}`}>{sub}</p>}
    </div>
  );
}
