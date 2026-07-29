/**
 * Format tanggal ISO/Date jadi format Indonesia, misal "17 Mei 2025"
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal + jam, misal "17 Mei 2025, 14:32 WIB"
 */
export function formatDateTime(date) {
  const d = new Date(date);
  const tanggal = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${tanggal}, ${jam} WIB`;
}
