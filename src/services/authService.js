/**
 * authService.js
 *
 * Strategi yang sama dengan dashboardService:
 *  - Tidak ada VITE_API_URL → login dummy (terima email/password apapun)
 *  - Ada VITE_API_URL → login ke API real, kalau gagal → error ditampilkan ke user
 */

const API_URL = import.meta.env.VITE_API_URL;
const USE_DUMMY = !API_URL;

// Kredensial demo yang diterima saat mode dummy
const DEMO_EMAIL = "admin@unsil.ac.id";

/**
 * Login admin
 * POST /api/auth/login
 */
export async function login(email, password) {
  // Mode demo: tidak perlu backend, terima email apapun
  if (USE_DUMMY) {
    console.info(
      "%c[UPZ Auth] Mode Demo — login diterima tanpa validasi backend.",
      "color: #f59e0b; font-weight: bold;"
    );
    return {
      token: "demo-token",
      user: { name: email.split("@")[0] ?? "Demo User", role: "administrator" },
    };
  }

  // Mode real: kirim ke API
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.errors?.email?.[0] ??
      data?.message ??
      "Login gagal. Periksa email dan password Anda.";
    throw new Error(message);
  }

  return data; // { token, user: { name, role } }
}

/**
 * Logout (hapus token dari server jika bukan mode demo)
 */
export async function logout() {
  const token = localStorage.getItem("token");

  if (!USE_DUMMY && token && token !== "demo-token") {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {}); // ignore error, tetap hapus lokal
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null");
  } catch {
    return null;
  }
}

/** True kalau sedang berjalan tanpa backend (mode demo) */
export function isDemoMode() {
  return USE_DUMMY;
}
