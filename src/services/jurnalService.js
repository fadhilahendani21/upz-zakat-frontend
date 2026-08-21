/**
 * jurnalService.js
 * API call untuk manajemen Jurnal Akuntansi UPZ Unsil.
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handle401(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/masuk";
    throw new Error("Sesi habis.");
  }
}

// Dummy storage untuk mode demo
let dummyJurnals = [
  {
    id: 1,
    tanggal: "2026-08-20",
    kode_akun: "1-1101",
    nama_akun: "Kas Bank BSI UPZ",
    keterangan: "Penerimaan Zakat Profesi Dosen Fakultas Teknik",
    debit: 15500000,
    kredit: 0,
    jenis: "masuk",
    referensi: "TRX-MASUK-001",
  },
  {
    id: 2,
    tanggal: "2026-08-19",
    kode_akun: "5-5101",
    nama_akun: "Penyaluran Beasiswa Mahasiswa",
    keterangan: "Bantuan UKT Mahasiswa Semester Ganjil 2026",
    debit: 0,
    kredit: 12000000,
    jenis: "keluar",
    referensi: "TRX-KELUAR-001",
  },
  {
    id: 3,
    tanggal: "2026-08-18",
    kode_akun: "1-1101",
    nama_akun: "Kas Bank BSI UPZ",
    keterangan: "Infaq & Sedekah Civitas Akademika Unsil",
    debit: 4800000,
    kredit: 0,
    jenis: "masuk",
    referensi: "TRX-MASUK-002",
  },
  {
    id: 4,
    tanggal: "2026-08-17",
    kode_akun: "5-5102",
    nama_akun: "Santunan Fakir Miskin Sekitar Kampus",
    keterangan: "Paket Sembako Dhuafa Hari Kemerdekaan",
    debit: 0,
    kredit: 7500000,
    jenis: "keluar",
    referensi: "TRX-KELUAR-002",
  },
  {
    id: 5,
    tanggal: "2026-08-15",
    kode_akun: "1-1102",
    nama_akun: "Kas Tunai Operasional",
    keterangan: "Donasi Online Program Peduli Dhuafa (QRIS)",
    debit: 3250000,
    kredit: 0,
    jenis: "masuk",
    referensi: "DONASI-ONL-101",
  },
  {
    id: 6,
    tanggal: "2026-08-10",
    kode_akun: "5-5103",
    nama_akun: "Bantuan Modal Usaha UMKM",
    keterangan: "Modal Usaha Gerobak Berkah Mustahik Binaan",
    debit: 0,
    kredit: 5000000,
    jenis: "keluar",
    referensi: "TRX-KELUAR-003",
  },
];

/**
 * GET /api/jurnal
 */
export async function getJurnal({ search = "", jenis = "", dateFrom = "", dateTo = "", page = 1, perPage = 10 } = {}) {
  if (!API_URL) {
    let filtered = [...dummyJurnals];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.nama_akun.toLowerCase().includes(s) ||
          (j.kode_akun && j.kode_akun.toLowerCase().includes(s)) ||
          (j.keterangan && j.keterangan.toLowerCase().includes(s)) ||
          (j.referensi && j.referensi.toLowerCase().includes(s))
      );
    }

    if (jenis) {
      filtered = filtered.filter((j) => j.jenis === jenis);
    }

    if (dateFrom) {
      filtered = filtered.filter((j) => j.tanggal >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((j) => j.tanggal <= dateTo);
    }

    const totalDebit = filtered.reduce((acc, curr) => acc + (Number(curr.debit) || 0), 0);
    const totalKredit = filtered.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);

    const total = filtered.length;
    const last_page = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return {
      data,
      meta: {
        current_page: Number(page),
        last_page,
        per_page: Number(perPage),
        total,
        total_debit: totalDebit,
        total_kredit: totalKredit,
        saldo_bersih: totalDebit - totalKredit,
      },
    };
  }

  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);
  if (jenis) params.set("jenis", jenis);
  if (dateFrom) params.set("date_from", dateFrom);
  if (dateTo) params.set("date_to", dateTo);

  const res = await fetch(`${API_URL}/jurnal?${params}`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data jurnal.");
  return res.json();
}

/**
 * POST /api/jurnal
 */
export async function createJurnal(payload) {
  if (!API_URL) {
    const newItem = {
      id: Date.now(),
      tanggal: payload.tanggal,
      kode_akun: payload.kode_akun || "",
      nama_akun: payload.nama_akun,
      keterangan: payload.keterangan || "",
      debit: Number(payload.debit) || 0,
      kredit: Number(payload.kredit) || 0,
      jenis: payload.jenis || "masuk",
      referensi: payload.referensi || `JRN-${Date.now().toString().slice(-4)}`,
    };
    dummyJurnals.unshift(newItem);
    return { message: "Entri jurnal berhasil ditambahkan.", data: newItem };
  }

  const res = await fetch(`${API_URL}/jurnal`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Gagal menambah entri jurnal.");
  }
  return data;
}

/**
 * PUT /api/jurnal/{id}
 */
export async function updateJurnal(id, payload) {
  if (!API_URL) {
    const index = dummyJurnals.findIndex((j) => j.id === id);
    if (index !== -1) {
      dummyJurnals[index] = {
        ...dummyJurnals[index],
        tanggal: payload.tanggal,
        kode_akun: payload.kode_akun || "",
        nama_akun: payload.nama_akun,
        keterangan: payload.keterangan || "",
        debit: Number(payload.debit) || 0,
        kredit: Number(payload.kredit) || 0,
        jenis: payload.jenis || "masuk",
        referensi: payload.referensi || dummyJurnals[index].referensi,
      };
      return { message: "Entri jurnal berhasil diperbarui.", data: dummyJurnals[index] };
    }
    throw new Error("Data tidak ditemukan.");
  }

  const res = await fetch(`${API_URL}/jurnal/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Gagal memperbarui entri jurnal.");
  }
  return data;
}

/**
 * DELETE /api/jurnal/{id}
 */
export async function deleteJurnal(id) {
  if (!API_URL) {
    dummyJurnals = dummyJurnals.filter((j) => j.id !== id);
    return { message: "Entri jurnal berhasil dihapus." };
  }

  const res = await fetch(`${API_URL}/jurnal/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Gagal menghapus entri jurnal.");
  }
  return data;
}
