/**
 * Format angka jadi format Rupiah, misal 1245780000 -> "Rp 1.245.780.000"
 */
export function formatRupiah(value) {
  if (value === null || value === undefined) return "Rp 0";
  return "Rp " + Number(value).toLocaleString("id-ID");
}

/**
 * Format angka jadi format singkat, misal 1245780000 -> "1,24 M"
 */
export function formatRupiahShort(value) {
  if (value === null || value === undefined) return "0";
  const num = Number(value);
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(".", ",") + " M";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(0) + " jt";
  return num.toLocaleString("id-ID");
}
