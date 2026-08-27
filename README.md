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
git clone https://github.com/ndiecyber/UPZ-Frontend.git
cd UPZ-Frontend
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

Lihat panduan setup backend: [UPZ-Backend](https://github.com/ndiecyber/UPZ-Backend)

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
| `/` | Landing Page / Beranda |
| `/tentang` | Tentang UPZ |
| `/tentang/kepengurusan` | Susunan Kepengurusan UPZ |
| `/tentang/visi-misi` | Visi & Misi |
| `/tentang/profil-unsil` | Profil Universitas Siliwangi |
| `/program` | Program Penyaluran |
| `/berita` | Berita & Kegiatan |
| `/laporan` | Laporan Keuangan Publik |
| `/hitung-zakat` | Kalkulator Zakat (Penghasilan, Maal, Fitrah) |
| `/donasi` | Form Donasi Online |
| `/kontak` | Kontak & Alamat |

### Autentikasi

| URL | Halaman |
|---|---|
| `/masuk` | Halaman Login Admin & Operator |

### Dashboard Admin & Operator (butuh login)

| URL | Halaman |
|---|---|
| `/dashboard` | Ringkasan & Statistik Utama |
| `/dashboard/pengumpulan` | Manajemen Pengumpulan Zakat & Infaq |
| `/dashboard/penyaluran` | Manajemen Penyaluran Zakat |
| `/dashboard/muzakki-mustahik` | Data Muzakki |
| `/dashboard/mustahik` | Data Mustahik & Kategori Asnaf |
| `/dashboard/program` | Kelola Program Penyaluran |
| `/dashboard/donasi-online` | Verifikasi Donasi Online |
| `/dashboard/transaksi` | Riwayat & Pencatatan Transaksi |
| `/dashboard/rekening-kas` | Manajemen Rekening & Kas |
| `/dashboard/laporan-keuangan` | Laporan Keuangan Detail |
| `/dashboard/jurnal` | Jurnal Akuntansi |
| `/dashboard/pengguna` | Manajemen Pengguna & Hak Akses |
| `/dashboard/pengaturan` | Pengaturan Sistem, Profil & Nisab |

---

## Struktur Folder

```
src/
├── assets/          # Gambar, logo, foto pengurus
├── components/
│   ├── common/      # Button, Card, Modal, dll. (reusable)
│   ├── dashboard/   # StatCard, LineChartCard, DonutChartCard, Topbar, Sidebar
│   └── landing/     # Navbar, Footer, HeroSection, dll.
├── data/            # Data dummy (fallback / mode demo)
├── hooks/
│   └── useAuth.js   # Hook cek status login
├── layouts/
│   ├── PublicLayout.jsx    # Layout halaman publik (Navbar + Footer)
│   └── DashboardLayout.jsx # Layout dashboard (Sidebar + Topbar)
├── pages/
│   ├── dashboard/   # Halaman-halaman dashboard admin
│   └── *.jsx        # Halaman publik
├── routes/
│   └── AppRoutes.jsx # Definisi semua routing aplikasi
├── services/
│   ├── authService.js      # Login, logout, profil
│   ├── dashboardService.js # Fetch data dashboard (dengan fallback)
│   ├── donasiService.js    # Submisi donasi online & laporan publik
│   ├── programService.js   # Fetch & kelola program penyaluran
│   ├── settingService.js   # Manajemen pengaturan sistem & nisab
│   └── zakatService.js     # Kalkulasi zakat & konfigurasi nisab
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
- **Vite 6** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first CSS
- **React Router 7** — Client-side routing
- **Recharts** — Library grafik (line chart, donut chart)
- **Lucide React** — Icon library
