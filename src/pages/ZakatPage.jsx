import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
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
  Search,
  Users,
  Building2,
  Check,
  ClipboardCheck,
  ChevronDown,
  Layers,
  Sparkles,
  Sprout,
  WalletCards,
  Info,
  BookOpen,
  ArrowRight,
  FilePen,
  AlertCircle,
} from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { dummyJenisDonasi, nominalCepat, metodePembayaran } from "../data/dummyDonasi";
import { formatRupiah } from "../utils/formatRupiah";
import { submitDonasi } from "../services/donasiService";
import { getPublicMuzakki } from "../services/muzakkiService";
import { useSettings } from "../services/settingService";
import { ajukanPerubahanKesepakatan } from "../services/agreementService";
import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";

const JENIS_ZAKAT = [
  {
    id: "zakat-penghasilan",
    nama: "Zakat Penghasilan",
    deskripsi: "Zakat atas penghasilan/profesi yang sudah mencapai nisab, dikeluarkan setiap menerima penghasilan atau setiap bulan.",
  },
  {
    id: "zakat-maal",
    nama: "Zakat Maal",
    deskripsi: "Zakat atas harta yang dimiliki (tabungan, emas, aset) yang telah mencapai nisab dan haul (1 tahun).",
  },
  {
    id: "zakat-fitrah",
    nama: "Zakat Fitrah",
    deskripsi: "Zakat wajib yang dikeluarkan setiap muslim menjelang Idulfitri, senilai 2.5 kg makanan pokok per jiwa.",
  },
];

