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

const METODE_ICON = {
  "transfer-bank": Landmark,
  qris: QrCode,
  "e-wallet": Smartphone,
};

// ======================================================
// KHUSUS DONASI: INFAK & SEDEKAH
// ======================================================
const JENIS_DONASI = dummyJenisDonasi.filter(
  (j) => j.id === "infak" || j.id === "sedekah"
);

export default function DonasiPage() {
  const location = useLocation();
  const settings = useSettings();

  // ======================================================
  // STATE
  // ======================================================

  const [jenisId, setJenisId] = useState(
    location.state?.jenisId || JENIS_DONASI[0]?.id
  );

  const [nominal, setNominal] = useState(
    location.state?.nominal || 100000
  );

  const [nominalCustom, setNominalCustom] = useState(
    location.state?.nominal
      ? String(location.state.nominal)
      : ""
  );

  const [metodeId, setMetodeId] = useState(
    metodePembayaran[0]?.id || ""
  );

  const [anonim, setAnonim] = useState(
    settings?.privasi?.defaultAnonimPublik || false
  );

  const [data, setData] = useState({
    nama: "",
    email: "",
    telepon: "",
  });

  const [status, setStatus] = useState("idle");
  const [hasil, setHasil] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // POPUP QRIS
  const [showQris, setShowQris] = useState(false);

  // ======================================================
  // JENIS DONASI TERPILIH
  // ======================================================

  const jenisTerpilih = JENIS_DONASI.find(
    (j) => j.id === jenisId
  );

  // ======================================================
  // NOMINAL CEPAT
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

    // QRIS langsung buka popup
    if (id === "qris") {
      setShowQris(true);
    } else {
      setShowQris(false);
    }
  }

  // ======================================================
  // SUBMIT DONASI
  // ======================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nominal || nominal < 10000) return;

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
          "Terjadi kesalahan saat memproses donasi. Silakan coba lagi."
      );

      setStatus("idle");
    }
  }

  // ======================================================
  // HALAMAN SUKSES
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
            Terima kasih atas donasi Anda
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            Selesaikan pembayaran dengan mengikuti instruksi
            yang tersedia. Konfirmasi akan dilakukan setelah
            pembayaran berhasil diverifikasi.
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

            {/* JENIS */}
            <div className="mb-3 flex justify-between gap-4 text-sm">
              <span className="text-gray-500">
                Jenis
              </span>

              <span className="text-right font-medium text-gray-900">
                {jenisTerpilih?.nama}
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
                {
                  metodePembayaran.find(
                    (m) => m.id === metodeId
                  )?.nama
                }
              </span>
            </div>

            {/* =================================================
                DETAIL TRANSFER BANK
            ================================================== */}
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
                  className="p-2 text-brand-600 hover:text-brand-700"
                  title="Salin nomor rekening"
                >
                  <Copy size={18} />
                </button>

              </div>
            )}

            {/* =================================================
                DETAIL QRIS
            ================================================== */}
            {metodeId === "qris" && (
              <div className="mt-5 border-t border-gray-100 pt-5 text-center">

                <p className="text-sm font-semibold text-brand-700">
                  Pembayaran QRIS
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Scan QR berikut menggunakan aplikasi pembayaran
                  yang mendukung QRIS.
                </p>

                <div className="mt-4 flex justify-center">

                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

                    <img
                      src="/dummy-qris.png"
                      alt="QRIS"
                      className="h-56 w-56 object-contain"
                    />

                  </div>

                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Silakan selesaikan pembayaran sesuai nominal donasi.
                </p>

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
                `Assalamu'alaikum, saya ingin konfirmasi donasi sebesar ${formatRupiah(
                  nominal
                )} untuk ${
                  jenisTerpilih?.nama || "Infaq/Sedekah"
                }. Kode transaksi: ${
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

          {/* DONASI LAIN */}
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              setStatus("idle");
              setHasil(null);
              setShowQris(false);
            }}
          >
            Buat Donasi Lain
          </Button>

        </div>
      </div>
    );
  }

  // ======================================================
  // FORM DONASI
  // ======================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">

      {/* =================================================
          HEADER
      ================================================== */}

      <section className="w-full bg-brand-700 text-white">

        <div className="mx-auto max-w-5xl px-6 py-12 text-center lg:py-14">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
            <Heart size={14} />
            Donasi Sekarang
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight lg:text-4xl">
            Donasi Infaq & Sedekah
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
            Salurkan infaq dan sedekah Anda dengan mudah,
            aman, dan tepat sasaran untuk membantu masyarakat
            yang membutuhkan.
          </p>

        </div>

      </section>

      {/* =================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-7xl space-y-5 px-6 py-12"
      >

        {/* =================================================
            JENIS DONASI
        ================================================== */}

        <Card>

          <h2 className="mb-4 font-semibold text-gray-900">
            Pilih Jenis Donasi
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">

            {JENIS_DONASI.map((j) => (
              <button
                type="button"
                key={j.id}
                onClick={() => setJenisId(j.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  jenisId === j.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300"
                }`}
              >

                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-600">
                  {j.kategori}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {j.nama}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {j.deskripsi}
                </p>

              </button>
            ))}

          </div>

        </Card>

        {/* =================================================
            NOMINAL
        ================================================== */}

        <Card>

          <h2 className="mb-4 font-semibold text-gray-900">
            Nominal Donasi
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
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

          </div>

          <p className="mt-2 text-xs text-gray-400">
            Minimal donasi Rp10.000
          </p>

        </Card>

        {/* =================================================
            DATA DIRI
        ================================================== */}

        <Card>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="font-semibold text-gray-900">
              Data Diri
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

              Donasi sebagai Hamba Allah (anonim)

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
                    placeholder="Nama Anda"
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

        {/* =================================================
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
                  />

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white text-brand-600">

                    {Icon && <Icon size={18} />}

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

        {/* =================================================
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
              Total donasi
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
              : "Lanjutkan Pembayaran"}
          </Button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Transaksi aman dan diawasi sesuai prinsip syariah.
          </p>

        </Card>

      </form>

      {/* =====================================================
          POPUP QRIS
      ====================================================== */}

      {showQris && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

          {/* MODAL */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

            {/* TOMBOL CLOSE */}
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

            {/* QR IMAGE */}
            <div className="mt-6 flex justify-center">

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <img
                  src="/dummy-qris.png"
                  alt="QRIS"
                  className="h-64 w-64 object-contain"
                />

              </div>

            </div>

            {/* INFO NOMINAL */}
            <div className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-center">

              <p className="text-xs text-gray-500">
                Total Donasi
              </p>

              <p className="mt-1 text-lg font-bold text-brand-700">
                {formatRupiah(nominal)}
              </p>

            </div>

            {/* TOMBOL TUTUP */}
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