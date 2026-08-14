// Data kontak — nanti tinggal diganti data asli UPZ, atau di-fetch dari BE
// lewat services/kontakService.js kalau mau dibikin dinamis.
export const dummyKontak = {
  alamat:
    "Gedung Rektorat Universitas Siliwangi, Jl. Siliwangi No. 24, Tasikmalaya, Jawa Barat 46115",
  telepon: "(0265) 323532",
  whatsapp: "0812-3456-7890",
  email: "upzzakat@unsil.ac.id",
  jamOperasional: [
    { hari: "Senin – Jumat", jam: "08.00 – 16.00 WIB" },
    { hari: "Sabtu, Minggu, & Hari Libur", jam: "Tutup" },
  ],
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Universitas+Siliwangi&output=embed",
  sosialMedia: [
    { label: "Facebook", handle: "@upzzakatunsil", url: "#" },
    { label: "Instagram", handle: "@upzzakat.unsil", url: "#" },
    { label: "Twitter / X", handle: "@upzzakatunsil", url: "#" },
    { label: "YouTube", handle: "UPZ Zakat Unsil", url: "#" },
  ],
};
