import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FloatingLeaves from "../components/common/FloatingLeaves";
import { login, getToken } from "../services/authService";
import { useSettings } from "../services/settingService";

export default function LoginPage() {
  const navigate = useNavigate();
  const settings = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user)); // ← simpan user + role
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
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

      <Card
        className="w-full max-w-sm relative z-10 bg-white/75 backdrop-blur-md"
        style={{ animation: "fadeInUp 0.6s ease-out" }}
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <ShieldCheck size={22} />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">
          Masuk Admin {settings?.profil?.namaSingkat || "UPZ"}
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {settings?.profil?.namaLembaga || "UPZ Zakat Universitas Siliwangi"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:scale-[1.02] focus:border-brand-400"
              placeholder="Masukkan email"
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
      </Card>
    </div>
  );
}