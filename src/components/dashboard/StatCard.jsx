/**
 * StatCard — Compact horizontal stat card component used across all dashboard pages.
 *
 * Props:
 *  - icon: Lucide icon component
 *  - label: string
 *  - value: string | number
 *  - color: "brand" | "emerald" | "green" | "amber" | "yellow" | "orange" | "red" | "blue" | "purple" | "pink" | "indigo" | "gray"
 *  - loading: boolean (shows skeleton)
 *  - className: string (optional)
 */

const COLOR_MAP = {
  brand:   { bg: "bg-brand-50",   text: "text-brand-600"   },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  green:   { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600"   },
  yellow:  { bg: "bg-amber-50",   text: "text-amber-600"   },
  orange:  { bg: "bg-orange-50",  text: "text-orange-600"  },
  red:     { bg: "bg-red-50",     text: "text-red-500"     },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600"    },
  purple:  { bg: "bg-purple-50",  text: "text-purple-600"  },
  pink:    { bg: "bg-pink-50",    text: "text-pink-600"    },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600"  },
  gray:    { bg: "bg-gray-100",   text: "text-gray-600"    },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = "brand",
  loading = false,
  className = "",
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.brand;

  if (loading) {
    return (
      <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse flex items-center gap-3.5 ${className}`}>
        <div className={`w-11 h-11 rounded-xl shrink-0 ${c.bg}`} />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 ${className}`}>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}