export default function ZakatPage() {
  const location = useLocation();
  const settings = useSettings();

  // ======================================================
  // SEARCHABLE DROPDOWN MUZAKKI TERDAFTAR
  // ======================================================
  const [searchMuzakkiQuery, setSearchMuzakkiQuery] = useState("");
  const [isDropdownMuzakkiOpen, setIsDropdownMuzakkiOpen] = useState(false);
  const [muzakkiList, setMuzakkiList] = useState([]);
  const [selectedMuzakki, setSelectedMuzakki] = useState(null);
  const [isMuzakkiLoading, setIsMuzakkiLoading] = useState(false);
  const searchContainerRef = useRef(null);

  // State modal ajukan perubahan kesepakatan
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementStatus, setAgreementStatus] = useState("idle"); // idle | loading | success | error
  const [agreementError, setAgreementError] = useState("");
  const [agreementAlasan, setAgreementAlasan] = useState("");
  const [agreementItems, setAgreementItems] = useState([]);

  // Load muzakki list from backend
  useEffect(() => {
    async function loadMuzakki() {
      setIsMuzakkiLoading(true);
      try {
        const res = await getPublicMuzakki();
        if (res && res.data) {
          setMuzakkiList(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat muzakki:", err);
      } finally {
        setIsMuzakkiLoading(false);
      }
    }
    loadMuzakki();
  }, []);

  // Filter muzakki list
  const filteredMuzakki = muzakkiList.filter((m) => {
    const q = searchMuzakkiQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.nama.toLowerCase().includes(q) ||
      (m.nip && m.nip.replace(/\D/g, "").includes(q.replace(/\D/g, ""))) ||
      (m.nik && m.nik.replace(/\D/g, "").includes(q.replace(/\D/g, ""))) ||
      (m.no_hp && m.no_hp.replace(/\D/g, "").includes(q.replace(/\D/g, ""))) ||
      (m.unit_kerja && m.unit_kerja.toLowerCase().includes(q))
    );
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsDropdownMuzakkiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ======================================================
  // STATE TAGIHAN KESEPAKATAN ZAKAT (DARI MUZAKKI TERDAFTAR)
  // ======================================================
  const [tagihanItems, setTagihanItems] = useState([]); // [{ key, jenis, nominal, frekuensi, detail, checked: true }]

  // Saat Muzakki dipilih dari Dropdown
  const handleSelectMuzakki = (muzakki) => {
    setSelectedMuzakki(muzakki);
    setSearchMuzakkiQuery(`${muzakki.nama} (${muzakki.kategori})`);
    setIsDropdownMuzakkiOpen(false);

    // Auto-isi data diri
    setData({
      nama: muzakki.nama || "",
      email: muzakki.email || "",
      telepon: muzakki.no_hp || "",
    });

    // Auto-isi metode pembayaran jika ada preferensi
    if (muzakki.metode_pembayaran) {
      if (muzakki.metode_pembayaran === "transfer-bank") {
        setMetodeId("transfer-bank");
        if (muzakki.pilihan_bank) setPilihanBank(muzakki.pilihan_bank);
      } else if (muzakki.metode_pembayaran === "e-wallet") {
        if (muzakki.pilihan_ewallet === "QRIS") {
          setMetodeId("qris");
        } else {
          setMetodeId("e-wallet");
          if (muzakki.pilihan_ewallet) setPilihanEwallet(muzakki.pilihan_ewallet);
        }
      }
    }

    // Bangun daftar item tagihan dari kesepakatan_zakat
    if (Array.isArray(muzakki.kesepakatan_zakat) && muzakki.kesepakatan_zakat.length > 0) {
      const items = muzakki.kesepakatan_zakat.map((item, idx) => ({
        id: item.key || `item-${idx}`,
        jenis: item.jenis || "Zakat",
        nominal: Number(item.nominal || 0),
        frekuensi: item.frekuensi || "bulanan",
        detail: item.detail || (item.jumlah_jiwa ? `${item.jumlah_jiwa} Jiwa` : `Frekuensi: ${item.frekuensi}`),
        checked: true,
      }));
      setTagihanItems(items);
    } else if (muzakki.nominal && Number(muzakki.nominal) > 0) {
      setTagihanItems([
        {
          id: "primary",
          jenis: muzakki.jenis_zakat || "Zakat Penghasilan",
          nominal: Number(muzakki.nominal),
          frekuensi: muzakki.frekuensi || "bulanan",
          detail: `Kesepakatan zakat (${muzakki.frekuensi || "rutin"})`,
          checked: true,
        },
      ]);
    } else {
      // Fallback kesepakatan
      setTagihanItems([
        {
          id: "default-penghasilan",
          jenis: muzakki.jenis_zakat || "Zakat Penghasilan",
          nominal: 500000,
          frekuensi: "bulanan",
          detail: "Komitmen Zakat Rutin",
          checked: true,
        },
      ]);
    }
  };

  const handleClearMuzakki = () => {
    setSelectedMuzakki(null);
    setSearchMuzakkiQuery("");
    setTagihanItems([]);
    setData({ nama: "", email: "", telepon: "" });
  };

  const toggleTagihanItem = (id) => {
    setTagihanItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Sync agreementItems saat tagihanItems berubah (pre-fill form perubahan)
  useEffect(() => {
    if (tagihanItems.length > 0) {
      setAgreementItems(
        tagihanItems.map((item) => ({
          key: item.id,
          jenis: item.jenis,
          frekuensi: item.frekuensi,
          nominal: item.nominal,
          detail: item.detail || "",
        }))
      );
    }
  }, [tagihanItems]);

  async function handleSubmitAgreement() {
    if (!selectedMuzakki) return;
    const invalid = agreementItems.some((i) => !i.nominal || Number(i.nominal) < 1000);
    if (invalid) {
      setAgreementError("Nominal setiap jenis zakat harus diisi minimal Rp 1.000.");
      return;
    }
    setAgreementStatus("loading");
    setAgreementError("");
    try {
      await ajukanPerubahanKesepakatan({
        muzakki_id: selectedMuzakki.id,
        alasan: agreementAlasan || null,
        perubahan_diajukan: agreementItems.map((i) => ({
          key: i.key,
          jenis: i.jenis,
          frekuensi: i.frekuensi,
          nominal: Number(i.nominal),
          detail: i.detail,
        })),
      });
      setAgreementStatus("success");
    } catch (err) {
      setAgreementError(err.message || "Gagal mengirim permohonan. Coba lagi.");
      setAgreementStatus("error");
    }
  }

  // Hitung total tagihan dari item yang dicentang
  const totalTagihanGabungan = tagihanItems
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.nominal, 0);

  // ======================================================
  // STATE MODE PENUNAIAN ZAKAT (TERDAFTAR vs MANUAL)
  // ======================================================
  const stateDariPerhitungan = location.state;
  const [modeTunaikan, setModeTunaikan] = useState(
    stateDariPerhitungan?.nominal ? "manual" : "terdaftar"
  );

  // State Kalkulator Zakat Modal
  const [showKalkulator, setShowKalkulator] = useState(false);
  const [jenisKalkulator, setJenisKalkulator] = useState("penghasilan");
  const [nilaiKalkulator, setNilaiKalkulator] = useState("");
  const [jumlahJiwaCalc, setJumlahJiwaCalc] = useState("1");
  const [nominalPerJiwaCalc, setNominalPerJiwaCalc] = useState("45000");
  const [hasilKalkulator, setHasilKalkulator] = useState(null);
  const [kalkulatorError, setKalkulatorError] = useState("");

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
        detail: `Zakat penghasilan ${hasil.kadarZakatPersen}% per bulan dari Rp ${new Intl.NumberFormat("id-ID").format(penghasilan)}.`,
      });
      return;
    }

    if (jenisKalkulator === "maal") {
      const harta = Number(String(nilaiKalkulator || "").replace(/\D/g, ""));
      if (!harta || harta <= 0) {
        setKalkulatorError("Silakan masukkan total harta bersih.");
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
          ? `Wajib zakat ${hasil.kadarZakatPersen}% dari total harta bersih (Nisab 85g emas: Rp ${new Intl.NumberFormat("id-ID").format(hasil.nisab)}).`
          : `Harta Anda (Rp ${new Intl.NumberFormat("id-ID").format(harta)}) belum mencapai batas nisab 85 gram emas (Rp ${new Intl.NumberFormat("id-ID").format(hasil.nisab)}).`,
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
        detail: `${jiwa} Jiwa × Rp ${new Intl.NumberFormat("id-ID").format(hasil.hargaBeras * 2.5)} (setara 2.5 kg beras/jiwa).`,
      });
      return;
    }
  };

  // ======================================================
  // STATE PENUNAIAN MANUAL (MULTI-ZAKAT BEBAS)
  // ======================================================
  const [manualZakat, setManualZakat] = useState({
    penghasilan: {
      selected: true,
      jenis: "Zakat Penghasilan",
      nominal: stateDariPerhitungan?.nominal || 100000,
      nominalCustom: stateDariPerhitungan?.nominal ? String(stateDariPerhitungan.nominal) : "",
      detail: "Per bulan",
    },
    maal: {
      selected: false,
      jenis: "Zakat Maal",
      nominal: 0,
      nominalCustom: "",
      detail: "Zakat atas simpanan & aset kekayaan",
    },
    fitrah: {
      selected: false,
      jenis: "Zakat Fitrah",
      jumlahJiwa: 1,
      nominalPerJiwa: 45000,
      nominal: 45000,
      detail: "1 Jiwa × Rp 45.000",
    },
  });

  const updateManualZakat = (key, patch) => {
    setManualZakat((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const terapkanHasilKalkulator = () => {
    if (!hasilKalkulator) return;
    // Hanya terapkan jika wajib zakat, atau jika ada value yang valid
    const val = hasilKalkulator.value;
    if (val === 0) return;
    if (jenisKalkulator === "penghasilan") {
      setManualZakat((prev) => ({
        ...prev,
        penghasilan: {
          ...prev.penghasilan,
          selected: true,
          nominal: val,
          nominalCustom: String(val),
        },
      }));
    } else if (jenisKalkulator === "maal") {
      setManualZakat((prev) => ({
        ...prev,
        maal: {
          ...prev.maal,
          selected: true,
          nominal: val,
          nominalCustom: String(val),
        },
      }));
    } else if (jenisKalkulator === "fitrah") {
      const jiwa = Number(jumlahJiwaCalc) || 1;
      setManualZakat((prev) => ({
        ...prev,
        fitrah: {
          ...prev.fitrah,
          selected: true,
          jumlahJiwa: jiwa,
          nominal: val,
          detail: `${jiwa} Jiwa × Rp 45.000`,
        },
      }));
    }
    setShowKalkulator(false);
  };

  // Helper untuk mengambil daftar zakat aktif di mode manual
  const getActiveManualList = () => {
    const list = [];
    if (manualZakat.penghasilan.selected && Number(manualZakat.penghasilan.nominal) > 0) {
      list.push({
        key: "penghasilan",
        jenis: "Zakat Penghasilan",
        nominal: Number(manualZakat.penghasilan.nominal),
        detail: manualZakat.penghasilan.detail || "Per bulan",
      });
    }
    if (manualZakat.maal.selected && Number(manualZakat.maal.nominal) > 0) {
      list.push({
        key: "maal",
        jenis: "Zakat Maal",
        nominal: Number(manualZakat.maal.nominal),
        detail: manualZakat.maal.detail || "Zakat atas simpanan & aset kekayaan",
      });
    }
    if (manualZakat.fitrah.selected && Number(manualZakat.fitrah.nominal) > 0) {
      list.push({
        key: "fitrah",
        jenis: "Zakat Fitrah",
        nominal: Number(manualZakat.fitrah.nominal),
        detail: `${manualZakat.fitrah.jumlahJiwa || 1} Jiwa × Rp 45.000`,
      });
    }
    return list;
  };

  const activeManualList = getActiveManualList();
  const totalManualNominal = activeManualList.reduce((sum, item) => sum + item.nominal, 0);

  // Common State
  const [metodeId, setMetodeId] = useState("transfer-bank");
  const [pilihanBank, setPilihanBank] = useState("BSI");
  const [pilihanEwallet, setPilihanEwallet] = useState("GoPay");
  const [anonim, setAnonim] = useState(settings?.privasi?.defaultAnonimPublik || false);

  const [data, setData] = useState({
    nama: "",
    email: "",
    telepon: "",
  });

  const [status, setStatus] = useState("idle");
  const [hasil, setHasil] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Tentukan nominal akhir yang akan dibayar
  const nominalAkhir =
    modeTunaikan === "terdaftar"
      ? totalTagihanGabungan
      : totalManualNominal;

  // Rincian kategori zakat untuk transaksi
  const kategoriTransaksi =
    modeTunaikan === "terdaftar"
      ? (tagihanItems.filter((i) => i.checked).map((i) => i.jenis).join(", ") || "Zakat")
      : (activeManualList.map((i) => i.jenis).join(", ") || "Zakat");

  // Rincian asal nominal untuk deskripsi
  const rincianAsalNominal =
    modeTunaikan === "terdaftar"
      ? (tagihanItems.filter((i) => i.checked).map((i) => `${i.jenis}: Rp ${new Intl.NumberFormat("id-ID").format(i.nominal)} (${i.detail})`).join(" + ") || null)
      : (activeManualList.map((i) => `${i.jenis}: Rp ${new Intl.NumberFormat("id-ID").format(i.nominal)} (${i.detail})`).join(" + ") || null);

  // Reset form bersih saat berpindah state/mode
  function handleSwitchMode(targetMode) {
    if (targetMode === modeTunaikan) return;
    setModeTunaikan(targetMode);

    // Reset seluruh state agar bersih dan bebas bug
    setSearchMuzakkiQuery("");
    setIsDropdownMuzakkiOpen(false);
    setSelectedMuzakki(null);
    setTagihanItems([]);
    setData({
      nama: "",
      email: "",
      telepon: "",
    });
    setAnonim(false);
    setMetodeId("transfer-bank");
    setPilihanBank("BSI");
    setPilihanEwallet("GoPay");
    setErrorMsg("");
    setStatus("idle");
    setHasil(null);

    // Reset manual state
    setManualZakat({
      penghasilan: {
        selected: true,
        jenis: "Zakat Penghasilan",
        nominal: 100000,
        nominalCustom: "",
        detail: "Per bulan",
      },
      maal: {
        selected: false,
        jenis: "Zakat Maal",
        nominal: 0,
        nominalCustom: "",
        detail: "Zakat atas simpanan & aset kekayaan",
      },
      fitrah: {
        selected: false,
        jenis: "Zakat Fitrah",
        jumlahJiwa: 1,
        nominalPerJiwa: 45000,
        nominal: 45000,
        detail: "1 Jiwa × Rp 45.000",
      },
    });
  }

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

    if (modeTunaikan === "terdaftar") {
      if (!selectedMuzakki) {
        setErrorMsg("Silakan cari dan pilih data profil muzakki Anda terlebih dahulu.");
        return;
      }
      if (tagihanItems.filter((i) => i.checked).length === 0) {
        setErrorMsg("Pilih minimal satu item tagihan zakat yang ingin ditunaikan.");
        return;
      }
    } else {
      if (activeManualList.length === 0) {
        setErrorMsg("Pilih dan centang minimal satu jenis zakat yang ingin Anda tunaikan.");
        return;
      }
    }

    if (!nominalAkhir || nominalAkhir < 10000) {
      setErrorMsg("Minimal total nominal penunaian zakat adalah Rp10.000.");
      return;
    }

    if (!anonim && !data.nama.trim()) {
      setErrorMsg("Nama pembayar zakat wajib diisi kecuali memilih opsi Hamba Allah (anonim).");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        jenis: "zakat",
        kategori: kategoriTransaksi,
        nominal: nominalAkhir,
        nama_donatur: anonim ? "Hamba Allah" : data.nama,
        email: data.email || null,
        telepon: data.telepon || null,
        anonim,
        metode: metodeId,
        muzakki_id: modeTunaikan === "terdaftar" && selectedMuzakki ? selectedMuzakki.id : null,
        pilihan_bank: metodeId === "transfer-bank" ? pilihanBank : null,
        pilihan_ewallet: metodeId === "e-wallet" ? pilihanEwallet : null,
        keterangan: rincianAsalNominal
          ? (modeTunaikan === "terdaftar"
              ? `Pembayaran Zakat Terdaftar: ${rincianAsalNominal}`
              : `Penunaian Zakat: ${rincianAsalNominal}`)
          : `Penunaian ${kategoriTransaksi}`,
      };

      const res = await submitDonasi(payload);
      setHasil(res.data || res);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Gagal memproses transaksi zakat. Silakan coba lagi.");
      setStatus("error");
    }
  }

  // ======================================================
  // SUCCESS / RECEIPT VIEW
  // ======================================================
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#f8faf9] py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#08734f] shadow-inner mb-4">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#08734f] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles size={13} /> Transaksi Dibuat
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
            Instruksi Pembayaran Zakat
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Transaksi penunaian zakat Anda berhasil dibuat. Silakan selesaikan pembayaran.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Kode Transaksi</span>
                <span className="font-mono font-bold text-gray-900">{hasil?.kode || hasil?.id || "-"}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Jenis Zakat</span>
                <span className="font-medium text-gray-900 text-right">{kategoriTransaksi}</span>
              </div>
              {rincianAsalNominal && (
                <div className="py-2.5 bg-emerald-50/70 p-3 rounded-xl mt-1 text-[11px] text-emerald-900 border border-emerald-100">
                  <p className="font-semibold text-emerald-800 mb-1">Rincian Komitmen Tagihan:</p>
                  <p className="leading-relaxed">{rincianAsalNominal}</p>
                </div>
              )}
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-gray-500">Total Pembayaran</span>
                <span className="text-xl font-extrabold text-[#08734f]">
                  Rp {new Intl.NumberFormat("id-ID").format(nominalAkhir)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Metode</span>
                <span className="font-medium text-gray-900 capitalize">
                  {metodeId === "transfer-bank"
                    ? `Transfer Bank (${pilihanBank})`
                    : metodeId === "qris"
                    ? "QRIS (Semua Pembayaran)"
                    : `E-Wallet (${pilihanEwallet})`}
                </span>
              </div>
            </div>

            {/* DETAIL REKENING */}
            {metodeId === "transfer-bank" && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                <p className="text-xs text-slate-600 font-medium">Rekening Tujuan ({pilihanBank}):</p>
                <p className="mt-1 font-mono text-base font-extrabold text-slate-900">
                  {pilihanBank === "BSI"
                    ? "7700-8811-99"
                    : pilihanBank === "Mandiri"
                    ? "131-00-9876543-2"
                    : pilihanBank === "BRI"
                    ? "0100-01-001234-53-0"
                    : pilihanBank === "BNI"
                    ? "0234-5678-90"
                    : "102-00-554433-2"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">a.n. UPZ Zakat Universitas Siliwangi</p>
              </div>
            )}

            {metodeId === "qris" && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-center">
                <QrCode className="mx-auto h-24 w-24 text-emerald-800" />
                <p className="text-xs font-semibold text-slate-800 mt-2">Scan QRIS Resmi UPZ UNSIL</p>
                <p className="text-[11px] text-slate-500">Buka aplikasi m-Banking atau dompet digital Anda dan scan kode QR ini.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setStatus("idle");
                setHasil(null);
              }}
            >
              Tunaikan Zakat Lainnya
            </Button>
            <Link
              to="/daftar-muzakki"
              className="text-xs text-slate-500 hover:text-[#08734f] underline"
            >
              Kembali ke Daftar Muzakki
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // FORM VIEW
  // ======================================================
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* =====================================================
          HERO BANNER (DARK GREEN BRAND BACKGROUND)
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#064f35] via-[#08613d] to-[#0b7548] text-white py-12 md:py-14">
        {/* DEKORATIF ORNAMEN LINGKARAN */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[24px] border-white/10 pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full border-[18px] border-white/10 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          {/* BADGE PIL */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-green-100 border border-white/20 backdrop-blur-xs">
            <BookOpen size={13} />
            <span>Tunaikan Zakat</span>
          </div>

          {/* TITLE */}
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Tunaikan Zakat
          </h1>

          {/* SUBTITLE */}
          <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-green-100/90 leading-relaxed">
            Tunaikan zakat Anda melalui UPZ Zakat Universitas Siliwangi dengan mudah, aman, dan terpercaya.
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTAINER (CENTERED CARDS)
      ====================================================== */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        {/* ====================================================
            0. TABS MODE PEMILIHAN: TERDAFTAR VS MANUAL
        ==================================================== */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200">
          <button
            type="button"
            onClick={() => handleSwitchMode("terdaftar")}
            className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold transition ${
              modeTunaikan === "terdaftar"
                ? "bg-white text-[#08734f] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardCheck size={17} className={modeTunaikan === "terdaftar" ? "text-[#08734f]" : "text-slate-400"} />
            <span>Muzakki Terdaftar (Cari Profil &amp; Tagihan)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("manual")}
            className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold transition ${
              modeTunaikan === "manual"
                ? "bg-white text-[#08734f] shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User size={17} className={modeTunaikan === "manual" ? "text-[#08734f]" : "text-slate-400"} />
            <span>Belum Terdaftar / Penunaian Bebas</span>
          </button>
        </div>

        {/* ====================================================
            KONDISI A: MODE MUZAKKI TERDAFTAR
        ==================================================== */}
        {modeTunaikan === "terdaftar" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08734f]">
              <Search size={17} />
              Cari Data Muzakki Anda di Sini:
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Ketik Nama, NIP, NIK, atau Nomor HP untuk memuat komitmen tagihan kesepakatan zakat Anda secara otomatis.
            </p>

            <div className="mt-3 relative" ref={searchContainerRef}>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchMuzakkiQuery}
                  onChange={(e) => {
                    setSearchMuzakkiQuery(e.target.value);
                    setIsDropdownMuzakkiOpen(true);
                  }}
                  onFocus={() => setIsDropdownMuzakkiOpen(true)}
                  placeholder="Ketik Nama / NIP / NIK / No. HP Anda (Contoh: Ahmad Fauzi / 3278...)..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs sm:text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />
                {searchMuzakkiQuery && (
                  <button
                    type="button"
                    onClick={handleClearMuzakki}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* DROPDOWN POPUP */}
              {isDropdownMuzakkiOpen && (
                <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {isMuzakkiLoading ? (
                    <div className="p-4 text-center text-xs text-slate-500">Memuat data muzakki...</div>
                  ) : filteredMuzakki.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Muzakki tidak ditemukan. Anda dapat menggunakan tab <strong>"Belum Terdaftar"</strong> di atas untuk penunaian bebas.
                    </div>
                  ) : (
                    filteredMuzakki.slice(0, 10).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMuzakki(m)}
                        className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-green-50/70 last:border-b-0"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-[#08734f] text-xs font-bold mt-0.5">
                          {m.nama.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{m.nama}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {m.nip ? `NIP: ${m.nip}` : `NIK: ${m.nik || "-"}`} • {m.unit_kerja || m.kategori}
                          </p>
                          {m.nominal && (
                            <p className="text-[11px] font-semibold text-emerald-700">
                              Komitmen: Rp {new Intl.NumberFormat("id-ID").format(m.nominal)} ({m.jenis_zakat || "Zakat"})
                            </p>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* STATUS TERPILIH */}
            {selectedMuzakki && (
              <div className="mt-3 flex items-center justify-between gap-2.5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs text-emerald-900 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>
                    Muzakki Terdaftar: <strong>{selectedMuzakki.nama}</strong> ({selectedMuzakki.kategori})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearMuzakki}
                  className="text-[11px] font-semibold text-emerald-700 underline hover:text-emerald-900"
                >
                  Ganti Muzakki
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            FORM UTAMA PENUNAIAN ZAKAT
        ==================================================== */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* ====================================================
              KONDISI A: MODE TERDAFTAR
          ==================================================== */}
          {modeTunaikan === "terdaftar" ? (
            selectedMuzakki && tagihanItems.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-[#08734f]">
                  <ClipboardCheck size={19} />
                  Daftar Tagihan Kesepakatan Zakat Anda:
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Berikut adalah rincian zakat yang telah Anda sepakati saat pendaftaran. Anda dapat mencentang zakat yang ingin ditunaikan saat ini.
                </p>

                {/* LIST TAGIHAN DENGAN CHECKBOX */}
                <div className="mt-4 space-y-3">
                  {tagihanItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleTagihanItem(item.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                        item.checked
                          ? "border-[#08734f] bg-green-50/60 shadow-xs"
                          : "border-slate-200 bg-white opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}}
                          className="h-4 w-4 accent-[#08734f] rounded"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">{item.jenis}</p>
                          <p className="text-[11px] text-slate-500">{item.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-[#08734f]">
                          Rp {new Intl.NumberFormat("id-ID").format(item.nominal)}
                        </p>
                        <span className="text-[10px] text-slate-400 capitalize">{item.frekuensi}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* KOTAK TOTAL TAGIHAN GABUNGAN & ASAL NOMINAL */}
                <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-700">Total Nominal yang Ditunaikan:</span>
                      {tagihanItems.filter((i) => i.checked).length > 0 && (
                        <div className="text-[11px] text-emerald-800 space-y-1 mt-1">
                          <p className="font-semibold text-emerald-900">Didapat dari:</p>
                          <ul className="space-y-0.5">
                            {tagihanItems
                              .filter((i) => i.checked)
                              .map((item) => (
                                <li key={item.id} className="flex items-center gap-1.5">
                                  <span className="text-emerald-700">•</span>
                                  <span>
                                    {item.jenis}: Rp {new Intl.NumberFormat("id-ID").format(item.nominal)} ({item.detail})
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <span className="text-xl font-semibold text-[#08734f] shrink-0 whitespace-nowrap pt-0.5">
                      Rp {new Intl.NumberFormat("id-ID").format(totalTagihanGabungan)}
                    </span>
                  </div>
                </div>

                {/* AJUKAN PERUBAHAN KESEPAKATAN */}
                <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-slate-500">
                  <span>Nominalnya berubah?</span>
                  <button
                    type="button"
                    onClick={() => setShowAgreementModal(true)}
                    className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900 transition"
                  >
                    Ajukan Perubahan Kesepakatan →
                  </button>
                </div>
              </div>
            ) : null
          ) : (
            /* ==================================================
               KONDISI B: MANUAL INPUT / PENUNAIAN BEBAS MULTI-ZAKAT
            ================================================== */
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                    Pilih Jenis Zakat yang Ingin Ditunaikan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Centang satu atau beberapa jenis zakat sekaligus sesuai kewajiban Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openKalkulator("penghasilan")}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-[#08734f] hover:bg-emerald-100 transition shadow-2xs"
                >
                  <Calculator size={14} />
                  <span>Buka Kalkulator Zakat</span>
                </button>
              </div>

              {/* LIST PILIHAN ZAKAT (MULTI-SELECTION) */}
              <div className="space-y-4">
                {/* 1. ZAKAT PENGHASILAN */}
                <div
                  className={`rounded-2xl border transition ${
                    manualZakat.penghasilan.selected
                      ? "border-[#08734f] bg-green-50/40 p-5 shadow-2xs"
                      : "border-slate-200 bg-white p-4 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={manualZakat.penghasilan.selected}
                        onChange={(e) => updateManualZakat("penghasilan", { selected: e.target.checked })}
                        className="h-5 w-5 rounded accent-[#08734f] mt-0.5"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider text-[#08734f] uppercase block">
                          Zakat Profesi
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">Zakat Penghasilan</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Zakat atas gaji/penghasilan bulanan atau honor saat menerima upah kerja.
                        </p>
                      </div>
                    </label>
                    {manualZakat.penghasilan.selected && (
                      <button
                        type="button"
                        onClick={() => openKalkulator("penghasilan")}
                        className="text-xs text-[#08734f] font-semibold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Calculator size={13} /> Hitung
                      </button>
                    )}
                  </div>

                  {manualZakat.penghasilan.selected && (
                    <div className="mt-4 pt-4 border-t border-emerald-100/80 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {[50000, 100000, 250000, 500000, 1000000, 2500000].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() =>
                              updateManualZakat("penghasilan", { nominal: n, nominalCustom: "" })
                            }
                            className={`py-2 px-2 rounded-xl border text-xs font-semibold transition ${
                              manualZakat.penghasilan.nominal === n && !manualZakat.penghasilan.nominalCustom
                                ? "border-[#08734f] bg-[#08734f] text-white font-bold"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {formatRupiah(n)}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Atau Masukkan Nominal Bebas (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                            Rp
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              manualZakat.penghasilan.nominalCustom
                                ? Number(manualZakat.penghasilan.nominalCustom).toLocaleString("id-ID")
                                : manualZakat.penghasilan.nominal
                                ? Number(manualZakat.penghasilan.nominal).toLocaleString("id-ID")
                                : ""
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              updateManualZakat("penghasilan", {
                                nominalCustom: raw,
                                nominal: raw ? Number(raw) : 0,
                              });
                            }}
                            placeholder="100.000"
                            className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium outline-none focus:border-[#08734f] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. ZAKAT MAAL */}
                <div
                  className={`rounded-2xl border transition ${
                    manualZakat.maal.selected
                      ? "border-[#08734f] bg-green-50/40 p-5 shadow-2xs"
                      : "border-slate-200 bg-white p-4 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={manualZakat.maal.selected}
                        onChange={(e) =>
                          updateManualZakat("maal", {
                            selected: e.target.checked,
                            nominal: e.target.checked && manualZakat.maal.nominal === 0 ? 500000 : manualZakat.maal.nominal,
                          })
                        }
                        className="h-5 w-5 rounded accent-[#08734f] mt-0.5"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider text-[#08734f] uppercase block">
                          Zakat Harta
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">Zakat Maal</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Zakat simpanan tabungan, emas, investasi, atau perniagaan yang mencapai nisab &amp; haul.
                        </p>
                      </div>
                    </label>
                    {manualZakat.maal.selected && (
                      <button
                        type="button"
                        onClick={() => openKalkulator("maal")}
                        className="text-xs text-[#08734f] font-semibold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Calculator size={13} /> Hitung
                      </button>
                    )}
                  </div>

                  {manualZakat.maal.selected && (
                    <div className="mt-4 pt-4 border-t border-emerald-100/80 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[500000, 1000000, 2500000, 5000000, 10000000].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() =>
                              updateManualZakat("maal", { nominal: n, nominalCustom: "" })
                            }
                            className={`py-2 px-2 rounded-xl border text-xs font-semibold transition ${
                              manualZakat.maal.nominal === n && !manualZakat.maal.nominalCustom
                                ? "border-[#08734f] bg-[#08734f] text-white font-bold"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {formatRupiah(n)}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Atau Masukkan Nominal Bebas (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                            Rp
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              manualZakat.maal.nominalCustom
                                ? Number(manualZakat.maal.nominalCustom).toLocaleString("id-ID")
                                : manualZakat.maal.nominal
                                ? Number(manualZakat.maal.nominal).toLocaleString("id-ID")
                                : ""
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              updateManualZakat("maal", {
                                nominalCustom: raw,
                                nominal: raw ? Number(raw) : 0,
                              });
                            }}
                            placeholder="500.000"
                            className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium outline-none focus:border-[#08734f] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ZAKAT FITRAH */}
                <div
                  className={`rounded-2xl border transition ${
                    manualZakat.fitrah.selected
                      ? "border-[#08734f] bg-green-50/40 p-5 shadow-2xs"
                      : "border-slate-200 bg-white p-4 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={manualZakat.fitrah.selected}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const jiwa = manualZakat.fitrah.jumlahJiwa || 1;
                          const perJiwa = manualZakat.fitrah.nominalPerJiwa || 45000;
                          updateManualZakat("fitrah", {
                            selected: checked,
                            nominal: checked ? jiwa * perJiwa : 0,
                          });
                        }}
                        className="h-5 w-5 rounded accent-[#08734f] mt-0.5"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider text-[#08734f] uppercase block">
                          Zakat Jiwa
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">Zakat Fitrah</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Zakat penyuci jiwa wajib saat bulan suci Ramadan (setara 2.5 kg beras / Rp 45.000 per jiwa).
                        </p>
                      </div>
                    </label>
                    {manualZakat.fitrah.selected && (
                      <button
                        type="button"
                        onClick={() => openKalkulator("fitrah")}
                        className="text-xs text-[#08734f] font-semibold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Calculator size={13} /> Hitung
                      </button>
                    )}
                  </div>

                  {manualZakat.fitrah.selected && (
                    <div className="mt-4 pt-4 border-t border-emerald-100/80 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Jumlah Jiwa (Tanggungan Keluarga)
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newJiwa = Math.max(1, (manualZakat.fitrah.jumlahJiwa || 1) - 1);
                              const perJiwa = manualZakat.fitrah.nominalPerJiwa || 45000;
                              updateManualZakat("fitrah", {
                                jumlahJiwa: newJiwa,
                                nominal: newJiwa * perJiwa,
                              });
                            }}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={manualZakat.fitrah.jumlahJiwa || 1}
                            onChange={(e) => {
                              const newJiwa = Math.max(1, Number(e.target.value) || 1);
                              const perJiwa = manualZakat.fitrah.nominalPerJiwa || 45000;
                              updateManualZakat("fitrah", {
                                jumlahJiwa: newJiwa,
                                nominal: newJiwa * perJiwa,
                              });
                            }}
                            className="h-10 w-20 text-center rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#08734f] bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newJiwa = (manualZakat.fitrah.jumlahJiwa || 1) + 1;
                              const perJiwa = manualZakat.fitrah.nominalPerJiwa || 45000;
                              updateManualZakat("fitrah", {
                                jumlahJiwa: newJiwa,
                                nominal: newJiwa * perJiwa,
                              });
                            }}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                          <span className="text-xs text-slate-500 ml-1">Jiwa</span>
                        </div>
                      </div>

                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 text-right">
                        <span className="text-[10px] text-slate-500 block">Total Zakat Fitrah:</span>
                        <span className="text-sm font-bold text-[#08734f]">
                          {manualZakat.fitrah.jumlahJiwa || 1} × Rp 45.000 = Rp {new Intl.NumberFormat("id-ID").format(manualZakat.fitrah.nominal)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KOTAK TOTAL TAGIHAN GABUNGAN MANUAL & ASAL NOMINAL */}
              {activeManualList.length > 0 && (
                <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-700">Total Nominal yang Ditunaikan:</span>
                      <div className="text-[11px] text-emerald-800 space-y-1 mt-1">
                        <p className="font-semibold text-emerald-900">Didapat dari:</p>
                        <ul className="space-y-0.5">
                          {activeManualList.map((item) => (
                            <li key={item.key} className="flex items-center gap-1.5">
                              <span className="text-emerald-700">•</span>
                              <span>
                                {item.jenis}: Rp {new Intl.NumberFormat("id-ID").format(item.nominal)} ({item.detail})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-[#08734f] shrink-0 whitespace-nowrap pt-0.5">
                      Rp {new Intl.NumberFormat("id-ID").format(totalManualNominal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              3. DATA MUZAKKI
          ==================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                {modeTunaikan === "terdaftar" ? "Data Diri Muzakki" : "3. Data Pembayar Zakat"}
              </h2>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={anonim}
                  onChange={(e) => setAnonim(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#08734f]"
                />
                <span>Tampilkan sebagai Hamba Allah (anonim)</span>
              </label>
            </div>

            {!anonim && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={data.nama}
                    onChange={handleDataChange}
                    required={!anonim}
                    placeholder="Nama lengkap muzakki"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleDataChange}
                    placeholder="nama@email.com (untuk kwitansi & laporan)"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    name="telepon"
                    value={data.telepon}
                    onChange={handleDataChange}
                    placeholder="08xxxxxxxxxx"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs sm:text-sm outline-none focus:border-[#08734f]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
              4. METODE PEMBAYARAN
          ==================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-3.5">
              {modeTunaikan === "terdaftar" ? "Metode Pembayaran" : "4. Metode Pembayaran"}
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "transfer-bank",
                  nama: "Transfer Bank",
                  desc: "BSI, Mandiri, BNI Syariah, BRI, Muamalat",
                  icon: Landmark,
                },
                {
                  id: "qris",
                  nama: "QRIS",
                  desc: "Scan & bayar via e-wallet apa pun",
                  icon: QrCode,
                },
                {
                  id: "e-wallet",
                  nama: "E-Wallet",
                  desc: "GoPay, OVO, DANA, ShopeePay",
                  icon: Smartphone,
                },
              ].map((m) => {
                const Icon = m.icon;
                const selected = metodeId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setMetodeId(m.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      selected
                        ? "border-[#08734f] bg-green-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="metodePembayaran"
                        checked={selected}
                        onChange={() => {}}
                        className="h-4 w-4 accent-[#08734f]"
                      />
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">{m.nama}</p>
                        <p className="text-[11px] text-slate-500">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUB-PILIHAN BANK */}
            {metodeId === "transfer-bank" && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Bank Rekening:</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {["BSI", "Mandiri", "BRI", "BNI", "Muamalat"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setPilihanBank(b)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        pilihanBank === b
                          ? "border-[#08734f] bg-[#08734f] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PILIHAN E-WALLET */}
            {metodeId === "e-wallet" && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Dompet Digital:</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["GoPay", "OVO", "Dana", "ShopeePay"].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setPilihanEwallet(w)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        pilihanEwallet === w
                          ? "border-[#08734f] bg-[#08734f] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
              5. SUBMIT CARD & TOTAL ZAKAT
          ==================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">Total Nominal Zakat:</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#08734f]">
                Rp {new Intl.NumberFormat("id-ID").format(nominalAkhir)}
              </span>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#08734f] text-sm font-bold text-white shadow-md transition hover:bg-[#065d40] disabled:opacity-50"
            >
              {status === "loading" ? (
                <>Memproses...</>
              ) : (
                <>
                  <Heart size={18} />
                  Tunaikan Zakat Sekarang
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-slate-400">
              Transaksi aman dan dikelola secara amanah dan transparan oleh UPZ Universitas Siliwangi.
            </p>
          </div>
        </form>
      </main>

      {/* ====================================================
          MODAL AJUKAN PERUBAHAN KESEPAKATAN ZAKAT
      ==================================================== */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#08734f] to-emerald-600 px-6 py-4 flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-white">
                <FilePen size={20} />
                <div>
                  <h3 className="font-bold text-base leading-tight">Ajukan Perubahan Kesepakatan</h3>
                  <p className="text-[11px] text-emerald-100 mt-0.5">
                    {selectedMuzakki?.nama}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAgreementModal(false);
                  setAgreementStatus("idle");
                  setAgreementError("");
                }}
                className="text-white/70 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {agreementStatus === "success" ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 size={36} className="text-[#08734f]" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800">Permohonan Terkirim!</h4>
                  <p className="text-xs text-slate-500">
                    Admin UPZ akan meninjau permohonan Anda dan mengonfirmasi perubahan kesepakatan. 
                    Anda akan dihubungi melalui no. HP terdaftar.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAgreementModal(false);
                      setAgreementStatus("idle");
                      setAgreementError("");
                    }}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#08734f] px-5 py-2 text-xs font-semibold text-white hover:bg-[#065a3d] transition"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ubah nominal atau frekuensi kesepakatan zakat Anda di bawah ini. 
                    Admin UPZ akan memverifikasi dan memperbarui data Anda.
                  </p>

                  {/* Items */}
                  <div className="space-y-3">
                    {agreementItems.map((item, idx) => (
                      <div key={item.key} className="rounded-xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">{item.jenis}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
                            {item.frekuensi}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Nominal Baru (Rp)</label>
                            <input
                              type="text"
                              value={
                                item.nominal !== "" && item.nominal !== undefined && item.nominal !== null
                                  ? new Intl.NumberFormat("id-ID").format(item.nominal)
                                  : ""
                              }
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, "");
                                setAgreementItems((prev) =>
                                  prev.map((it, i) =>
                                    i === idx ? { ...it, nominal: raw ? Number(raw) : "" } : it
                                  )
                                );
                              }}
                              placeholder="0"
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium focus:border-[#08734f] focus:outline-none focus:ring-1 focus:ring-[#08734f]/30"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Frekuensi</label>
                            <select
                              value={item.frekuensi}
                              onChange={(e) =>
                                setAgreementItems((prev) =>
                                  prev.map((it, i) =>
                                    i === idx ? { ...it, frekuensi: e.target.value } : it
                                  )
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#08734f] focus:outline-none"
                            >
                              <option value="bulanan">Bulanan</option>
                              <option value="triwulanan">Triwulanan</option>
                              <option value="semesteran">Semesteran</option>
                              <option value="tahunan">Tahunan</option>
                              <option value="ramadan">Ramadan</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alasan */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Alasan Perubahan <span className="text-slate-400 font-normal">(opsional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={agreementAlasan}
                      onChange={(e) => setAgreementAlasan(e.target.value)}
                      placeholder="Contoh: Gaji naik golongan, jumlah tanggungan bertambah, dll."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none focus:border-[#08734f] focus:outline-none focus:ring-1 focus:ring-[#08734f]/30"
                      maxLength={500}
                    />
                  </div>

                  {/* Error */}
                  {agreementError && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      {agreementError}
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAgreementModal(false);
                        setAgreementStatus("idle");
                        setAgreementError("");
                      }}
                      className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitAgreement}
                      disabled={agreementStatus === "loading"}
                      className="flex-1 rounded-lg bg-[#08734f] py-2.5 text-xs font-semibold text-white hover:bg-[#065a3d] disabled:opacity-60 transition"
                    >
                      {agreementStatus === "loading" ? "Mengirim..." : "Kirim Permohonan"}
                    </button>
                  </div>
                </div>
              )}
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
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#08734f]">
                <Calculator size={23} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kalkulator Zakat</h2>
                <p className="text-xs text-gray-500">Hitung estimasi zakat sebelum ditunaikan.</p>
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
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 font-medium">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={nilaiKalkulator ? new Intl.NumberFormat("id-ID").format(Number(nilaiKalkulator)) : ""}
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
                    Total Harta Bersih (Tabungan / Deposito / Emas)
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-200">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 font-medium">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={nilaiKalkulator ? new Intl.NumberFormat("id-ID").format(Number(nilaiKalkulator)) : ""}
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
                Hitung Estimasi Zakat
              </button>
            </div>

            {/* HASIL ESTIMASI */}
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
                  Rp {new Intl.NumberFormat("id-ID").format(hasilKalkulator.value)}
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
                  Terapkan ke Formulir (Rp {new Intl.NumberFormat("id-ID").format(hasilKalkulator.value)})
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