import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, FileSearch } from "lucide-react";
import Button from "../common/Button";
import gedungUnsil from "../../assets/images/gedung-unsil.jpeg";
import { useSettings } from "../../services/settingService";

export default function Hero() {
  const navigate = useNavigate();
  const settings = useSettings();
  const orgName = settings?.profil?.namaLembaga || "UPZ Zakat Universitas Siliwangi";

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-7xl w-full mx-auto px-6 py-8 sm:py-10 lg:py-24">
        {/* Foto latar */}
        <div className="hidden sm:block absolute inset-y-0 right-0 w-[60%] lg:right-6 lg:w-[65%]">
          <img
            src={gedungUnsil}
            alt="Gedung Universitas Siliwangi"
            className="w-full h-full object-cover object-right"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 8%, rgba(0,0,0,0.15) 18%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0.6) 38%, black 52%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 8%, rgba(0,0,0,0.15) 18%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0.6) 38%, black 52%)",
            }}
          />
        </div>

        {/* Scrim tipis di belakang teks supaya kontras tetap terjaga di layar sempit */}
        <div
          className="hidden sm:block lg:hidden absolute inset-y-0 left-0 w-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.8) 42%, rgba(255,255,255,0.25) 60%, transparent 75%)",
          }}
        />

        {/* Kolom teks */}
        <div className="relative z-[1] max-w-full sm:max-w-[46%] md:max-w-[48%] lg:max-w-xl">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
            <ShieldCheck size={14} /> Transparan • Amanah • Profesional
          </span>

          <h1 className="mt-3 sm:mt-4 lg:mt-5 text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight sm:leading-snug lg:leading-tight">
            Menunaikan Zakat,{" "}
            <span className="text-brand-600">Membersamai Umat</span>
          </h1>

          <p className="mt-3 sm:mt-3 lg:mt-5 text-sm sm:text-xs md:text-sm text-gray-600 leading-relaxed">
            {orgName} hadir untuk memudahkan sivitas
            akademika dan masyarakat dalam menunaikan zakat, infak, dan
            sedekah secara aman, transparan, dan terpercaya.
          </p>

          <div className="mt-5 sm:mt-4 lg:mt-8 flex flex-wrap gap-3 sm:gap-2 lg:gap-4">
            <Button icon={Wallet} onClick={() => navigate("/donasi")}>
              Tunaikan Zakat
            </Button>
            <Button
              variant="outline"
              icon={FileSearch}
              onClick={() => navigate("/hitung-zakat")}
            >
              Cek Perhitungan Zakat
            </Button>
          </div>

          <p className="mt-3 sm:mt-3 lg:mt-5 text-[11px] sm:text-xs text-gray-500 flex items-center gap-2">
            <ShieldCheck size={14} /> Transaksi aman dan diawasi oleh Syariah
          </p>
        </div>

        {/* Versi khusus HP portrait */}
        <div className="sm:hidden relative mt-8 rounded-2xl overflow-hidden shadow-md">
          <img
            src={gedungUnsil}
            alt="Gedung Universitas Siliwangi"
            className="w-full h-56 object-cover object-bottom"
          />
        </div>
        <div className="sm:hidden mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-700 leading-relaxed">
            &ldquo;Ambillah zakat dari sebagian harta mereka, dengan zakat itu
            kamu membersihkan dan mensucikan mereka.&rdquo;
          </p>
          <p className="mt-1 text-[11px] text-gray-500 font-medium">
            – QS. At-Taubah: 103
          </p>
        </div>

        {/* Kartu kutipan: tetap tampil dari sm ke atas, ukuran & posisi menyesuaikan */}
        <div className="hidden sm:block absolute bottom-3 right-3 w-40 sm:w-44 md:w-56 lg:bottom-6 lg:right-10 lg:w-80 z-10">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2.5 pt-4 lg:p-5 lg:pt-6 shadow-lg">
            <div className="absolute -top-2.5 left-2.5 w-5 h-5 lg:-top-4 lg:left-5 lg:w-9 lg:h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px] lg:text-lg font-serif shadow-md">
              &ldquo;
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-800 leading-snug lg:leading-relaxed">
              Ambillah zakat dari sebagian harta mereka, dengan zakat itu
              kamu membersihkan dan mensucikan mereka.
            </p>
            <p className="mt-1 lg:mt-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-600 font-medium">
              – QS. At-Taubah: 103
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}