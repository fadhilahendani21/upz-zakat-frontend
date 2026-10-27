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
  if (!res.ok) throw new Error(json?.message ?? "Terjadi kesalahan.");
  return json;
}

export const getProgram = ({
  search = "",
  status = "",
  tahun = "",
  page = 1,
  perPage = 10,
} = {}) => {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (tahun)  params.append("tahun", tahun);
  return request("GET", `/program?${params}`);
};

export const createProgram = (data) => request("POST", "/program", data);
export const updateProgram  = (id, data) => request("PUT", `/program/${id}`, data);
export const deleteProgram  = (id) => request("DELETE", `/program/${id}`);
export const getProgramOptions = (tahun = "") => {
  const params = new URLSearchParams();
  if (tahun) params.append("tahun", tahun);
  return request("GET", `/program/options?${params}`);
};

export const getPublicPrograms = () => {
  if (!API_URL) return Promise.resolve({ data: [] });
  return fetch(`${API_URL}/public/program`, {
    headers: { Accept: "application/json" },
  }).then((res) => (res.ok ? res.json() : { data: [] }));
};

export const getPublicProgramDetail = async (idOrSlug) => {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/public/program/${encodeURIComponent(idOrSlug)}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      return json?.data ?? null;
    }
  } catch (err) {
    console.warn("Gagal fetch detail program dari endpoint individual:", err);
  }

  // Fallback: Jika endpoint individual gagal, cari dari list publik program berdasarkan slug atau id
  try {
    const listRes = await getPublicPrograms();
    const cleanParam = String(idOrSlug).toLowerCase();
    const found = listRes?.data?.find(
      (p) =>
        String(p.slug) === cleanParam ||
        String(p.id) === cleanParam ||
        (p.nama &&
          p.nama
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") === cleanParam)
    );
    return found ?? null;
  } catch {
    return null;
  }
};
