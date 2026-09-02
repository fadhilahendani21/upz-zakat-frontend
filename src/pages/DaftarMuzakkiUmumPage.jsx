import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  ShieldCheck,
  Building2,
  Calculator,
  X,
  UserPlus,
  Users,
  CheckCircle2,
  Loader2,
  WalletCards,
  Landmark,
  ScanLine,
  Sprout,
  ClipboardCheck,
  Check,
  Smartphone,
  LockKeyhole,
  Clock3,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Heart,
} from "lucide-react";

import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";
import { registerPublicMuzakki, getPublicMuzakki } from "../services/muzakkiService";

export default function DaftarMuzakkiUmumPage() {
  // =========================================================
  // STATE MUZAKKI TERDAFTAR (UNTUK VALIDASI NIK DUPLIKAT)
  // =========================================================
  const [registeredMuzakkiList, setRegisteredMuzakkiList] = useState([]);

  useEffect(() => {
    fetchExistingMuzakki();
  }, []);

  // Fungsi untuk fetch data muzakki terdaftar
  const fetchExistingMuzakki = async () => {
    try {
      const res = await getPublicMuzakki();
      if (res && res.data) {
        setRegisteredMuzakkiList(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat data muzakki:", err);
    }
  };

  // =========================================================
  // STATE DATA DIRI
  // =========================================================

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "",
    tanggal_lahir: "",
    pekerjaan: "",
    alamat_lengkap: "",
    email: "",
    no_hp: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setFormError("");
  };

  // =========================================================
  // STATE MULTI-KESEPAKATAN ZAKAT
  // =========================================================

  const [zakatSelections, setZakatSelections] = useState({
    penghasilan: {
      selected: true,
      frekuensi: "bulanan", // "bulanan" | "tahunan"
      nominal: "250000",
    },
    maal: {
      selected: false,
      frekuensi: "tahunan", // "tahunan"
      nominal: "1500000",
    },
    fitrah: {
      selected: false,
      frekuensi: "ramadan", // "ramadan"
      jumlahJiwa: "3",
      nominalPerJiwa: "45000",
      nominal: "135000",
    },
  });

  const toggleZakat = (key) => {
    setZakatSelections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        selected: !prev[key].selected,
      },
    }));
    setFormError("");
  };

  const updateZakatField = (key, field, value) => {
    setZakatSelections((prev) => {
      const updated = { ...prev[key], [field]: value };
      if (key === "fitrah" && (field === "jumlahJiwa" || field === "nominalPerJiwa")) {
        const jiwa = Number(String(field === "jumlahJiwa" ? value : updated.jumlahJiwa).replace(/\D/g, "") || 1);
        const perJiwa = Number(String(field === "nominalPerJiwa" ? value : updated.nominalPerJiwa).replace(/\D/g, "") || 45000);
        updated.nominal = String(jiwa * perJiwa);
      }
      return { ...prev, [key]: updated };
    });
    setFormError("");
  };

  // =========================================================
  // PREFERENSI PENYALURAN (TRANSFER BANK, E-WALLET, DAN QRIS)
  // =========================================================

  const [metodePenyaluran, setMetodePenyaluran] = useState("transfer-bank"); // "transfer-bank" | "e-wallet" | "qris"
  const [pilihanBank, setPilihanBank] = useState("BSI");
  const [pilihanEwallet, setPilihanEwallet] = useState("QRIS");

  // =========================================================
  // STATE PERSETUJUAN & MODAL SUKSES
  // =========================================================

  const [setuju, setSetuju] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAgreementAlert, setShowAgreementAlert] = useState(false);
  const [registeredSummary, setRegisteredSummary] = useState(null);

  // =========================================================
  // STATE KALKULATOR
  // =========================================================

  const [showKalkulator, setShowKalkulator] = useState(false);
  const [jenisKalkulator, setJenisKalkulator] = useState("penghasilan");
  const [nilaiKalkulator, setNilaiKalkulator] = useState("");
  const [jumlahJiwaCalc, setJumlahJiwaCalc] = useState("1");
  const [nominalPerJiwaCalc, setNominalPerJiwaCalc] = useState("45000");
  const [hasilKalkulator, setHasilKalkulator] = useState(null);
  const [kalkulatorError, setKalkulatorError] = useState("");

  // =========================================================
  // FORMAT NOMINAL
  // =========================================================

  const formatNominal = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = typeof value === "number" ? value : Number(String(value).replace(/\D/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // =========================================================
  // KALKULASI TOTAL KESEPAKATAN
  // =========================================================

  const getSelectedZakatCount = () => {
    return Object.values(zakatSelections).filter((z) => z.selected).length;
  };

  const getActiveZakatList = () => {
    const list = [];
    if (zakatSelections.penghasilan.selected) {
      list.push({
        key: "penghasilan",
        jenis: "Zakat Penghasilan",
        frekuensi: zakatSelections.penghasilan.frekuensi,
        nominal: Number(String(zakatSelections.penghasilan.nominal || 0).replace(/\D/g, "")),
        detail: `${zakatSelections.penghasilan.frekuensi === "bulanan" ? "Per bulan" : "Per tahun"}`,
      });
    }
    if (zakatSelections.maal.selected) {
      list.push({
        key: "maal",
        jenis: "Zakat Maal",
        frekuensi: zakatSelections.maal.frekuensi,
        nominal: Number(String(zakatSelections.maal.nominal || 0).replace(/\D/g, "")),
        detail: "Zakat atas simpanan & aset kekayaan",
      });
    }
    if (zakatSelections.fitrah.selected) {
      list.push({
        key: "fitrah",
        jenis: "Zakat Fitrah",
        frekuensi: "ramadan",
        jumlah_jiwa: Number(zakatSelections.fitrah.jumlahJiwa || 1),
        nominal_per_jiwa: Number(String(zakatSelections.fitrah.nominalPerJiwa || 45000).replace(/\D/g, "")),
        nominal: Number(String(zakatSelections.fitrah.nominal || 0).replace(/\D/g, "")),
        detail: `${zakatSelections.fitrah.jumlahJiwa} Jiwa × Rp ${formatNominal(zakatSelections.fitrah.nominalPerJiwa)}`,
      });
    }
    return list;
  };

  const getTotalNominal = () => {
    return getActiveZakatList().reduce((sum, item) => sum + item.nominal, 0);
  };

  // =========================================================
  // HANDLER KALKULATOR
  // =========================================================

  const openKalkulator = (jenis = "penghasilan") => {
    const config = getZakatConfig();
    setShowKalkulator(true);
    setJenisKalkulator(jenis);
    setNilaiKalkulator("");
    setJumlahJiwaCalc("1");
    setNominalPerJiwaCalc(String(Math.round(2.5 * config.hargaBerasPerKg)));
    setHasilKalkulator(null);
    setKalkulatorError("");
  };

  const handleHitungKalkulator = () => {
    setKalkulatorError("");
    if (jenisKalkulator === "penghasilan") {
      const penghasilan = Number(String(nilaiKalkulator || "").replace(/\D/g, ""));
      if (!penghasilan || penghasilan <= 0) {
        setKalkulatorError("Silakan masukkan penghasilan per bulan.");
        return;
      }
      const hasil = hitungZakatPenghasilan(penghasilan);
      setHasilKalkulator({
        label: "Estimasi Zakat Penghasilan",
        value: hasil.jumlahZakat,
        wajib: hasil.wajibZakat,
        detail: `Zakat penghasilan ${hasil.kadarZakatPersen}% per bulan dari Rp ${formatNominal(penghasilan)}.`,
      });
      return;
    }

    if (jenisKalkulator === "maal") {
      const harta = Number(String(nilaiKalkulator || "").replace(/\D/g, ""));
      if (!harta || harta <= 0) {
        setKalkulatorError("Silakan masukkan total harta.");
        return;
      }
      const hasil = hitungZakatMaal(harta);
      const voluntaryInfak = Math.round(harta * (hasil.kadarZakatPersen / 100));
      setHasilKalkulator({
        label: "Estimasi Zakat Maal",
        value: hasil.jumlahZakat,
        wajib: hasil.wajibZakat,
        voluntary: voluntaryInfak,
        nisabTahun: hasil.nisab,
        detail: hasil.wajibZakat
          ? `Wajib zakat ${hasil.kadarZakatPersen}% dari total harta bersih (Nisab 85g emas: Rp ${formatNominal(hasil.nisab)}).`
          : `Harta Anda (Rp ${formatNominal(harta)}) belum mencapai batas nisab 85 gram emas (Rp ${formatNominal(hasil.nisab)}).`,
      });
      return;
    }

    if (jenisKalkulator === "fitrah") {
      const jiwa = Number(String(jumlahJiwaCalc || "").replace(/\D/g, ""));
      if (!jiwa || jiwa <= 0) {
        setKalkulatorError("Jumlah jiwa harus lebih dari 0.");
        return;
      }
      const hasil = hitungZakatFitrah(jiwa);
      setHasilKalkulator({
        label: "Estimasi Zakat Fitrah",
        value: hasil.jumlahZakat,
        wajib: true,
        detail: `${jiwa} jiwa × Rp ${formatNominal(hasil.perJiwa)} (Setara 2,5 kg beras @ Rp ${formatNominal(hasil.hargaBeras)}/kg).`,
      });
    }
  };

  const terapkanHasilKalkulator = () => {
    if (hasilKalkulator) {
      // Hanya terapkan jika wajib zakat, atau jika ada value yang valid
      const nominalPakai = hasilKalkulator.value;
      if (nominalPakai > 0) {
        if (jenisKalkulator === "penghasilan") {
          setZakatSelections((prev) => ({
            ...prev,
            penghasilan: {
              ...prev.penghasilan,
              selected: true,
              nominal: String(nominalPakai),
            },
          }));
        } else if (jenisKalkulator === "maal") {
          setZakatSelections((prev) => ({
            ...prev,
            maal: {
              ...prev.maal,
              selected: true,
              nominal: String(nominalPakai),
            },
          }));
        } else if (jenisKalkulator === "fitrah") {
          setZakatSelections((prev) => ({
            ...prev,
            fitrah: {
              ...prev.fitrah,
              selected: true,
              jumlahJiwa: String(jumlahJiwaCalc),
              nominal: String(nominalPakai),
            },
          }));
        }
        setShowKalkulator(false);
      }
    }
  };

  // =========================================================
  // VALIDASI & SUBMIT
  // =========================================================

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const err = {};
    if (!formData.nama.trim()) err.nama = "Nama lengkap wajib diisi.";
    if (!formData.nik.trim()) err.nik = "NIK (KTP) wajib diisi.";
    if (formData.nik && formData.nik.replace(/\D/g, "").length !== 16) {
      err.nik = "NIK harus berjumlah 16 digit angka.";
    }

    // Cek apakah NIK sudah terdaftar
    if (formData.nik) {
      const nikExists = registeredMuzakkiList.some(
        (m) => m.nik && m.nik.replace(/\D/g, "") === formData.nik.replace(/\D/g, "")
      );
      if (nikExists) {
        err.nik = `NIK ${formData.nik} sudah terdaftar sebagai Muzakki. Silakan gunakan NIK lain.`;
      }
    }

    if (!formData.no_hp.trim()) err.no_hp = "Nomor HP / WhatsApp wajib diisi.";
    if (!formData.alamat_lengkap.trim()) err.alamat_lengkap = "Alamat lengkap wajib diisi.";

    // Jika ada error data diri, langsung return tanpa cek yang lain
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return false;
    }

    const activeZakat = getActiveZakatList();
    if (activeZakat.length === 0) {
      err.zakat = "Pilih minimal 1 jenis zakat yang ingin disepakati.";
    }
    for (const z of activeZakat) {
      if (!z.nominal || z.nominal < 10000) {
        err.zakat = `Nominal untuk ${z.jenis} minimal Rp10.000.`;
        break;
      }
    }

    // Jika ada error zakat, return tanpa cek persetujuan
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return false;
    }

    // Validasi persetujuan terakhir (tidak masuk ke err object)
    if (!setuju) {
      setShowAgreementAlert(true);
      return false;
    }

    setErrors(err);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      setFormError("Mohon lengkapi seluruh isian wajib pada formulir.");
      // Scroll ke atas untuk melihat error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      const activeZakat = getActiveZakatList();
      const totalNominal = getTotalNominal();
      const jenisJoined = activeZakat.map((z) => z.jenis).join(", ");

      const payload = {
        nama: formData.nama,
        nik: formData.nik,
        nip: null,
        jenis_kelamin: formData.jenis_kelamin,
        tempat_lahir: formData.tempat_lahir || null,
        tanggal_lahir: formData.tanggal_lahir || null,
        pekerjaan: formData.pekerjaan || null,
        alamat_lengkap: formData.alamat_lengkap,
        email: formData.email || null,
        no_hp: formData.no_hp,
        kategori: "Muzakki Umum",
        unit_kerja: "Masyarakat Umum",
        jenis_zakat: jenisJoined,
        frekuensi: activeZakat.length === 1 ? activeZakat[0].frekuensi : "multi-frekuensi",
        nominal: totalNominal,
        metode_pembayaran: metodePenyaluran,
        pilihan_bank: metodePenyaluran === "transfer-bank" ? pilihanBank : null,
        pilihan_ewallet:
          metodePenyaluran === "e-wallet" || metodePenyaluran === "qris" ? pilihanEwallet : null,
        kesepakatan_zakat: activeZakat,
      };

      await registerPublicMuzakki(payload);

      setRegisteredSummary({
        nama: formData.nama,
        nik: formData.nik,
        alamat: formData.alamat_lengkap,
        pekerjaan: formData.pekerjaan,
        activeZakat,
        totalNominal,
        metodePenyaluran,
        pilihanBank,
        pilihanEwallet,
      });

      setShowSuccessModal(true);

      // Reset form setelah sukses
      resetForm();

      // Refresh data muzakki list untuk validasi duplikasi
      await fetchExistingMuzakki();
    } catch (err) {
      setFormError(err.message || "Gagal mengirim pendaftaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Fungsi reset form
  const resetForm = () => {
    setFormData({
      nama: "",
      nik: "",
      jenis_kelamin: "Laki-laki",
      tempat_lahir: "",
      tanggal_lahir: "",
      pekerjaan: "",
      alamat_lengkap: "",
      email: "",
      no_hp: "",
    });
    setZakatSelections({
      penghasilan: {
        selected: true,
        frekuensi: "bulanan",
        nominal: "250000",
      },
      maal: {
        selected: false,
        frekuensi: "tahunan",
        nominal: "1500000",
      },
      fitrah: {
        selected: false,
        frekuensi: "ramadan",
        jumlahJiwa: "3",
        nominalPerJiwa: "45000",
        nominal: "135000",
      },
    });
    setMetodePenyaluran("transfer-bank");
    setPilihanBank("");
    setPilihanEwallet("");
    setSetuju(false);
    setErrors({});
    setFormError("");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* =====================================================
          HERO BANNER
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#064f35] via-[#08613d] to-[#0b7548] text-white">
        {/* DEKORASI */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[24px] border-white/10 pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full border-[18px] border-white/10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Pendaftaran Muzakki
          </h1>
          <p className="mt-1 text-base text-green-100 font-medium">
            Masyarakat Umum
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
            <Link to="/" className="hover:underline">Beranda</Link>
            <span>›</span>
            <Link to="/daftar-muzakki" className="hover:underline">Daftar Muzakki</Link>
            <span>›</span>
            <span className="text-white font-medium">Muzakki Umum</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT (2-COLUMN GRID)
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===================================================
              SIDEBAR INFO KIRI
          ==================================================== */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
              {/* BIG CIRCLE ICON */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e6f4ea]">
                <Users className="h-12 w-12 text-[#08734f]" />
              </div>

              {/* TITLE & DESCRIPTION */}
              <h2 className="mt-5 text-lg font-bold text-[#08734f]">
                Pendaftaran Muzakki Umum
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 text-left">
                Formulir ini untuk masyarakat umum yang ingin menunaikan dan menyepakati komitmen zakat secara amanah dan berkala di UPZ Universitas Siliwangi.
              </p>

              {/* 3 BULLET POINTS */}
              <div className="mt-6 space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                      Data Terverifikasi
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      Data terdaftar resmi dalam basis data muzakki UPZ Universitas Siliwangi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                      Lebih Cepat &amp; Mudah
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      Pilih jenis zakat, frekuensi, dan nominal sesuai kesepakatan Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                    <LockKeyhole size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                      Aman &amp; Terpercaya
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      Informasi Anda aman dan hanya digunakan untuk keperluan zakat.
                    </p>
                  </div>
                </div>
              </div>

              {/* AYAT QUOTE BOX */}
              <div className="mt-6 rounded-xl bg-emerald-50/80 border border-emerald-100 p-4 text-left">
                <span className="text-2xl font-serif text-[#08734f] leading-none block select-none">
                  “
                </span>
                <p className="text-xs italic text-slate-700 leading-relaxed mt-1">
                  Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka dan berdoalah untuk mereka. Sesungguhnya doa kamu itu (menjadi) ketenteraman jiwa bagi mereka.
                </p>
                <p className="mt-2 text-[11px] font-bold text-[#08734f]">
                  (QS. At-Taubah: 103)
                </p>
              </div>

              {/* BUTTON VIEW KALKULATOR ZAKAT */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => openKalkulator("penghasilan")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#08734f]/30 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-[#08734f] shadow-xs transition hover:bg-green-50/80 hover:border-[#08734f]"
                >
                  <Calculator size={18} />
                  View Kalkulator Zakat
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Hitung zakat Anda dengan mudah menggunakan kalkulator kami.
                </p>
              </div>
            </div>
          </aside>

          {/* ===================================================
              FORM UTAMA KANAN
          ==================================================== */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {formError && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Mohon Periksa Kembali:</p>
                  <p className="mt-0.5 text-xs">{formError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* =================================================
                  1. DATA DIRI
              ================================================== */}
              <div>
                <SectionTitle
                  number="1."
                  icon={<UserRound size={21} />}
                  title="Data Diri Muzakki"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Isi data diri Anda sesuai dengan identitas kependudukan yang sah (KTP).
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* NAMA LENGKAP */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      placeholder="Contoh: H. Dani Firmansyah, S.T."
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm outline-none transition ${
                        errors.nama ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#08734f]"
                      }`}
                    />
                    {errors.nama && <p className="mt-1 text-[11px] text-red-500">{errors.nama}</p>}
                  </div>

                  {/* NIP (OPSIONAL) & NIK */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIP <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nip || ""}
                      onChange={(e) => handleInputChange("nip", e.target.value.replace(/\D/g, ""))}
                      placeholder="Contoh: 197503122001112001"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIK (Nomor Induk Kependudukan - 16 Digit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => handleInputChange("nik", e.target.value.replace(/\D/g, ""))}
                      placeholder="3278xxxxxxxxxxxx"
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm outline-none transition ${
                        errors.nik ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#08734f]"
                      }`}
                    />
                    {errors.nik && <p className="mt-1 text-[11px] text-red-500">{errors.nik}</p>}
                  </div>

                  {/* TEMPAT & TANGGAL LAHIR */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempat_lahir}
                      onChange={(e) => handleInputChange("tempat_lahir", e.target.value)}
                      placeholder="Contoh: Tasikmalaya"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={(e) => handleInputChange("tanggal_lahir", e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* PEKERJAAN & JENIS KELAMIN */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pekerjaan / Profesi</label>
                    <input
                      type="text"
                      value={formData.pekerjaan}
                      onChange={(e) => handleInputChange("pekerjaan", e.target.value)}
                      placeholder="Contoh: Pengusaha / Wiraswasta / Karyawan"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Laki-laki", "Perempuan"].map((jk) => (
                        <button
                          key={jk}
                          type="button"
                          onClick={() => handleInputChange("jenis_kelamin", jk)}
                          className={`h-11 rounded-xl border text-xs font-semibold transition ${
                            formData.jenis_kelamin === jk
                              ? "bg-[#08734f] text-white border-[#08734f]"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {jk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ALAMAT LENGKAP */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Alamat Lengkap Domisili <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.alamat_lengkap}
                      onChange={(e) => handleInputChange("alamat_lengkap", e.target.value)}
                      placeholder="Contoh: Jl. Siliwangi No. 24, Kec. Tawang, Kota Tasikmalaya"
                      className={`w-full rounded-xl border p-3 text-xs sm:text-sm outline-none transition resize-none ${
                        errors.alamat_lengkap ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#08734f]"
                      }`}
                    />
                    {errors.alamat_lengkap && (
                      <p className="mt-1 text-[11px] text-red-500">{errors.alamat_lengkap}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email (Opsional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="email@domain.com"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* NO HP */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nomor WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.no_hp}
                      onChange={(e) => handleInputChange("no_hp", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm outline-none transition ${
                        errors.no_hp ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#08734f]"
                      }`}
                    />
                    {errors.no_hp && <p className="mt-1 text-[11px] text-red-500">{errors.no_hp}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* =================================================
                  2. INFORMASI KESEPAKATAN ZAKAT (MULTI-ZAKAT)
              ================================================== */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <SectionTitle
                      number="2."
                      icon={<WalletCards size={21} />}
                      title="Informasi Kesepakatan Zakat"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Pilih 1 atau lebih jenis zakat yang ingin Anda tunaikan secara berkala.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openKalkulator("penghasilan")}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-[#08734f]/30 bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#08734f] hover:bg-green-100 transition"
                  >
                    <Calculator size={14} />
                    Kalkulator Zakat
                  </button>
                </div>

                {errors.zakat && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {errors.zakat}
                  </div>
                )}

                {/* CHECKBOX PILIHAN MULTI-ZAKAT */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* ZAKAT PENGHASILAN */}
                  <div
                    onClick={() => toggleZakat("penghasilan")}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      zakatSelections.penghasilan.selected
                        ? "border-[#08734f] bg-green-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-slate-800">
                        <WalletCards size={18} className="text-[#08734f]" />
                        Zakat Penghasilan
                      </div>
                      <input
                        type="checkbox"
                        checked={zakatSelections.penghasilan.selected}
                        onChange={() => {}}
                        className="h-4 w-4 accent-[#08734f] rounded"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Zakat atas penghasilan atau gaji rutin setiap bulan/tahun.
                    </p>
                  </div>

                  {/* ZAKAT MAAL */}
                  <div
                    onClick={() => toggleZakat("maal")}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      zakatSelections.maal.selected
                        ? "border-[#08734f] bg-green-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-slate-800">
                        <Landmark size={18} className="text-[#08734f]" />
                        Zakat Maal (Harta)
                      </div>
                      <input
                        type="checkbox"
                        checked={zakatSelections.maal.selected}
                        onChange={() => {}}
                        className="h-4 w-4 accent-[#08734f] rounded"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Zakat atas tabungan, simpanan emas, dan aset harta yang telah mencapai haul.
                    </p>
                  </div>

                  {/* ZAKAT FITRAH */}
                  <div
                    onClick={() => toggleZakat("fitrah")}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      zakatSelections.fitrah.selected
                        ? "border-[#08734f] bg-green-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-slate-800">
                        <Sprout size={18} className="text-[#08734f]" />
                        Zakat Fitrah
                      </div>
                      <input
                        type="checkbox"
                        checked={zakatSelections.fitrah.selected}
                        onChange={() => {}}
                        className="h-4 w-4 accent-[#08734f] rounded"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Zakat fitrah untuk diri sendiri dan keluarga pada bulan Ramadan.
                    </p>
                  </div>
                </div>

                {/* DETAIL SETTING PER ZAKAT YANG DIPILIH */}
                <div className="mt-5 space-y-4">
                  {/* DETAIL ZAKAT PENGHASILAN */}
                  {zakatSelections.penghasilan.selected && (
                    <div className="rounded-xl border border-green-200 bg-green-50/40 p-4.5 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08734f]">
                          <WalletCards size={17} />
                          Pengaturan Zakat Penghasilan
                        </div>
                        <button
                          type="button"
                          onClick={() => openKalkulator("penghasilan")}
                          className="text-[11px] font-semibold text-[#08734f] underline"
                        >
                          Hitung 2,5% via Kalkulator
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Frekuensi Penunaian
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "bulanan", label: "Bulanan" },
                              { id: "tahunan", label: "Tahunan" },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => updateZakatField("penghasilan", "frekuensi", f.id)}
                                className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition ${
                                  zakatSelections.penghasilan.frekuensi === f.id
                                    ? "bg-[#08734f] text-white border-[#08734f]"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nominal Zakat Penghasilan (Rp)
                          </label>
                          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatNominal(zakatSelections.penghasilan.nominal)}
                              onChange={(e) =>
                                updateZakatField("penghasilan", "nominal", e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="250.000"
                              className="h-10 w-full px-3 text-xs sm:text-sm outline-none"
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {zakatSelections.penghasilan.frekuensi === "bulanan"
                              ? `Estimasi komitmen: Rp ${formatNominal(Number(zakatSelections.penghasilan.nominal || 0) * 12)} / tahun`
                              : "Nominal zakat penghasilan per penunaian"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DETAIL ZAKAT MAAL */}
                  {zakatSelections.maal.selected && (
                    <div className="rounded-xl border border-green-200 bg-green-50/40 p-4.5 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08734f]">
                          <Landmark size={17} />
                          Pengaturan Zakat Maal (Harta / Tabungan)
                        </div>
                        <button
                          type="button"
                          onClick={() => openKalkulator("maal")}
                          className="text-[11px] font-semibold text-[#08734f] underline"
                        >
                          Hitung via Kalkulator Maal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Frekuensi Penunaian
                          </label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: "tahunan", label: "Tahunan (Haul)" },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => updateZakatField("maal", "frekuensi", f.id)}
                                className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition ${
                                  zakatSelections.maal.frekuensi === f.id
                                    ? "bg-[#08734f] text-white border-[#08734f]"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nominal Zakat Maal (Rp)
                          </label>
                          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500">
                              Rp
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatNominal(zakatSelections.maal.nominal)}
                              onChange={(e) =>
                                updateZakatField("maal", "nominal", e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="1.500.000"
                              className="h-10 w-full px-3 text-xs sm:text-sm outline-none"
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Kadar 2,5% dari total harta bersih yang telah mencapai nisab 85g emas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DETAIL ZAKAT FITRAH */}
                  {zakatSelections.fitrah.selected && (
                    <div className="rounded-xl border border-green-200 bg-green-50/40 p-4.5 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08734f]">
                          <Sprout size={17} />
                          Pengaturan Zakat Fitrah (Ramadan)
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          Setiap Ramadan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Jumlah Tanggungan / Jiwa
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={zakatSelections.fitrah.jumlahJiwa}
                            onChange={(e) => updateZakatField("fitrah", "jumlahJiwa", e.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nominal per Jiwa (Rp)
                          </label>
                          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500">
                              Rp
                            </span>
                            <input
                              type="text"
                              value={formatNominal(zakatSelections.fitrah.nominalPerJiwa)}
                              onChange={(e) =>
                                updateZakatField("fitrah", "nominalPerJiwa", e.target.value.replace(/\D/g, ""))
                              }
                              className="h-10 w-full px-2.5 text-xs sm:text-sm outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Total Zakat Fitrah
                          </label>
                          <div className="flex h-10 items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs sm:text-sm font-bold text-[#08734f]">
                            Rp {formatNominal(zakatSelections.fitrah.nominal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RINGKASAN GABUNGAN KOMITMEN ZAKAT */}
                {getSelectedZakatCount() > 0 && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08734f]">
                      <ClipboardCheck size={18} />
                      Ringkasan Total Kesepakatan Zakat Anda
                    </div>

                    <div className="mt-3 divide-y divide-emerald-200/60">
                      {getActiveZakatList().map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-2 text-xs sm:text-sm">
                          <div>
                            <p className="font-semibold text-slate-800">{item.jenis}</p>
                            <p className="text-[11px] text-slate-500">{item.detail}</p>
                          </div>
                          <p className="font-bold text-[#08734f]">
                            Rp {formatNominal(item.nominal)}
                          </p>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-3 text-sm font-bold text-slate-900">
                        <span>Total Nominal Komitmen Gabungan:</span>
                        <span className="text-base font-extrabold text-[#08734f]">
                          Rp {formatNominal(getTotalNominal())}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* =================================================
                  3. PREFERENSI PENYALURAN (TRANSFER BANK, E-WALLET, DAN QRIS)
              ================================================== */}
              <div>
                <SectionTitle
                  number="3."
                  icon={<Landmark size={21} />}
                  title="Preferensi Penyaluran / Pembayaran Zakat"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Pilih metode pembayaran yang paling nyaman untuk Anda.
                </p>

                {/* TIGA PILIHAN: TRANSFER BANK, E-WALLET, DAN QRIS */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      id: "transfer-bank",
                      nama: "Transfer Bank",
                      desc: "Transfer melalui Rekening Bank resmi UPZ UNSIL.",
                      icon: Landmark,
                    },
                    {
                      id: "e-wallet",
                      nama: "E-Wallet",
                      desc: "Bayar via dompet digital (GoPay/OVO/DANA/ShopeePay).",
                      icon: WalletCards,
                    },
                    {
                      id: "qris",
                      nama: "QRIS",
                      desc: "Scan QRIS resmi UPZ UNSIL melalui e-wallet apa pun.",
                      icon: ScanLine,
                    },
                  ].map((m) => {
                    const Icon = m.icon;
                    const selected = metodePenyaluran === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setMetodePenyaluran(m.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          selected
                            ? "border-[#08734f] bg-green-50 text-[#08734f] shadow-xs"
                            : "border-slate-200 bg-white hover:border-green-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon size={20} className={selected ? "text-[#08734f]" : "text-slate-500"} />
                          <input
                            type="radio"
                            name="metodePenyaluran"
                            checked={selected}
                            onChange={() => {}}
                            className="h-4 w-4 accent-[#08734f]"
                          />
                        </div>
                        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800">{m.nama}</p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* SUB-PILIHAN BANK JIKA TRANSFER BANK */}
                {metodePenyaluran === "transfer-bank" && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Pilih Bank Tujuan Transfer:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      {[
                        { id: "BSI", name: "BSI (Syariah)" },
                        { id: "Mandiri", name: "Bank Mandiri" },
                        { id: "BRI", name: "Bank BRI" },
                        { id: "BNI", name: "Bank BNI" },
                        { id: "Muamalat", name: "Bank Muamalat" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setPilihanBank(b.id)}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            pilihanBank === b.id
                              ? "border-[#08734f] bg-[#08734f] text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-PILIHAN E-WALLET JIKA E-WALLET */}
                {metodePenyaluran === "e-wallet" && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Pilih Dompet Digital / E-Wallet:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      {[
                        { id: "GoPay", name: "GoPay" },
                        { id: "OVO", name: "OVO" },
                        { id: "Dana", name: "DANA" },
                        { id: "ShopeePay", name: "ShopeePay" },
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setPilihanEwallet(w.id)}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            pilihanEwallet === w.id
                              ? "border-[#08734f] bg-[#08734f] text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* =================================================
                  4. PERSETUJUAN & SUBMIT
              ================================================== */}
              <div>
                <SectionTitle
                  number="4."
                  icon={<ShieldCheck size={21} />}
                  title="Persetujuan &amp; Akad Kesepakatan"
                />

                <label className="mt-4 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={setuju}
                    onChange={(e) => {
                      setSetuju(e.target.checked);
                      setFormError("");
                    }}
                    className="mt-1 h-4 w-4 accent-[#08734f] rounded"
                  />
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    Saya menyatakan bahwa data yang diisi adalah data saya yang sebenarnya dan menyetujui komitmen zakat ini
                    untuk keperluan administrasi serta pelayanan zakat UPZ Universitas Siliwangi.
                  </span>
                </label>

                {errors.setuju && <p className="mt-1 text-[11px] text-red-500">{errors.setuju}</p>}

                {/* BUTTON SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#08734f] text-sm font-semibold text-white shadow-xs transition hover:bg-[#065d40] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Menyimpan Kesepakatan...
                    </>
                  ) : (
                    <>
                      <UserPlus size={19} />
                      Daftar sebagai Muzakki
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <LockKeyhole size={13} />
                  <span>Data Anda aman dan akan digunakan sesuai kebijakan UPZ Zakat UNSIL.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* =====================================================
          MODAL ALERT PERSETUJUAN
      ====================================================== */}
      {showAgreementAlert && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
                <AlertCircle size={36} className="stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Persetujuan Diperlukan
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Anda belum menyetujui pernyataan akad kesepakatan zakat. Silakan centang kotak persetujuan di bagian bawah formulir sebelum melanjutkan pendaftaran.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAgreementAlert(false)}
              className="mt-6 w-full rounded-xl bg-[#08734f] py-3 text-sm font-semibold text-white hover:bg-[#065d40] transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL SUKSES PENDAFTARAN MUZAKKI UMUM
      ====================================================== */}
      {showSuccessModal && registeredSummary && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in">
          <div
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
            >
              <X size={18} />
            </button>

            {/* ICON & TITLE */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#08734f] shadow-inner mb-4">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#08734f] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles size={13} /> Pendaftaran Berhasil
              </span>
              <h2 className="mt-2.5 text-2xl font-bold text-gray-900">
                Alhamdulillah, Anda Terdaftar!
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                Terima kasih, <strong>{registeredSummary.nama}</strong>. Komitmen kesepakatan zakat Anda telah resmi tercatat di UPZ Zakat Universitas Siliwangi.
              </p>
            </div>

            {/* RINGKASAN KARTU */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-left">
              <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
                <span className="text-xs text-gray-500">Profil Muzakki</span>
                <span className="text-xs font-bold text-gray-800">Muzakki Umum</span>
              </div>
              <div className="mt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">NIK (KTP)</span>
                  <span className="font-mono font-semibold text-gray-800">{registeredSummary.nik}</span>
                </div>
                {registeredSummary.pekerjaan && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pekerjaan</span>
                    <span className="font-semibold text-gray-800">{registeredSummary.pekerjaan}</span>
                  </div>
                )}

                <div className="border-t border-emerald-200/70 pt-2 mt-2">
                  <p className="text-[11px] font-semibold text-emerald-800 mb-1">Rincian Kesepakatan Zakat:</p>
                  {registeredSummary.activeZakat.map((item) => (
                    <div key={item.key} className="flex justify-between py-1 text-xs">
                      <span className="text-gray-600">{item.jenis} ({item.detail})</span>
                      <span className="font-bold text-[#08734f]">Rp {formatNominal(item.nominal)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-emerald-200/70 pt-2.5 font-bold">
                  <span className="text-gray-700">Total Komitmen Zakat:</span>
                  <span className="text-base text-[#08734f]">
                    Rp {formatNominal(registeredSummary.totalNominal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-gray-500">Preferensi Penyaluran:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {registeredSummary.metodePenyaluran === "transfer-bank"
                      ? `Transfer Bank (${registeredSummary.pilihanBank})`
                      : registeredSummary.metodePenyaluran === "qris"
                        ? `QRIS (${registeredSummary.pilihanEwallet})`
                        : `E-Wallet (${registeredSummary.pilihanEwallet})`}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/zakat")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#08734f] text-sm font-semibold text-white shadow-md transition hover:bg-[#065d40]"
              >
                <Heart size={18} />
                Tunaikan Zakat Sekarang
              </button>

              <button
                type="button"
                onClick={() => navigate("/daftar-muzakki")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Lihat Daftar Muzakki Terdaftar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          POPUP KALKULATOR ZAKAT
      ====================================================== */}
      {showKalkulator && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowKalkulator(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowKalkulator(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#08734f]">
                <Calculator size={23} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kalkulator Zakat</h2>
                <p className="text-xs text-gray-500">Hitung estimasi zakat sebelum disimpan ke formulir.</p>
              </div>
            </div>

            {/* TAB JENIS KALKULATOR */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { id: "penghasilan", label: "Penghasilan", icon: WalletCards },
                { id: "maal", label: "Maal (Harta)", icon: Landmark },
                { id: "fitrah", label: "Fitrah", icon: Sprout },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setJenisKalkulator(t.id);
                      setHasilKalkulator(null);
                      setKalkulatorError("");
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                      jenisKalkulator === t.id
                        ? "bg-[#08734f] text-white border-[#08734f]"
                        : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* INPUT KALKULATOR */}
            <div className="mt-4">
              {kalkulatorError && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5 border border-red-200">
                  <AlertCircle size={14} />
                  {kalkulatorError}
                </div>
              )}

              {jenisKalkulator === "penghasilan" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Penghasilan per Bulan
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-200">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={formatNominal(nilaiKalkulator)}
                      onChange={(e) => {
                        setNilaiKalkulator(e.target.value.replace(/\D/g, ""));
                        setKalkulatorError("");
                      }}
                      placeholder="5.000.000"
                      className="h-10 w-full px-3 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {jenisKalkulator === "maal" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Harta Bersih (Tabungan/Emas/Investasi)
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-200">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={formatNominal(nilaiKalkulator)}
                      onChange={(e) => {
                        setNilaiKalkulator(e.target.value.replace(/\D/g, ""));
                        setKalkulatorError("");
                      }}
                      placeholder="100.000.000"
                      className="h-10 w-full px-3 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {jenisKalkulator === "fitrah" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Jumlah Jiwa</label>
                    <input
                      type="number"
                      min="1"
                      value={jumlahJiwaCalc}
                      onChange={(e) => {
                        setJumlahJiwaCalc(e.target.value);
                        setKalkulatorError("");
                      }}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleHitungKalkulator}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08734f] py-2.5 text-xs font-semibold text-white hover:bg-[#065d40] transition"
              >
                <Calculator size={15} />
                Hitung Estimasi
              </button>
            </div>

            {/* HASIL */}
            {hasilKalkulator && (
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  hasilKalkulator.wajib
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">{hasilKalkulator.label}</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      hasilKalkulator.wajib
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {hasilKalkulator.wajib ? "Wajib Zakat" : "Belum Wajib Zakat"}
                  </span>
                </div>

                <p
                  className={`mt-1.5 text-xl font-bold ${
                    hasilKalkulator.wajib ? "text-[#08734f]" : "text-amber-800"
                  }`}
                >
                  Rp {formatNominal(hasilKalkulator.value)}
                </p>

                <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">
                  {hasilKalkulator.detail}
                </p>

                <button
                  type="button"
                  onClick={terapkanHasilKalkulator}
                  disabled={hasilKalkulator.value === 0}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold shadow-xs transition ${
                    hasilKalkulator.value === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#08734f] text-white hover:bg-[#065d40]"
                  }`}
                >
                  <Check size={14} />
                  Terapkan ke Formulir (Rp {formatNominal(hasilKalkulator.value)})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowKalkulator(false)}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function SectionTitle({ number, icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="text-[#08734f]">{icon}</div>
      <h2 className="text-sm sm:text-base font-bold text-[#08734f]">
        {number} {title}
      </h2>
    </div>
  );
}