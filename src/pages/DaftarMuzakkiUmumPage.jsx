import { useState } from "react";
import {
  ClipboardCheck,
  ShieldCheck,
  FileText,
  HandHeart,
  UserRound,
  WalletCards,
  Landmark,
  QrCode,
  Building2,
  ChevronDown,
  Check,
  UserPlus,
  Clock3,
  LockKeyhole,
  Calculator,
} from "lucide-react";

export default function DaftarMuzakkiUmumPage() {
  // =========================================================
  // STATE
  // =========================================================

  const [formData, setFormData] = useState({
    namaLengkap: "",
    jenisKelamin: "",
    nik: "",
    tanggalLahir: "",
    email: "",
    whatsapp: "",
    instansi: "",
    pekerjaan: "",
    alamat: "",
    kota: "",
    kodePos: "",
    jenisZakat: "",
    frekuensi: "",
    pembayaran: "",
    sumberInformasi: "",
    catatan: "",
    persetujuan: false,
  });

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // JENIS ZAKAT
  // =========================================================

  const handleJenisZakat = (value) => {
    setFormData((prev) => ({
      ...prev,
      jenisZakat: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.persetujuan) {
      alert("Silakan centang persetujuan terlebih dahulu.");
      return;
    }

    console.log("Data Muzakki Umum:", formData);

    alert("Pendaftaran Muzakki berhasil dikirim!");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* =====================================================
          HERO / BREADCRUMB
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#075b43] via-[#08734f] to-[#075b43]">

        {/* PATTERN BULAT */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[30px] border-white" />

          <div className="absolute right-40 top-10 h-48 w-48 rounded-full border-[20px] border-white" />
        </div>

        {/* DEKORASI TANAMAN / ILUSTRASI */}
        <div className="absolute right-0 top-0 hidden h-full w-[32%] overflow-hidden lg:block">

          <div className="absolute bottom-0 right-20 h-32 w-10 rotate-12 rounded-full bg-green-700/30" />

          <div className="absolute right-32 top-8 h-20 w-10 -rotate-45 rounded-full bg-green-300/40" />

          <div className="absolute right-10 top-20 h-28 w-12 rotate-45 rounded-full bg-green-400/30" />

          <div className="absolute bottom-5 right-5 h-24 w-8 -rotate-12 rounded-full bg-green-300/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Daftar sebagai Muzakki
          </h1>

          <p className="mt-1 text-xl text-white md:text-2xl">
            Muzakki Umum
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/90">
            <span>Beranda</span>
            <span>›</span>
            <span>Daftar sebagai Muzakki</span>
            <span>›</span>
            <span>Muzakki Umum</span>
          </div>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[285px_1fr]">

          {/* =================================================
              SIDEBAR KIRI
          ================================================== */}

          <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* =================================================
                ICON / ILUSTRASI
            ================================================= */}

            <div className="mb-5 flex justify-center">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">

                <ClipboardCheck
                  size={82}
                  strokeWidth={1.5}
                  className="text-[#078052]"
                />

              </div>

            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h2 className="text-xl font-bold leading-snug text-[#08734f]">
              Pendaftaran Muzakki
              <br />
              Umum
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Formulir ini diperuntukkan bagi masyarakat umum
              yang ingin terdaftar sebagai Muzakki dan menunaikan
              zakat melalui UPZ Zakat Universitas Siliwangi.
            </p>

            {/* =================================================
                FEATURE
            ================================================= */}

            <div className="mt-7 space-y-6">

              <Feature
                icon={<ShieldCheck size={22} />}
                title="Aman & Terpercaya"
                description="Data Anda aman dan hanya digunakan untuk keperluan administrasi zakat."
              />

              <Feature
                icon={<Clock3 size={22} />}
                title="Lebih Cepat & Mudah"
                description="Pendaftaran dapat dilakukan dengan mudah melalui formulir online."
              />

              <Feature
                icon={<LockKeyhole size={22} />}
                title="Data Terlindungi"
                description="Informasi Anda dijaga dan digunakan sesuai kebutuhan pelayanan zakat."
              />

            </div>

            {/* =================================================
                QUOTE
            ================================================= */}

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
                1. DATA PRIBADI
            ================================================== */}

            <SectionTitle
              number="1."
              icon={<UserRound size={21} />}
              title="Data Pribadi"
            />

            <p className="mt-2 text-sm text-slate-600">
              Lengkapi data diri Anda dengan benar untuk
              keperluan administrasi Muzakki.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAMA */}

              <InputField
                label="Nama Lengkap"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />

              {/* JENIS KELAMIN */}

              <SelectField
                label="Jenis Kelamin"
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </SelectField>

              {/* NIK */}

              <InputField
                label="NIK / Nomor Identitas"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Masukkan NIK / No. KTP"
                required
              />

              {/* TEMPAT TANGGAL LAHIR */}

              <InputField
                label="Tempat, Tanggal Lahir"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                placeholder="Contoh: Tasikmalaya, 01 Januari 1990"
                required
              />

              {/* EMAIL */}

              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="nama@email.com"
                required
              />

              {/* WHATSAPP */}

              <InputField
                label="No. WhatsApp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                type="tel"
                placeholder="08xxxxxxxxxx"
                required
              />

              {/* INSTANSI */}

              <InputField
                label="Fakultas / Unit / Instansi"
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                placeholder="Contoh: Universitas Siliwangi"
              />

              {/* PEKERJAAN */}

              <InputField
                label="Pekerjaan / Jabatan"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Contoh: Karyawan"
              />

              {/* ALAMAT */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alamat Lengkap{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* KOTA */}

              <SelectField
                label="Kota / Kabupaten"
                name="kota"
                value={formData.kota}
                onChange={handleChange}
                required
              >
                <option value="">
                  Pilih kota / kabupaten
                </option>

                <option value="Tasikmalaya">
                  Tasikmalaya
                </option>

                <option value="Ciamis">
                  Ciamis
                </option>

                <option value="Garut">
                  Garut
                </option>

                <option value="Banjar">
                  Banjar
                </option>

                <option value="Pangandaran">
                  Pangandaran
                </option>

                <option value="Bandung">
                  Bandung
                </option>

                <option value="Jakarta">
                  Jakarta
                </option>

                <option value="Lainnya">
                  Lainnya
                </option>

              </SelectField>

              {/* KODE POS */}

              <InputField
                label="Kode Pos"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
                placeholder="Masukkan kode pos"
              />

            </div>

            {/* =================================================
                2. INFORMASI ZAKAT
            ================================================== */}

            <div className="my-6 border-t border-slate-200" />

            <SectionTitle
              number="2."
              icon={<WalletCards size={21} />}
              title="Informasi Zakat"
            />

            {/* JENIS ZAKAT */}

            <div className="mt-5">

              <label className="mb-3 block text-sm font-medium">
                Jenis Zakat yang biasa ditunaikan
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <ZakatCard
                  selected={formData.jenisZakat === "penghasilan"}
                  onClick={() => handleJenisZakat("penghasilan")}
                  icon={<WalletCards size={23} />}
                  title="Zakat Penghasilan"
                  description="Zakat atas penghasilan seperti gaji dan honor."
                />

                <ZakatCard
                  selected={formData.jenisZakat === "maal"}
                  onClick={() => handleJenisZakat("maal")}
                  icon={<Landmark size={23} />}
                  title="Zakat Maal"
                  description="Zakat atas harta, tabungan, emas, investasi, dan lainnya."
                />

                <ZakatCard
                  selected={formData.jenisZakat === "fitrah"}
                  onClick={() => handleJenisZakat("fitrah")}
                  icon={<HandHeart size={23} />}
                  title="Zakat Fitrah"
                  description="Zakat fitrah untuk diri sendiri dan keluarga."
                />

              </div>

            </div>

            {/* FREKUENSI */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium">
                Frekuensi Menunaikan Zakat
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                <RadioOption
                  label="Bulanan"
                  value="bulanan"
                  selected={formData.frekuensi === "bulanan"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      frekuensi: "bulanan",
                    }))
                  }
                />

                <RadioOption
                  label="Tahunan"
                  value="tahunan"
                  selected={formData.frekuensi === "tahunan"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      frekuensi: "tahunan",
                    }))
                  }
                />

                <RadioOption
                  label="Setiap Ramadan"
                  value="ramadan"
                  selected={formData.frekuensi === "ramadan"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      frekuensi: "ramadan",
                    }))
                  }
                />

                <RadioOption
                  label="Sesuai Kebutuhan"
                  value="kebutuhan"
                  selected={formData.frekuensi === "kebutuhan"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      frekuensi: "kebutuhan",
                    }))
                  }
                />

              </div>

            </div>

            {/* PEMBAYARAN */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium">
                Preferensi Pembayaran
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <PaymentButton
                  icon={<Landmark size={18} />}
                  name="pembayaran"
                  value="transfer"
                  label="Transfer Bank"
                  checked={formData.pembayaran === "transfer"}
                  onChange={handleChange}
                />

                <PaymentButton
                  icon={<Building2 size={18} />}
                  name="pembayaran"
                  value="virtual-account"
                  label="Virtual Account"
                  checked={formData.pembayaran === "virtual-account"}
                  onChange={handleChange}
                />

                <PaymentButton
                  icon={<QrCode size={18} />}
                  name="pembayaran"
                  value="qris"
                  label="QRIS"
                  checked={formData.pembayaran === "qris"}
                  onChange={handleChange}
                />

                <PaymentButton
                  icon={<Building2 size={18} />}
                  name="pembayaran"
                  value="tunai"
                  label="Tunai di Kantor UPZ"
                  checked={formData.pembayaran === "tunai"}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* =================================================
                3. INFORMASI TAMBAHAN
            ================================================== */}

            <div className="my-6 border-t border-slate-200" />

            <SectionTitle
              number="3."
              icon={<ClipboardCheck size={21} />}
              title="Informasi Tambahan"
            />

            <p className="mt-1 text-sm text-slate-500">
              Opsional
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              <SelectField
                label="Bagaimana Anda mengetahui UPZ Zakat UNSIL?"
                name="sumberInformasi"
                value={formData.sumberInformasi}
                onChange={handleChange}
              >
                <option value="">
                  Pilih sumber informasi
                </option>

                <option value="media-sosial">
                  Media Sosial
                </option>

                <option value="website">
                  Website UPZ
                </option>

                <option value="teman">
                  Teman / Keluarga
                </option>

                <option value="kampus">
                  Lingkungan Kampus
                </option>

                <option value="lainnya">
                  Lainnya
                </option>
              </SelectField>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Catatan
                </label>

                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Masukkan catatan (opsional)"
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

            {/* =================================================
                4. PERSETUJUAN
            ================================================== */}

            <div className="my-6 border-t border-slate-200" />

            <SectionTitle
              number="4."
              icon={<ShieldCheck size={21} />}
              title="Persetujuan"
            />

            <label className="mt-5 flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                name="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-[#08734f]"
              />

              <span className="text-sm leading-6 text-slate-600">
                Saya menyatakan bahwa data yang saya berikan
                adalah benar dan saya menyetujui penggunaan
                data ini untuk keperluan administrasi dan
                pelayanan zakat UPZ Zakat UNSIL.
              </span>

            </label>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#08734f] text-sm font-semibold text-white transition hover:bg-[#065d40]"
            >
              <UserPlus size={19} />
              Daftar sebagai Muzakki
            </button>

            {/* FOOTER FORM */}

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
   SECTION TITLE
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
   FEATURE
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
   INPUT
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">

        {label}{" "}

        {required && (
          <span className="text-red-500">*</span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
      />

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">

        {label}{" "}

        {required && (
          <span className="text-red-500">*</span>
        )}

      </label>

      <div className="relative">

        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
        >
          {children}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

      </div>

    </div>
  );
}

/* =========================================================
   ZAKAT CARD
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
          selected
            ? "text-[#08734f]"
            : "text-slate-500"
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
   RADIO OPTION
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
   PAYMENT BUTTON
========================================================= */

function PaymentButton({
  icon,
  name,
  value,
  label,
  checked,
  onChange,
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-sm transition ${
        checked
          ? "border-[#08734f] bg-green-50 text-[#126b43]"
          : "border-slate-200 text-slate-600 hover:border-green-300"
      }`}
    >

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required
        className="h-4 w-4 accent-[#08734f]"
      />

      <span
        className={
          checked
            ? "text-[#08734f]"
            : "text-slate-400"
        }
      >
        {icon}
      </span>

      <span>{label}</span>

    </label>
  );
}