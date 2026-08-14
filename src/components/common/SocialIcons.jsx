// lucide-react versi terbaru sudah tidak menyediakan ikon brand (Facebook,
// Instagram, dll) karena alasan trademark, jadi kita bikin versi minimal
// sendiri di sini biar tidak bergantung ke library eksternal tambahan.

function IconBase({ size = 20, children, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      {children}
    </svg>
  );
}

export function FacebookIcon({ size, ...props }) {
  return (
    <IconBase size={size} fill="currentColor" {...props}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.3c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4.02v2.24H7.8v3h2.56V21h3.14Z" />
    </IconBase>
  );
}

export function InstagramIcon({ size, ...props }) {
  return (
    <IconBase size={size} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function TwitterIcon({ size, ...props }) {
  return (
    <IconBase size={size} fill="currentColor" {...props}>
      <path d="M4 4l7.2 9.4L4.3 20h1.9l6-6.4 4.6 6.4H20l-7.6-9.9L19.4 4h-1.9l-5.5 5.9L7.7 4H4Zm2.6 1.4h2l9 12.2h-2l-9-12.2Z" />
    </IconBase>
  );
}

export function YoutubeIcon({ size, ...props }) {
  return (
    <IconBase size={size} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
