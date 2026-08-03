import { ShieldCheck, Wallet, FileSearch } from "lucide-react";
import Button from "../common/Button";
import gedungUnsil from "../../assets/images/gedung-unsil.jpeg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-7xl w-full mx-auto px-6 py-16 sm:py-24">
        <div className="absolute inset-y-0 right-6 w-full sm:w-[65%]">
          <img
            src={gedungUnsil}
            alt="Gedung Universitas Siliwangi"
            className="w-full h-full object-cover object-right"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 10%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.6) 40%, black 55%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 10%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.6) 40%, black 55%)",
            }}
          />
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} /> Transparan • Amanah • Profesional
          </span>

          <h1 className="mt-5 text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Menunaikan Zakat,{" "}
            <span className="text-brand-600">Membersamai Umat</span>
          </h1>

          <p className="mt-5 text-gray-600 leading-relaxed">
            UPZ Zakat Universitas Siliwangi hadir untuk memudahkan sivitas
            akademika dan masyarakat dalam menunaikan zakat, infak, dan
            sedekah secara aman, transparan, dan terpercaya.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button icon={Wallet}>Tunaikan Zakat</Button>
            <Button variant="outline" icon={FileSearch}>
              Cek Perhitungan Zakat
            </Button>
          </div>

          <p className="mt-5 text-xs text-gray-500 flex items-center gap-2">
            <ShieldCheck size={14} /> Transaksi aman dan diawasi oleh Syariah
          </p>
        </div>

        <div className="hidden md:block absolute bottom-6 right-10 w-72 sm:w-80 z-10">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 pt-6 shadow-lg">
            <div className="absolute -top-4 left-5 w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-lg font-serif shadow-md">
              &ldquo;
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              Ambillah zakat dari sebagian harta mereka, dengan zakat itu
              kamu membersihkan dan mensucikan mereka.
            </p>
            <p className="mt-2 text-xs text-gray-600 font-medium">
              – QS. At-Taubah: 103
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}