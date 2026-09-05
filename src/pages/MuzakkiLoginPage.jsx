import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FloatingLeaves from "../components/common/FloatingLeaves";

export default function MuzakkiLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("muzakki_token");
    if (token) {
      navigate("/muzakki/dashboard", { replace: true });
    }
  }, [navigate]);

  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/muzakki/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Email atau password salah.");
      }

      // Check if this is first login
      if (result.user.is_first_login) {
        localStorage.setItem("muzakki_temp_user", JSON.stringify({
          name: result.user.name,
          nip: result.user.nip,
          faculty: result.muzakki?.unit_kerja?.split('·')[0]?.trim() || "N/A",
          study_program: result.muzakki?.unit_kerja?.split('·')[1]?.trim() || "N/A",
          email: result.user.email,
          phone: result.user.no_hp,
          role: result.user.role
        }));
        localStorage.setItem("muzakki_token", result.token);
        setShowFirstLoginModal(true);
        setLoading(false);
        return;
      }

      // Normal login flow (not first login)
      localStorage.setItem("muzakki_token", result.token);
      localStorage.setItem("muzakki_user", JSON.stringify({
        name: result.user.name,
        nip: result.user.nip,
        faculty: result.muzakki?.unit_kerja?.split('·')[0]?.trim() || "N/A",
        study_program: result.muzakki?.unit_kerja?.split('·')[1]?.trim() || "N/A",
        email: result.user.email,
        phone: result.user.no_hp,
        role: result.user.role
      }));
      navigate("/muzakki/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      if (!showFirstLoginModal) setLoading(false);
    }
  }

  const handleSetPassword = async () => {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Password dan konfirmasi tidak cocok.");
      return;
    }
    
    try {
      const token = localStorage.getItem("muzakki_token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/muzakki/set-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah password.");
      }

      // Success: proceed to dashboard
      const tempUser = JSON.parse(localStorage.getItem("muzakki_temp_user") || "{}");
      localStorage.setItem("muzakki_user", JSON.stringify(tempUser));
      localStorage.removeItem("muzakki_temp_user");
      setShowFirstLoginModal(false);
      setLoading(false);
      navigate("/muzakki/dashboard");
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-white via-brand-50 to-brand-200 flex items-center justify-center px-6 relative overflow-hidden">
        <FloatingLeaves />

        {/* Back to Home Button */}
        <Link
          to="/"
          className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200 z-50"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </Link>

        <Card className="w-full max-w-sm relative z-10 bg-white/75 backdrop-blur-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">
            Masuk sebagai Muzakki
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Akses dashboard zakat Anda
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email / Nomor HP
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:scale-[1.02] focus:border-brand-400"
                placeholder="Masukkan email atau nomor HP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:scale-[1.02] focus:border-brand-400"
                placeholder="Masukkan password"
              />
            </div>
            <Button
              type="submit"
              className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-500">
            Belum punya akun?{" "}
            <a href="/daftar-muzakki" className="text-brand-600 hover:underline">
              Daftar sebagai Muzakki
            </a>
          </p>
        </Card>
      </div>

      {/* First Login Modal - Set Password */}
      {showFirstLoginModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 text-center">
              🔐 Buat Password Baru
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1">
              Ini adalah login pertama Anda. Silakan buat password baru untuk keamanan akun Anda.
            </p>
            {passwordError && (
              <div className="mt-3 p-2 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {passwordError}
              </div>
            )}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Ulangi password"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowFirstLoginModal(false);
                  setLoading(false);
                  // Proceed without setting password (skip for now)
                  const tempUser = JSON.parse(localStorage.getItem("muzakki_temp_user") || "{}");
                  localStorage.setItem("muzakki_token", "mock-token");
                  localStorage.setItem("muzakki_user", JSON.stringify(tempUser));
                  localStorage.removeItem("muzakki_temp_user");
                  navigate("/muzakki/dashboard");
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleSetPassword}
                className="flex-1 py-2.5 rounded-xl bg-[#08734f] text-sm font-semibold text-white hover:bg-[#065d40] transition"
              >
                Buat Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}