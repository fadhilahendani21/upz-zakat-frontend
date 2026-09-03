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
  FolderHeart,
  X,
  Search,
  AlertCircle,
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
import { getPublicPrograms } from "../services/programService";
import { getPublicMuzakki } from "../services/muzakkiService";
import { useSettings } from "../services/settingService";

const METODE_ICON = {
  "transfer-bank": Landmark,
  qris: QrCode,
  "e-wallet": Smartphone,
};

// ======================================================
// 3 PILIHAN DONASI UTAMA
// ======================================================
const JENIS_DONASI = [
  {
    id: "infak",
    kategori: "INFAK",
    nama: "Infak",
    deskripsi: "Pemberian sukarela tanpa batasan nisab untuk mendukung operasional dan program umum UPZ.",
  },
  {
    id: "sedekah",
    kategori: "SEDEKAH",
    nama: "Sedekah",
    deskripsi: "Pemberian sukarela dalam bentuk apa pun sebagai wujud kepedulian dan kebaikan umum.",
  },
  {
    id: "program",
    kategori: "PROGRAM",
    nama: "Donasi by Program",
    deskripsi: "Salurkan donasi Anda secara spesifik untuk program penyaluran pilihan Anda.",
  },
];

export default function DonasiPage() {
  const location = useLocation();
  const settings = useSettings();

  const searchParams = new URLSearchParams(location.search);
  const initialProgramId = location.state?.programId || searchParams.get("program") || "";

  // ======================================================
  // STATE
  // ======================================================

  const [programsList, setProgramsList] = useState([]);
  const [programId, setProgramId] = useState(initialProgramId);

  const [jenisId, setJenisId] = useState(
    initialProgramId ? "program" : (location.state?.jenisId || "infak")
  );

  const [nominal, setNominal] = useState(
    location.state?.nominal || 100000
  );

  const [nominalCustom, setNominalCustom] = useState(
      location.state?.nominal
        ? Number(location.state.nominal).toLocaleString("id-ID")
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
  // FITUR CARI DATA MUZAKKI (UNTUK DONASI)
  // ======================================================
  const [muzakkiList, setMuzakkiList] = useState([]);
  const [selectedMuzakki, setSelectedMuzakki] = useState(null);
  const [modeDataDiri, setModeDataDiri] = useState("cari"); // "manual" atau "cari"
  const [nipNikCari, setNipNikCari] = useState("");
  const [noHpCari, setNoHpCari] = useState("");
  const [cariMuzakkiError, setCariMuzakkiError] = useState("");

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await getPublicPrograms();
        if (res?.data && res.data.length > 0) {
          setProgramsList(res.data);
          // Jika sudah mode program tapi belum ada program terpilih, pilih yang pertama
          if (initialProgramId) {
            setProgramId(String(initialProgramId));
          }
        }
      } catch (err) {
        console.error("Gagal memuat program:", err);
      }
    }
    loadPrograms();
  }, []);

  // Load muzakki list untuk fitur Cari Data
  useEffect(() => {
    async function loadMuzakki() {
      try {
        const res = await getPublicMuzakki();
        if (res && res.data) {
          setMuzakkiList(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat muzakki:", err);
      }
    }
    loadMuzakki();
  }, []);

  // Update programId if route/state changes
  useEffect(() => {
    const qProg = searchParams.get("program") || location.state?.programId;
    if (qProg) {
      setJenisId("program");
      setProgramId(String(qProg));
    }
  }, [location.search, location.state]);

  // ======================================================
  // JENIS & PROGRAM DONASI TERPILIH
  // ======================================================

  const jenisTerpilih = JENIS_DONASI.find(
    (j) => j.id === jenisId
  );

  const programTerpilih = programsList.find(
    (p) => String(p.id) === String(programId)
  );

  // ======================================================
  // GANTI JENIS DONASI
  // ======================================================

  function handlePilihJenis(id) {
    setJenisId(id);
    if (id === "program") {
      if (!programId && programsList.length > 0) {
        setProgramId(String(programsList[0].id));
      }
    } else {
      setProgramId("");
    }
  }

  // ======================================================
  // NOMINAL CEPAT
  // ======================================================

  function handlePilihNominal(value) {
    setNominal(value);
    setNominalCustom("");
  }

  function handleNominalCustomChange(e) {
      // Get only digits from input
      const raw = e.target.value.replace(/[^0-9]/g, "");

      // Format with Indonesian thousand separator for display
      const formatted = raw ? Number(raw).toLocaleString("id-ID") : "";

      setNominalCustom(formatted);
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
  // CARI DATA MUZAKKI
  // ======================================================
  
  // State untuk mode pencarian
  const [searchMode, setSearchMode] = useState("nip"); // "nip" atau "hp"
  
  const handleCariMuzakki = () => {
    setCariMuzakkiError("");
    
    if (searchMode === "nip") {
      const cleanNipNik = nipNikCari.replace(/\D/g, "").trim();
      
      if (!cleanNipNik) {
        setCariMuzakkiError("Harap isi NIP/NIK untuk mencari data muzakki.");
        return;
      }

      // Cari muzakki berdasarkan NIP/NIK
      const found = muzakkiList.find((m) => {
        return (m.nip && m.nip.replace(/\D/g, "") === cleanNipNik) || 
               (m.nik && m.nik.replace(/\D/g, "") === cleanNipNik);
      });

      if (found) {
        setSelectedMuzakki(found);
        setData({
          nama: found.nama || "",
          email: found.email || "",
          telepon: found.no_hp || "",
        });
        setCariMuzakkiError("");
      } else {
        setCariMuzakkiError(`Data muzakki dengan NIP/NIK "${nipNikCari}" tidak ditemukan.`);
        setSelectedMuzakki(null);
      }
    } else {
      const cleanNoHp = noHpCari.replace(/\D/g, "").trim();
      
      if (!cleanNoHp) {
        setCariMuzakkiError("Harap isi Nomor HP untuk mencari data muzakki.");
        return;
      }

      // Cari muzakki berdasarkan No HP
      const found = muzakkiList.find((m) => {
        return m.no_hp && m.no_hp.replace(/\D/g, "") === cleanNoHp;
      });

      if (found) {
        setSelectedMuzakki(found);
        setData({
          nama: found.nama || "",
          email: found.email || "",
          telepon: found.no_hp || "",
        });
        setCariMuzakkiError("");
      } else {
        setCariMuzakkiError(`Data muzakki dengan Nomor HP "${noHpCari}" tidak ditemukan.`);
        setSelectedMuzakki(null);
      }
    }
  };

  const handleResetCariMuzakki = () => {
    setNipNikCari("");
    setNoHpCari("");
    setCariMuzakkiError("");
    setSelectedMuzakki(null);
    setData({ nama: "", email: "", telepon: "" });
    setModeDataDiri("cari");
  };

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

  // ======================================================
  // RESET FORM LENGKAP
  // ======================================================
  function handleResetFormComplete() {
    setJenisId("infak");
    setProgramId("");
    setNominal(100000);
    setNominalCustom("");
    setMetodeId(metodePembayaran[0]?.id || "");
    setAnonim(settings?.privasi?.defaultAnonimPublik || false);
    setData({
      nama: "",
      email: "",
      telepon: "",
    });
    setStatus("idle");
    setHasil(null);
    setErrorMsg("");
    setShowQris(false);
    setSelectedMuzakki(null);
    setModeDataDiri("cari");
    setNipNikCari("");
    setNoHpCari("");
    setCariMuzakkiError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ======================================================
  // SUBMIT HANDLER
  // ======================================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Scroll ke atas saat submit
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!nominal || nominal < 10000) return;

    if (!metodeId) {
      setErrorMsg("Silakan pilih metode pembayaran.");
      return;
    }

    const isProgram = jenisId === "program";

    if (isProgram && !programId) {
      setErrorMsg("Silakan pilih program penyaluran yang ingin didukung.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        kategori: isProgram ? (programTerpilih?.nama || "Donasi Program") : jenisTerpilih?.nama,
        nominal,
        metode: metodeId,
        anonim,
        program_id: isProgram && programId ? Number(programId) : null,
        muzakki_id: selectedMuzakki ? selectedMuzakki.id : null,

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
                Jenis Donasi
              </span>

              <span className="text-right font-medium text-gray-900">
                {jenisTerpilih?.nama}
              </span>
            </div>

            {/* PROGRAM (JIKA ADA) */}
            {jenisId === "program" && (hasil?.program_nama || programTerpilih?.nama) && (
              <div className="mb-3 flex justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Tujuan Program
                </span>

                <span className="text-right font-semibold text-brand-700">
                  {hasil?.program_nama || programTerpilih?.nama}
                </span>
              </div>
            )}

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
                }${
                  jenisId === "program" && (hasil?.program_nama || programTerpilih?.nama)
                    ? ` (Program ${hasil?.program_nama || programTerpilih?.nama})`
                    : ""
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
            onClick={handleResetFormComplete}
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
            Salurkan infaq, sedekah, maupun donasi program Anda dengan mudah,
            aman, dan tepat sasaran untuk membantu masyarakat yang membutuhkan.
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
            DATA DIRI / CARI DATA MUZAKKI (PALING ATAS)
        ================================================== */}

        <Card>

          <div className="mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">
              Data Diri
            </h2>

            {/* Switch/Toggle Mode: Manual vs Cari Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setModeDataDiri("cari");
                  setData({ nama: "", email: "", telepon: "" });
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold transition ${
                  modeDataDiri === "cari"
                    ? "bg-white text-[#08734f] shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Search size={17} className={modeDataDiri === "cari" ? "text-[#08734f]" : "text-slate-400"} />
                <span>Cari Data Muzakki</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setModeDataDiri("manual");
                  setSelectedMuzakki(null);
                  setCariMuzakkiError("");
                }}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold transition ${
                  modeDataDiri === "manual"
                    ? "bg-white text-[#08734f] shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User size={17} className={modeDataDiri === "manual" ? "text-[#08734f]" : "text-slate-400"} />
                <span>Isi Manual</span>
              </button>
            </div>
          </div>

          {/* MODE: CARI DATA MUZAKKI */}
          {modeDataDiri === "cari" && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 mb-2">
                <Search size={16} />
                Cari Data Muzakki Terdaftar
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Jika Anda sudah terdaftar sebagai Muzakki, pilih metode pencarian dan masukkan data untuk mengisi form otomatis.
              </p>

              {/* SWITCH MODE PENCARIAN */}
              <div className="mb-3 flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Cari dengan:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchMode("nip")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      searchMode === "nip"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    NIP / NIK
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode("hp")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      searchMode === "hp"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Nomor HP
                  </button>
                </div>
              </div>

              {/* INPUT FIELD - CONDITIONAL BASED ON searchMode */}
              <div className="mb-3">
                {searchMode === "nip" ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIP / NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nipNikCari}
                      onChange={(e) => setNipNikCari(e.target.value)}
                      placeholder="Contoh: 198501302012121009 atau 3278..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nomor HP / WA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noHpCari}
                      onChange={(e) => setNoHpCari(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleCariMuzakki}
                  className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <Search size={16} />
                  Cari Data
                </button>
                <button
                  type="button"
                  onClick={handleResetCariMuzakki}
                  className="h-10 px-4 rounded-xl border border-slate-300 bg-white text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Reset
                </button>
              </div>

              {cariMuzakkiError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{cariMuzakkiError}</span>
                </div>
              )}

              {selectedMuzakki && (
                <>
                  <div className="mt-3 flex items-center justify-between gap-2.5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs text-emerald-900 shadow-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span>
                        Muzakki Terdaftar: <strong>{selectedMuzakki.nama}</strong> ({selectedMuzakki.kategori})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetCariMuzakki}
                      className="text-[11px] font-semibold text-emerald-700 underline hover:text-emerald-900"
                    >
                      Ganti Muzakki
                    </button>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={anonim}
                        onChange={(e) => setAnonim(e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Tampilkan sebagai Hamba Allah (anonim)
                    </label>
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Data diri Anda sudah tercatat dari profil muzakki terdaftar. 
                      Centang opsi di atas jika ingin nama Anda ditampilkan sebagai "Hamba Allah" 
                      dalam laporan publik (ID tetap tercatat untuk tagihan).
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* MODE: ISI MANUAL - Form Data Diri */}
          {modeDataDiri === "manual" && !selectedMuzakki && (
            <div className="grid gap-4 sm:grid-cols-2 mb-4">

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
                    required={!anonim}
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
                    value={data.email}
                    onChange={handleDataChange}
                    placeholder="nama@email.com (untuk kwitansi & laporan)"
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                </div>

              </div>

              {/* TELEPON */}
              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  No. WhatsApp / HP
                </label>

                <div className="relative">

                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="telepon"
                    value={data.telepon}
                    onChange={handleDataChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                </div>

              </div>

            </div>
          )}

          {/* CHECKBOX HAMBA ALLAH - HANYA MUNCUL DI MODE ISI MANUAL */}
          {modeDataDiri === "manual" && (
            <div className="pt-4 border-t border-gray-100">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={anonim}
                  onChange={(e) => setAnonim(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Donasi sebagai Hamba Allah (anonim)
              </label>
            </div>
          )}

        </Card>

        {/* =================================================
            JENIS DONASI (3 PILIHAN)
        ================================================== */}

        <Card>

          <h2 className="mb-4 font-semibold text-gray-900">
            Pilih Jenis Donasi
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">

            {JENIS_DONASI.map((j) => (
              <button
                type="button"
                key={j.id}
                onClick={() => handlePilihJenis(j.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  jenisId === j.id
                    ? "border-brand-600 bg-brand-50 shadow-xs ring-1 ring-brand-500/20"
                    : "border-gray-200 hover:border-brand-300 hover:bg-gray-50/50"
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
            PILIHAN PROGRAM (HANYA MUNCUL JIKA OPSI PROGRAM DIPILIH)
        ================================================== */}

        {jenisId === "program" && (
          <Card className="animate-fadeIn border-brand-200 bg-brand-50/20">

            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Pilih Program Penyaluran
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pilih salah satu program penyaluran yang ingin Anda dukung secara langsung.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <FolderHeart size={16} />
              </div>
            </div>

            {programsList.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                Memuat daftar program...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3.5 mt-4">
                {programsList.map((prog) => {
                  const isSelected = String(programId) === String(prog.id);
                  const collected = prog.nominal_terkumpul || 0;
                  const target = prog.target_nominal || 1;
                  const percent = Math.min(100, Math.round((collected / target) * 100));

                  return (
                    <button
                      type="button"
                      key={prog.id}
                      onClick={() => setProgramId(String(prog.id))}
                      className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-brand-600 bg-white shadow-md ring-2 ring-brand-500/25"
                          : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-brand-600 text-white"
                              : "bg-brand-50 text-brand-700 border border-brand-100"
                          }`}>
                            Program {prog.tahun || ""}
                          </span>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? "border-brand-600 bg-brand-600" : "border-gray-300 bg-white"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          {prog.nama}
                        </h3>

                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {prog.deskripsi || "Program penyaluran UPZ Unsil."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                        <span className="text-[11px] text-gray-500 block mb-1.5 text-left">
                          Terkumpul:{" "}
                          <strong className="text-brand-700 font-semibold">
                            {formatRupiah(collected)}
                          </strong>
                        </span>
                        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">
                            Donatur: {prog.jumlah_donatur || 0}
                          </span>
                          <span className="text-gray-400">
                            Target: {formatRupiah(target)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </Card>
        )}



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