import { getSettings } from "./settingService";

/**
 * Mendapatkan parameter nisab zakat terkini dari pengaturan sistem
 */
export function getZakatConfig() {
  const settings = getSettings();
  const zakat = settings.zakat || {};
  return {
    hargaEmasPerGram: Number(zakat.hargaEmasPerGram) || 1350000,
    nisabGramEmas: Number(zakat.nisabZakatMaalGram) || 85,
    hargaBerasPerKg: Number(zakat.hargaBerasPerKg) || 15000,
    kadarZakatPersen: Number(zakat.kadarZakatPersen) || 2.5,
  };
}

/**
 * Hitung zakat penghasilan berdasarkan harga emas acuan di pengaturan sistem
 * @param {number} penghasilanBulanan
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number, hargaEmas: number}}
 */
export function hitungZakatPenghasilan(penghasilanBulanan) {
  const { hargaEmasPerGram, nisabGramEmas, kadarZakatPersen } = getZakatConfig();
  const nisab = nisabGramEmas * hargaEmasPerGram;
  const penghasilanSetahun = (Number(penghasilanBulanan) || 0) * 12;
  const wajibZakat = penghasilanSetahun >= nisab;
  const jumlahZakat = wajibZakat ? (Number(penghasilanBulanan) || 0) * (kadarZakatPersen / 100) : 0;

  return { nisab, wajibZakat, jumlahZakat, hargaEmas: hargaEmasPerGram };
}

/**
 * Hitung zakat maal berdasarkan harga emas acuan di pengaturan sistem
 * @param {number} totalHarta - total harta yang sudah dimiliki 1 tahun (haul)
 * @param {number} totalUtang - utang jatuh tempo yang mengurangi harta wajib zakat
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number, hartaBersih: number, hargaEmas: number}}
 */
export function hitungZakatMaal(totalHarta, totalUtang = 0) {
  const { hargaEmasPerGram, nisabGramEmas, kadarZakatPersen } = getZakatConfig();
  const nisab = nisabGramEmas * hargaEmasPerGram;
  const hartaBersih = Math.max((Number(totalHarta) || 0) - (Number(totalUtang) || 0), 0);
  const wajibZakat = hartaBersih >= nisab;
  const jumlahZakat = wajibZakat ? hartaBersih * (kadarZakatPersen / 100) : 0;

  return { nisab, wajibZakat, jumlahZakat, hartaBersih, hargaEmas: hargaEmasPerGram };
}

/**
 * Hitung zakat fitrah (2,5 kg beras per jiwa) berdasarkan harga beras acuan di pengaturan sistem
 * @param {number} jumlahJiwa
 * @returns {{jumlahZakat: number, perJiwa: number, hargaBeras: number}}
 */
export function hitungZakatFitrah(jumlahJiwa) {
  const { hargaBerasPerKg } = getZakatConfig();
  const perJiwa = 2.5 * hargaBerasPerKg;
  const jumlahZakat = Math.max(Number(jumlahJiwa) || 0, 0) * perJiwa;

  return { jumlahZakat, perJiwa, hargaBeras: hargaBerasPerKg };
}

/**
 * Kirim data pembayaran zakat ke server (mock / API)
 */
export async function bayarZakat(payload) {
  console.log("Dummy bayarZakat payload:", payload);
  return Promise.resolve({ success: true, id: "ZKT-" + Date.now() });
}
