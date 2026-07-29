// const API_URL = import.meta.env.VITE_API_URL;

/**
 * Login admin
 * TODO (BE): implementasikan endpoint POST /api/auth/login
 * Body yang dikirim: { email, password }
 * Response yang diharapkan: { token, user: { name, role } }
 */
export async function login(email, password) {
  // const res = await fetch(`${API_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, password }),
  // });
  // return await res.json();

  // dummy sementara, anggap selalu berhasil
  return Promise.resolve({
    token: "dummy-token-123",
    user: { name: "Admin UPZ", role: "administrator" },
  });
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
