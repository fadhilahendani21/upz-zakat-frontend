import { Link } from "react-router-dom";
import {
  UserRound,
  GraduationCap,
  ArrowRight,
  UsersRound,
  CheckCircle2,
} from "lucide-react";

// =========================================================
// DATA MUZAKKI TERDAFTAR
// SEMENTARA DATA DUMMY
// NANTI BISA DIGANTI DENGAN DATA BACKEND
// =========================================================

const MUZAKKI_TERDAFTAR = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    kategori: "Muzakki Umum",
    jenisZakat: "Zakat Penghasilan",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Siti Rahma",
    kategori: "Muzakki Umum",
    jenisZakat: "Zakat Maal",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Dr. H. Asep Setiawan",
    kategori: "Dosen UNSIL",
    jenisZakat: "Zakat Penghasilan",
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Rina Marlina",
    kategori: "Muzakki Umum",
    jenisZakat: "Zakat Penghasilan",
    status: "Aktif",
  },
  {
    id: 5,
    nama: "Dedi Kurniawan",
    kategori: "Staf UNSIL",
    jenisZakat: "Zakat Penghasilan",
    status: "Aktif",
  },
  {
    id: 6,
    nama: "Nur Aisyah",
    kategori: "Muzakki Umum",
    jenisZakat: "Zakat Fitrah",
    status: "Aktif",
  },
];

// =========================================================
// DAFTAR MUZAKKI PAGE
// =========================================================

export default function DaftarMuzakkiPage() {
  const jumlahUmum = MUZAKKI_TERDAFTAR.filter(
    (item) => item.kategori === "Muzakki Umum"
  ).length;

  const jumlahUnsil = MUZAKKI_TERDAFTAR.filter(
    (item) => item.kategori.includes("UNSIL")
  ).length;

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#064f35] via-[#08613d] to-[#0b7548]">

        {/* DEKORASI */}

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[24px] border-white/10" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full border-[18px] border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Daftar sebagai Muzakki
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50">
            Bergabunglah menjadi bagian dari Muzakki
            UPZ Zakat Universitas Siliwangi dan bersama-sama
            mendukung pengelolaan zakat yang amanah,
            transparan, dan tepat sasaran.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/90">

            <span>Beranda</span>
            <span>›</span>
            <span>Daftar sebagai Muzakki</span>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="px-4 py-10 md:px-6 md:py-12">

        <div className="mx-auto max-w-6xl">

          {/* =================================================
              PILIH JENIS PENDAFTARAN
          ================================================== */}

          <div className="text-center">

            <h2 className="text-2xl font-bold text-[#126b43] md:text-3xl">
              Pilih Jenis Pendaftaran
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-gray-500">
              Silakan pilih kategori pendaftaran sesuai
              dengan status Anda untuk melanjutkan proses
              pendaftaran sebagai Muzakki.
            </p>

          </div>

          {/* =================================================
              CARD PENDAFTARAN
          ================================================== */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            {/* =================================================
                MUZAKKI UMUM
            ================================================== */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8f2]">

                <UserRound
                  size={27}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />

              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                Muzakki Umum
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Untuk masyarakat umum yang ingin mendaftar
                dan menunaikan zakat melalui UPZ Zakat
                Universitas Siliwangi.
              </p>

              <Link
                to="/daftar-muzakki/umum"
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar sebagai Muzakki Umum
                <ArrowRight size={15} />
              </Link>

            </div>

            {/* =================================================
                DOSEN & STAF UNSIL
            ================================================== */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8f2]">

                <GraduationCap
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#13804f]"
                />

              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                Dosen &amp; Staf UNSIL
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Khusus dosen dan tenaga kependidikan/staf
                Universitas Siliwangi yang ingin terdaftar
                sebagai Muzakki.
              </p>

              <Link
                to="/daftar-muzakki/unsil"
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#167a47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12653b]"
              >
                Daftar Dosen &amp; Staf UNSIL
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

          {/* =================================================
              TRANSPARANSI MUZAKKI
          ================================================== */}

          <section className="mt-10">

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8f2] text-[#13804f]">
                <UsersRound size={21} />
              </div>

              <h2 className="mt-3 text-xl font-bold text-gray-900 md:text-2xl">
                Muzakki yang Telah Terdaftar
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
                Transparansi data pendaftaran Muzakki sebagai
                bentuk keterbukaan dan kepercayaan dalam
                pengelolaan zakat UPZ Zakat Universitas Siliwangi.
              </p>

            </div>

            {/* =================================================
                RINGKASAN
            ================================================== */}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {/* TOTAL */}

              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">

                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">

                  <UsersRound size={16} />

                </div>

                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {MUZAKKI_TERDAFTAR.length}
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Total Muzakki Terdaftar
                </p>

              </div>

              {/* UMUM */}

              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">

                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">

                  <UserRound size={16} />

                </div>

                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {jumlahUmum}
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Muzakki Umum
                </p>

              </div>

              {/* UNSIL */}

              <div className="rounded-xl border border-green-100 bg-white px-4 py-4 text-center shadow-sm">

                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#08734f]">

                  <GraduationCap size={16} />

                </div>

                <p className="mt-2 text-xl font-bold text-[#08734f]">
                  {jumlahUnsil}
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Dosen &amp; Staf UNSIL
                </p>

              </div>

            </div>

            {/* =================================================
                TABEL
            ================================================== */}

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              {/* HEADER TABEL */}

              <div className="border-b border-gray-100 bg-green-50 px-4 py-3">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-[#08734f]"
                  />

                  <h3 className="text-xs font-semibold text-[#08734f] sm:text-sm">
                    Daftar Muzakki Aktif
                  </h3>

                </div>

                <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                  Data ditampilkan sebagai bentuk transparansi
                  pendaftaran Muzakki.
                </p>

              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[620px] text-left">

                  <thead>

                    <tr className="border-b border-gray-100 bg-white">

                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        No.
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Nama Muzakki
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Kategori
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Jenis Zakat
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {MUZAKKI_TERDAFTAR.map(
                      (item, index) => (

                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-green-50/40"
                        >

                          <td className="px-4 py-3 text-xs text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3">

                            <div className="flex items-center gap-2">

                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#08734f]">

                                <UserRound size={13} />

                              </div>

                              <span className="text-xs font-semibold text-gray-800">
                                {item.nama}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-3 text-xs text-gray-600">
                            {item.kategori}
                          </td>

                          <td className="px-4 py-3 text-xs text-gray-600">
                            {item.jenisZakat}
                          </td>

                          <td className="px-4 py-3">

                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">

                              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />

                              {item.status}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* =================================================
                INFO PRIVASI
            ================================================== */}

            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">

              <p className="text-[10px] leading-4 text-blue-700 sm:text-xs sm:leading-5">

                Data yang ditampilkan merupakan informasi
                pendaftaran untuk kebutuhan transparansi dan
                tidak menampilkan data pribadi yang bersifat sensitif.

              </p>

            </div>

          </section>

        </div>

      </section>

    </div>
  );
}