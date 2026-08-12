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
