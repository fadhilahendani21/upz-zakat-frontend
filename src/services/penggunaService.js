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

// ─── Manajemen Pengguna (CRUD) — Khusus Administrator ────────────────────────

const DUMMY_USERS = [
  {
    id: 1,
    name: "Admin UPZ",
    email: "admin@upz-unsil.ac.id",
    role: "administrator",
    created_at: "2025-01-15T08:00:00.000000Z",
  },
  {
    id: 2,
    name: "Operator Amil 1",
    email: "operator1@upz-unsil.ac.id",
    role: "operator",
    created_at: "2025-02-10T09:30:00.000000Z",
  },
  {
    id: 3,
    name: "Staf Penyaluran",
    email: "staf.penyaluran@upz-unsil.ac.id",
    role: "operator",
    created_at: "2025-03-01T11:15:00.000000Z",
  },
];

/**
 * GET /api/users
 */
export async function getAllUsers({ search = "", role = "", page = 1, perPage = 10 } = {}) {
  if (!API_URL) {
    let filtered = [...DUMMY_USERS];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }
    return {
      data: filtered,
      meta: {
        current_page: page,
        last_page: 1,
        per_page: perPage,
        total: filtered.length,
        total_admin: DUMMY_USERS.filter((u) => u.role === "administrator").length,
        total_operator: DUMMY_USERS.filter((u) => u.role === "operator").length,
      },
    };
  }

  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.append("search", search);
  if (role) params.append("role", role);

  const res = await fetch(`${API_URL}/users?${params}`, { headers: authHeaders() });
  handle401(res);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil daftar pengguna.");
  return data;
}

/**
 * POST /api/users
 */
export async function createUser({ name, email, password, role }) {
  if (!API_URL) {
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: role || "operator",
      created_at: new Date().toISOString(),
    };
    DUMMY_USERS.unshift(newUser);
    return { message: "Pengguna berhasil ditambahkan (Mode Demo).", data: newUser };
  }

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, role }),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.errors ? Object.values(data.errors).flat().join(" ") : data?.message || "Gagal menambah pengguna.";
    throw new Error(msg);
  }
  return data;
}

/**
 * PUT /api/users/{id}
 */
export async function updateUser(id, { name, email, password, role }) {
  if (!API_URL) {
    const idx = DUMMY_USERS.findIndex((u) => u.id === Number(id));
    if (idx !== -1) {
      DUMMY_USERS[idx] = { ...DUMMY_USERS[idx], name, email, role };
    }
    return { message: "Data pengguna berhasil diperbarui (Mode Demo)." };
  }

  const payload = { name, email, role };
  if (password) payload.password = password;

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.errors ? Object.values(data.errors).flat().join(" ") : data?.message || "Gagal memperbarui pengguna.";
    throw new Error(msg);
  }
  return data;
}

/**
 * DELETE /api/users/{id}
 */
export async function deleteUser(id) {
  if (!API_URL) {
    const idx = DUMMY_USERS.findIndex((u) => u.id === Number(id));
    if (idx !== -1) DUMMY_USERS.splice(idx, 1);
    return { message: "Pengguna berhasil dihapus (Mode Demo)." };
  }

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  handle401(res);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus pengguna.");
  return data;
}
