import { useState, useEffect } from "react";

const STORAGE_KEY = "upz_system_settings";

export const DEFAULT_SETTINGS = {
  // 1. Profil Lembaga & Legalitas
  profil: {
    namaLembaga: "Unit Pengumpul Zakat (UPZ) Universitas Siliwangi",
    namaSingkat: "UPZ Unsil",
    alamat: "Jl. Siliwangi No. 24, Kahuripan, Kec. Tawang, Kota Tasikmalaya, Jawa Barat 46115",
    whatsapp: "081234567890",
    email: "upz@unsil.ac.id",
    website: "https://upz.unsil.ac.id",
    rekeningUtamaBank: "Bank Syariah Indonesia (BSI)",
    rekeningUtamaNo: "7123456789",
    rekeningUtamaAn: "UPZ Unsil",
    rekeningInfaqBank: "Bank Syariah Indonesia (BSI)",
    rekeningInfaqNo: "7987654321",
    rekeningInfaqAn: "Infaq UPZ Unsil",
  },

  // 2. Pengaturan Zakat & Nisab
  zakat: {
    hargaEmasPerGram: 1350000,
    nisabZakatMaalGram: 85,
    hargaBerasPerKg: 15000,
    kadarZakatPersen: 2.5,
    persentaseHakAmil: 12.5, // batas amil max 1/8 (12.5%)
    updateTerakhirEmas: new Date().toISOString().split("T")[0],
  },

  // 3. Kategori Asnaf & Jenis Dana
  kategori: {
    asnafList: [
      "Fakir Miskin",
      "Gharim",
      "Muallaf",
      "Ibnu Sabil",
      "Fi Sabilillah",
      "Amil",
    ],
    jenisDanaList: [
      "Zakat Fitrah",
      "Zakat Maal",
      "Zakat Profesi/Penghasilan",
      "Infaq",
      "Sedekah",
      "Fidyah",
      "Dana Kemanusiaan",
    ],
  },

  // 4. Privasi & Keamanan
  privasi: {
    defaultAnonimPublik: false, // Samarkan nama muzakki di laporan publik (Hamba Allah)
    tampilkanDonasiOnlineDiLanding: true,
    tampilkanNominalDiDonasiTerbaru: true,
    retensiLogBulan: 24,
  },

  // 5. Pengaturan Umum
  umum: {
    zonaWaktu: "Asia/Jakarta (WIB)",
    mataUang: "IDR (Rp)",
    formatTanggal: "DD MMMM YYYY",
    modePemeliharaan: false,
  },
};

/**
 * Mengambil semua pengaturan sistem
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const merged = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      profil: { ...DEFAULT_SETTINGS.profil, ...(parsed.profil || {}) },
      zakat: { ...DEFAULT_SETTINGS.zakat, ...(parsed.zakat || {}) },
      kategori: { ...DEFAULT_SETTINGS.kategori, ...(parsed.kategori || {}) },
      privasi: { ...DEFAULT_SETTINGS.privasi, ...(parsed.privasi || {}) },
      umum: { ...DEFAULT_SETTINGS.umum, ...(parsed.umum || {}) },
    };

    // Derived values for backward compatibility
    const mainBank = merged.profil.rekeningUtamaBank || "";
    const mainNo = merged.profil.rekeningUtamaNo || "";
    const mainAn = merged.profil.rekeningUtamaAn || "";
    merged.profil.rekeningUtama = `${mainBank} No. ${mainNo} a.n ${mainAn}`;

    const infaqBank = merged.profil.rekeningInfaqBank || "";
    const infaqNo = merged.profil.rekeningInfaqNo || "";
    const infaqAn = merged.profil.rekeningInfaqAn || "";
    merged.profil.rekeningInfaq = `${infaqBank} No. ${infaqNo} a.n ${infaqAn}`;

    return merged;
  } catch (err) {
    console.error("Gagal membaca pengaturan sistem dari storage:", err);
    return {
      ...DEFAULT_SETTINGS,
      profil: {
        ...DEFAULT_SETTINGS.profil,
        rekeningUtama: `${DEFAULT_SETTINGS.profil.rekeningUtamaBank} No. ${DEFAULT_SETTINGS.profil.rekeningUtamaNo} a.n ${DEFAULT_SETTINGS.profil.rekeningUtamaAn}`,
        rekeningInfaq: `${DEFAULT_SETTINGS.profil.rekeningInfaqBank} No. ${DEFAULT_SETTINGS.profil.rekeningInfaqNo} a.n ${DEFAULT_SETTINGS.profil.rekeningInfaqAn}`,
      }
    };
  }
}

/**
 * Menyimpan pembaruan pengaturan sistem
 */
export function saveSettings(newSettings) {
  try {
    const current = getSettings();
    const merged = {
      ...current,
      ...newSettings,
      profil: { ...current.profil, ...(newSettings.profil || {}) },
      zakat: { ...current.zakat, ...(newSettings.zakat || {}) },
      kategori: { ...current.kategori, ...(newSettings.kategori || {}) },
      privasi: { ...current.privasi, ...(newSettings.privasi || {}) },
      umum: { ...current.umum, ...(newSettings.umum || {}) },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Kirim custom event agar komponen/halaman lain (seperti HitungZakatPage) bisa live-update
    window.dispatchEvent(new CustomEvent("upz_settings_updated", { detail: merged }));
    return { success: true, message: "Pengaturan sistem berhasil disimpan!" };
  } catch (err) {
    console.error("Gagal menyimpan pengaturan sistem:", err);
    throw new Error("Gagal menyimpan ke penyimpanan lokal.");
  }
}

/**
 * Mengembalikan pengaturan ke default awal
 */
export function resetSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  window.dispatchEvent(new CustomEvent("upz_settings_updated", { detail: DEFAULT_SETTINGS }));
  return DEFAULT_SETTINGS;
}

/**
 * Export backup data aplikasi dalam format JSON
 */
export function exportBackupData() {
  const settings = getSettings();
  const backupObj = {
    exportedAt: new Date().toISOString(),
    version: "1.0.0",
    settings,
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute(
    "download",
    `backup-upz-unsil-${new Date().toISOString().split("T")[0]}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import / Restore data backup dari file JSON
 */
export function importBackupData(jsonContent) {
  try {
    const parsed = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
    const settingsToRestore = parsed.settings || parsed;

    if (!settingsToRestore || typeof settingsToRestore !== "object") {
      throw new Error("Format berkas backup JSON tidak valid.");
    }

    return saveSettings(settingsToRestore);
  } catch (err) {
    console.error("Gagal melakukan restore data backup:", err);
    throw new Error(err.message || "File JSON backup tidak dapat dibaca.");
  }
}

/**
 * React Hook untuk mendengarkan perubahan pengaturan sistem secara realtime
 */
export function useSettings() {
  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    function handleUpdate(e) {
      if (e?.detail) {
        setSettings(e.detail);
      } else {
        setSettings(getSettings());
      }
    }
    window.addEventListener("upz_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("upz_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (settings?.profil?.namaSingkat || settings?.profil?.namaLembaga) {
      const brand = settings.profil.namaSingkat || "UPZ Unsil";
      const full = settings.profil.namaLembaga || "Unit Pengumpul Zakat Universitas Siliwangi";
      document.title = `${brand} - ${full}`;
    }
  }, [settings]);

  return settings;
}
