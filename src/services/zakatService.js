// const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hitung zakat penghasilan (contoh logic sementara di FE,
 * nanti sebaiknya perhitungan final divalidasi juga di BE)
 * @param {number} penghasilanBulanan
 * @returns {{nisab: number, wajibZakat: boolean, jumlahZakat: number}}
 */
export function hitungZakatPenghasilan(penghasilanBulanan) {
  const hargaEmasPerGram = 1200000; // contoh, idealnya diambil dari API harga emas terkini
  const nisab = 85 * hargaEmasPerGram;
  const penghasilanSetahun = penghasilanBulanan * 12;
  const wajibZakat = penghasilanSetahun >= nisab;
  const jumlahZakat = wajibZakat ? penghasilanBulanan * 0.025 : 0;

  return { nisab, wajibZakat, jumlahZakat };
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
