/**
 * agreementService.js
 * Layanan untuk fitur perubahan kesepakatan zakat.
 * - Publik: muzakki ajukan perubahan
 * - Admin: lihat, approve, tolak permintaan
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json.message ??
      Object.values(json.errors ?? {}).flat().join(", ") ??
      "Terjadi kesalahan.";
    throw new Error(msg);
  }
  return json;
}

/**
 * POST /api/public/zakat-request
 * Muzakki ajukan perubahan kesepakatan zakat.
 * @param {object} payload - { muzakki_id, alasan, perubahan_diajukan: [...] }
 */
export async function ajukanPerubahanKesepakatan(payload) {
  if (!API_URL) {
    // Demo mode
    return Promise.resolve({
      message: "Permohonan perubahan kesepakatan zakat berhasil diajukan (demo).",
      request_id: `DEMO-${Date.now()}`,
    });
  }
  const res = await fetch(`${API_URL}/public/zakat-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * GET /api/zakat-requests  (PROTECTED)
 * Admin: daftar semua permintaan.
 * @param {'pending'|'disetujui'|'ditolak'|'all'} status
 */
export async function getAgreementRequests({ status = "pending", page = 1, perPage = 15 } = {}) {
  const params = new URLSearchParams({ status, page, per_page: perPage });
  const res = await fetch(`${API_URL}/zakat-requests?${params}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * GET /api/zakat-requests/pending-count  (PROTECTED)
 * Badge counter untuk notifikasi admin.
 */
export async function getPendingRequestCount() {
  if (!API_URL) return { count: 0 };
  try {
    const res = await fetch(`${API_URL}/zakat-requests/pending-count`, {
      headers: authHeaders(),
    });
    if (!res.ok) return { count: 0 };
    return res.json();
  } catch {
    return { count: 0 };
  }
}

/**
 * PATCH /api/zakat-requests/{id}/approve  (PROTECTED)
 * Admin setujui request.
 */
export async function approveRequest(id, catatanAdmin = "") {
  const res = await fetch(`${API_URL}/zakat-requests/${id}/approve`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ catatan_admin: catatanAdmin }),
  });
  return handleResponse(res);
}

/**
 * PATCH /api/zakat-requests/{id}/reject  (PROTECTED)
 * Admin tolak request.
 */
export async function rejectRequest(id, catatanAdmin = "") {
  const res = await fetch(`${API_URL}/zakat-requests/${id}/reject`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ catatan_admin: catatanAdmin }),
  });
  return handleResponse(res);
}
