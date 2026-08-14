// Data jenis donasi (zakat, infak, sedekah) buat halaman Donasi.
export const dummyJenisDonasi = [
  {
    id: "zakat-penghasilan",
    kategori: "Zakat",
    nama: "Zakat Penghasilan",
    deskripsi:
      "Zakat atas penghasilan/profesi yang sudah mencapai nisab, dikeluarkan setiap menerima penghasilan atau setiap bulan.",
  },
  {
    id: "zakat-maal",
    kategori: "Zakat",
    nama: "Zakat Maal",
    deskripsi:
      "Zakat atas harta yang dimiliki (tabungan, emas, aset) yang telah mencapai nisab dan haul (1 tahun).",
  },
  {
    id: "zakat-fitrah",
    kategori: "Zakat",
    nama: "Zakat Fitrah",
    deskripsi:
      "Zakat wajib yang dikeluarkan setiap muslim menjelang Idulfitri, senilai 2,5 kg makanan pokok per jiwa.",
  },
  {
    id: "infak",
    kategori: "Infak",
    nama: "Infak",
    deskripsi:
      "Pemberian sukarela tanpa batasan nisab, untuk mendukung operasional dan program UPZ.",
  },
  {
    id: "sedekah",
    kategori: "Sedekah",
    nama: "Sedekah",
    deskripsi:
      "Pemberian sukarela dalam bentuk apa pun sebagai bentuk kepedulian dan kebaikan.",
  },
];

// Nominal cepat yang bisa dipilih langsung
export const nominalCepat = [
  50000, 100000, 250000, 500000, 1000000, 2500000,
];

// Metode pembayaran yang tersedia (dummy)
export const metodePembayaran = [
  { id: "transfer-bank", nama: "Transfer Bank", keterangan: "BSI, Mandiri, BNI Syariah" },
  { id: "qris", nama: "QRIS", keterangan: "Scan & bayar via e-wallet apa pun" },
  { id: "e-wallet", nama: "E-Wallet", keterangan: "GoPay, OVO, DANA, ShopeePay" },
];
