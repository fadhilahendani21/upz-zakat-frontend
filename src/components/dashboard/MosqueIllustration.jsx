// Ilustrasi masjid dekoratif, dipakai sebagai background halus di pojok
// kanan atas dashboard (lihat DashboardLayout.jsx)
export default function MosqueIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 480 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id="mosqueCutouts">
          <rect x="0" y="0" width="480" height="240" fill="white" />
          <path d="M225,240 V190 a15 15 0 0 1 30 0 V240 Z" fill="black" />
          <path d="M140,240 V205 a12 12 0 0 1 24 0 V240 Z" fill="black" />
          <path d="M316,240 V205 a12 12 0 0 1 24 0 V240 Z" fill="black" />
        </mask>
      </defs>

      <g fill="currentColor" mask="url(#mosqueCutouts)">
        {/* badan bangunan utama, siluet solid */}
        <path d="M70,240 L70,150 Q70,138 82,138 L398,138 Q410,138 410,150 L410,240 Z" />

        {/* menara kiri */}
        <path d="M28,240 L28,110 Q28,100 38,100 L52,100 Q62,100 62,110 L62,240 Z" />
        <path d="M28,100 Q45,68 62,100 Z" />
        <rect x="43" y="52" width="4" height="20" rx="2" />
        <circle cx="45" cy="48" r="6" />

        {/* menara kanan */}
        <path d="M418,240 L418,110 Q418,100 428,100 L442,100 Q452,100 452,110 L452,240 Z" />
        <path d="M418,100 Q435,68 452,100 Z" />
        <rect x="433" y="52" width="4" height="20" rx="2" />
        <circle cx="435" cy="48" r="6" />

        {/* kubah utama, bentuk organik melengkung */}
        <path d="M170,138 C170,90 195,50 240,50 C285,50 310,90 310,138 Z" />
        <rect x="237" y="24" width="6" height="26" rx="3" />
        <circle cx="240" cy="18" r="8" />

        {/* kubah kecil kiri & kanan, menyatu ke badan bangunan */}
        <path d="M100,138 C100,112 116,94 138,94 C160,94 176,112 176,138 Z" opacity="0.85" />
        <path d="M304,138 C304,112 320,94 342,94 C364,94 380,112 380,138 Z" opacity="0.85" />
      </g>
    </svg>
  );
}
