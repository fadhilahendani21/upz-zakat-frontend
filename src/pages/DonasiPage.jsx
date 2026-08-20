import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Heart,
  Landmark,
  QrCode,
  Smartphone,
  CheckCircle2,
  Copy,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  dummyJenisDonasi,
  nominalCepat,
  metodePembayaran,
} from "../data/dummyDonasi";
import { formatRupiah } from "../utils/formatRupiah";
import { submitDonasi } from "../services/donasiService";

const METODE_ICON = {
  "transfer-bank": Landmark,
  qris: QrCode,
  "e-wallet": Smartphone,
};

export default function DonasiPage() {
  const location = useLocation();
  const [jenisId, setJenisId] = useState(
    location.state?.jenisId || dummyJenisDonasi[0].id
  );
  const [nominal, setNominal] = useState(location.state?.nominal || 100000);
  const [nominalCustom, setNominalCustom] = useState(
    location.state?.nominal ? String(location.state.nominal) : ""
  );
  const [metodeId, setMetodeId] = useState(metodePembayaran[0].id);
  const [anonim, setAnonim] = useState(false);
  const [data, setData] = useState({ nama: "", email: "", telepon: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [hasil, setHasil] = useState(null);

  const jenisTerpilih = dummyJenisDonasi.find((j) => j.id === jenisId);

  function pilihNominalCepat(value) {
    setNominal(value);
    setNominalCustom("");
  }

  function handleNominalCustomChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setNominalCustom(raw);
    setNominal(raw ? Number(raw) : 0);
  }

  function handleDataChange(e) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nominal || nominal < 10000) return;

    setStatus("loading");
    try {
      const payload = {
        kategori: jenisTerpilih.nama,
        nominal,
        metode: metodeId,
        anonim: anonim,
        ...(anonim ? {} : {
          nama_donatur: data.nama,
          email: data.email,
          telepon: data.telepon,
        }),
      };
      const res = await submitDonasi(payload);
      setHasil(res);
      setStatus("success");
    } catch (err) {
      alert(err.message ?? "Terjadi kesalahan. Silakan coba lagi.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Terima kasih atas donasi Anda
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Selesaikan pembayaran dengan mengikuti instruksi di bawah. Konfirmasi
          otomatis setelah pembayaran berhasil diverifikasi.
        </p>

        <Card className="text-left">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">ID Transaksi</span>
            <span className="font-medium text-gray-900">{hasil?.kode}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Jenis</span>
            <span className="font-medium text-gray-900">
              {jenisTerpilih.nama}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Nominal</span>
            <span className="font-semibold text-brand-700">
              {formatRupiah(nominal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Metode</span>
            <span className="font-medium text-gray-900">
              {metodePembayaran.find((m) => m.id === metodeId)?.nama}
            </span>
          </div>

          {metodeId === "transfer-bank" && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Nomor Virtual Account</p>
                <p className="font-mono font-semibold text-gray-900">
                  8808 1234 5678 9012
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText("880812345678902")
                }
                className="text-brand-600 hover:text-brand-700"
                aria-label="Salin nomor virtual account"
              >
                <Copy size={18} />
              </button>
            </div>
          )}
        </Card>

        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => setStatus("idle")}
        >
          Buat Donasi Lain
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full">
          <Heart size={14} /> Donasi Sekarang
        </span>
        <h1 className="mt-5 text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
          Tunaikan Zakat, Infak & Sedekah
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Salurkan zakat, infak, dan sedekah Anda dengan mudah, aman, dan
          tersalurkan tepat sasaran kepada mustahik yang membutuhkan.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-6 pb-16 space-y-5"
      >
        {/* Pilih Jenis */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Pilih Jenis</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {dummyJenisDonasi.map((j) => (
              <button
                type="button"
                key={j.id}
                onClick={() => setJenisId(j.id)}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  jenisId === j.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300"
                }`}
              >
                <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wide">
                  {j.kategori}
                </p>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">
                  {j.nama}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {j.deskripsi}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Nominal */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">
            Nominal Donasi
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {nominalCepat.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => pilihNominalCepat(n)}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  nominal === n && !nominalCustom
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-gray-200 text-gray-700 hover:border-brand-300"
                }`}
              >
                {formatRupiah(n)}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Atau masukkan nominal lain
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={nominalCustom}
              onChange={handleNominalCustomChange}
              placeholder="100.000"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Data Diri */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Data Diri</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={anonim}
                onChange={(e) => setAnonim(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              Donasi sebagai hamba Allah (anonim)
            </label>
          </div>

          {!anonim && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="nama"
                    required
                    value={data.nama}
                    onChange={handleDataChange}
                    placeholder="Nama Anda"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={data.email}
                    onChange={handleDataChange}
                    placeholder="nama@email.com"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  No. Telepon
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="telepon"
                    required
                    value={data.telepon}
                    onChange={handleDataChange}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Metode Pembayaran */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">
            Metode Pembayaran
          </h2>
          <div className="space-y-2.5">
            {metodePembayaran.map((m) => {
              const Icon = METODE_ICON[m.id];
              return (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                    metodeId === m.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="metode"
                    value={m.id}
                    checked={metodeId === m.id}
                    onChange={() => setMetodeId(m.id)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-brand-600 shrink-0">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-gray-900">
                      {m.nama}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {m.keterangan}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </Card>

        {/* Ringkasan & Submit */}
        <Card className="sticky bottom-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total donasi</span>
            <span className="text-xl font-bold text-brand-700">
              {formatRupiah(nominal)}
            </span>
          </div>
          <Button
            type="submit"
            icon={Heart}
            disabled={status === "loading" || !nominal}
            className="w-full"
          >
            {status === "loading" ? "Memproses..." : "Lanjutkan Pembayaran"}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Transaksi aman dan diawasi sesuai prinsip syariah.
          </p>
        </Card>
      </form>
    </div>
  );
}