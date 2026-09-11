import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  ArrowRight,
  Download,
  Calculator,
  HandCoins,
  FileText,
  UserRound,
  CreditCard,
  WalletCards,
  ChevronRight,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function MuzakkiDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUnauthorized(false);

      const token = localStorage.getItem("muzakki_token");

      if (!token) {
        setIsUnauthorized(true);
        setError(
          "Sesi login telah berakhir atau token tidak ditemukan. Silakan login ulang."
        );
        return;
      }

      const response = await axios.get(`${API_URL}/muzakki/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);

      if (err.response?.status === 401) {
        setIsUnauthorized(true);

        localStorage.removeItem("muzakki_token");
        localStorage.removeItem("muzakki_user");

        setError(
          "Sesi Anda telah berakhir atau tidak valid. Silakan masuk kembali."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal memuat data dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#d8eee3] border-t-[#16845d] rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-sm text-gray-500">
            Memuat data dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#fbfdfc] px-5">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <span className="text-xl font-bold">!</span>
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-800">
            Gagal Memuat Dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          {isUnauthorized ? (
            <button
              onClick={() => navigate("/muzakki/masuk")}
              className="mt-5 px-5 py-2.5 rounded-lg bg-[#16845d] hover:bg-[#116f4e] text-white text-sm font-semibold transition"
            >
              Masuk Kembali
            </button>
          ) : (
            <button
              onClick={fetchDashboardData}
              className="mt-5 px-5 py-2.5 rounded-lg bg-[#16845d] hover:bg-[#116f4e] text-white text-sm font-semibold transition"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  const { user, muzakki, stats, transaksi } = dashboardData || {};

  const nama =
    muzakki?.nama ||
    user?.name ||
    "Muzakki UPZ Unsil";

  const pekerjaan =
    muzakki?.pekerjaan ||
    muzakki?.kategori ||
    "Muzakki";

  const initial =
    nama?.charAt(0)?.toUpperCase() || "M";

  const formatRupiah = (value) => {
    return `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`;
  };

  /* =====================================================
     STATISTIK
  ===================================================== */
  const statsDisplay = [
    {
      label: `Total Zakat Tahun ${
        stats?.tahun || new Date().getFullYear()
      }`,
      value: formatRupiah(stats?.total_zakat_tahun_ini),
      icon: WalletCards,
      iconClass: "bg-[#dff3e8] text-[#14865d]",
      valueClass: "text-[#13845b]",
    },
    {
      label: "Jumlah Pembayaran",
      value: `${stats?.jumlah_pembayaran || 0} kali`,
      icon: CreditCard,
      iconClass: "bg-[#e1f0fb] text-[#2182c4]",
      valueClass: "text-[#14845d]",
    },
    {
      label: "Zakat Bulanan",
      value: formatRupiah(stats?.zakat_bulanan),
      icon: HandCoins,
      iconClass: "bg-[#fff0df] text-[#eb7518]",
      valueClass: "text-[#e8751b]",
    },
    {
      label: "Status",
      value: "Aktif",
      icon: CheckCircle,
      iconClass: "bg-[#eee5ff] text-[#7650c7]",
      valueClass: "text-[#14845d]",
      active: true,
    },
  ];

  return (
    <div className="w-full bg-[#fbfdfc] text-[#263238]">

      {/* =====================================================
          WELCOME BANNER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-xl border border-[#e4eee9] bg-gradient-to-r from-[#eef9f3] via-[#f4fbf7] to-[#e5f4eb] min-h-[145px] sm:min-h-[158px]">

        <div className="relative z-10 px-5 py-6 sm:px-7 sm:py-7 md:px-9 md:py-8 max-w-[700px]">
          <p className="text-sm sm:text-[15px] text-gray-700">
            Selamat Datang,
          </p>

          <h1 className="mt-1 text-xl sm:text-2xl md:text-[30px] leading-tight font-bold text-[#08784f]">
            {nama}
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-[15px] leading-relaxed text-gray-600 max-w-[520px]">
            Terima kasih telah menjadi bagian dari gerakan kebaikan
            melalui zakat di Universitas Siliwangi.
          </p>
        </div>

        {/* DEKORASI DESKTOP */}
        <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden md:block overflow-hidden">
          <div className="absolute -right-16 -top-20 w-[360px] h-[360px] rounded-full bg-[#d5eddf]" />

          <div className="absolute right-10 lg:right-16 top-9 text-right">
            <p className="text-[22px] lg:text-[24px] font-serif italic text-[#245b46]">
              Zakat
            </p>

            <p className="text-xs lg:text-sm font-medium text-[#245b46]">
              Membersihkan Harta
            </p>

            <p className="text-xs lg:text-sm font-medium text-[#245b46]">
              Menumbuhkan Keberkahan
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          PROFIL + MOTIVASI
      ===================================================== */}
      <section className="mt-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_315px] gap-4">

        {/* PROFIL */}
        <div className="bg-white border border-[#e1e7e4] rounded-xl p-4 sm:p-5">

          <div className="flex items-center justify-between mb-4 gap-3">

            <div className="flex items-center gap-2 min-w-0">
              <UserRound
                size={20}
                className="text-[#16845d] shrink-0"
              />

              <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#16845d]">
                Profil Muzakki
              </h2>
            </div>

            <button
              onClick={() => navigate("/muzakki/profil")}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-[11px] sm:text-xs font-semibold text-gray-700 hover:border-[#16845d] hover:text-[#16845d] transition shrink-0"
            >
              Edit Profil
            </button>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

            {/* FOTO */}
            <div className="shrink-0 flex justify-center sm:justify-start">
              <div className="w-[88px] h-[88px] sm:w-[105px] sm:h-[105px] md:w-[112px] md:h-[112px] rounded-full overflow-hidden bg-[#dff1e5] border-4 border-white shadow-sm flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-[#13845b]">
                  {initial}
                </span>
              </div>
            </div>

            {/* DATA */}
            <div className="flex-1 min-w-0">

              <div className="flex flex-wrap items-center gap-2 mb-2">

                <h3 className="text-lg sm:text-xl font-bold text-[#17202a] break-words">
                  {nama}
                </h3>

                <span className="px-3 py-1 rounded-full bg-[#d9f5e5] text-[#13845b] text-[10px] sm:text-xs font-semibold">
                  {pekerjaan}
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs sm:text-sm">

                {muzakki?.nip && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">NIP</span>

                    <span className="font-medium text-gray-700 break-all">
                      {muzakki.nip}
                    </span>
                  </div>
                )}

                {muzakki?.nik && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">NIK</span>

                    <span className="font-medium text-gray-700 break-all">
                      {muzakki.nik}
                    </span>
                  </div>
                )}

                {muzakki?.unit_kerja && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">
                      Unit Kerja
                    </span>

                    <span className="font-medium text-gray-700 break-words">
                      {muzakki.unit_kerja}
                    </span>
                  </div>
                )}

                {muzakki?.fakultas && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">
                      Fakultas
                    </span>

                    <span className="font-medium text-gray-700 break-words">
                      {muzakki.fakultas}
                    </span>
                  </div>
                )}

                {muzakki?.program_studi && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">
                      Program Studi
                    </span>

                    <span className="font-medium text-gray-700 break-words">
                      {muzakki.program_studi}
                    </span>
                  </div>
                )}

                {muzakki?.email && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">
                      Email
                    </span>

                    <span className="font-medium text-gray-700 break-all">
                      {muzakki.email}
                    </span>
                  </div>
                )}

                {muzakki?.no_hp && (
                  <div className="grid grid-cols-[90px_1fr]">
                    <span className="text-gray-500">
                      No. Handphone
                    </span>

                    <span className="font-medium text-gray-700 break-all">
                      {muzakki.no_hp}
                    </span>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>


        {/* MOTIVASI */}
        <div className="relative overflow-hidden rounded-xl border border-[#dcece3] bg-gradient-to-br from-[#edf9f2] to-[#e2f3e9] p-4 sm:p-5">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center text-[#16845d] shadow-sm shrink-0">
              <HandCoins size={21} />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#176c4d]">
                Zakat hari ini,
              </h3>

              <h3 className="text-sm sm:text-base font-bold text-[#176c4d]">
                untuk keberkahan esok.
              </h3>
            </div>

          </div>

          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600">
            Teruslah menebar kebaikan melalui zakat.
            Semoga setiap langkah kebaikan Anda menjadi
            pahala yang berkelanjutan.
          </p>

          <div className="mt-4 w-12 h-1 rounded-full bg-[#13845b]" />

          <div className="absolute -bottom-8 -right-5 text-[#cde5d7] opacity-50">
            <HandCoins size={110} />
          </div>

        </div>

      </section>


      {/* =====================================================
          KARTU MUZAKKI + NPWZ
          TETAP LANDSCAPE DI SEMUA UKURAN
      ===================================================== */}
      <section className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ===================================================
            KARTU MUZAKKI
        =================================================== */}
        <div className="bg-white border border-[#e1e7e4] rounded-xl p-3 sm:p-3.5">

          <div className="flex items-center gap-2 px-1 mb-3">
            <WalletCards
              size={18}
              className="text-[#16845d] shrink-0"
            />

            <h2 className="text-sm sm:text-base font-bold text-[#16845d]">
              Kartu Muzakki
            </h2>
          </div>


          {/* KARTU */}
          <div
            className="
              relative
              w-full
              aspect-[1.75/1]
              overflow-hidden
              rounded-lg
              sm:rounded-xl
              bg-gradient-to-br
              from-white
              via-[#f7fbf8]
              to-[#e3f1e8]
              border
              border-[#d8e7df]
            "
          >

            {/* HIASAN BAWAH */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-[#13845b]" />

            <div
              className="
                absolute
                bottom-0
                left-[35%]
                w-[30%]
                h-[20%]
                bg-[#e8c52c]
                -skew-x-[25deg]
              "
            />


            {/* ISI KARTU */}
            <div
              className="
                relative
                z-10
                h-full
                w-full
                p-2
                min-[375px]:p-2.5
                sm:p-4
                md:p-5
                flex
                flex-row
                items-start
                gap-2
                min-[375px]:gap-2.5
                sm:gap-4
              "
            >

              {/* LOGO */}
              <div
                className="
                  w-9
                  h-9
                  min-[375px]:w-11
                  min-[375px]:h-11
                  sm:w-14
                  sm:h-14
                  md:w-[68px]
                  md:h-[68px]
                  rounded-full
                  bg-white
                  border
                  border-[#d8e7df]
                  flex
                  items-center
                  justify-center
                  shrink-0
                  shadow-sm
                "
              >

                <div className="text-center">
                  <div
                    className="
                      text-xs
                      min-[375px]:text-sm
                      sm:text-lg
                      md:text-xl
                      font-bold
                      text-[#16845d]
                    "
                  >
                    U
                  </div>

                  <p
                    className="
                      text-[3px]
                      min-[375px]:text-[4px]
                      sm:text-[6px]
                      md:text-[7px]
                      font-bold
                      text-[#16845d]
                    "
                  >
                    UPZ UNSIL
                  </p>
                </div>

              </div>


              {/* DATA */}
              <div className="flex-1 min-w-0 h-full">

                {/* HEADER */}
                <div className="flex items-start justify-between gap-1.5 sm:gap-2">

                  <div className="min-w-0">

                    <p
                      className="
                        text-[8px]
                        min-[375px]:text-[10px]
                        sm:text-base
                        md:text-lg
                        font-bold
                        text-[#116a4b]
                        truncate
                      "
                    >
                      KARTU MUZAKKI
                    </p>

                    <p
                      className="
                        text-[4px]
                        min-[375px]:text-[5px]
                        sm:text-[7px]
                        md:text-[9px]
                        text-gray-500
                        truncate
                      "
                    >
                      Dosen & Staff Universitas Siliwangi
                    </p>

                  </div>


                  {/* QR PLACEHOLDER */}
                  <div
                    className="
                      w-5
                      h-5
                      min-[375px]:w-6
                      min-[375px]:h-6
                      sm:w-8
                      sm:h-8
                      md:w-10
                      md:h-10
                      border
                      border-gray-300
                      bg-white
                      shrink-0
                    "
                  />

                </div>


                {/* DATA DETAIL */}
                <div
                  className="
                    mt-1
                    min-[375px]:mt-1.5
                    sm:mt-2.5
                    space-y-0.5
                    sm:space-y-1
                    text-[4px]
                    min-[375px]:text-[5px]
                    sm:text-[8px]
                    md:text-[10px]
                  "
                >

                  {/* NAMA */}
                  <div
                    className="
                      grid
                      grid-cols-[34px_4px_1fr]
                      min-[375px]:grid-cols-[40px_5px_1fr]
                      sm:grid-cols-[58px_7px_1fr]
                      md:grid-cols-[70px_8px_1fr]
                    "
                  >
                    <span className="text-gray-600">
                      Nama
                    </span>

                    <span>:</span>

                    <span className="font-semibold truncate">
                      {nama}
                    </span>
                  </div>


                  {/* NIP */}
                  <div
                    className="
                      grid
                      grid-cols-[34px_4px_1fr]
                      min-[375px]:grid-cols-[40px_5px_1fr]
                      sm:grid-cols-[58px_7px_1fr]
                      md:grid-cols-[70px_8px_1fr]
                    "
                  >
                    <span className="text-gray-600">
                      NIP
                    </span>

                    <span>:</span>

                    <span className="font-semibold truncate">
                      {muzakki?.nip || "-"}
                    </span>
                  </div>


                  {/* UNIT KERJA */}
                  <div
                    className="
                      grid
                      grid-cols-[34px_4px_1fr]
                      min-[375px]:grid-cols-[40px_5px_1fr]
                      sm:grid-cols-[58px_7px_1fr]
                      md:grid-cols-[70px_8px_1fr]
                    "
                  >
                    <span className="text-gray-600">
                      Unit Kerja
                    </span>

                    <span>:</span>

                    <span className="font-semibold truncate">
                      {muzakki?.unit_kerja || "-"}
                    </span>
                  </div>


                  {/* STATUS */}
                  <div
                    className="
                      grid
                      grid-cols-[34px_4px_1fr]
                      min-[375px]:grid-cols-[40px_5px_1fr]
                      sm:grid-cols-[58px_7px_1fr]
                      md:grid-cols-[70px_8px_1fr]
                    "
                  >
                    <span className="text-gray-600">
                      Status
                    </span>

                    <span>:</span>

                    <span className="font-semibold text-[#16845d]">
                      Aktif
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* NOMOR KARTU */}
            <div
              className="
                absolute
                bottom-[3.5%]
                left-2
                min-[375px]:left-2.5
                sm:left-4
                md:left-5
                z-20
                text-white
                font-semibold
                text-[4px]
                min-[375px]:text-[5px]
                sm:text-[8px]
                md:text-[11px]
                truncate
                max-w-[55%]
              "
            >
              MZK-{muzakki?.id || "2025-000123"}
            </div>


            {/* VERIFIKASI */}
            <p
              className="
                absolute
                bottom-[3.5%]
                right-2
                min-[375px]:right-2.5
                sm:right-4
                md:right-5
                z-20
                text-[3px]
                min-[375px]:text-[4px]
                sm:text-[6px]
                md:text-[8px]
                text-white
                truncate
                max-w-[35%]
              "
            >
              Scan untuk verifikasi
            </p>

          </div>

        </div>


        {/* ===================================================
            KARTU NPWZ
        =================================================== */}
        <div className="bg-white border border-[#e1e7e4] rounded-xl p-3 sm:p-3.5">

          <div className="flex items-center gap-2 px-1 mb-3">

            <CreditCard
              size={18}
              className="text-[#16845d] shrink-0"
            />

            <h2 className="text-sm sm:text-base font-bold text-[#16845d]">
              Kartu NPWZ
            </h2>

          </div>


          {/* KARTU LANDSCAPE */}
          <div
            className="
              relative
              w-full
              aspect-[1.75/1]
              overflow-hidden
              rounded-lg
              sm:rounded-xl
              bg-gradient-to-br
              from-[#fff9d9]
              via-[#ffe990]
              to-[#eabf37]
              border
              border-[#e6c95a]
            "
          >

            {/* DEKORASI */}
            <div className="absolute right-0 top-0 w-[45%] h-full bg-[#d9b12d]/20" />


            {/* ISI */}
            <div
              className="
                relative
                z-10
                h-full
                p-2
                min-[375px]:p-2.5
                sm:p-4
                md:p-5
              "
            >

              {/* HEADER */}
              <div className="flex justify-between items-start gap-2">

                <div className="min-w-0">

                  <p
                    className="
                      text-[8px]
                      min-[375px]:text-[10px]
                      sm:text-sm
                      md:text-base
                      font-bold
                      text-[#1b674b]
                      truncate
                    "
                  >
                    BAZNASCard
                  </p>

                  <p
                    className="
                      text-[4px]
                      min-[375px]:text-[5px]
                      sm:text-[7px]
                      md:text-[9px]
                      text-gray-700
                      truncate
                    "
                  >
                    Badan Amil Zakat Nasional
                  </p>

                </div>


                <p
                  className="
                    text-[6px]
                    min-[375px]:text-[8px]
                    sm:text-base
                    md:text-xl
                    font-serif
                    text-gray-600
                    shrink-0
                  "
                >
                  BAZNASCard
                </p>

              </div>


              {/* NPWZ */}
              <div
                className="
                  mt-1.5
                  min-[375px]:mt-2
                  sm:mt-3
                  md:mt-4
                "
              >

                <p
                  className="
                    text-[4px]
                    min-[375px]:text-[5px]
                    sm:text-[8px]
                    md:text-[10px]
                    font-bold
                    text-gray-700
                  "
                >
                  NPWZ
                </p>

                <p
                  className="
                    text-[8px]
                    min-[375px]:text-[10px]
                    sm:text-base
                    md:text-xl
                    font-bold
                    tracking-wider
                    text-[#151515]
                    truncate
                  "
                >
                  {muzakki?.npwz || "BELUM TERDAFTAR"}
                </p>

              </div>


              {/* MUZAKKI */}
              <div
                className="
                  mt-1
                  min-[375px]:mt-1.5
                  sm:mt-2.5
                  md:mt-3
                "
              >

                <p
                  className="
                    text-[4px]
                    min-[375px]:text-[5px]
                    sm:text-[7px]
                    md:text-[9px]
                    text-gray-600
                  "
                >
                  MUZAKKI
                </p>

                <p
                  className="
                    text-[6px]
                    min-[375px]:text-[8px]
                    sm:text-xs
                    md:text-sm
                    font-bold
                    text-gray-800
                    truncate
                  "
                >
                  {nama}
                </p>

              </div>


              {/* FOOTER */}
              <p
                className="
                  absolute
                  bottom-1
                  min-[375px]:bottom-1.5
                  sm:bottom-2
                  left-2
                  min-[375px]:left-2.5
                  sm:left-4
                  md:left-5
                  text-[3px]
                  min-[375px]:text-[4px]
                  sm:text-[6px]
                  md:text-[8px]
                  italic
                  text-gray-700
                  truncate
                  max-w-[75%]
                "
              >
                Amanah, Transparan dan Profesional
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATISTIK
      ===================================================== */}
      <section className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">

        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-[#e1e7e4]
                rounded-xl
                p-3
                sm:p-4
                flex
                items-center
                gap-2
                sm:gap-3
                min-w-0
              "
            >

              <div
                className={`
                  w-9
                  h-9
                  sm:w-11
                  sm:h-11
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                  ${stat.iconClass}
                `}
              >
                <Icon
                  size={18}
                  className="sm:w-[21px] sm:h-[21px]"
                />
              </div>

              <div className="min-w-0">

                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                  {stat.label}
                </p>

                <p
                  className={`
                    mt-0.5
                    text-sm
                    sm:text-lg
                    font-bold
                    truncate
                    ${stat.valueClass}
                  `}
                >
                  {stat.value}
                </p>

                {stat.active && (
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] text-[#16845d]">
                    <CheckCircle size={11} />
                    Aktif
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </section>


      {/* =====================================================
          RIWAYAT PEMBAYARAN
      ===================================================== */}
      <section className="mt-4 bg-white border border-[#e1e7e4] rounded-xl overflow-hidden">

        <div className="px-3 sm:px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">

          <div className="flex items-center gap-2 min-w-0">

            <FileText
              size={18}
              className="text-[#16845d] shrink-0"
            />

            <h2 className="text-sm sm:text-base font-bold text-[#16845d] truncate">
              Riwayat Pembayaran Zakat
            </h2>

          </div>

          <button
            onClick={() => navigate("/muzakki/riwayat")}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#16845d] shrink-0"
          >
            Lihat Semua
            <ArrowRight size={15} />
          </button>

        </div>


        {transaksi && transaksi.length > 0 ? (
          <div className="overflow-x-auto">

            <table className="w-full text-xs md:text-sm">

              <thead className="bg-[#f0f7f3] text-gray-600">

                <tr>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    No
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Tanggal
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Jenis Zakat
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Periode
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Nominal
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Metode Pembayaran
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {transaksi.slice(0, 5).map((item, idx) => (

                  <tr
                    key={item.id || idx}
                    className="hover:bg-[#f8fcfa] transition"
                  >

                    <td className="px-3 py-2.5 text-gray-500">
                      {idx + 1}
                    </td>

                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                      {item.tanggal || "-"}
                    </td>

                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                      {item.jenis_zakat || "-"}
                    </td>

                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                      {item.periode || "-"}
                    </td>

                    <td className="px-3 py-2.5 font-semibold text-gray-800 whitespace-nowrap">
                      {formatRupiah(item.nominal)}
                    </td>

                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">
                      {item.metode || "-"}
                    </td>

                    <td className="px-3 py-2.5">

                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#dff6e8] text-[#16845d] font-semibold whitespace-nowrap">
                        <CheckCircle size={12} />
                        {item.status || "Lunas"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        ) : (

          <div className="py-10 text-center">

            <FileText
              size={34}
              className="mx-auto text-gray-300"
            />

            <p className="mt-2 text-sm text-gray-500">
              Belum ada riwayat pembayaran zakat.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          QUICK ACTION
      ===================================================== */}
      <section className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 pb-6">

        {/* HITUNG */}
        <button
          onClick={() => navigate("/muzakki/kalkulator")}
          className="
            group
            bg-white
            border
            border-[#d9e9e1]
            rounded-xl
            p-3
            sm:p-4
            flex
            items-center
            gap-3
            sm:gap-4
            text-left
            hover:border-[#16845d]
            hover:shadow-sm
            transition
          "
        >

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#dff3e8] text-[#16845d] flex items-center justify-center shrink-0">
            <Calculator
              size={21}
              className="sm:w-[25px] sm:h-[25px]"
            />
          </div>

          <div className="flex-1 min-w-0">

            <p className="font-bold text-sm sm:text-base text-[#16845d]">
              Hitung Zakat
            </p>

            <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
              Gunakan kalkulator untuk estimasi zakat Anda.
            </p>

          </div>

          <ChevronRight
            size={18}
            className="text-[#16845d] group-hover:translate-x-1 transition shrink-0"
          />

        </button>


        {/* TUNAIKAN */}
        <button
          onClick={() => navigate("/muzakki/tunaikan")}
          className="
            group
            bg-[#f3f9fd]
            border
            border-[#cce3f2]
            rounded-xl
            p-3
            sm:p-4
            flex
            items-center
            gap-3
            sm:gap-4
            text-left
            hover:border-[#2182c4]
            hover:shadow-sm
            transition
          "
        >

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2182c4] text-white flex items-center justify-center shrink-0">
            <HandCoins
              size={21}
              className="sm:w-[25px] sm:h-[25px]"
            />
          </div>

          <div className="flex-1 min-w-0">

            <p className="font-bold text-sm sm:text-base text-[#2182c4]">
              Tunaikan Zakat
            </p>

            <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
              Lakukan pembayaran zakat sekarang.
            </p>

          </div>

          <ChevronRight
            size={18}
            className="text-[#2182c4] group-hover:translate-x-1 transition shrink-0"
          />

        </button>


        {/* LAPORAN */}
        <button
          onClick={() => navigate("/muzakki/laporan")}
          className="
            group
            bg-[#fffaf1]
            border
            border-[#f2dfb6]
            rounded-xl
            p-3
            sm:p-4
            flex
            items-center
            gap-3
            sm:gap-4
            text-left
            hover:border-[#e99a16]
            hover:shadow-sm
            transition
          "
        >

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0a51c] text-white flex items-center justify-center shrink-0">
            <Download
              size={21}
              className="sm:w-[25px] sm:h-[25px]"
            />
          </div>

          <div className="flex-1 min-w-0">

            <p className="font-bold text-sm sm:text-base text-[#d9900d]">
              Unduh Laporan
            </p>

            <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
              Unduh rekapitulasi pembayaran zakat Anda.
            </p>

          </div>

          <ChevronRight
            size={18}
            className="text-[#d9900d] group-hover:translate-x-1 transition shrink-0"
          />

        </button>

      </section>

    </div>
  );
}