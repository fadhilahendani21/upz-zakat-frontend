// Motif geometris islami yang samar, diulang (tile) jadi tekstur halus
// di background halaman (Beranda & Dashboard). Warnanya ngikutin
// currentColor + opacity di parent, sengaja dibikin tipis banget.
export default function IslamicPattern({ className = "", style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="islamicMotif"
          x="0"
          y="0"
          width="90"
          height="90"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="45" cy="45" r="20" />
            <path d="M45,25 C55,25 55,35 45,45 C35,55 35,65 45,65" />
            <path d="M25,45 C25,35 35,35 45,45 C55,55 65,55 65,45" />
            <path d="M45,25 C35,25 35,35 45,45 C55,55 55,65 45,65" />
            <path d="M25,45 C25,55 35,55 45,45 C55,35 65,35 65,45" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamicMotif)" />
    </svg>
  );
}




