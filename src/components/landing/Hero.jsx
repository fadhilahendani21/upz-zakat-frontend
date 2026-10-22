
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, FileSearch } from "lucide-react";
import Button from "../common/Button";
import gedungUnsil from "../../assets/images/gedung-unsil.jpeg";
import { useSettings } from "../../services/settingService";

export default function Hero() {
  const navigate = useNavigate();
  const settings = useSettings();

  const [berandaCustom, setBerandaCustom] = useState(() => {
    try {
      const saved = localStorage.getItem("upz_beranda_settings");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setBerandaCustom(e.detail);
      } else {
        try {
          const saved = localStorage.getItem("upz_beranda_settings");
          if (saved) setBerandaCustom(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("upz_beranda_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("upz_beranda_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const orgName =
    settings?.profil?.namaLembaga ||
    "UPZ Zakat Universitas Siliwangi";

  const badgeText =
    berandaCustom?.hero?.badge || "Transparan • Amanah • Profesional";

  const judulText =
    berandaCustom?.hero?.judul || "Menunaikan Zakat, Membersamai Umat";

  const deskripsiText =
    berandaCustom?.hero?.deskripsi ||
    `${orgName} hadir untuk memudahkan sivitas akademika dan masyarakat dalam menunaikan zakat, infak, dan sedekah secara aman, transparan, dan terpercaya.`;

  const fotoHero = berandaCustom?.hero?.foto || gedungUnsil;
  const kutipanIsi =
    berandaCustom?.kutipan?.isi ||
    "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka.";
  const kutipanSumber =
    berandaCustom?.kutipan?.sumber || "QS. At-Taubah: 103";

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative mx-auto w-full max-w-none px-3 py-1 sm:px-5 sm:py-2 lg:px-6 xl:px-8 lg:py-2">

        {/* ======================================================
            FOTO LATAR
        ====================================================== */}
        <div className="absolute inset-y-0 right-3 hidden sm:block sm:right-5 sm:w-[58%] lg:right-6 lg:w-[58%] xl:right-8 xl:w-[60%]">
          <img
            src={fotoHero}
            alt="Gedung Universitas Siliwangi"
            className="h-full w-full object-cover object-center"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.35) 27%, rgba(0,0,0,0.72) 42%, black 55%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.35) 27%, rgba(0,0,0,0.72) 42%, black 55%)",
            }}
          />
        </div>

        {/* ======================================================
            SCRIM UNTUK LAYAR TABLET
        ====================================================== */}
        <div
          className="hidden sm:block lg:hidden absolute inset-y-0 left-0 w-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.86) 38%, rgba(255,255,255,0.42) 58%, transparent 78%)",
          }}
        />

        {/* ======================================================
            KOLOM TEKS
        ====================================================== */}
        <div className="relative z-[1] w-full max-w-full sm:max-w-[48%] md:max-w-[46%] lg:max-w-[48%] xl:max-w-[46%]">

          {/* BADGE */}
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-medium text-brand-700 sm:text-xs">
            <ShieldCheck size={14} />
            {badgeText}
          </span>

          {/* JUDUL */}
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-gray-900 sm:mt-2 sm:text-3xl md:text-3xl lg:mt-2 lg:text-3xl xl:text-4xl">
            {judulText}
          </h1>

          {/* DESKRIPSI */}
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-xs md:text-sm lg:mt-2">
            {deskripsiText}
          </p>

          {/* ======================================================
              TOMBOL HERO
          ====================================================== */}
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-3 lg:gap-3">

            {/* TUNAIKAN ZAKAT */}
            <button
              type="button"
              onClick={() => navigate("/zakat")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Wallet size={18} />
              Tunaikan Zakat
            </button>

            {/* CEK PERHITUNGAN ZAKAT */}
            <Button
              variant="outline"
              icon={FileSearch}
              onClick={() => navigate("/hitung-zakat")}
            >
              Cek Perhitungan Zakat
            </Button>

          </div>

          {/* KETERANGAN */}
          <p className="mt-2 flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
            <ShieldCheck size={14} />
            Transaksi aman dan diawasi oleh Syariah
          </p>
        </div>

        {/* ======================================================
            VERSI KHUSUS HP
        ====================================================== */}
        <div className="relative mt-5 overflow-hidden rounded-2xl shadow-md sm:hidden">
          <img
            src={fotoHero}
            alt="Gedung Universitas Siliwangi"
            className="h-48 w-full object-cover object-bottom"
          />
        </div>

        {/* KUTIPAN HP */}
        <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:hidden">
          <p className="text-xs leading-relaxed text-gray-700">
            &ldquo;{kutipanIsi}&rdquo;
          </p>

          <p className="mt-1 text-[11px] font-medium text-gray-500">
            – {kutipanSumber}
          </p>
        </div>

        {/* ======================================================
            KARTU KUTIPAN DESKTOP
        ====================================================== */}
        <div className="absolute bottom-2 right-3 z-10 hidden w-44 sm:block md:right-5 md:w-52 lg:bottom-3 lg:right-6 lg:w-64 xl:right-8 xl:w-72">
          <div className="relative rounded-xl bg-white/80 p-3 pt-4 shadow-lg backdrop-blur-sm lg:rounded-2xl lg:p-4 lg:pt-5 border border-white/50">

            {/* ICON KUTIPAN */}
            <div className="absolute -top-2.5 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-[11px] font-serif text-white shadow-md lg:-top-3 lg:left-4 lg:h-7 lg:w-7 lg:text-base">
              &ldquo;
            </div>

            {/* ISI KUTIPAN */}
            <p className="text-[10px] leading-snug text-gray-800 md:text-[11px] lg:text-xs lg:leading-relaxed">
              {kutipanIsi}
            </p>

            {/* SUMBER */}
            <p className="mt-1.5 text-[9px] font-medium text-gray-600 lg:text-[10px]">
              – {kutipanSumber}
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
