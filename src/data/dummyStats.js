// Data statistik utama buat 4 card di atas dashboard & landing page
export const dummyStats = {
  totalDanaTerkumpul: 1245780000,
  totalDanaDisalurkan: 987450000,
  saldoKasBank: 258330000,
  totalMuzakki: 1256,
  perubahanDanaTerkumpul: 18.6, // persen, dibanding tahun lalu
  perubahanDanaDisalurkan: 15.3,
  perubahanMuzakki: 12.4,
};

// Data buat landing page (statsbar bawah hero)
export const dummyLandingStats = {
  muzakkiTerdaftar: 2845,
  danaTerkumpul2024: 1820000000,
  mustahikTerbantu: 3210,
  programPenyaluran: 25,
};

// Data buat donut chart "Ringkasan Dana"
export const dummyRingkasanDana = [
  { name: "Zakat", value: 812450000, percent: 65.2, color: "#2e7d38" },
  { name: "Infaq", value: 287530000, percent: 23.1, color: "#3b82f6" },
  { name: "Sedekah", value: 112800000, percent: 9.1, color: "#eab308" },
  { name: "Dana Lainnya", value: 33000000, percent: 2.6, color: "#a855f7" },
];
