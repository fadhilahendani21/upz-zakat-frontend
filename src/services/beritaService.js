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

  if (json?.url && typeof json.url === "string") {
    if (json.url.startsWith("http://") && !json.url.includes("localhost") && !json.url.includes("127.0.0.1")) {
      json.url = json.url.replace(/^http:\/\//, "https://");
    }
  }

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

/**
 * Normalizes and resolves image URL for display:
 * - Handles relative storage paths (/storage/..., storage/...)
 * - Upgrades insecure http:// to https:// for remote domains
 * - Preserves data URIs, blob URLs, and full external URLs
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  let trimmed = url.trim();
  if (!trimmed) return null;

  // Blob and data URLs
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return trimmed;

  // Fix mixed content: upgrade http:// to https:// for remote/cloud hosts
  if (trimmed.startsWith("http://") && !trimmed.includes("localhost") && !trimmed.includes("127.0.0.1")) {
    trimmed = trimmed.replace(/^http:\/\//, "https://");
  }

  // Extract base backend url (e.g. http://localhost:8000/api -> http://localhost:8000)
  const backendBaseUrl = (API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

  // If it contains a /storage/ path (relative or full URL from any host)
  if (trimmed.includes("/storage/")) {
    const storageIndex = trimmed.indexOf("/storage/");
    const storagePath = trimmed.substring(storageIndex);
    return `${backendBaseUrl}${storagePath}`;
  }

  // If it's a relative api storage path (e.g. /api/storage/... or api/storage/...)
  if (trimmed.startsWith("/api/storage/") || trimmed.startsWith("api/storage/")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${backendBaseUrl}${cleanPath}`;
  }

  return trimmed;
}

/**
 * Compresses an image file in the browser and converts it to a base64 Data URL.
 * Produces lightweight WebP/JPEG (~30-60 KB) that can be saved directly and permanently in the DB.
 */
export function fileToDataUrl(file, maxWidth = 1200, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
