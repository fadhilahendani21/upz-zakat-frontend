// Ilustrasi masjid dekoratif, dipakai sebagai background halus di pojok
// kanan atas dashboard (lihat DashboardLayout.jsx)
export default function MosqueIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* garis tanah */}
      <line x1="0" y1="200" x2="420" y2="200" stroke="currentColor" strokeWidth="2" />

      {/* menara kiri */}
      <rect x="30" y="90" width="18" height="110" stroke="currentColor" strokeWidth="2" />
      <path d="M30 90 L39 68 L48 90 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="39" y1="68" x2="39" y2="52" stroke="currentColor" strokeWidth="2" />
      <circle cx="39" cy="48" r="4" stroke="currentColor" strokeWidth="2" />

      {/* menara kanan */}
      <rect x="372" y="90" width="18" height="110" stroke="currentColor" strokeWidth="2" />
      <path d="M372 90 L381 68 L390 90 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="381" y1="68" x2="381" y2="52" stroke="currentColor" strokeWidth="2" />
      <circle cx="381" cy="48" r="4" stroke="currentColor" strokeWidth="2" />

      {/* badan bangunan utama */}
      <rect x="90" y="120" width="240" height="80" stroke="currentColor" strokeWidth="2" />

      {/* pintu tengah lengkung */}
      <path
        d="M195 200 V160 a15 15 0 0 1 30 0 V200"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* jendela lengkung kiri & kanan */}
      <path d="M120 200 V172 a10 10 0 0 1 20 0 V200" stroke="currentColor" strokeWidth="2" />
      <path d="M280 200 V172 a10 10 0 0 1 20 0 V200" stroke="currentColor" strokeWidth="2" />

      {/* kubah utama */}
      <path
        d="M150 120 C150 85 175 60 210 60 C245 60 270 85 270 120 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line x1="210" y1="60" x2="210" y2="34" stroke="currentColor" strokeWidth="2" />
      <circle cx="210" cy="28" r="5" stroke="currentColor" strokeWidth="2" />

      {/* kubah kecil kiri & kanan */}
      <path
        d="M105 120 C105 102 116 90 130 90 C144 90 155 102 155 120 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M265 120 C265 102 276 90 290 90 C304 90 315 102 315 120 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
