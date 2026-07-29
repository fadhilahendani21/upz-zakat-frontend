# UPZ Zakat — Frontend

Frontend untuk website & dashboard admin UPZ Zakat Universitas Siliwangi.
Dibangun pakai React + Vite + Tailwind CSS + React Router + Recharts.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

- `/` — landing page publik
- `/masuk` — halaman login admin
- `/dashboard` — dashboard admin (statistik, grafik, transaksi, dll)

## Struktur folder

```
src/
├── components/        # komponen UI reusable
│   ├── common/         # Button, Card, dll (dipakai di mana-mana)
│   ├── landing/         # komponen khusus landing page
│   └── dashboard/       # komponen khusus dashboard admin
├── layouts/            # PublicLayout (navbar) & DashboardLayout (sidebar)
├── pages/              # halaman utuh, dipetakan ke route
│   └── dashboard/       # sub-halaman dashboard
├── data/               # data dummy — nanti diganti response API asli
├── services/           # fungsi ambil data — di sini titik "colok" API BE
├── hooks/              # custom hooks (mis. useAuth)
├── routes/             # AppRoutes.jsx — semua routing didefinisikan di sini
└── utils/              # helper (format rupiah, format tanggal, dll)
```

## Cara handover ke Backend

Semua data yang ditampilkan FE saat ini masih **dummy**, ditaruh di folder
`src/data/`. Titik integrasi ke API asli ada di folder `src/services/` —
setiap fungsi di situ punya komentar `TODO (BE)` yang jelasin endpoint
yang disarankan dan struktur response yang diharapkan. Contoh:

```js
// src/services/dashboardService.js
export async function getDashboardStats() {
  return Promise.resolve(dummyStats);
  // nanti diganti:
  // const res = await fetch(`${API_URL}/dashboard/stats`);
  // return await res.json();
}
```

Jadi kalau BE sudah siap, tinggal:
1. Isi `.env` (copy dari `.env.example`) dengan URL API asli.
2. Ganti isi tiap fungsi di `services/*.js` dari dummy jadi `fetch(...)` ke API.
3. Komponen & halaman **tidak perlu diubah sama sekali**, karena semua
   sudah manggil data lewat fungsi service, bukan langsung dari file dummy.

## Catatan

- Warna brand (hijau) diset lewat CSS variable `--color-brand-*` di
  `src/index.css`, tinggal diubah kalau ada penyesuaian.
- Halaman-halaman yang belum didesain penuh (mis. `Pengumpulan.jsx`,
  `TentangPage.jsx`, dll) masih berupa stub kosong — tinggal dikembangin.
- Auth masih sederhana pakai `localStorage` (lihat `services/authService.js`
  dan `hooks/useAuth.js`), belum ada proteksi route di `AppRoutes.jsx`.
