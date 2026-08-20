/**
 * PageActions — tombol aksi utama halaman (Tambah, Ekspor, dll.)
 * Ditempatkan di sudut kanan atas, sejajar dengan Topbar.
 *
 * <PageActions>
 *   <Button icon={Plus} onClick={...}>Tambah</Button>
 * </PageActions>
 */
export function PageActions({ children }) {
  return (
    <div className="flex justify-end mb-5 -mt-1 gap-2 relative z-20">
      {children}
    </div>
  );
}

/**
 * TableCard — wrapper tabel utama dengan toolbar, table, dan pagination.
 *
 * Props:
 *   - toolbar: ReactNode  (filter/search bar)
 *   - pagination: ReactNode
 *   - children: ReactNode  (table content)
 */
export function TableCard({ toolbar, pagination, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {toolbar && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {pagination}
    </div>
  );
}

/**
 * TableHead — thead dengan style konsisten.
 * Props: cols (array string)
 */
export function TableHead({ cols }) {
  return (
    <thead className="bg-gray-50 border-b border-gray-100">
      <tr>
        {cols.map((col) => (
          <th
            key={col}
            className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/**
 * TableEmpty — empty / loading state untuk tbody.
 */
export function TableEmpty({ colSpan = 6, loading = false, message = "Belum ada data." }) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-5 py-14 text-center">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center text-sm text-gray-400">
        {message}
      </td>
    </tr>
  );
}

/**
 * Pagination — navigasi halaman tabel.
 * Props: page, lastPage, total, onPageChange, label (opsional)
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, lastPage, total, onPageChange, label = "data" }) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
    if (page <= 3) return i + 1;
    if (page >= lastPage - 2) return lastPage - 4 + i;
    return page - 2 + i;
  }).filter((n) => n >= 1 && n <= lastPage);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Total {total} {label} • Halaman {page} dari {lastPage}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
              n === page
                ? "bg-brand-600 text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(lastPage, page + 1))}
          disabled={page === lastPage}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/**
 * SearchInput — input pencarian konsisten.
 */
import { Search } from "lucide-react";

export function SearchInput({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="relative flex-1 w-full min-w-[160px]">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white"
      />
    </div>
  );
}

/**
 * FilterSelect — select filter konsisten.
 */
export function FilterSelect({ value, onChange, children, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition ${className}`}
    >
      {children}
    </select>
  );
}

/**
 * Modal — wrapper modal konsisten.
 * Props: onClose, title, subtitle, footer (ReactNode), children, maxWidth (default "max-w-lg")
 */
import { X } from "lucide-react";

export function Modal({ onClose, title, subtitle, footer, children, maxWidth = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            {subtitle && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 mb-0.5">
                {subtitle}
              </p>
            )}
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
}

/**
 * FormField — label + input wrapper konsisten.
 */
export function FormField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/**
 * inputCls — class string untuk semua input/select dalam form.
 */
export const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition bg-white";

/**
 * Badge — pill badge konsisten untuk status / kategori.
 * color: "green"|"emerald"|"blue"|"purple"|"amber"|"red"|"gray"
 */
const BADGE_COLORS = {
  green:   "bg-emerald-50 text-emerald-700",
  emerald: "bg-emerald-50 text-emerald-700",
  blue:    "bg-blue-50 text-blue-700",
  purple:  "bg-purple-50 text-purple-700",
  amber:   "bg-amber-50 text-amber-700",
  red:     "bg-red-50 text-red-600",
  gray:    "bg-gray-100 text-gray-600",
  brand:   "bg-brand-50 text-brand-700",
};

export function Badge({ children, color = "gray", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_COLORS[color] ?? BADGE_COLORS.gray} ${className}`}
    >
      {children}
    </span>
  );
}
