const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/masuk";
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Terjadi kesalahan pada server.");
  return json;
}

/**
 * Mengambil semua pengaturan publik (beranda, kontak, footer) dari backend
 */
export async function getPublicPengaturanAll() {
  try {
    const json = await request("GET", "/public/pengaturan");
    if (json?.data) {
      if (json.data.beranda) {
        localStorage.setItem("upz_beranda_settings", JSON.stringify(json.data.beranda));
      }
      if (json.data.kontak) {
        localStorage.setItem("upz_kontak_settings", JSON.stringify(json.data.kontak));
      }
      if (json.data.footer) {
        localStorage.setItem("upz_footer_settings", JSON.stringify(json.data.footer));
      }
      return json.data;
    }
  } catch (err) {
    console.warn("Gagal memuat pengaturan publik dari backend, menggunakan cache:", err);
  }

  return {
    beranda: JSON.parse(localStorage.getItem("upz_beranda_settings") || "null"),
    kontak: JSON.parse(localStorage.getItem("upz_kontak_settings") || "null"),
    footer: JSON.parse(localStorage.getItem("upz_footer_settings") || "null"),
  };
}

/**
 * Mengambil konfigurasi spesifik dari endpoint publik
 * @param {'beranda'|'kontak'|'footer'|string} key
 */
export async function getPublicPengaturan(key) {
  try {
    const json = await request("GET", `/public/pengaturan/${key}`);
    if (json?.data) {
      localStorage.setItem(`upz_${key}_settings`, JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn(`Gagal memuat pengaturan '${key}' dari backend:`, err);
  }

  const cached = localStorage.getItem(`upz_${key}_settings`);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Mengambil konfigurasi untuk Admin Dashboard
 * @param {string} key
 */
export async function getPengaturanAdmin(key) {
  try {
    const json = await request("GET", `/pengaturan/${key}`);
    if (json?.data) {
      localStorage.setItem(`upz_${key}_settings`, JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn(`Fallback cache untuk pengaturan admin '${key}':`, err);
  }

  const cached = localStorage.getItem(`upz_${key}_settings`);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Menyimpan konfigurasi dari Admin Dashboard ke Backend Database
 * @param {string} key
 * @param {object} value
 */
export async function savePengaturanAdmin(key, value) {
  const json = await request("POST", `/pengaturan/${key}`, { value });

  // Update cache lokal
  const savedData = json?.data || value;
  localStorage.setItem(`upz_${key}_settings`, JSON.stringify(savedData));

  // Trigger event realtime untuk UI yang sedang terbuka
  window.dispatchEvent(
    new CustomEvent(`upz_${key}_updated`, { detail: savedData })
  );

  return savedData;
}
