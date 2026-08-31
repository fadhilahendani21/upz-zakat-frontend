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
 * (Nisab setara 85 gram emas per tahun, dihitung per bulan)
 * @param {number} penghasilanBulanan
 * @param {object} [customConfig]
 * @returns {{nisab: number, nisabBulan: number, wajibZakat: boolean, jumlahZakat: number, hargaEmas: number, kadarZakatPersen: number, nisabGramEmas: number}}
 */
export function hitungZakatPenghasilan(penghasilanBulanan, customConfig = null) {
  const { hargaEmasPerGram, nisabGramEmas, kadarZakatPersen } = customConfig || getZakatConfig();
  const nisab = nisabGramEmas * hargaEmasPerGram;
  const nisabBulan = Math.round(nisab / 12);
  const penghasilan = Number(penghasilanBulanan) || 0;
  const penghasilanSetahun = penghasilan * 12;
  const wajibZakat = penghasilanSetahun >= nisab;
  const jumlahZakat = wajibZakat ? Math.round(penghasilan * (kadarZakatPersen / 100)) : 0;

  return {
    nisab,
    nisabBulan,
    wajibZakat,
    jumlahZakat,
    hargaEmas: hargaEmasPerGram,
    kadarZakatPersen,
    nisabGramEmas,
  };
}

/**
 * Hitung zakat maal berdasarkan harga emas acuan di pengaturan sistem (Nisab 85 gram emas, Haul 1 tahun)
 * @param {number} totalHarta - total harta yang sudah dimiliki 1 tahun (haul)
 * @param {number} [totalUtang=0] - utang jatuh tempo yang mengurangi harta wajib zakat
 * @param {object} [customConfig]
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number, hartaBersih: number, hargaEmas: number, kadarZakatPersen: number, nisabGramEmas: number}}
 */
export function hitungZakatMaal(totalHarta, totalUtang = 0, customConfig = null) {
  const { hargaEmasPerGram, nisabGramEmas, kadarZakatPersen } = customConfig || getZakatConfig();
  const nisab = nisabGramEmas * hargaEmasPerGram;
  const hartaBersih = Math.max((Number(totalHarta) || 0) - (Number(totalUtang) || 0), 0);
  const wajibZakat = hartaBersih >= nisab;
  const jumlahZakat = wajibZakat ? Math.round(hartaBersih * (kadarZakatPersen / 100)) : 0;

  return {
    nisab,
    wajibZakat,
    jumlahZakat,
    hartaBersih,
    hargaEmas: hargaEmasPerGram,
    kadarZakatPersen,
    nisabGramEmas,
  };
}

/**
 * Hitung zakat fitrah (2,5 kg beras per jiwa) berdasarkan harga beras acuan di pengaturan sistem
 * @param {number} jumlahJiwa
 * @param {object} [customConfig]
 * @returns {{jumlahZakat: number, perJiwa: number, hargaBeras: number}}
 */
export function hitungZakatFitrah(jumlahJiwa, customConfig = null) {
  const { hargaBerasPerKg } = customConfig || getZakatConfig();
  const perJiwa = Math.round(2.5 * hargaBerasPerKg);
  const jumlahZakat = Math.max(Number(jumlahJiwa) || 0, 0) * perJiwa;

  return {
    jumlahZakat,
    perJiwa,
    hargaBeras: hargaBerasPerKg,
  };
}


/**
 * Kirim data pembayaran zakat ke server (mock / API)
 */
export async function bayarZakat(payload) {
  console.log("Dummy bayarZakat payload:", payload);
  return Promise.resolve({ success: true, id: "ZKT-" + Date.now() });
}
