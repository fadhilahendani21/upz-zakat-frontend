/**
 * Ambil inisial dari nama, misal "Prof. Dr. H. Ahmad Fauzi, M.Ag." -> "AF"
 * Buang gelar umum di depan (Prof, Dr, H, Hj, dll) dan singkatan gelar
 * pendek di belakang nama (M.Ag, S.E, Lc, dst), lalu ambil huruf pertama
 * dari kata nama pertama & terakhir yang tersisa.
 */
const GELAR_DEPAN = new Set([
  "prof", "dr", "drs", "dra", "h", "hj", "ir", "kh", "ust", "ustadz", "ustadzah",
]);

export function getInitials(fullName) {
  if (!fullName) return "?";

  let words = fullName
    .replace(/\./g, " ")
    .split(/[\s,]+/)
    .filter(Boolean)
    .filter((w) => !GELAR_DEPAN.has(w.toLowerCase()));

  // Buang singkatan gelar pendek (<=3 huruf) di belakang, selama masih
  // ada kata nama yang lebih panjang tersisa
  const adaKataPanjang = words.some((w) => w.length > 3);
  if (adaKataPanjang) {
    words = words.filter((w) => w.length > 3);
  }

  if (words.length === 0) return fullName[0]?.toUpperCase() ?? "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
