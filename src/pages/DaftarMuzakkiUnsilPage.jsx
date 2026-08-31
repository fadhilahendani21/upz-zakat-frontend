import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Search,
  ShieldCheck,
  Clock3,
  LockKeyhole,
  Building2,
  Calculator,
  X,
  UserPlus,
  Users,
  CheckCircle2,
  Sparkles,
  Loader2,
  Info,
  WalletCards,
  Landmark,
} from "lucide-react";

import { DOSEN_STAF_UNSIL } from "../data/dummyDosenStaf";
import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";
import { registerPublicMuzakki } from "../services/muzakkiService";

export default function DaftarMuzakkiUnsilPage() {
  // =========================================================
  // STATE PENCARIAN DATA
  // =========================================================

  const [metodeCari, setMetodeCari] = useState("nip");
  const [keyword, setKeyword] = useState("");
  const [dataDitemukan, setDataDitemukan] = useState(false);
  const [cariError, setCariError] = useState("");

  // =========================================================
  // DATA PEGAWAI DITEMUKAN
  // =========================================================

  const [dataPegawai, setDataPegawai] = useState({
    nama: "",
    nip: "",
    unit: "",
    jurusan: "",
    jabatan: "",
    email: "",
    noHp: "",
    golongan: "",
  });

  // =========================================================
  // STATE PERSETUJUAN
  // =========================================================

  const [setuju, setSetuju] = useState(false);

  // =========================================================
  // STATE KALKULATOR
  // =========================================================

  const [showKalkulator, setShowKalkulator] = useState(false);
  const [jenisKalkulator, setJenisKalkulator] = useState("penghasilan");
  const [nilaiKalkulator, setNilaiKalkulator] = useState("");
  const [jumlahJiwa, setJumlahJiwa] = useState("1");
  const [nominalPerJiwa, setNominalPerJiwa] = useState("45000");
  const [hasilKalkulator, setHasilKalkulator] = useState(null);

  // =========================================================
  // CARI DATA DOSEN / STAF
  // =========================================================

  const handleCariData = (customTerm = null) => {
    const rawTerm = typeof customTerm === "string" ? customTerm : keyword;
    const term = rawTerm.trim().toLowerCase();

    if (!term) {
      setCariError(
        `Silakan masukkan ${metodeCari === "nip" ? "NIP" : "nama"} terlebih dahulu.`
      );
      setDataDitemukan(false);
      return;
    }

    const found = DOSEN_STAF_UNSIL.find((p) => {
      if (metodeCari === "nip") {
        return p.nip.replace(/\D/g, "").includes(term.replace(/\D/g, ""));
      } else {
        return p.nama.toLowerCase().includes(term);
      }
    });

    if (found) {
      setDataPegawai(found);
      setDataDitemukan(true);
      setCariError("");
      setKeyword(metodeCari === "nip" ? found.nip : found.nama);
    } else {
      setDataDitemukan(false);
      setCariError(
        `Data pegawai dengan ${metodeCari === "nip" ? "NIP" : "nama"} "${rawTerm}" tidak ditemukan di database kepegawaian UNSIL.`
      );
    }
  };


  // =========================================================
  // FORMAT NOMINAL
  // =========================================================

  const formatNominal = (value) => {
    const angka = String(value || "").replace(/\D/g, "");

    if (!angka) {
      return "";
    }

    return new Intl.NumberFormat("id-ID").format(
      Number(angka)
    );
  };

  // =========================================================
  // HANDLE NOMINAL
  // =========================================================

  // =========================================================
  // BUKA KALKULATOR
  // =========================================================

  const openKalkulator = () => {
    const config = getZakatConfig();
    setShowKalkulator(true);
    setJenisKalkulator("penghasilan");
    setNilaiKalkulator("");
    setJumlahJiwa("1");
    setNominalPerJiwa(String(Math.round(2.5 * config.hargaBerasPerKg)));
    setHasilKalkulator(null);
  };

  // =========================================================
  // GANTI JENIS KALKULATOR
  // =========================================================

  const handleJenisKalkulator = (value) => {
    const config = getZakatConfig();
    setJenisKalkulator(value);
    setNilaiKalkulator("");
    setHasilKalkulator(null);

    if (value === "fitrah") {
      setJumlahJiwa("1");
      setNominalPerJiwa(String(Math.round(2.5 * config.hargaBerasPerKg)));
    }
  };

  // =========================================================
  // HITUNG KALKULATOR (SESUAI PENGATURAN SISTEM)
  // =========================================================

  const handleHitungKalkulator = () => {
    // ZAKAT PENGHASILAN
    if (jenisKalkulator === "penghasilan") {
      const penghasilan = Number(
        String(nilaiKalkulator || "").replace(/\D/g, "")
      );

      if (!penghasilan || penghasilan <= 0) {
        alert("Silakan masukkan penghasilan per bulan.");
        return;
      }

      const hasil = hitungZakatPenghasilan(penghasilan);

      setHasilKalkulator({
        label: "Estimasi Zakat Penghasilan",
        value: hasil.jumlahZakat,
        wajib: hasil.wajibZakat,
        detail: hasil.wajibZakat
          ? `Wajib zakat ${hasil.kadarZakatPersen}% (Nisab setara 85 gram emas: Rp ${formatNominal(hasil.nisab)}/thn).`
          : `Penghasilan belum mencapai nisab (Rp ${formatNominal(hasil.nisab)}/thn atau Rp ${formatNominal(hasil.nisabBulan)}/bln).`,
      });

      return;
    }

    // ZAKAT MAAL
    if (jenisKalkulator === "maal") {
      const harta = Number(
        String(nilaiKalkulator || "").replace(/\D/g, "")
      );

      if (!harta || harta <= 0) {
        alert("Silakan masukkan total harta.");
        return;
      }

      const hasil = hitungZakatMaal(harta);

      setHasilKalkulator({
        label: "Estimasi Zakat Maal",
        value: hasil.jumlahZakat,
        wajib: hasil.wajibZakat,
        detail: hasil.wajibZakat
          ? `Wajib zakat ${hasil.kadarZakatPersen}% dari harta bersih (Nisab 85g emas: Rp ${formatNominal(hasil.nisab)}).`
          : `Harta belum mencapai nisab 85 gram emas (Rp ${formatNominal(hasil.nisab)}).`,
      });

      return;
    }

    // ZAKAT FITRAH
    if (jenisKalkulator === "fitrah") {
      const jiwa = Number(
        String(jumlahJiwa || "").replace(/\D/g, "")
      );

      if (!jiwa || jiwa <= 0) {
        alert("Jumlah jiwa harus lebih dari 0.");
        return;
      }

      const hasil = hitungZakatFitrah(jiwa);

      setHasilKalkulator({
        label: "Estimasi Zakat Fitrah",
        value: hasil.jumlahZakat,
        wajib: true,
        detail: `${jiwa} jiwa × Rp ${formatNominal(
          hasil.perJiwa
        )} (Setara 2,5 kg beras @ Rp ${formatNominal(hasil.hargaBeras)}/kg).`,
      });
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataDitemukan) {
      alert("Silakan cari dan pilih data kepegawaian terlebih dahulu.");
      return;
    }

    if (!setuju) {
      alert("Silakan menyetujui pernyataan terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      await registerPublicMuzakki({
        nama: dataPegawai.nama,
        nip: dataPegawai.nip,
        kategori: "Dosen & Staf UNSIL",
        pekerjaan: dataPegawai.jabatan || "Dosen / Tenaga Kependidikan",
        unit_kerja: `${dataPegawai.unit}${dataPegawai.jurusan ? ` · ${dataPegawai.jurusan}` : ""}`,
        email: dataPegawai.email || null,
        no_hp: dataPegawai.noHp || null,
      });

      navigate("/daftar-muzakki", { state: { registered: true, nama: dataPegawai.nama } });
    } catch (err) {
      alert(err.message || "Gagal mengirim pendaftaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#075b43] via-[#08734f] to-[#075b43]">

        {/* PATTERN */}

        <div className="absolute inset-0 opacity-10">

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[30px] border-white" />

          <div className="absolute right-40 top-10 h-48 w-48 rounded-full border-[20px] border-white" />

        </div>

        {/* DEKORASI */}

        <div className="absolute right-0 top-0 hidden h-full w-[32%] overflow-hidden lg:block">

          <div className="absolute bottom-0 right-20 h-32 w-10 rotate-12 rounded-full bg-green-700/30" />

          <div className="absolute right-32 top-8 h-20 w-10 -rotate-45 rounded-full bg-green-300/40" />

          <div className="absolute right-10 top-20 h-28 w-12 rotate-45 rounded-full bg-green-400/30" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Pendaftaran Muzakki
          </h1>

          <p className="mt-1 text-xl text-white md:text-2xl">
            Dosen & Staff Universitas Siliwangi
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/90">

            <span>Beranda</span>
            <span>›</span>
            <span>Daftar Muzakki</span>
            <span>›</span>
            <span>Dosen & Staff UNSIL</span>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[285px_1fr]">

          {/* =================================================
              SIDEBAR KIRI
          ================================================== */}

          <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* ICON */}

            <div className="mb-5 flex justify-center">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">

                <Building2
                  size={82}
                  strokeWidth={1.5}
                  className="text-[#078052]"
                />

              </div>

            </div>

            {/* TITLE */}

            <h2 className="text-xl font-bold leading-snug text-[#08734f]">

              Pendaftaran Khusus

              <br />

              Dosen & Staff UNSIL

            </h2>

            {/* DESCRIPTION */}

            <p className="mt-4 text-sm leading-6 text-slate-600">

              Formulir ini khusus untuk Dosen dan Staff
              Universitas Siliwangi. Data Anda akan
              diambil otomatis dari sistem kepegawaian
              universitas.

            </p>

            {/* FEATURES */}

            <div className="mt-7 space-y-6">

              <Feature
                icon={<ShieldCheck size={22} />}
                title="Data Terverifikasi"
                description="Data diambil langsung dari sistem kepegawaian UNSIL."
              />

              <Feature
                icon={<Clock3 size={22} />}
                title="Lebih Cepat & Mudah"
                description="Cukup masukkan NIP atau Nama, data muncul otomatis."
              />

              <Feature
                icon={<LockKeyhole size={22} />}
                title="Aman & Terpercaya"
                description="Informasi Anda aman dan hanya digunakan untuk keperluan zakat."
              />

            </div>

            {/* QUOTE */}

            <div className="mt-8 rounded-xl bg-green-50 p-5">

              <div className="mb-2 text-3xl font-bold text-[#08734f]">
                “
              </div>

              <p className="text-sm italic leading-6 text-slate-600">

                Ambillah zakat dari sebagian harta mereka,
                dengan zakat itu kamu membersihkan dan
                mensucikan mereka dan mendoalah untuk
                mereka.

              </p>

              <p className="mt-4 text-xs font-semibold text-slate-700">
                (QS. At-Taubah: 103)
              </p>

              {/* KALKULATOR */}

              <button
                type="button"
                onClick={openKalkulator}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#08734f] px-4 py-3 text-sm font-semibold text-[#08734f] transition hover:bg-[#08734f] hover:text-white"
              >

                <Calculator size={18} />

                View Kalkulator Zakat

              </button>

              <p className="mt-3 text-center text-xs text-slate-600">

                Hitung zakat Anda dengan mudah
                menggunakan kalkulator kami.

              </p>

            </div>

          </aside>

          {/* =================================================
              FORM KANAN
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-7"
          >

            {/* =================================================
                1. PENCARIAN DATA KEPEGAWAIAN
            ================================================== */}

            <SectionTitle
              number="1."
              icon={<UserRound size={21} />}
              title="Pencarian Data Kepegawaian"
            />

            <p className="mt-2 text-sm leading-6 text-slate-600">

              Masukkan NIP atau nama Anda untuk mengambil
              data secara otomatis dari sistem kepegawaian UNSIL.

            </p>

            {/* TAB */}

            <div className="mt-5 flex border-b border-slate-200">

              <button
                type="button"
                onClick={() => {
                  setMetodeCari("nip");
                  setKeyword("");
                  setDataDitemukan(false);
                }}
                className={`w-1/2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  metodeCari === "nip"
                    ? "border-[#08734f] text-[#08734f]"
                    : "border-transparent text-slate-500"
                }`}
              >
                Cari dengan NIP
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodeCari("nama");
                  setKeyword("");
                  setDataDitemukan(false);
                }}
                className={`w-1/2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  metodeCari === "nama"
                    ? "border-[#08734f] text-[#08734f]"
                    : "border-transparent text-slate-500"
                }`}
              >
                Cari dengan Nama
              </button>

            </div>

            {/* INPUT PENCARIAN */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-gray-700">

                {metodeCari === "nip"
                  ? "NIP"
                  : "Nama"}

                <span className="text-red-500">
                  {" "}*
                </span>

              </label>

              <div className="flex flex-col gap-3 md:flex-row">

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setDataDitemukan(false);
                    setCariError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCariData();
                    }
                  }}
                  placeholder={
                    metodeCari === "nip"
                      ? "Masukkan NIP Anda (misal: 197503122001121001)"
                      : "Masukkan nama lengkap Anda (misal: Ahmad Fauzi)"
                  }
                  className="h-11 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => handleCariData()}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#08734f] px-6 text-sm font-semibold text-white transition hover:bg-[#065d40]"
                >

                  <Search size={18} />

                  Cari Data

                </button>

              </div>

              {/* CONTOH CEPAT */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-600">Coba data dosen/tendik:</span>
                {DOSEN_STAF_UNSIL.slice(0, 4).map((p) => (
                  <button
                    key={p.nip}
                    type="button"
                    onClick={() => {
                      setMetodeCari("nip");
                      setKeyword(p.nip);
                      handleCariData(p.nip);
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-green-50 border border-green-200/60 px-2 py-1 text-[11px] font-medium text-[#08734f] transition hover:bg-green-100"
                    title={`${p.nama} (${p.unit})`}
                  >
                    <Sparkles size={11} />
                    {p.nama.split(",")[0]}
                  </button>
                ))}
              </div>

              {/* ERROR NOT FOUND */}
              {cariError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {cariError}
                </div>
              )}

              {/* SUCCESS FOUND */}
              {dataDitemukan && dataPegawai && (
                <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                  <span>
                    Data Ditemukan: <strong>{dataPegawai.nama}</strong> ({dataPegawai.jabatan})
                  </span>
                </div>
              )}

            </div>

            {/* INFO */}

            <div className="mt-4 flex gap-3 rounded-lg bg-green-50/70 border border-green-100 p-4 text-xs text-[#176b51]">

              <Info
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>
                Pastikan NIP yang Anda masukkan sesuai dengan data kepegawaian Universitas Siliwangi. Anda dapat mencari dengan NIP maupun Nama Lengkap.
              </p>

            </div>

            <div className="my-6 border-t border-slate-200" />

            {/* =================================================
                2. DATA DIRI
            ================================================== */}

            <SectionTitle
              number="2."
              icon={<UserRound size={21} />}
              title="Data Diri (Otomatis dari Sistem)"
            />

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              <ReadOnlyInput
                label="Nama Lengkap"
                value={
                  dataDitemukan
                    ? dataPegawai.nama
                    : "-"
                }
              />

              <ReadOnlyInput
                label="NIP"
                value={
                  dataDitemukan
                    ? dataPegawai.nip
                    : "-"
                }
              />

              <ReadOnlyInput
                label="Fakultas / Unit Kerja"
                value={
                  dataDitemukan
                    ? dataPegawai.unit
                    : "-"
                }
              />

              <ReadOnlyInput
                label="Jurusan / Program Studi"
                value={
                  dataDitemukan
                    ? dataPegawai.jurusan || "-"
                    : "-"
                }
              />

              <ReadOnlyInput
                label="Jabatan & Golongan"
                value={
                  dataDitemukan
                    ? `${dataPegawai.jabatan} ${dataPegawai.golongan ? `(${dataPegawai.golongan})` : ""}`
                    : "-"
                }
              />

              <ReadOnlyInput
                label="Email Universitas Siliwangi"
                value={
                  dataDitemukan
                    ? dataPegawai.email || "-"
                    : "-"
                }
              />

            </div>


            {/* INFO OTOMATIS */}

            <div className="mt-5 flex gap-3 rounded-lg bg-green-50 p-4 text-sm text-[#176b51]">

              <Info
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p>

                Data di atas diambil otomatis dari sistem
                kepegawaian Universitas Siliwangi dan tidak
                dapat diubah.

              </p>

            </div>

            <div className="my-6 border-t border-slate-200" />

            {/* =================================================
                3. PERSETUJUAN
            ================================================== */}

            <SectionTitle
              number="3."
              icon={<ShieldCheck size={21} />}
              title="Persetujuan"
            />

            <label className="mt-5 flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={setuju}
                onChange={(e) =>
                  setSetuju(e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#08734f]"
              />

              <span className="text-sm leading-6 text-slate-600">

                Saya menyatakan bahwa data yang ditampilkan
                adalah data saya dan menyetujui penggunaan
                data tersebut untuk keperluan administrasi dan
                pelayanan zakat UPZ Zakat Universitas Siliwangi.

              </span>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#08734f] text-sm font-semibold text-white transition hover:bg-[#065d40] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Menyimpan Pendaftaran...
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  Daftar sebagai Muzakki
                </>
              )}
            </button>


            {/* FOOTER */}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">

              <LockKeyhole size={14} />

              Data Anda aman dan akan digunakan sesuai
              kebijakan UPZ Zakat UNSIL.

            </div>

          </form>

        </div>

      </main>

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

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setShowKalkulator(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* HEADER */}

            <div className="pr-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#08734f]">

                  <Calculator size={23} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Kalkulator Zakat
                  </h2>

                  <p className="text-sm text-gray-500">
                    Hitung estimasi zakat Anda.
                  </p>

                </div>

              </div>

            </div>

            {/* PILIH JENIS */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium text-gray-700">
                Jenis Zakat
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <CalculatorTypeButton
                  icon={<WalletCards size={19} />}
                  title="Penghasilan"
                  selected={
                    jenisKalkulator === "penghasilan"
                  }
                  onClick={() =>
                    handleJenisKalkulator("penghasilan")
                  }
                />

                <CalculatorTypeButton
                  icon={<Landmark size={19} />}
                  title="Maal"
                  selected={
                    jenisKalkulator === "maal"
                  }
                  onClick={() =>
                    handleJenisKalkulator("maal")
                  }
                />

                <CalculatorTypeButton
                  icon={<Users size={19} />}
                  title="Fitrah"
                  selected={
                    jenisKalkulator === "fitrah"
                  }
                  onClick={() =>
                    handleJenisKalkulator("fitrah")
                  }
                />

              </div>

            </div>

            {/* =================================================
                ZAKAT PENGHASILAN
            ================================================== */}

            {jenisKalkulator === "penghasilan" && (

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Penghasilan per Bulan
                </label>

                <div className="flex overflow-hidden rounded-lg border border-gray-200">

                  <span className="flex items-center border-r border-gray-200 px-4 text-sm font-medium text-gray-500">
                    Rp
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNominal(
                      nilaiKalkulator
                    )}
                    onChange={(e) =>
                      setNilaiKalkulator(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="5.000.000"
                    className="h-11 w-full px-4 text-sm outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Estimasi sederhana menggunakan 2,5%.
                </p>

              </div>

            )}

            {/* =================================================
                ZAKAT MAAL
            ================================================== */}

            {jenisKalkulator === "maal" && (

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Total Harta
                </label>

                <div className="flex overflow-hidden rounded-lg border border-gray-200">

                  <span className="flex items-center border-r border-gray-200 px-4 text-sm font-medium text-gray-500">
                    Rp
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNominal(
                      nilaiKalkulator
                    )}
                    onChange={(e) =>
                      setNilaiKalkulator(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="100.000.000"
                    className="h-11 w-full px-4 text-sm outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Estimasi sederhana menggunakan 2,5%.
                </p>

              </div>

            )}

            {/* =================================================
                ZAKAT FITRAH
            ================================================== */}

            {jenisKalkulator === "fitrah" && (

              <div className="mt-5 space-y-4">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jumlah Jiwa
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={jumlahJiwa}
                    onChange={(e) =>
                      setJumlahJiwa(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="1"
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nominal Zakat Fitrah per Jiwa
                  </label>

                  <div className="flex overflow-hidden rounded-lg border border-gray-200">

                    <span className="flex items-center border-r border-gray-200 px-4 text-sm font-medium text-gray-500">
                      Rp
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatNominal(
                        nominalPerJiwa
                      )}
                      onChange={(e) =>
                        setNominalPerJiwa(
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="50.000"
                      className="h-11 w-full px-4 text-sm outline-none"
                    />

                  </div>

                </div>

                <p className="text-xs text-gray-500">
                  Nominal per jiwa dapat disesuaikan
                  dengan ketentuan UPZ.
                </p>

              </div>

            )}

            {/* HITUNG */}

            <button
              type="button"
              onClick={handleHitungKalkulator}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08734f] py-3 text-sm font-semibold text-white transition hover:bg-[#065d40]"
            >

              <Calculator size={18} />

              Hitung Zakat

            </button>

            {/* HASIL */}

            {hasilKalkulator && (

              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">

                <p className="text-xs text-gray-500 font-medium">
                  {hasilKalkulator.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#08734f]">
                  Rp {formatNominal(
                    hasilKalkulator.value
                  )}
                </p>

                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {hasilKalkulator.detail}
                </p>

              </div>

            )}


            {/* CATATAN */}

            <div className="mt-5 rounded-lg bg-gray-50 p-4">

              <p className="text-xs leading-5 text-gray-500">

                Hasil kalkulator merupakan estimasi sederhana
                untuk membantu perhitungan awal.

              </p>

            </div>

            {/* TUTUP */}

            <button
              type="button"
              onClick={() => setShowKalkulator(false)}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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
   SECTION TITLE
========================================================= */

function SectionTitle({
  number,
  icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="text-[#08734f]">
        {icon}
      </div>

      <h2 className="text-base font-bold text-[#08734f]">
        {number} {title}
      </h2>

    </div>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold text-slate-700">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   READ ONLY INPUT
========================================================= */

function ReadOnlyInput({
  label,
  value,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        <input
          type="text"
          value={value}
          readOnly
          className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-600 outline-none"
        />

        <LockKeyhole
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

      </div>

    </div>
  );
}

/* =========================================================
   CALCULATOR TYPE BUTTON
========================================================= */

function CalculatorTypeButton({
  icon,
  title,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition ${
        selected
          ? "border-[#08734f] bg-green-50 text-[#08734f]"
          : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
      }`}
    >

      {icon}

      <span className="font-semibold">
        {title}
      </span>

    </button>
  );
}