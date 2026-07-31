# UPZ Zakat Unsil — Frontend

> Aplikasi web untuk sistem manajemen zakat UPZ Universitas Siliwangi.
> Dibangun dengan **React 19** + **Vite** + **Tailwind CSS** + **Recharts**.

---

## Prasyarat

| Tool | Versi minimal |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Git | - |

---

## Setup dari Nol

### 1. Clone Repository

```bash
git clone https://github.com/fariezzz/upz-zakat-frontend.git
cd upz-zakat-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Lalu buka `.env`. Ada **dua pilihan mode**:

---

#### 🟡 Mode Demo — Tanpa Backend

Biarkan `VITE_API_URL` kosong atau dihapus:

```env
# VITE_API_URL=http://localhost:8000/api
```

Di mode ini:
- Dashboard menampilkan **data dummy** (tidak perlu backend berjalan)
- Login menerima **email dan password apapun**
- Muncul banner kuning **"Mode Demo"** di dashboard sebagai penanda

Cocok untuk: **developer yang hanya mengerjakan frontend** dan tidak perlu setup backend.

---

#### 🟢 Mode Real — Dengan Backend

Isi `VITE_API_URL` dengan URL backend Laravel:

```env
VITE_API_URL=http://localhost:8000/api
```

Di mode ini:
- Semua data diambil dari API secara real-time
- Login memerlukan akun yang valid di database
- Jika API tidak dapat dijangkau, otomatis fallback ke data dummy

Lihat panduan setup backend: [upz-zakat-backend](https://github.com/fariezzz/upz-zakat-backend)

---

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di **http://localhost:5173**

---

## Halaman & Routing

### Halaman Publik (tanpa login)

| URL | Halaman |
|---|---|
| `/` | Landing Page |
| `/tentang` | Tentang UPZ |
| `/program` | Program Penyaluran |
| `/berita` | Berita & Kegiatan |
| `/laporan` | Laporan Keuangan |
| `/kontak` | Kontak |

### Autentikasi

| URL | Halaman |
|---|---|
| `/masuk` | Halaman Login Admin |

### Dashboard Admin (butuh login)

| URL | Halaman |
|---|---|
| `/dashboard` | Ringkasan & Statistik Utama |
| `/dashboard/pengumpulan` | Manajemen Pengumpulan |
| `/dashboard/penyaluran` | Manajemen Penyaluran |
| `/dashboard/muzakki-mustahik` | Data Muzakki & Mustahik |
| `/dashboard/donasi-online` | Donasi Online |
| `/dashboard/transaksi` | Riwayat Transaksi |
| `/dashboard/laporan-keuangan` | Laporan Keuangan |
| `/dashboard/pengaturan` | Pengaturan |

---

## Struktur Folder

```
src/
├── assets/          # Gambar, ikon, font
├── components/
│   ├── common/      # Button, Card, dll. (reusable)
│   ├── dashboard/   # StatCard, LineChartCard, DonutChartCard, dll.
│   └── landing/     # Komponen halaman publik
├── data/            # Data dummy (fallback / mode demo)
│   ├── dummyStats.js
│   ├── dummyChart.js
│   ├── dummyTransaksi.js
│   └── dummyProgram.js
├── hooks/
│   └── useAuth.js   # Hook cek status login
├── layouts/
│   ├── PublicLayout.jsx    # Layout halaman publik (Navbar + Footer)
│   └── DashboardLayout.jsx # Layout dashboard (Sidebar + Topbar)
├── pages/
│   ├── dashboard/   # Halaman-halaman dashboard
│   └── *.jsx        # Halaman publik
├── routes/
│   └── AppRoutes.jsx # Definisi semua routing
├── services/
│   ├── authService.js      # Login, logout, cek token
│   ├── dashboardService.js # Fetch data dashboard (dengan fallback)
│   └── zakatService.js     # Kalkulasi & pembayaran zakat
└── utils/
    └── formatRupiah.js     # Helper format angka ke Rupiah
```

---

## Perintah Berguna

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview hasil build
npm run preview

# Linting
npm run lint
```

---

## Akun Default (Mode Real dengan Backend)

| | |
|---|---|
| **URL Login** | `http://localhost:5173/masuk` |
| **Email** | `admin@upz-unsil.ac.id` |
| **Password** | `password` |

> Akun ini dibuat otomatis oleh seeder di backend. Ganti password setelah pertama kali login.

---

## Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first CSS
- **React Router 7** — Client-side routing
- **Recharts** — Library grafik (line chart, donut chart)
- **Lucide React** — Icon library
