/**
 * UserContext.jsx
 * Shared context untuk data user yang sudah login.
 * Menghindari duplicate getProfile() API calls di Sidebar + Topbar.
 * Profile API hanya dipanggil SEKALI saat DashboardLayout mount.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUser } from "../services/authService";
import { getProfile } from "../services/penggunaService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Baca dari localStorage dulu (instan, tidak perlu network)
  const [user, setUser] = useState(() => getUser());

  // Sekali saja saat mount: refresh dari API
  useEffect(() => {
    let cancelled = false;
    async function refreshUser() {
      try {
        const fresh = await getProfile();
        if (cancelled) return;
        const existing = getUser() || {};
        const updated = { ...existing, ...fresh };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
      } catch {
        // Abaikan error, tetap gunakan data localStorage
      }
    }
    refreshUser();
    return () => { cancelled = true; };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await getProfile();
      const existing = getUser() || {};
      const updated = { ...existing, ...fresh };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    } catch { /* silent */ }
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    // Fallback jika dipanggil di luar provider
    return { user: getUser(), refreshUser: () => {} };
  }
  return ctx;
}
