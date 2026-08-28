/**
 * notificationService.js
 * Manajemen notifikasi sistem, transaksi, dan donasi online untuk Dashboard UPZ Unsil.
 */

import { getAllDashboardData } from "./dashboardService";

const STORAGE_KEY_READ = "upz_read_notif_ids";
const STORAGE_KEY_CUSTOM = "upz_custom_notifications";

// Notifikasi bawaan / default
const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-sys-1",
    type: "pengumpulan",
    icon: "💰",
    title: "Penerimaan Zakat Baru",
    desc: "Zakat Penghasilan Rp 1.500.000 berhasil dicatat di sistem.",
    time: "10 menit lalu",
    timestamp: Date.now() - 10 * 60 * 1000,
    targetUrl: "/dashboard/pengumpulan",
    actionLabel: "Lihat Pengumpulan",
  },
  {
    id: "notif-sys-2",
    type: "donasi",
    icon: "🌐",
    title: "Donasi Online Masuk",
    desc: "Terdapat donasi online baru dari muzakki yang menunggu verifikasi.",
    time: "35 menit lalu",
    timestamp: Date.now() - 35 * 60 * 1000,
    targetUrl: "/dashboard/donasi-online",
    actionLabel: "Verifikasi Donasi",
  },
  {
    id: "notif-sys-3",
    type: "penyaluran",
    icon: "📤",
    title: "Penyaluran Sembako & Beasiswa",
    desc: "Penyaluran dana bantuan kepada 5 mustahik Asnaf Fakir & Miskin berhasil.",
    time: "2 jam lalu",
    timestamp: Date.now() - 2 * 3600 * 1000,
    targetUrl: "/dashboard/penyaluran",
    actionLabel: "Lihat Penyaluran",
  },
  {
    id: "notif-sys-4",
    type: "mustahik",
    icon: "👥",
    title: "Pembaruan Data Mustahik",
    desc: "Kategori Asnaf dan data mustahik aktif telah disinkronkan.",
    time: "1 hari lalu",
    timestamp: Date.now() - 24 * 3600 * 1000,
    targetUrl: "/dashboard/mustahik",
    actionLabel: "Buka Data Mustahik",
  },
  {
    id: "notif-sys-5",
    type: "sistem",
    icon: "🛡️",
    title: "Pengingat Cadangan Data",
    desc: "Lakukan export backup data JSON secara berkala di Pengaturan Sistem.",
    time: "2 hari lalu",
    timestamp: Date.now() - 48 * 3600 * 1000,
    targetUrl: "/dashboard/pengaturan",
    actionLabel: "Pengaturan Sistem",
  },
];

function getReadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(ids));
  } catch (err) {
    console.error("Gagal menyimpan read ids notifikasi:", err);
  }
}

function getCustomNotifs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomNotifs(notifs) {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(notifs));
  } catch (err) {
    console.error("Gagal menyimpan custom notifikasi:", err);
  }
}

function emitUpdate() {
  window.dispatchEvent(new CustomEvent("upz_notifs_updated"));
}

/**
 * Mengambil semua notifikasi yang digabung (transaksi dinamis + default)
 */
export async function getNotifications() {
  const readIds = getReadIds();
  const custom = getCustomNotifs();

  let dynamicNotifs = [];

  try {
    const dash = await getAllDashboardData().catch(() => null);
    if (dash?.transaksi && Array.isArray(dash.transaksi)) {
      dynamicNotifs = dash.transaksi.slice(0, 3).map((trx, idx) => {
        const isMasuk = trx.jenis === "masuk";
        const id = `trx-notif-${trx.kode || idx}`;
        return {
          id,
          type: isMasuk ? "pengumpulan" : "penyaluran",
          icon: isMasuk ? "💰" : "📤",
          title: isMasuk ? "Transaksi Pengumpulan" : "Transaksi Penyaluran",
          desc: `${trx.kategori || "Zakat"} sebesar Rp ${(trx.nominal || 0).toLocaleString("id-ID")}`,
          time: trx.tanggal || "Baru saja",
          timestamp: Date.now() - (idx + 1) * 15 * 60 * 1000,
          targetUrl: isMasuk ? "/dashboard/pengumpulan" : "/dashboard/penyaluran",
          actionLabel: isMasuk ? "Lihat Pengumpulan" : "Lihat Penyaluran",
        };
      });
    }
  } catch {
    // Ignore error, fallback to defaults
  }

  // Gabungkan semua tanpa duplikasi ID
  const allMap = new Map();
  [...custom, ...dynamicNotifs, ...DEFAULT_NOTIFICATIONS].forEach((item) => {
    if (!allMap.has(item.id)) {
      allMap.set(item.id, {
        ...item,
        unread: !readIds.includes(item.id),
      });
    }
  });

  return Array.from(allMap.values());
}

/**
 * Tandai satu notifikasi sebagai telah dibaca
 */
export function markNotificationAsRead(id) {
  const readIds = getReadIds();
  if (!readIds.includes(id)) {
    readIds.push(id);
    saveReadIds(readIds);
    emitUpdate();
  }
}

/**
 * Tandai semua notifikasi sebagai telah dibaca
 */
export async function markAllNotificationsAsRead() {
  const notifs = await getNotifications();
  const allIds = notifs.map((n) => n.id);
  saveReadIds(allIds);
  emitUpdate();
}

/**
 * Hapus / bersihkan semua riwayat notifikasi
 */
export function clearAllNotifications() {
  localStorage.removeItem(STORAGE_KEY_CUSTOM);
  saveReadIds(DEFAULT_NOTIFICATIONS.map((n) => n.id));
  emitUpdate();
}

/**
 * Tambah notifikasi baru secara programatik (misal saat transaksi sukses dibuat)
 */
export function addNotification(notif) {
  const custom = getCustomNotifs();
  const newNotif = {
    id: notif.id || `notif-user-${Date.now()}`,
    type: notif.type || "sistem",
    icon: notif.icon || "🔔",
    title: notif.title || "Pemberitahuan Sistem",
    desc: notif.desc || "",
    time: "Baru saja",
    timestamp: Date.now(),
    targetUrl: notif.targetUrl || "/dashboard",
    actionLabel: notif.actionLabel || "Buka",
  };
  custom.unshift(newNotif);
  saveCustomNotifs(custom.slice(0, 30)); // batas maksimal 30
  emitUpdate();
}
