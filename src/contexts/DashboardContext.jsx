import { createContext, useContext, useState, useCallback } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState({
    stats: null,
    ringkasanDana: [],
    grafik: [],
    transaksi: [],
    program: [],
    user: null,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(false);

  const setDashboardData = useCallback((newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const clearDashboard = useCallback(() => {
    setData({
      stats: null,
      ringkasanDana: [],
      grafik: [],
      transaksi: [],
      program: [],
      user: null,
      pendingRequests: 0,
    });
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, setLoading, setDashboardData, clearDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}