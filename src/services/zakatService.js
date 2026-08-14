// const API_URL = import.meta.env.VITE_API_URL;

const HARGA_EMAS_PER_GRAM = 1200000; // contoh, idealnya diambil dari API harga emas terkini
const HARGA_BERAS_PER_KG = 15000; // contoh harga beras acuan zakat fitrah
const NISAB_GRAM_EMAS = 85;

/**
 * Hitung zakat penghasilan (contoh logic sementara di FE,
 * nanti sebaiknya perhitungan final divalidasi juga di BE)
 * @param {number} penghasilanBulanan
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number}}
 */
export function hitungZakatPenghasilan(penghasilanBulanan) {
  const nisab = NISAB_GRAM_EMAS * HARGA_EMAS_PER_GRAM;
  const penghasilanSetahun = penghasilanBulanan * 12;
  const wajibZakat = penghasilanSetahun >= nisab;
  const jumlahZakat = wajibZakat ? penghasilanBulanan * 0.025 : 0;

  return { nisab, wajibZakat, jumlahZakat };
}

/**
 * Hitung zakat maal (harta simpanan: tabungan, emas, aset lancar, dsb)
 * @param {number} totalHarta - total harta yang sudah dimiliki 1 tahun (haul)
 * @param {number} totalUtang - utang jatuh tempo yang mengurangi harta wajib zakat
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number, hartaBersih: number}}
 */
export function hitungZakatMaal(totalHarta, totalUtang = 0) {
  const nisab = NISAB_GRAM_EMAS * HARGA_EMAS_PER_GRAM;
  const hartaBersih = Math.max(totalHarta - totalUtang, 0);
  const wajibZakat = hartaBersih >= nisab;
  const jumlahZakat = wajibZakat ? hartaBersih * 0.025 : 0;

  return { nisab, wajibZakat, jumlahZakat, hartaBersih };
}

/**
 * Hitung zakat fitrah (2,5 kg / 3,5 liter makanan pokok per jiwa,
 * dikonversi ke nilai uang berdasarkan harga beras acuan)
 * @param {number} jumlahJiwa
 * @returns {{jumlahZakat: number, perJiwa: number}}
 */
export function hitungZakatFitrah(jumlahJiwa) {
  const perJiwa = 2.5 * HARGA_BERAS_PER_KG;
  const jumlahZakat = Math.max(jumlahJiwa, 0) * perJiwa;

  return { jumlahZakat, perJiwa };
}

/**
 * Kirim data pembayaran zakat ke server
 * TODO (BE): implementasikan endpoint POST /api/zakat/bayar
 */
export async function bayarZakat(payload) {
  // const res = await fetch(`${API_URL}/zakat/bayar`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // return await res.json();
  console.log("Dummy bayarZakat payload:", payload);
  return Promise.resolve({ success: true, id: "ZKT-" + Date.now() });
}
