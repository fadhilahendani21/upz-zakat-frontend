import { useState, useEffect } from "react";
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
  Calculator,
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
import { useSettings } from "../services/settingService";

const METODE_ICON = {
  "transfer-bank": Landmark,
  qris: QrCode,
  "e-wallet": Smartphone,
};

// ======================================================
// KHUSUS ZAKAT
// ======================================================
const JENIS_ZAKAT = dummyJenisDonasi.filter(
  (j) =>
    j.id === "zakat-penghasilan" ||
    j.id === "zakat-maal" ||
    j.id === "zakat-fitrah"
);

export default function ZakatPage() {
  const location = useLocation();
  const settings = useSettings();

  // ======================================================
  // DATA DARI HALAMAN HITUNG ZAKAT
  // ======================================================

  const stateDariPerhitungan = location.state;

  const nominalDariPerhitungan =
    stateDariPerhitungan?.nominal || null;

  const jenisIdDariPerhitungan =
    stateDariPerhitungan?.jenisId || null;

  // ======================================================
  // JENIS ZAKAT
  // ======================================================

  const [jenisId, setJenisId] = useState(
    jenisIdDariPerhitungan || JENIS_ZAKAT[0]?.id
  );

  // ======================================================
  // NOMINAL
  // ======================================================

  const [nominal, setNominal] = useState(
    nominalDariPerhitungan || 100000
  );

  const [nominalCustom, setNominalCustom] = useState(
    nominalDariPerhitungan
      ? String(nominalDariPerhitungan)
      : ""
  );

  // ======================================================
  // METODE PEMBAYARAN
  // ======================================================

  const [metodeId, setMetodeId] = useState(
    metodePembayaran[0].id
  );

  // ======================================================
  // ANONIM
  // ======================================================

  const [anonim, setAnonim] = useState(
    settings?.privasi?.defaultAnonimPublik || false
  );

  // ======================================================
  // DATA DIRI
  // ======================================================

  const [data, setData] = useState({
    nama: "",
    email: "",
    telepon: "",
  });

  // ======================================================
  // STATUS
  // ======================================================

  const [status, setStatus] = useState("idle");
  const [hasil, setHasil] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ======================================================
  // SINKRONISASI DARI HALAMAN HITUNG ZAKAT
  // ======================================================

  useEffect(() => {
    if (location.state?.jenisId) {
      setJenisId(location.state.jenisId);
    }

    if (location.state?.nominal) {
      setNominal(location.state.nominal);
      setNominalCustom(String(location.state.nominal));
    }
  }, [location.state]);

  // ======================================================
  // JENIS TERPILIH
  // ======================================================

  const jenisTerpilih = JENIS_ZAKAT.find(
    (j) => j.id === jenisId
  );

  // ======================================================
  // NOMINAL
  // ======================================================

  function handlePilihNominal(value) {
    setNominal(value);
    setNominalCustom("");
  }

  function handleNominalCustomChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");

    setNominalCustom(raw);
    setNominal(raw ? Number(raw) : 0);
  }

  // ======================================================
  // DATA DIRI
  // ======================================================

  function handleDataChange(e) {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // ======================================================
  // SUBMIT ZAKAT
  // ======================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nominal || nominal < 10000) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        kategori: jenisTerpilih.nama,
        nominal,
        metode: metodeId,
        anonim,

        ...(anonim
          ? {}
          : {
              nama_donatur: data.nama,
              email: data.email,
              telepon: data.telepon,
            }),
      };

      const res = await submitDonasi(payload);

      setHasil(res);
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err.message ||
          "Terjadi kesalahan saat memproses pembayaran zakat. Silakan coba lagi."
      );

      setStatus("idle");
    }
  }

  // ======================================================
  // SUCCESS
  // ======================================================

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

        <div className="max-w-lg mx-auto px-6 py-20 text-center">

          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Terima kasih
          </h1>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Pembayaran zakat Anda telah berhasil dibuat.
            Silakan ikuti instruksi pembayaran berikutnya.
          </p>

          <Card className="text-left">

            <div className="flex justify-between text-sm mb-3 gap-4">
              <span className="text-gray-500">
                ID Transaksi
              </span>

              <span className="font-medium text-gray-900 text-right">
                {hasil?.kode || hasil?.id || "-"}
              </span>
            </div>

            <div className="flex justify-between text-sm mb-3 gap-4">
              <span className="text-gray-500">
                Jenis Zakat
              </span>

              <span className="font-medium text-gray-900 text-right">
                {jenisTerpilih?.nama}
              </span>
            </div>

            <div className="flex justify-between text-sm mb-3 gap-4">
              <span className="text-gray-500">
                Nominal
              </span>

              <span className="font-semibold text-brand-700 text-right">
                {formatRupiah(nominal)}
              </span>
            </div>

            <div className="flex justify-between text-sm gap-4">
              <span className="text-gray-500">
                Metode
              </span>

              <span className="font-medium text-gray-900 text-right">
                {
                  metodePembayaran.find(
                    (m) => m.id === metodeId
                  )?.nama
                }
              </span>
            </div>

            {metodeId === "transfer-bank" && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">

                <div>
                  <p className="text-xs text-gray-500">
                    Rekening Tujuan
                  </p>

                  <p className="font-mono font-semibold text-gray-900 text-xs sm:text-sm">
                    {settings?.profil?.rekeningUtama ||
                      "BSI 7123456789 a.n UPZ Unsil"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      settings?.profil?.rekeningUtamaNo ||
                        "7123456789"
                    )
                  }
                  className="text-brand-600 hover:text-brand-700 p-2"
                  title="Salin nomor rekening"
                >
                  <Copy size={18} />
                </button>

              </div>
            )}

          </Card>

          {settings?.profil?.whatsapp && (
            <a
              href={`https://wa.me/${settings.profil.whatsapp.replace(
                /[^0-9]/g,
                ""
              )}?text=${encodeURIComponent(
                `Assalamu'alaikum, saya ingin konfirmasi pembayaran ${jenisTerpilih?.nama} sebesar ${formatRupiah(
                  nominal
                )}. Kode transaksi: ${
                  hasil?.kode || hasil?.id || "-"
                }.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Phone size={16} />
              Konfirmasi via WhatsApp
            </a>
          )}

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              setStatus("idle");
              setHasil(null);
            }}
          >
            Tunaikan Zakat Lain
          </Button>

        </div>

      </div>
    );
  }

  // ======================================================
  // FORM
  // ======================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14 text-center">

          <span className="inline-flex items-center gap-2 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full">
            <Calculator size={14} />
            Tunaikan Zakat
          </span>

          <h1 className="mt-5 text-3xl lg:text-4xl font-extrabold leading-tight">
            Tunaikan Zakat
          </h1>

          <p className="mt-4 text-green-50 leading-relaxed max-w-2xl mx-auto text-sm sm:text-base">
            Tunaikan zakat Anda melalui UPZ Zakat Universitas
            Siliwangi dengan mudah, aman, dan terpercaya.
          </p>

        </div>

      </section>

      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl mx-auto px-6 py-12 space-y-5"
      >

        {/* ==================================================
            JENIS ZAKAT
        ================================================== */}

        <Card>

          <h2 className="font-semibold text-gray-900 mb-4">
            Pilih Jenis Zakat
          </h2>

          <div className="space-y-3">

            {JENIS_ZAKAT.map((j) => (

              <button
                type="button"
                key={j.id}
                onClick={() => setJenisId(j.id)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${
                  jenisId === j.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300"
                }`}
              >

                <div className="flex items-start gap-3">

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      jenisId === j.id
                        ? "bg-white text-brand-600"
                        : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    <Heart size={17} />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wide">
                      {j.kategori}
                    </p>

                    <p className="font-semibold text-gray-900 text-sm mt-1">
                      {j.nama}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {j.deskripsi}
                    </p>

                  </div>

                </div>

              </button>

            ))}

          </div>

        </Card>

        {/* ==================================================
            NOMINAL
        ================================================== */}

        <Card>

          <h2 className="font-semibold text-gray-900 mb-4">
            Nominal Zakat
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">

            {nominalCepat.map((n) => (

              <button
                type="button"
                key={n}
                onClick={() => handlePilihNominal(n)}
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
            Atau masukkan nominal zakat
          </label>

          <div className="relative">

            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              Rp
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={
                nominalCustom
                  ? Number(nominalCustom).toLocaleString("id-ID")
                  : ""
              }
              onChange={handleNominalCustomChange}
              placeholder="100.000"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />

          </div>

          <p className="text-xs text-gray-400 mt-2">
            Minimal pembayaran Rp10.000
          </p>

        </Card>

        {/* ==================================================
            DATA DIRI
        ================================================== */}

        <Card>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

            <h2 className="font-semibold text-gray-900">
              Data Muzakki
            </h2>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

              <input
                type="checkbox"
                checked={anonim}
                onChange={(e) =>
                  setAnonim(e.target.checked)
                }
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />

              Tampilkan sebagai hamba Allah (anonim)

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
                    placeholder="Nama lengkap"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                </div>

              </div>

            </div>

          )}

        </Card>

        {/* ==================================================
            METODE PEMBAYARAN
        ================================================== */}

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
                  className={`flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer ${
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
                    onChange={() =>
                      setMetodeId(m.id)
                    }
                    className="text-brand-600"
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

        {/* ==================================================
            RINGKASAN
        ================================================== */}

        <Card>

          {errorMsg && (

            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>

          )}

          <div className="flex items-center justify-between mb-4">

            <span className="text-sm text-gray-500">
              Total zakat
            </span>

            <span className="text-xl font-bold text-brand-700">
              {formatRupiah(nominal)}
            </span>

          </div>

          <Button
            type="submit"
            icon={Heart}
            disabled={
              status === "loading" ||
              !nominal ||
              nominal < 10000 ||
              !jenisTerpilih
            }
            className="w-full"
          >
            {status === "loading"
              ? "Memproses..."
              : "Tunaikan Zakat"}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Transaksi aman dan dikelola secara amanah dan
            transparan.
          </p>

        </Card>

      </form>

    </div>
  );
}