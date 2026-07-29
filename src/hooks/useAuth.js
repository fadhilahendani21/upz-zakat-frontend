import { useState, useEffect } from "react";
import { getToken } from "../services/authService";

/**
 * Hook sederhana buat cek status login.
 * Nanti bisa dikembangin pakai Context kalau butuh state auth global.
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
}
