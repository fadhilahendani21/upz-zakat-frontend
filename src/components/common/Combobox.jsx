import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, X } from "lucide-react";

/**
 * Combobox — select yang bisa diketik untuk pencarian.
 *
 * Props:
 *  - value: { id, nama, unit_kerja } | null
 *  - onChange: (item | null) => void
 *  - onSearch: async (query: string) => [{id, nama, unit_kerja}]
 *  - placeholder: string
 *  - disabled: boolean
 */
export default function Combobox({
  value,
  onChange,
  onSearch,
  placeholder = "Ketik untuk mencari...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!open) return;

    clearTimeout(debounceRef.current);
    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(query);
        // Deduplikasi by id sebagai lapisan perlindungan
        const seen = new Set();
        const unique = results.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        setOptions(unique);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, open]);

  function handleOpen() {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleSelect(item) {
    onChange(item);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition text-left
          ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200" : "bg-white border-gray-200 hover:border-gray-300 focus:outline-none"}
          ${open ? "ring-2 ring-brand-500/30 border-brand-500" : ""}`}
      >
        {value ? (
          <span className="flex-1 truncate text-gray-800">{value.nama}
            {value.unit_kerja && (
              <span className="text-gray-400 ml-1 text-xs">— {value.unit_kerja}</span>
            )}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="flex items-center gap-1 ml-2 shrink-0">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="text-gray-300 hover:text-gray-500 transition cursor-pointer p-0.5 rounded"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin shrink-0" />
            )}
          </div>

          {/* Options list */}
          <ul className="max-h-48 overflow-y-auto divide-y divide-gray-50">
            {options.length === 0 && !loading ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                {query ? "Tidak ada hasil" : "Mulai ketik untuk mencari..."}
              </li>
            ) : (
              options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors
                      ${value?.id === opt.id ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-700"}`}
                  >
                    <span className="block font-medium">{opt.nama}</span>
                    {opt.unit_kerja && (
                      <span className="block text-xs text-gray-400">{opt.unit_kerja}</span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
