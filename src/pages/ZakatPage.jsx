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
  X,
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

// ======================================================
// ICON METODE PEMBAYARAN
// ======================================================
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
    metodePembayaran[0]?.id || ""
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
  // POPUP QRIS
  // ======================================================

  const [showQris, setShowQris] = useState(false);

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
  // PILIH METODE PEMBAYARAN
  // ======================================================

  function handlePilihMetode(id) {
    setMetodeId(id);

    if (id === "qris") {
      setShowQris(true);
    } else {
      setShowQris(false);
    }
  }

  // ======================================================
  // SUBMIT ZAKAT
  // ======================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nominal || nominal < 10000) {
      setErrorMsg("Minimal pembayaran zakat Rp10.000.");
      return;
    }

    if (!jenisTerpilih) {
      setErrorMsg("Silakan pilih jenis zakat.");
      return;
    }

    if (!metodeId) {
      setErrorMsg("Silakan pilih metode pembayaran.");
      return;
    }

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

        <div className="mx-auto max-w-lg px-6 py-20 text-center">

          {/* ICON SUKSES */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Terima kasih
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            Pembayaran zakat Anda telah berhasil dibuat.
            Silakan ikuti instruksi pembayaran berikutnya.
          </p>

          <Card className="text-left">

            {/* ID TRANSAKSI */}
            <div className="mb-3 flex justify-between gap-4 text-sm">

              <span className="text-gray-500">
                ID Transaksi
              </span>

              <span className="text-right font-medium text-gray-900">
                {hasil?.kode || hasil?.id || "-"}
              </span>

            </div>

            {/* JENIS ZAKAT */}
            <div className="mb-3 flex justify-between gap-4 text-sm">

              <span className="text-gray-500">
                Jenis Zakat
              </span>

              <span className="text-right font-medium text-gray-900">
                {jenisTerpilih?.nama || "-"}
              </span>

            </div>

            {/* NOMINAL */}
            <div className="mb-3 flex justify-between gap-4 text-sm">

              <span className="text-gray-500">
                Nominal
              </span>

              <span className="text-right font-semibold text-brand-700">
                {formatRupiah(nominal)}
              </span>

            </div>

            {/* METODE */}
            <div className="flex justify-between gap-4 text-sm">

              <span className="text-gray-500">
                Metode
              </span>

              <span className="text-right font-medium text-gray-900">
                {metodePembayaran.find(
                  (m) => m.id === metodeId
                )?.nama || "-"}
              </span>

            </div>

            {/* TRANSFER BANK */}
            {metodeId === "transfer-bank" && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">

                <div>

                  <p className="text-xs text-gray-500">
                    Rekening Tujuan
                  </p>

                  <p className="font-mono text-xs font-semibold text-gray-900 sm:text-sm">
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
                  className="p-2 text-brand-600 transition hover:text-brand-700"
                  title="Salin nomor rekening"
                >
                  <Copy size={18} />
                </button>

              </div>
            )}

            {/* QRIS DI HASIL TRANSAKSI */}
            {metodeId === "qris" && (
              <div className="mt-5 border-t border-gray-100 pt-5 text-center">

                <p className="text-sm font-semibold text-brand-700">
                  Pembayaran QRIS
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Scan QR berikut menggunakan aplikasi pembayaran
                  Anda.
                </p>

                <div className="mt-4 flex justify-center">

                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">

                    <img
                      src="/dummy-qris.png"
                      alt="QRIS"
                      className="h-56 w-56 object-contain"
                    />

                  </div>

                </div>

                <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3">

                  <p className="text-xs text-gray-500">
                    Total Zakat
                  </p>

                  <p className="mt-1 text-lg font-bold text-brand-700">
                    {formatRupiah(nominal)}
                  </p>

                </div>

              </div>
            )}

          </Card>

          {/* WHATSAPP */}
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Phone size={16} />
              Konfirmasi via WhatsApp
            </a>
          )}

          {/* ZAKAT LAIN */}
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              setStatus("idle");
              setHasil(null);
              setShowQris(false);
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

        <div className="mx-auto max-w-7xl px-6 py-12 text-center lg:py-14">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
            <Calculator size={14} />
            Tunaikan Zakat
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight lg:text-4xl">
            Tunaikan Zakat
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
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
        className="mx-auto w-full max-w-7xl space-y-5 px-6 py-12"
      >

        {/* ==================================================
            JENIS ZAKAT
        ================================================== */}

        <Card>

          <h2 className="mb-4 font-semibold text-gray-900">
            Pilih Jenis Zakat
          </h2>

          <div className="space-y-3">

            {JENIS_ZAKAT.map((j) => (

              <button
                type="button"
                key={j.id}
                onClick={() => setJenisId(j.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  jenisId === j.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300"
                }`}
              >

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      jenisId === j.id
                        ? "bg-white text-brand-600"
                        : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    <Heart size={17} />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-brand-600">
                      {j.kategori}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {j.nama}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
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

          <h2 className="mb-4 font-semibold text-gray-900">
            Nominal Zakat
          </h2>

          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

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

          <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

          </div>

          <p className="mt-2 text-xs text-gray-400">
            Minimal pembayaran Rp10.000
          </p>

        </Card>

        {/* ==================================================
            DATA DIRI
        ================================================== */}

        <Card>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="font-semibold text-gray-900">
              Data Muzakki
            </h2>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                checked={anonim}
                onChange={(e) =>
                  setAnonim(e.target.checked)
                }
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />

              Tampilkan sebagai Hamba Allah (anonim)

            </label>

          </div>

          {!anonim && (

            <div className="grid gap-4 sm:grid-cols-2">

              {/* NAMA */}

              <div className="sm:col-span-2">

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                </div>

              </div>

              {/* TELEPON */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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

          <h2 className="mb-4 font-semibold text-gray-900">
            Metode Pembayaran
          </h2>

          <div className="space-y-2.5">

            {metodePembayaran.map((m) => {

              const Icon = METODE_ICON[m.id];

              return (

                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors ${
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
                      handlePilihMetode(m.id)
                    }
                    className="text-brand-600"
                    required
                  />

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white text-brand-600">

                    {Icon ? (
                      <Icon size={18} />
                    ) : (
                      <WalletIcon />
                    )}

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
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">

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
              !jenisTerpilih ||
              !metodeId
            }
            className="w-full"
          >
            {status === "loading"
              ? "Memproses..."
              : "Tunaikan Zakat"}
          </Button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Transaksi aman dan dikelola secara amanah dan
            transparan.
          </p>

        </Card>

      </form>

      {/* =====================================================
          POPUP QRIS
      ====================================================== */}

      {showQris && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowQris(false)}
        >

          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setShowQris(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Tutup popup QRIS"
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <QrCode size={25} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                Pembayaran QRIS
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Scan QR berikut menggunakan aplikasi pembayaran
                Anda.
              </p>

            </div>

            {/* QR */}
            <div className="mt-6 flex justify-center">

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <img
                  src="/dummy-qris.png"
                  alt="QRIS"
                  className="h-64 w-64 object-contain"
                />

              </div>

            </div>

            {/* NOMINAL */}
            <div className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-center">

              <p className="text-xs text-gray-500">
                Total Zakat
              </p>

              <p className="mt-1 text-lg font-bold text-brand-700">
                {formatRupiah(nominal)}
              </p>

            </div>

            {/* TUTUP */}
            <button
              type="button"
              onClick={() => setShowQris(false)}
              className="mt-5 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

// =========================================================
// FALLBACK ICON
// =========================================================

function WalletIcon() {
  return <WalletCardsIcon />;
}

function WalletCardsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h5" />
      <path d="M7 16h3" />
    </svg>
  );
}