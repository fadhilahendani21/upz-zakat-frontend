import { ShieldCheck, Wallet, FileSearch } from "lucide-react";
import Button from "../common/Button";
import gedungUnsil from "../../assets/images/gedung-unsil.jpeg";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 pb-4 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} /> Transparan • Amanah • Profesional
        </span>

        <h1 className="mt-5 text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          Menunaikan Zakat,{" "}
          <span className="text-brand-600">Membersamai Umat</span>
        </h1>

        <p className="mt-5 text-gray-600 leading-relaxed">
          UPZ Zakat Universitas Siliwangi hadir untuk memudahkan sivitas
          akademika dan masyarakat dalam menunaikan zakat, infak, dan sedekah
          secara aman, transparan, dan terpercaya.
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

      <div className="relative aspect-4/3">
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroBlob" clipPathUnits="objectBoundingBox">
              <path d="M0.25,0 L1,0 L1,1 L0.32,1 C0.12,1 0,0.83 0,0.58 C0,0.58 0,0.25 0.25,0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div
          className="absolute inset-0 bg-linear-to-br from-brand-200 via-brand-100 to-white"
          style={{ clipPath: "url(#heroBlob)" }}
        >
          <img
            src={gedungUnsil}
            alt="Gedung Universitas Siliwangi"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-6 left-24 right-6 sm:left-32">
          <div className="relative bg-white/95 backdrop-blur rounded-2xl p-5 pt-6 shadow-lg">
            <div className="absolute -top-4 left-5 w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-lg font-serif shadow-md">
              &ldquo;
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Ambillah zakat dari sebagian harta mereka, dengan zakat itu
              kamu membersihkan dan mensucikan mereka.
            </p>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              – QS. At-Taubah: 103
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
