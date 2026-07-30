import { useState, useEffect } from "react";
import { Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";

export default function Topbar({ title, subtitle, onMenuClick }) {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    // cek tiap 30 detik, update state cuma kalau tanggalnya beneran ganti
    // (jadi gak re-render tiap detik tanpa alasan)
    const interval = setInterval(() => {
      const now = new Date();
      setToday((prev) =>
        prev.toDateString() !== now.toDateString() ? now : prev
      );
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const tanggalMasehi = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tanggalHijriah = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(today)
    .replace(/\bAH\b/, "H");

  return (
    <div className="flex items-start justify-between mb-8 gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden mt-1 shrink-0 text-gray-500 hover:text-gray-700"
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate sm:whitespace-normal">
            {title || (
              <>
                Assalamu&apos;alaikum,{" "}
                <span className="text-brand-600">Admin UPZ</span> 👋
              </>
            )}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-700">{tanggalMasehi}</p>
          <p className="text-xs text-gray-400">{tanggalHijriah}</p>
        </div>

        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] flex items-center justify-center bg-brand-600 text-white rounded-full">
            3
          </span>
        </button>

        <button className="text-gray-500 hover:text-gray-700">
          <HelpCircle size={20} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              Admin UPZ
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              administrator
            </p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
