import { Link } from "react-router-dom";
import {
  UserRound,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function DaftarMuzakkiPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#064f35] via-[#08613d] to-[#0b7548]">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[30px] border-white/10" />

        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full border-[20px] border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Daftar sebagai Muzakki
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-white/90">
            <span>Beranda</span>
            <span>›</span>
            <span>Daftar sebagai Muzakki</span>
          </div>

        </div>
      </section>

      {/* =========================
          CONTENT
      ========================== */}
      <section className="px-4 py-16 md:px-6">

        <div className="mx-auto max-w-5xl">

          {/* TITLE */}
          <div className="text-center">

            <h2 className="text-2xl font-bold text-[#126b43] md:text-3xl">
              Pilih Jenis Pendaftaran
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
              Silakan pilih kategori pendaftaran sesuai dengan status Anda
              untuk melanjutkan proses pendaftaran sebagai Muzakki.
            </p>

          </div>

          {/* =========================
              CARDS
          ========================== */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* =========================
                MUZAKKI UMUM
            ========================== */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              {/* ICON */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf8f2]">

                <UserRound
                  size={34}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />

              </div>

              {/* TITLE */}
              <h3 className="mt-6 text-xl font-bold text-gray-800">
                Muzakki Umum
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">
                Untuk masyarakat umum yang ingin mendaftar dan menunaikan
                zakat melalui UPZ Zakat Universitas Siliwangi.
              </p>

              {/* BUTTON */}
              <Link
                to="/daftar-muzakki/umum"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar sebagai Muzakki Umum
                <ArrowRight size={18} />
              </Link>

            </div>

            {/* =========================
                DOSEN & STAF UNSIL
            ========================== */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              {/* ICON */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf8f2]">

                <GraduationCap
                  size={36}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />

              </div>

              {/* TITLE */}
              <h3 className="mt-6 text-xl font-bold text-gray-800">
                Dosen & Staf UNSIL
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">
                Khusus dosen dan tenaga kependidikan/staf Universitas
                Siliwangi yang ingin terdaftar sebagai Muzakki.
              </p>

              {/* BUTTON */}
              <Link
                to="/daftar-muzakki/unsil"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar Dosen & Staf UNSIL
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}