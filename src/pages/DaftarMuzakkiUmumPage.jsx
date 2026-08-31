import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  ShieldCheck,
  UserRound,
  WalletCards,
  Landmark,
  UserPlus,
  Clock3,
  LockKeyhole,
  Calculator,
  X,
  Users,
  Loader2,
  ChevronDown,
} from "lucide-react";

import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";
import { registerPublicMuzakki } from "../services/muzakkiService";




export default function DaftarMuzakkiUmumPage() {

  // =========================================================
  // STATE FORM
  // =========================================================

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    pekerjaan: "",
    email: "",
    noHp: "",
    alamatLengkap: "",
    sumberInformasi: "",
    catatan: "",
    persetujuan: false,
  });

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // FORMAT RUPIAH (dipakai di kalkulator)
  // =========================================================

  const formatNominal = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = typeof value === "number" ? value : Number(String(value).replace(/\D/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // =========================================================
  // STATE & HANDLER KALKULATOR ZAKAT
  // =========================================================

  const [showKalkulator, setShowKalkulator] = useState(false);
  const [jenisKalkulator, setJenisKalkulator] = useState("penghasilan");
  const [nilaiKalkulator, setNilaiKalkulator] = useState("");
  const [jumlahJiwa, setJumlahJiwa] = useState("1");
  const [nominalPerJiwa, setNominalPerJiwa] = useState("45000");
  const [hasilKalkulator, setHasilKalkulator] = useState(null);

  const openKalkulator = () => {
    const config = getZakatConfig();
    setShowKalkulator(true);
    setHasilKalkulator(null);
    setJenisKalkulator("penghasilan");
    setNilaiKalkulator("");
    setJumlahJiwa("1");
    setNominalPerJiwa(String(Math.round(2.5 * config.hargaBerasPerKg)));
  };

  const handleJenisKalkulator = (value) => {
    const config = getZakatConfig();
    setJenisKalkulator(value);
    setHasilKalkulator(null);
    setNilaiKalkulator("");
    if (value === "fitrah") {
      setJumlahJiwa("1");
      setNominalPerJiwa(String(Math.round(2.5 * config.hargaBerasPerKg)));
    }
  };

  const handleHitungKalkulator = () => {
    if (jenisKalkulator === "penghasilan") {
      const penghasilan = Number(String(nilaiKalkulator || "").replace(/\D/g, ""));
      if (!penghasilan || penghasilan <= 0) {
        alert("Silakan masukkan penghasilan per bulan.");
        return;
      }
      const hasil = hitungZakatPenghasilan(penghasilan);
      const voluntaryInfak = Math.round(penghasilan * (hasil.kadarZakatPersen / 100));
      setHasilKalkulator({
        label: "Estimasi Zakat Penghasilan",
        value: hasil.jumlahZakat,
        wajib: hasil.wajibZakat,
        voluntary: voluntaryInfak,
        nisabBulan: hasil.nisabBulan,
        nisabTahun: hasil.nisab,
        detail: hasil.wajibZakat
          ? `Wajib zakat ${hasil.kadarZakatPersen}% per bulan karena penghasilan telah mencapai batas nisab (Nisab: Rp ${formatNominal(hasil.nisabBulan)}/bln atau Rp ${formatNominal(hasil.nisab)}/thn).`
          : `Penghasilan Anda (Rp ${formatNominal(penghasilan)}/bln) belum mencapai batas nisab zakat (Rp ${formatNominal(hasil.nisabBulan)}/bln atau setara 85g emas: Rp ${formatNominal(hasil.nisab)}/thn). Tidak wajib zakat.`,
      });
      return;
    }
    if (jenisKalkulator === "maal") {
      const harta = Number(String(nilaiKalkulator || "").replace(/\D/g, ""));
      if (!harta || harta <= 0) {
        alert("Silakan masukkan total harta.");
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
          : `Harta Anda (Rp ${formatNominal(harta)}) belum mencapai batas nisab 85 gram emas (Rp ${formatNominal(hasil.nisab)}). Tidak wajib zakat.`,
      });
      return;
    }
    if (jenisKalkulator === "fitrah") {
      const jiwa = Number(String(jumlahJiwa || "").replace(/\D/g, ""));
      if (!jiwa || jiwa <= 0) {
        alert("Jumlah jiwa harus lebih dari 0.");
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



  // =========================================================
  // SUBMIT
  // =========================================================

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.namaLengkap.trim()) {
      alert("Silakan masukkan nama lengkap.");
      return;
    }
    if (!formData.nik.trim()) {
      alert("Silakan masukkan NIK / nomor identitas.");
      return;
    }
    if (!formData.jenisKelamin) {
      alert("Silakan pilih jenis kelamin.");
      return;
    }
    if (!formData.tempatLahir.trim()) {
      alert("Silakan masukkan tempat lahir.");
      return;
    }
    if (!formData.tanggalLahir.trim()) {
      alert("Silakan masukkan tanggal lahir.");
      return;
    }
    if (!formData.pekerjaan.trim()) {
      alert("Silakan masukkan pekerjaan.");
      return;
    }
    if (!formData.noHp.trim()) {
      alert("Silakan masukkan nomor HP / WhatsApp.");
      return;
    }
    if (!formData.alamatLengkap.trim()) {
      alert("Silakan masukkan alamat lengkap.");
      return;
    }
    if (!formData.persetujuan) {
      alert("Silakan centang persetujuan terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      await registerPublicMuzakki({
        nama: formData.namaLengkap,
        nik: formData.nik,
        jenis_kelamin: formData.jenisKelamin,
        tempat_lahir: formData.tempatLahir,
        tanggal_lahir: formData.tanggalLahir,
        pekerjaan: formData.pekerjaan,
        alamat_lengkap: formData.alamatLengkap,
        email: formData.email || null,
        no_hp: formData.noHp,
        kategori: "Muzakki Umum",
        unit_kerja: "Masyarakat Umum",
      });

      navigate("/daftar-muzakki", { state: { registered: true, nama: formData.namaLengkap } });
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

        <div className="absolute inset-0 opacity-10">

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[30px] border-white" />

          <div className="absolute right-40 top-10 h-48 w-48 rounded-full border-[20px] border-white" />

        </div>

        <div className="absolute right-0 top-0 hidden h-full w-[32%] overflow-hidden lg:block">

          <div className="absolute bottom-0 right-20 h-32 w-10 rotate-12 rounded-full bg-green-700/30" />

          <div className="absolute right-32 top-8 h-20 w-10 -rotate-45 rounded-full bg-green-300/40" />

          <div className="absolute right-10 top-20 h-28 w-12 rotate-45 rounded-full bg-green-400/30" />

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
              SIDEBAR
          ================================================== */}

          <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex justify-center">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">

                <ClipboardCheck
                  size={82}
                  strokeWidth={1.5}
                  className="text-[#078052]"
                />

              </div>

            </div>

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

              <p className="mt-3 text-center text-xs leading-5 text-slate-600">
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
              Lengkapi data diri Anda dengan benar sesuai identitas resmi untuk keperluan administrasi Muzakki.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              <InputField
                label="Nama Lengkap"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Contoh: Fitriani Dewi, S.Farm."
                required
              />

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

              <InputField
                label="NIK (Nomor Induk Kependudukan)"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 digit NIK sesuai KTP"
                required
              />

              <InputField
                label="Pekerjaan"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Contoh: Wiraswasta / Karyawan Swasta / Dokter"
                required
              />

              <InputField
                label="Tempat Lahir"
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={handleChange}
                placeholder="Contoh: Tasikmalaya"
                required
              />

              <InputField
                label="Tanggal Lahir"
                name="tanggalLahir"
                type="date"
                value={formData.tanggalLahir}
                onChange={handleChange}
                required
              />

              <InputField
                label="No. HP / WhatsApp"
                name="noHp"
                type="tel"
                value={formData.noHp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                required
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Contoh: nama@email.com (opsional)"
              />


              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Masukkan alamat lengkap tempat tinggal (Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten)"
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#08734f] focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* =================================================
                2. INFORMASI TAMBAHAN
            ================================================== */}

            <div className="my-6 border-t border-slate-200" />

            <SectionTitle
              number="2."
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

            {/* TOMBOL KALKULATOR ZAKAT */}

            <div className="mt-5">
              <button
                type="button"
                onClick={openKalkulator}
                className="flex items-center gap-2 rounded-xl border border-[#08734f] bg-green-50 px-4 py-2.5 text-sm font-medium text-[#08734f] transition hover:bg-green-100"
              >
                <Calculator size={17} />
                Hitung Estimasi Zakat Saya
              </button>
              <p className="mt-1.5 text-xs text-slate-500">
                Gunakan kalkulator untuk mengetahui perkiraan kewajiban zakat Anda.
              </p>
            </div>

            {/* =================================================
                3. PERSETUJUAN
            ================================================== */}

            <div className="my-6 border-t border-slate-200" />

            <SectionTitle
              number="3."
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
              aria-label="Tutup kalkulator"
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
                    Hitung estimasi zakat Anda dengan mudah.
                  </p>

                </div>

              </div>

            </div>

            {/* JENIS KALKULATOR */}

            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium text-gray-700">
                Jenis Zakat
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <CalculatorTypeButton
                  icon={<WalletCards size={20} />}
                  title="Penghasilan"
                  selected={
                    jenisKalkulator === "penghasilan"
                  }
                  onClick={() =>
                    handleJenisKalkulator("penghasilan")
                  }
                />

                <CalculatorTypeButton
                  icon={<Landmark size={20} />}
                  title="Maal"
                  selected={
                    jenisKalkulator === "maal"
                  }
                  onClick={() =>
                    handleJenisKalkulator("maal")
                  }
                />

                <CalculatorTypeButton
                  icon={<Users size={20} />}
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

            {/* ================================================
                PENGHASILAN
            ================================================= */}

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
                    className="h-11 w-full px-4 text-sm outline-none focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Estimasi sederhana menggunakan 2,5%.
                </p>

              </div>

            )}

            {/* ================================================
                MAAL
            ================================================= */}

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
                    className="h-11 w-full px-4 text-sm outline-none focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Estimasi sederhana menggunakan 2,5%.
                </p>

              </div>

            )}

            {/* ================================================
                FITRAH
            ================================================= */}

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
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(/\D/g, "");

                      setJumlahJiwa(value);
                    }}
                    placeholder="1"
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-green-100"
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
                      className="h-11 w-full px-4 text-sm outline-none focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                </div>

                <p className="text-xs text-gray-500">
                  Nominal per jiwa dapat disesuaikan dengan
                  ketentuan yang berlaku di wilayah/UPZ.
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
                Hasil di atas merupakan estimasi sederhana untuk
                membantu perhitungan awal dan bukan penetapan
                kewajiban zakat resmi.
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
          <span className="text-red-500">
            *
          </span>
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
          <span className="text-red-500">
            *
          </span>
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
      className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-[#08734f] bg-green-50 text-[#08734f]"
          : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
      }`}
    >

      {icon}

      <span className="text-sm font-semibold">
        {title}
      </span>

    </button>
  );
}