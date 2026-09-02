import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  Search,
  ShieldCheck,
  Clock3,
  Building2,
  Calculator,
  X,
  UserPlus,
  Users,
  CheckCircle2,
  Sparkles,
  Loader2,
  WalletCards,
  Landmark,
  ScanLine,
  Sprout,
  ClipboardCheck,
  Check,
  ChevronDown,
  Smartphone,
  QrCode,
  GraduationCap,
  AlertCircle,
  Heart,
  Calendar,
} from "lucide-react";

import { DOSEN_STAF_UNSIL } from "../data/dummyDosenStaf";
import { FAKULTAS_JURUSAN_UNSIL } from "./dashboard/MuzakkiMustahik";
import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";
import { registerPublicMuzakki, getPublicMuzakki } from "../services/muzakkiService";

const FAKULTAS_LIST = Object.keys(FAKULTAS_JURUSAN_UNSIL);

export default function DaftarMuzakkiUnsilPage() {
  // =========================================================
  // STATE MUZAKKI TERDAFTAR DARI DATABASE (UNTUK FILTERING)
  // =========================================================
  const [registeredMuzakkiList, setRegisteredMuzakkiList] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);

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
    } finally {
      setLoadingRegistered(false);
    }
  };

  // =========================================================
  // STATE PENCARIAN NIP & NO HP
  // =========================================================

  const [nipCari, setNipCari] = useState("");
  const [noHpCari, setNoHpCari] = useState("");
  const [pegawaiDitemukan, setPegawaiDitemukan] = useState(null);
  const [cariError, setCariError] = useState("");
  const [dataPegawai, setDataPegawai] = useState({
    nama: "",
    nip: "",
    nik: "",
    unit: "",
    jurusan: "",
    jabatan: "",
    email: "",
    noHp: "",
    golongan: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamatLengkap: "",
  });

  // State untuk dropdown Fakultas dan Jurusan
  const [selectedFakultas, setSelectedFakultas] = useState(FAKULTAS_LIST[0]);
  const [selectedJurusan, setSelectedJurusan] = useState(FAKULTAS_JURUSAN_UNSIL[FAKULTAS_LIST[0]][0]);

  // Handler untuk perubahan fakultas
  const handleFakultasChange = (e) => {
    const newFakultas = e.target.value;
    setSelectedFakultas(newFakultas);
    const jurusanList = FAKULTAS_JURUSAN_UNSIL[newFakultas] || [];
    setSelectedJurusan(jurusanList[0] || "");
    setDataPegawai({
      ...dataPegawai,
      unit: newFakultas,
      jurusan: jurusanList[0] || "",
    });
  };

  const handleJurusanChange = (e) => {
    const newJurusan = e.target.value;
    setSelectedJurusan(newJurusan);
    setDataPegawai({
      ...dataPegawai,
      jurusan: newJurusan,
    });
  };

  // =========================================================
  // FUNGSI CARI DATA PEGAWAI
  // =========================================================

  const handleCariData = () => {
    setCariError("");
    const cleanNip = nipCari.replace(/\D/g, "").trim();
    const cleanNoHp = noHpCari.replace(/\D/g, "").trim();

    if (!cleanNip && !cleanNoHp) {
      setCariError("Minimal masukkan NIP atau Nomor HP untuk pencarian.");
      return;
    }

    const found = DOSEN_STAF_UNSIL.find((p) => {
      const matchNip = cleanNip ? p.nip.replace(/\D/g, "") === cleanNip : true;
      const matchNoHp = cleanNoHp ? p.noHp.replace(/\D/g, "") === cleanNoHp : true;
      return matchNip && matchNoHp;
    });

    if (found) {
      setDataPegawai({ ...found });
      setPegawaiDitemukan(found);
      setCariError("");
      setFormError("");
      
      // Update dropdown fakultas dan jurusan berdasarkan data yang ditemukan
      if (found.unit) {
        const foundFakultas = FAKULTAS_LIST.find(f => found.unit.includes(f)) || FAKULTAS_LIST[0];
        setSelectedFakultas(foundFakultas);
        setSelectedJurusan(found.jurusan || FAKULTAS_JURUSAN_UNSIL[foundFakultas][0]);
      }
    } else {
      setPegawaiDitemukan(null);
      setDataPegawai({
        nama: "",
        nip: "",
        nik: "",
        unit: "",
        jurusan: "",
        jabatan: "",
        email: "",
        noHp: "",
        golongan: "",
        jenisKelamin: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamatLengkap: "",
      });
      setCariError(`Data pegawai dengan NIP "${nipCari}" atau No HP "${noHpCari}" tidak ditemukan.`);
    }
  };

  const handleResetCari = () => {
    setNipCari("");
    setNoHpCari("");
    setPegawaiDitemukan(null);
    setCariError("");
    setDataPegawai({
      nama: "",
      nip: "",
      nik: "",
      unit: "",
      jurusan: "",
      jabatan: "",
      email: "",
      noHp: "",
      golongan: "",
      jenisKelamin: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamatLengkap: "",
    });
    setFormError("");
    
    // Reset dropdown ke default
    setSelectedFakultas(FAKULTAS_LIST[0]);
    setSelectedJurusan(FAKULTAS_JURUSAN_UNSIL[FAKULTAS_LIST[0]][0]);
  };

  // =========================================================
  // STATE MULTI-KESEPAKATAN ZAKAT
  // =========================================================

  const [zakatSelections, setZakatSelections] = useState({
    penghasilan: {
      selected: true,
      frekuensi: "bulanan", // "bulanan" | "tahunan"
      nominal: "500000",
    },
    maal: {
      selected: false,
      frekuensi: "tahunan", // "tahunan"
      nominal: "2500000",
    },
    fitrah: {
      selected: false,
      frekuensi: "ramadan", // "ramadan"
      jumlahJiwa: "4",
      nominalPerJiwa: "45000",
      nominal: "180000",
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
  // PREFERENSI PENYALURAN (HANYA TRANSFER BANK & E-WALLET)
  // =========================================================

  const [metodePenyaluran, setMetodePenyaluran] = useState("transfer-bank"); // "transfer-bank" | "e-wallet" | "qris"
  const [pilihanBank, setPilihanBank] = useState("BSI");
  const [pilihanEwallet, setPilihanEwallet] = useState("QRIS");

  // =========================================================
  // STATE PERSETUJUAN & ERROR BANNER
  // =========================================================

  const [setuju, setSetuju] = useState(false);
  const [formError, setFormError] = useState("");
  const [showAgreementAlert, setShowAgreementAlert] = useState(false);

  // =========================================================
  // STATE SUCCESS MODAL
  // =========================================================

  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
  // SUBMIT FORM
  // =========================================================

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Prioritas 1: Validasi data pegawai wajib
    if (!dataPegawai.nama.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!dataPegawai.nik.trim()) {
      setFormError("NIK wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!dataPegawai.nip.trim()) {
      setFormError("NIP wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!dataPegawai.jenisKelamin) {
      setFormError("Jenis Kelamin wajib dipilih.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!dataPegawai.alamatLengkap.trim()) {
      setFormError("Alamat Lengkap Domisili wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    // Cek apakah NIP sudah terdaftar
    const nipExists = registeredMuzakkiList.some(
      (m) => m.nip && m.nip.replace(/\D/g, "") === dataPegawai.nip.replace(/\D/g, "")
    );
    if (nipExists) {
      setFormError(`NIP ${dataPegawai.nip} sudah terdaftar sebagai Muzakki. Silakan gunakan NIP lain.`);
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    // Cek apakah sudah pernah daftar dengan NIK (sebagai Muzakki Umum)
    const namaExists = registeredMuzakkiList.some(
      (m) => m.nama && m.nama.toLowerCase().trim() === dataPegawai.nama.toLowerCase().trim()
    );
    if (namaExists) {
      setFormError(`Nama "${dataPegawai.nama}" sudah terdaftar sebagai Muzakki. Jika Anda sudah terdaftar sebelumnya, tidak perlu mendaftar ulang.`);
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    if (!dataPegawai.unit.trim()) {
      setFormError("Fakultas / Unit Kerja wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!dataPegawai.jabatan.trim()) {
      setFormError("Jabatan wajib diisi.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    // Prioritas 2: Validasi kesepakatan zakat
    const activeZakat = getActiveZakatList();
    if (activeZakat.length === 0) {
      setFormError("Silakan pilih minimal 1 jenis zakat yang ingin disepakati.");
      window.scrollTo({ top: 400, behavior: "smooth" });
      return;
    }

    for (const z of activeZakat) {
      if (!z.nominal || z.nominal < 10000) {
        setFormError(`Nominal untuk ${z.jenis} minimal Rp10.000.`);
        window.scrollTo({ top: 400, behavior: "smooth" });
        return;
      }
    }

    // Prioritas 3: Validasi persetujuan (terakhir)
    if (!setuju) {
      setShowAgreementAlert(true);
      return;
    }

    setSubmitting(true);
    try {
      const totalNominal = getTotalNominal();
      const jenisJoined = activeZakat.map((z) => z.jenis).join(", ");

      const payload = {
        nama: dataPegawai.nama,
        nik: dataPegawai.nik,
        nip: dataPegawai.nip,
        kategori: "Dosen & Staf UNSIL",
        pekerjaan: dataPegawai.jabatan || "Dosen / Tenaga Kependidikan",
        unit_kerja: `${dataPegawai.unit}${dataPegawai.jurusan ? ` · ${dataPegawai.jurusan}` : ""}`,
        jenis_kelamin: dataPegawai.jenisKelamin,
        tempat_lahir: dataPegawai.tempatLahir,
        tanggal_lahir: dataPegawai.tanggalLahir,
        alamat_lengkap: dataPegawai.alamatLengkap,
        email: dataPegawai.email || null,
        no_hp: dataPegawai.noHp || null,
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
        nama: dataPegawai.nama,
        nip: dataPegawai.nip,
        unit: dataPegawai.unit,
        jabatan: dataPegawai.jabatan,
        activeZakat,
        totalNominal,
        metodePenyaluran,
        pilihanBank,
        pilihanEwallet,
      });

      setShowSuccessModal(true);

      // Reset form setelah sukses
      resetForm();

      // Refresh data muzakki list untuk update dropdown pencarian
      await fetchExistingMuzakki();
    } catch (err) {
      setFormError(err.message || "Gagal mengirim pendaftaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Fungsi reset form
  const resetForm = () => {
    setDataPegawai({
      nama: "",
      nip: "",
      nik: "",
      unit: "",
      jurusan: "",
      jabatan: "",
      email: "",
      noHp: "",
      golongan: "",
      jenisKelamin: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamatLengkap: "",
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
            Dosen &amp; Staff Universitas Siliwangi
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
            <Link to="/" className="hover:underline">Beranda</Link>
            <span>›</span>
            <Link to="/daftar-muzakki" className="hover:underline">Daftar Muzakki</Link>
            <span>›</span>
            <span className="text-white font-medium">Dosen &amp; Staff UNSIL</span>
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
                <Building2 className="h-12 w-12 text-[#08734f]" />
              </div>

              {/* TITLE & DESCRIPTION */}
              <h2 className="mt-5 text-lg font-bold text-[#08734f]">
                Pendaftaran Khusus Dosen &amp; Staff UNSIL
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 text-left">
                Formulir ini khusus untuk Dosen dan Staff Universitas Siliwangi. Anda dapat mencari data dengan NIP dan Nomor HP, atau mengisi data secara manual.
              </p>

              {/* 3 BULLET POINTS */}
              <div className="mt-6 space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                      Data Fleksibel
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                       Cari dengan NIP & No HP atau isi manual - semua data bisa diedit.
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
                      Cukup masukkan NIP atau Nama, data muncul otomatis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
                    <ShieldCheck size={18} />
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
                  1. PENCARIAN DATA KEPEGAWAIAN (NIP + NO HP)
              ================================================== */}
              <div>
                <SectionTitle
                  number="1."
                  icon={<UserRound size={21} />}
                  title="Pencarian Data Kepegawaian"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Masukkan NIP dan Nomor HP Anda untuk mengambil data dari sistem kepegawaian UNSIL.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nipCari}
                      onChange={(e) => setNipCari(e.target.value.replace(/\D/g, ""))}
                      placeholder="Contoh: 197503122001121001"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nomor HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noHpCari}
                      onChange={(e) => setNoHpCari(e.target.value.replace(/\D/g, ""))}
                      placeholder="Contoh: 081223450001"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCariData}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#08734f] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#064f35]"
                  >
                    <Search size={17} />
                    Cari Data
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCari}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 shadow-xs transition hover:bg-slate-50"
                  >
                    <X size={17} />
                    Reset
                  </button>
                </div>

                {cariError && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{cariError}</span>
                  </div>
                )}

                {pegawaiDitemukan && (
                  <div className="mt-3 flex items-center justify-between gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-semibold text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span>
                        Data Ditemukan: <strong>{pegawaiDitemukan.nama}</strong> ({pegawaiDitemukan.jabatan})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetCari}
                      className="text-[11px] text-emerald-700 underline hover:text-emerald-900"
                    >
                      Ganti Data
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* =================================================
                  2. DATA DIRI KEPGAWAIAN
              ================================================== */}
              <div>
                <SectionTitle
                  number="2."
                  icon={<UserRound size={21} />}
                  title="Data Diri Kepegawaian"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Isi data kepegawaian Anda. Data akan terisi otomatis jika mencari dengan NIP dan Nomor HP di atas.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* NAMA LENGKAP */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dataPegawai.nama}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, nama: e.target.value })}
                      placeholder="Contoh: Dr. Budi Santoso, M.Kom."
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* NIP */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dataPegawai.nip}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, nip: e.target.value })}
                      placeholder="Contoh: 197503122001121001"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* NIK */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NIK (Nomor Induk Kependudukan - 16 Digit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={dataPegawai.nik}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, nik: e.target.value.replace(/\D/g, "") })}
                      placeholder="3278xxxxxxxxxxxx"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* FAKULTAS / UNIT KERJA */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Fakultas / Unit Kerja <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={selectedFakultas}
                        onChange={handleFakultasChange}
                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-xs sm:text-sm outline-none focus:border-[#08734f] appearance-none bg-white"
                      >
                        {FAKULTAS_LIST.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* JURUSAN / PROGRAM STUDI */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jurusan / Program Studi</label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={selectedJurusan}
                        onChange={handleJurusanChange}
                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-xs sm:text-sm outline-none focus:border-[#08734f] appearance-none bg-white"
                      >
                        {(FAKULTAS_JURUSAN_UNSIL[selectedFakultas] || []).map((j) => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* JABATAN & JENIS KELAMIN */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dataPegawai.jabatan}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, jabatan: e.target.value })}
                      placeholder="Contoh: Dosen / Lektor Kepala"
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
                          onClick={() => setDataPegawai({ ...dataPegawai, jenisKelamin: jk })}
                          className={`h-11 rounded-xl border text-xs font-semibold transition ${
                            dataPegawai.jenisKelamin === jk
                              ? "bg-[#08734f] text-white border-[#08734f]"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {jk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TEMPAT & TANGGAL LAHIR */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tempat Lahir</label>
                    <input
                      type="text"
                      value={dataPegawai.tempatLahir}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, tempatLahir: e.target.value })}
                      placeholder="Contoh: Tasikmalaya"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={dataPegawai.tanggalLahir}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, tanggalLahir: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>

                  {/* ALAMAT LENGKAP */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Alamat Lengkap Domisili <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={dataPegawai.alamatLengkap}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, alamatLengkap: e.target.value })}
                      placeholder="Contoh: Jl. Siliwangi No. 24, Kec. Tawang, Kota Tasikmalaya"
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm outline-none focus:border-[#08734f] resize-none"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={dataPegawai.email || ""}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, email: e.target.value })}
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
                      value={dataPegawai.noHp || ""}
                      onChange={(e) => setDataPegawai({ ...dataPegawai, noHp: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* =================================================
                  3. INFORMASI KESEPAKATAN ZAKAT (MULTI-ZAKAT)
              ================================================== */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <SectionTitle
                      number="3."
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
                      Zakat atas gaji, remunerasi, sertifikasi dosen &amp; honorarium rutin.
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
                      Zakat atas tabungan, simpanan emas, atau aset kekayaan mencapai haul.
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
                      Zakat jiwa untuk diri sendiri dan keluarga pada bulan suci Ramadan.
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
                              placeholder="500.000"
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
                              placeholder="2.500.000"
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

                {/* SUB-PILIHAN BANK JIKA MEMILIH TRANSFER BANK */}
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

                {/* SUB-PILIHAN E-WALLET JIKA MEMILIH E-WALLET */}
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
                  5. PERSETUJUAN & SUBMIT
              ================================================== */}
              <div>
                <SectionTitle
                  number="5."
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
                    Saya menyatakan bahwa data yang dipilih adalah data saya dan menyetujui komitmen zakat ini
                    untuk keperluan administrasi serta pelayanan zakat UPZ Universitas Siliwangi.
                  </span>
                </label>

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
                  <ShieldCheck size={13} />
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
          MODAL SUKSES PENDAFTARAN MUZAKKI
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
                Terima kasih, <strong>{registeredSummary.nama}</strong>. Data komitmen kesepakatan zakat Anda telah berhasil tersimpan di sistem UPZ Zakat Universitas Siliwangi.
              </p>
            </div>

            {/* RINGKASAN KARTU */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-left">
              <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
                <span className="text-xs text-gray-500">Profil Muzakki</span>
                <span className="text-xs font-bold text-gray-800">Dosen &amp; Staf UNSIL</span>
              </div>
              <div className="mt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">NIP</span>
                  <span className="font-mono font-semibold text-gray-800">{registeredSummary.nip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit / Fakultas</span>
                  <span className="font-semibold text-gray-800 text-right">{registeredSummary.unit}</span>
                </div>

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
                    Penghasilan per Bulan (Gaji + Tunjangan/Honor)
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