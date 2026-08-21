/**
 * penggunaService.js
 * API call untuk profil admin & manajemen akun.
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

/**
 * GET /api/auth/me
 */
export async function getProfile() {
  const localUser = JSON.parse(localStorage.getItem("user") ?? "{}");

  if (!API_URL) {
    return {
      name: localUser.name || "Administrator UPZ",
      email: localUser.email || "admin@unsil.ac.id",
      role: localUser.role || "administrator",
      created_at: "2025-01-15T08:00:00.000000Z",
    };
  }

  const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders() });
  handle401(res);
  if (!res.ok) throw new Error("Gagal mengambil data profil.");
  return res.json();
}

/**
 * PUT /api/auth/profile
 */
export async function updateProfile({ name, email }) {
  if (!API_URL) {
    const user = { name, email, role: "administrator" };
    localStorage.setItem("user", JSON.stringify(user));
    return { message: "Profil berhasil diperbarui (Mode Demo).", user };
  }

  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, email }),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.errors?.email?.[0] || data?.errors?.name?.[0] || data?.message || "Gagal memperbarui profil.";
    throw new Error(errorMsg);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
}

/**
 * PUT /api/auth/password
 */
export async function updatePassword({ current_password, new_password, new_password_confirmation }) {
  if (!API_URL) {
    if (new_password !== new_password_confirmation) {
      throw new Error("Konfirmasi password baru tidak cocok.");
    }
    return { message: "Password berhasil diubah (Mode Demo)." };
  }

  const res = await fetch(`${API_URL}/auth/password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      current_password,
      new_password,
      new_password_confirmation,
    }),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    const errorMsg =
      data?.errors?.current_password?.[0] ||
      data?.errors?.new_password?.[0] ||
      data?.message ||
      "Gagal mengubah password.";
    throw new Error(errorMsg);
  }
  return data;
}
