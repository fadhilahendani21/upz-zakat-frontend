import ketuaImg from "../assets/img/acep-irham.jpeg";
import wakilImg from "../assets/img/joni.jpeg";
import sekretarisImg from "../assets/img/dita-agustian.jpeg";
import bendaharaImg from "../assets/img/randi-rizal.jpeg";
import administrasiImg from "../assets/img/riza-nurdiana.jpeg";
import { formatImageUrl, fileToDataUrl } from "./beritaService";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_KEY = "upz_pengurus_data";

// Data awal sebagai fallback jika backend belum dibuat oleh tim backend
const DEFAULT_PENGURUS = [
  {
    id: 1,
    nama: "Dr. Ir. Acep Irham Gufroni, M.Eng.",
    jabatan: "Ketua UPZ",
    foto: ketuaImg,
    urutan: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nama: "Dr. Joni, S.E.I., M.E.Sy.",
    jabatan: "Wakil Ketua UPZ",
    foto: wakilImg,
    urutan: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    nama: "Dr. Dita Agustian, M.Pd.",
    jabatan: "Sekretaris UPZ",
    foto: sekretarisImg,
    urutan: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    nama: "Ir. Randi Rizal, Ph.D.",
    jabatan: "Bendahara UPZ",
    foto: bendaharaImg,
    urutan: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    nama: "Riza Nurdiana, S.E.",
    jabatan: "Administrasi",
    foto: administrasiImg,
    urutan: 5,
    created_at: new Date().toISOString(),
  },
];

// Helper autentikasi header untuk API Laravel
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper penyimpanan lokal (Mock fallback)
function getLocalList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PENGURUS));
      return DEFAULT_PENGURUS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PENGURUS;
  } catch {
    return DEFAULT_PENGURUS;
  }
}

function saveLocalList(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Gagal menyimpan ke localStorage:", e);
  }
}

/**
 * GET: Ambil pengurus untuk halaman publik
 */
export async function getPublicPengurus() {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/public/pengurus`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || [];
        if (data.length > 0) return data;
      }
    } catch {
      // Backend belum siap / offline, fallback ke localStorage
    }
  }

  // Fallback lokal diurutkan berdasarkan urutan asc
  const local = getLocalList();
  return [...local].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
}

/**
 * GET: Ambil pengurus untuk dashboard admin
 */
export async function getAdminPengurus() {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/pengurus`, {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/masuk";
        return [];
      }
      if (res.ok) {
        const json = await res.json();
        return json?.data || [];
      }
    } catch {
      // Backend belum siap / offline, fallback ke localStorage
    }
  }

  const local = getLocalList();
  return [...local].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
}

/**
 * POST: Tambah pengurus baru
 */
export async function createPengurus(formData) {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/pengurus`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return { isRemote: true, ...json };
      }
      // Jika endpoint 404 / 500, lemparkan ke fallback mock
    } catch {
      // Fallback
    }
  }

  // Simpan ke localStorage mock
  const list = getLocalList();
  let fotoData = null;
  const fotoFile = formData.get("foto");

  if (fotoFile instanceof File && fotoFile.size > 0) {
    fotoData = await fileToDataUrl(fotoFile, 800, 800, 0.85);
  }

  const newItem = {
    id: Date.now(),
    nama: formData.get("nama") || "",
    jabatan: formData.get("jabatan") || "",
    urutan: parseInt(formData.get("urutan")) || list.length + 1,
    foto: fotoData,
    created_at: new Date().toISOString(),
  };

  const updated = [...list, newItem];
  saveLocalList(updated);

  return {
    isRemote: false,
    message: "Data pengurus berhasil ditambahkan (Tersimpan di Penyimpanan Frontend).",
    data: newItem,
  };
}

/**
 * POST: Update pengurus
 */
export async function updatePengurus(id, formData) {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/pengurus/${id}`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return { isRemote: true, ...json };
      }
    } catch {
      // Fallback
    }
  }

  const list = getLocalList();
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index === -1) throw new Error("Pengurus tidak ditemukan.");

  const existing = list[index];
  let fotoData = existing.foto;
  const fotoFile = formData.get("foto");

  if (fotoFile instanceof File && fotoFile.size > 0) {
    fotoData = await fileToDataUrl(fotoFile, 800, 800, 0.85);
  }

  const updatedItem = {
    ...existing,
    nama: formData.get("nama") ?? existing.nama,
    jabatan: formData.get("jabatan") ?? existing.jabatan,
    urutan: formData.has("urutan") ? parseInt(formData.get("urutan")) || 0 : existing.urutan,
    foto: fotoData,
    updated_at: new Date().toISOString(),
  };

  const newList = [...list];
  newList[index] = updatedItem;
  saveLocalList(newList);

  return {
    isRemote: false,
    message: "Data pengurus berhasil diperbarui (Tersimpan di Penyimpanan Frontend).",
    data: updatedItem,
  };
}

/**
 * DELETE: Hapus pengurus
 */
export async function deletePengurus(id) {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/pengurus/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return { isRemote: true, ...json };
      }
    } catch {
      // Fallback
    }
  }

  const list = getLocalList();
  const filtered = list.filter((item) => String(item.id) !== String(id));
  saveLocalList(filtered);

  return {
    isRemote: false,
    message: "Data pengurus berhasil dihapus.",
  };
}

/**
 * Reset data mock ke kondisi awal
 */
export function resetPengurusToDefault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PENGURUS));
  return DEFAULT_PENGURUS;
}
