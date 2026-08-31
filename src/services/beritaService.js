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

export const getBerita = ({
  search = "",
  kategori = "",
  status = "",
  page = 1,
  perPage = 10,
} = {}) => {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.append("search", search);
  if (kategori) params.append("kategori", kategori);
  if (status) params.append("status", status);
  return request("GET", `/berita?${params}`);
};

export const getBeritaById = (id) => request("GET", `/berita/${id}`);
export const createBerita = (data) => request("POST", "/berita", data);
export const updateBerita = (id, data) => request("PUT", `/berita/${id}`, data);
export const deleteBerita = (id) => request("DELETE", `/berita/${id}`);

export const uploadBeritaImage = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/berita/upload-image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/masuk";
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Gagal mengunggah gambar.");
  return json;
};

export const getPublicBerita = ({
  search = "",
  kategori = "",
  page = 1,
  perPage = 9,
} = {}) => {
  if (!API_URL) return Promise.resolve({ data: [], meta: {} });
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.append("search", search);
  if (kategori) params.append("kategori", kategori);
  return fetch(`${API_URL}/public/berita?${params}`, {
    headers: { Accept: "application/json" },
  }).then((res) => (res.ok ? res.json() : { data: [], meta: {} }));
};

export const getPublicBeritaDetail = (idOrSlug) => {
  if (!API_URL) return Promise.resolve({ data: null });
  return fetch(`${API_URL}/public/berita/${idOrSlug}`, {
    headers: { Accept: "application/json" },
  }).then((res) => (res.ok ? res.json() : { data: null }));
};

