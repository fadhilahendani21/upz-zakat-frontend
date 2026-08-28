import { useState } from "react";
import {
  UserRound,
  Search,
  ShieldCheck,
  Clock3,
  LockKeyhole,
  UsersRound,
  Building2,
  ClipboardCheck,
  WalletCards,
  Sprout,
  Info,
  Check,
  ChevronDown,
  Calculator,
} from "lucide-react";

export default function DaftarMuzakkiUnsilPage() {
  // ==============================
  // STATE
  // ==============================
  const [metodeCari, setMetodeCari] = useState("nip");
  const [keyword, setKeyword] = useState("");
  const [dataDitemukan, setDataDitemukan] = useState(false);

  const [jenisZakat, setJenisZakat] = useState("penghasilan");
  const [frekuensi, setFrekuensi] = useState("bulanan");
  const [nominal, setNominal] = useState("500000");
  const [noHandphone, setNoHandphone] = useState("");
  const [setuju, setSetuju] = useState(false);

  // ==============================
  // DATA SIMULASI KEPEGAWAIAN
  // Nanti diganti API backend
  // ==============================
  const dataPegawai = {
    nama: "Nama Dosen / Staff UNSIL",
    nip: "198xxxxxxxxxxxxx",
    unit: "Universitas Siliwangi",
    jabatan: "Dosen",
    email: "nama@unsil.ac.id",
  };

  // ==============================
  // CARI DATA
  // ==============================
  const handleCariData = () => {
    if (!keyword.trim()) {
      alert(
        `Silakan masukkan ${
          metodeCari === "nip" ? "NIP" : "nama"
        } terlebih dahulu.`
      );
      return;
    }

    // Simulasi data ditemukan
    setDataDitemukan(true);
  };

  // ==============================
  // FORMAT RUPIAH
  // ==============================
  const formatRupiah = (value) => {
    if (!value) return "0";

    const number = Number(value.replace(/\D/g, ""));

    return new Intl.NumberFormat("id-ID").format(number);
  };

  // ==============================
  // HANDLE NOMINAL
  // ==============================
  const handleNominalChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNominal(value);
  };

  // ==============================
  // ESTIMASI TAHUN
  // ==============================
  const getEstimasiTahunan = () => {
    const angka = Number(nominal || 0);

    if (frekuensi === "bulanan") {
      return angka * 12;
    }

    if (frekuensi === "tahunan") {
      return angka;
    }

    if (frekuensi === "ramadan") {
      return angka;
    }

    return angka;
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dataDitemukan) {
      alert("Silakan cari data kepegawaian terlebih dahulu.");
      return;
    }

    if (!noHandphone.trim()) {
      alert("Silakan masukkan nomor handphone aktif.");
      return;
    }

    if (!setuju) {
      alert("Silakan menyetujui pernyataan terlebih dahulu.");
      return;
    }

    alert("Pendaftaran Muzakki berhasil dikirim.");

    // Nanti di sini bisa dipanggil API backend
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* =====================================================
          HERO / BREADCRUMB
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#075b43] via-[#08734f] to-[#075b43]">
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[30px] border-white" />
          <div className="absolute right-40 top-10 h-48 w-48 rounded-full border-[20px] border-white" />
        </div>

        {/* Dekorasi tanaman */}
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

          <div className="mt-5 flex items-center gap-3 text-sm text-white/90">
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

            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">
                <Building2
                  size={82}
                  strokeWidth={1.5}
                  className="text-[#078052]"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold leading-snug text-[#08734f]">
              Pendaftaran Khusus
              <br />
              Dosen & Staff UNSIL
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Formulir ini khusus untuk Dosen dan Staff
              Universitas Siliwangi. Data Anda akan
              diambil otomatis dari sistem kepegawaian
              universitas.
            </p>

            {/* Feature */}
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

            {/* Quote */}
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

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/hitung-zakat";
                }}
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

            <p className="mt-2 text-sm text-slate-600">
              Masukkan NIP atau nama Anda untuk mengambil
              data secara otomatis dari sistem kepegawaian UNSIL.
            </p>

            {/* Tab pencarian */}
            <div className="mt-5 flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setMetodeCari("nip")}
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
                onClick={() => setMetodeCari("nama")}
                className={`w-1/2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  metodeCari === "nama"
                    ? "border-[#08734f] text-[#08734f]"
                    : "border-transparent text-slate-500"
                }`}
              >
                Cari dengan Nama
              </button>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">
                {metodeCari === "nip" ? "NIP" : "Nama"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type={metodeCari === "nip" ? "text" : "text"}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={
                    metodeCari === "nip"
                      ? "Masukkan NIP Anda"
                      : "Masukkan nama lengkap Anda"
                  }
                  className="h-11 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={handleCariData}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#08734f] px-6 text-sm font-semibold text-white transition hover:bg-[#065d40]"
                >
                  <Search size={18} />
                  Cari Data
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-5 flex gap-3 rounded-lg bg-green-50 p-4 text-sm text-[#176b51]">
              <Info size={19} className="mt-0.5 shrink-0" />

              <p>
                Pastikan NIP yang Anda masukkan sesuai
                dengan data kepegawaian Universitas Siliwangi.
                Jika data tidak ditemukan, silakan hubungi
                Bagian Kepegawaian.
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

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              <ReadOnlyInput
                label="Nama Lengkap"
                value={dataDitemukan ? dataPegawai.nama : "-"}
              />

              <ReadOnlyInput
                label="NIP"
                value={dataDitemukan ? dataPegawai.nip : "-"}
              />

              <ReadOnlyInput
                label="Fakultas / Unit Kerja"
                value={dataDitemukan ? dataPegawai.unit : "-"}
              />

              <ReadOnlyInput
                label="Jabatan"
                value={dataDitemukan ? dataPegawai.jabatan : "-"}
              />

              <ReadOnlyInput
                label="Email Institusi"
                value={dataDitemukan ? dataPegawai.email : "-"}
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  No. Handphone (Aktif)
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="tel"
                  value={noHandphone}
                  onChange={(e) => setNoHandphone(e.target.value)}
                  placeholder="Masukkan nomor handphone aktif Anda"
                  className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* Info otomatis */}
            <div className="mt-5 flex gap-3 rounded-lg bg-green-50 p-4 text-sm text-[#176b51]">
              <Info size={19} className="mt-0.5 shrink-0" />

              <p>
                Data di atas diambil otomatis dari sistem
                kepegawaian Universitas Siliwangi dan tidak
                dapat diubah.
              </p>
            </div>

            <div className="my-6 border-t border-slate-200" />

            {/* =================================================
                3. INFORMASI ZAKAT
            ================================================== */}
            <SectionTitle
              number="3."
              icon={<UsersRound size={21} />}
              title="Informasi Zakat"
            />

            <div className="mt-5">
              <label className="mb-3 block text-sm font-medium">
                Jenis Zakat yang akan Ditunaikan
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <ZakatCard
                  selected={jenisZakat === "penghasilan"}
                  onClick={() => setJenisZakat("penghasilan")}
                  icon={<WalletCards size={23} />}
                  title="Zakat Penghasilan"
                  description="Zakat atas penghasilan (gaji, honor, dll)"
                />

                <ZakatCard
                  selected={jenisZakat === "maal"}
                  onClick={() => setJenisZakat("maal")}
                  icon={<ClipboardCheck size={23} />}
                  title="Zakat Maal"
                  description="Zakat atas harta (tabungan, investasi, emas, dll)"
                />

                <ZakatCard
                  selected={jenisZakat === "fitrah"}
                  onClick={() => setJenisZakat("fitrah")}
                  icon={<Sprout size={23} />}
                  title="Zakat Fitrah"
                  description="Zakat fitrah untuk diri dan keluarga"
                />

              </div>
            </div>

            {/* Frekuensi */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium">
                Frekuensi Pembayaran Zakat
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                <RadioOption
                  label="Bulanan"
                  value="bulanan"
                  selected={frekuensi === "bulanan"}
                  onClick={() => setFrekuensi("bulanan")}
                />

                <RadioOption
                  label="Tahunan"
                  value="tahunan"
                  selected={frekuensi === "tahunan"}
                  onClick={() => setFrekuensi("tahunan")}
                />

                <RadioOption
                  label="Setiap Ramadan"
                  value="ramadan"
                  selected={frekuensi === "ramadan"}
                  onClick={() => setFrekuensi("ramadan")}
                />

                <RadioOption
                  label="Sesuai Kesepakatan"
                  value="kesepakatan"
                  selected={frekuensi === "kesepakatan"}
                  onClick={() => setFrekuensi("kesepakatan")}
                />

              </div>
            </div>

            {/* Nominal */}
            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#08734f]">
                Nominal Zakat yang Disepakati
                <span className="text-red-500">*</span>
                <Info size={15} />
              </div>

              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                <span className="flex items-center border-r border-slate-200 px-4 text-sm font-medium text-slate-600">
                  Rp
                </span>

                <input
                  type="text"
                  value={formatRupiah(nominal)}
                  onChange={handleNominalChange}
                  className="h-11 w-full px-4 text-sm outline-none"
                  placeholder="500.000"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Contoh: 500000
              </p>
            </div>

            {/* Ringkasan */}
            <div className="mt-5 rounded-xl bg-green-50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#08734f]">
                <ClipboardCheck size={18} />
                Ringkasan Komitmen Zakat Anda
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">

                <SummaryItem
                  label="Jenis Zakat"
                  value={
                    jenisZakat === "penghasilan"
                      ? "Zakat Penghasilan"
                      : jenisZakat === "maal"
                      ? "Zakat Maal"
                      : "Zakat Fitrah"
                  }
                />

                <SummaryItem
                  label="Frekuensi"
                  value={
                    frekuensi === "bulanan"
                      ? "Bulanan"
                      : frekuensi === "tahunan"
                      ? "Tahunan"
                      : frekuensi === "ramadan"
                      ? "Setiap Ramadan"
                      : "Sesuai Kesepakatan"
                  }
                />

                <SummaryItem
                  label="Nominal Disepakati"
                  value={`Rp ${formatRupiah(nominal)}${
                    frekuensi === "bulanan" ? " / bulan" : ""
                  }`}
                  green
                />

                <SummaryItem
                  label="Estimasi / Tahun"
                  value={`Rp ${formatRupiah(
                    String(getEstimasiTahunan())
                  )}`}
                  green
                />

              </div>

              <p className="mt-4 text-xs text-slate-500">
                Estimasi per tahun dihitung berdasarkan nominal
                dan frekuensi pembayaran yang dipilih.
              </p>
            </div>

            <div className="my-6 border-t border-slate-200" />

            {/* =================================================
                4. PERSETUJUAN
            ================================================== */}
            <SectionTitle
              number="4."
              icon={<UsersRound size={21} />}
              title="Persetujuan"
            />

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={setuju}
                onChange={(e) => setSetuju(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#08734f]"
              />

              <span className="text-sm leading-6 text-slate-600">
                Saya menyatakan bahwa data yang ditampilkan
                adalah data saya dan menyetujui penggunaan
                data tersebut untuk keperluan administrasi dan
                pelayanan zakat UPZ Zakat Universitas Siliwangi.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#08734f] text-sm font-semibold text-white transition hover:bg-[#065d40]"
            >
              <UserRound size={19} />
              Daftar sebagai Muzakki
            </button>

            {/* Footer form */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <LockKeyhole size={14} />
              Data Anda aman dan akan digunakan sesuai
              kebijakan UPZ Zakat UNSIL.
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   COMPONENT: SECTION TITLE
========================================================= */

function SectionTitle({ number, icon, title }) {
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
   COMPONENT: FEATURE
========================================================= */

function Feature({ icon, title, description }) {
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
   COMPONENT: READ ONLY INPUT
========================================================= */

function ReadOnlyInput({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
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
   COMPONENT: ZAKAT CARD
========================================================= */

function ZakatCard({
  selected,
  onClick,
  icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[#08734f] bg-green-50"
          : "border-slate-200 bg-white hover:border-green-300"
      }`}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded bg-[#08734f] text-white">
          <Check size={13} />
        </div>
      )}

      <div
        className={`mb-3 ${
          selected ? "text-[#08734f]" : "text-slate-500"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   COMPONENT: RADIO OPTION
========================================================= */

function RadioOption({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-left text-sm text-slate-600"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          selected
            ? "border-[#08734f]"
            : "border-slate-300"
        }`}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-[#08734f]" />
        )}
      </span>

      {label}
    </button>
  );
}

/* =========================================================
   COMPONENT: SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  green = false,
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${
          green
            ? "text-[#08734f]"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}