const LEAVES = [
  { top: "10%", left: "6%", size: 28, duration: "7.2s", delay: "0s", rotate: "20deg", opacity: 0.55, color: "text-brand-500" },
  { top: "6%", left: "62%", size: 16, duration: "9.4s", delay: "1.1s", rotate: "-100deg", opacity: 0.3, color: "text-brand-400" },
  { top: "28%", left: "88%", size: 22, duration: "8.1s", delay: "2.3s", rotate: "160deg", opacity: 0.4, color: "text-brand-500" },
  { top: "18%", left: "26%", size: 13, duration: "10.2s", delay: "3.4s", rotate: "45deg", opacity: 0.25, color: "text-brand-500" },
  { top: "58%", left: "3%", size: 20, duration: "6.8s", delay: "0.6s", rotate: "-30deg", opacity: 0.4, color: "text-brand-400" },
  { top: "72%", left: "18%", size: 15, duration: "8.9s", delay: "2s", rotate: "95deg", opacity: 0.3, color: "text-brand-500" },
  { top: "82%", left: "88%", size: 26, duration: "7.6s", delay: "1.4s", rotate: "-15deg", opacity: 0.5, color: "text-brand-500" },
  { top: "48%", left: "95%", size: 14, duration: "9.9s", delay: "3.8s", rotate: "70deg", opacity: 0.25, color: "text-brand-400" },
  { top: "38%", left: "48%", size: 12, duration: "8.4s", delay: "1.8s", rotate: "-60deg", opacity: 0.18, color: "text-brand-400" },
  { top: "92%", left: "55%", size: 18, duration: "7.9s", delay: "0.9s", rotate: "130deg", opacity: 0.35, color: "text-brand-500" },
  { top: "4%", left: "40%", size: 14, duration: "10.6s", delay: "2.7s", rotate: "-80deg", opacity: 0.22, color: "text-brand-400" },
  { top: "64%", left: "68%", size: 17, duration: "9.1s", delay: "3.2s", rotate: "35deg", opacity: 0.3, color: "text-brand-500" },
];

function LeafShape({ size, opacity }) {
  return (
    <svg viewBox="0 0 28 32" width={size} height={size * 1.14} fill="none">
      <path
        d="M14,3 C7,6 3,13 4,19 C5,24 9,28 14,29 C19,28 23,24 24,19 C25,13 21,6 14,3 Z"
        fill="currentColor"
        opacity={opacity}
      />
      <path
        d="M14,5 C13,12 13,20 14,27"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity={opacity + 0.25}
      />
      <path
        d="M14,10 C11,11 9,13 7,13 M14,10 C17,11 19,13 21,13"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity={opacity + 0.15}
      />
      <path
        d="M14,17 C11,18 9,20 7.5,21 M14,17 C17,18 19,20 20.5,21"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity={opacity + 0.15}
      />
      <path
        d="M14,27 C14,29 13.5,30 13,31"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity={opacity + 0.25}
      />
    </svg>
  );
}

export default function FloatingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          className={`absolute ${leaf.color}`}
          style={{
            top: leaf.top,
            left: leaf.left,
            animation: `leafFloat ${leaf.duration} ease-in-out infinite`,
            animationDelay: leaf.delay,
          }}
        >
          <div style={{ transform: `rotate(${leaf.rotate})` }}>
            <LeafShape size={leaf.size} opacity={leaf.opacity} />
          </div>
        </div>
      ))}
    </div>
  );
}