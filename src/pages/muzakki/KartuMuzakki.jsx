import { Download, Share2, WalletCards } from "lucide-react";

export default function KartuMuzakki() {
  const user = JSON.parse(
    localStorage.getItem("muzakki_user") || "{}"
  );

  const nama =
    user.name ||
    user.nama ||
    "Nama Muzakki";

  const pekerjaan =
    user.pekerjaan ||
    user.kategori ||
    "Muzakki";

  const tahun =
    user.tahun ||
    new Date().getFullYear();

  const handleDownload = () => {
    alert("Fitur download kartu Muzakki akan segera tersedia");
  };

  const handleShare = () => {
    alert("Fitur share kartu Muzakki akan segera tersedia");
  };

  return (
    <div className="w-full bg-[#fbfdfc] text-[#263238] p-3 sm:p-4 md:p-5">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-4">
        <div className="flex items-center gap-2">

          <WalletCards
            size={20}
            className="shrink-0 text-[#16845d]"
          />

          <h1 className="text-base font-bold text-[#16845d] sm:text-lg md:text-xl">
            Kartu Muzakki
          </h1>

        </div>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Kartu identitas Muzakki UPZ Universitas Siliwangi.
        </p>
      </div>


      {/* =====================================================
          CARD CONTAINER
      ===================================================== */}
      <section className="mx-auto w-full max-w-3xl">

        {/* ===================================================
            KARTU MUZAKKI
            DESAIN SAMA DENGAN DASHBOARD
        =================================================== */}
        <div
          className="
            relative
            aspect-[1.75/1]
            w-full
            overflow-hidden
            rounded-lg
            border
            border-[#d7e8de]
            bg-gradient-to-br
            from-white
            via-[#f7fbf8]
            to-[#e3f1e8]
            shadow-sm
            sm:rounded-xl
          "
        >

          {/* =================================================
              GREEN BOTTOM STRIP
          ================================================= */}
          <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-[#16845d]" />


          {/* =================================================
              GOLD DECORATION
          ================================================= */}
          <div
            className="
              absolute
              bottom-0
              right-[18%]
              h-[42%]
              w-[20%]
              -skew-x-[25deg]
              bg-[#d9b12d]/80
            "
          />


          {/* =================================================
              CARD CONTENT
          ================================================= */}
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

            {/* =================================================
                HEADER KARTU
            ================================================= */}
            <div className="flex items-start justify-between gap-2">

              <div className="min-w-0">

                <p
                  className="
                    text-[7px]
                    font-bold
                    text-[#16845d]
                    min-[375px]:text-[8px]
                    sm:text-[11px]
                    md:text-sm
                  "
                >
                  UPZ UNSIL
                </p>

                <p
                  className="
                    text-[4px]
                    text-gray-500
                    min-[375px]:text-[5px]
                    sm:text-[7px]
                    md:text-[8px]
                  "
                >
                  Universitas Siliwangi
                </p>

              </div>


              <div
                className="
                  shrink-0
                  rounded-md
                  border
                  border-[#d5e5dc]
                  bg-white/70
                  px-1.5
                  py-1
                  sm:px-2
                  sm:py-1.5
                "
              >

                <p
                  className="
                    text-[5px]
                    font-bold
                    text-gray-600
                    min-[375px]:text-[6px]
                    sm:text-[8px]
                    md:text-[9px]
                  "
                >
                  KARTU MUZAKKI
                </p>

              </div>

            </div>


            {/* =================================================
                NAMA
            ================================================= */}
            <div
              className="
                mt-2
                min-[375px]:mt-2.5
                sm:mt-4
                md:mt-5
              "
            >

              <p
                className="
                  text-[4px]
                  uppercase
                  text-gray-400
                  min-[375px]:text-[5px]
                  sm:text-[7px]
                  md:text-[8px]
                "
              >
                Nama Muzakki
              </p>

              <p
                className="
                  mt-0.5
                  max-w-[68%]
                  truncate
                  text-[7px]
                  font-bold
                  text-gray-800
                  min-[375px]:text-[8px]
                  sm:text-xs
                  md:text-sm
                "
              >
                {nama}
              </p>

            </div>


            {/* =================================================
                DATA
            ================================================= */}
            <div
              className="
                mt-1.5
                grid
                grid-cols-2
                gap-2
                min-[375px]:mt-2
                sm:mt-3
                md:mt-4
              "
            >

              {/* STATUS */}
              <div>

                <p
                  className="
                    text-[4px]
                    text-gray-400
                    min-[375px]:text-[5px]
                    sm:text-[7px]
                    md:text-[8px]
                  "
                >
                  Status
                </p>

                <p
                  className="
                    text-[5px]
                    font-semibold
                    text-gray-700
                    min-[375px]:text-[6px]
                    sm:text-[8px]
                    md:text-[9px]
                  "
                >
                  MUZAKKI
                </p>

              </div>


              {/* PEKERJAAN */}
              <div>

                <p
                  className="
                    text-[4px]
                    text-gray-400
                    min-[375px]:text-[5px]
                    sm:text-[7px]
                    md:text-[8px]
                  "
                >
                  Pekerjaan
                </p>

                <p
                  className="
                    max-w-[90%]
                    truncate
                    text-[5px]
                    font-semibold
                    text-gray-700
                    min-[375px]:text-[6px]
                    sm:text-[8px]
                    md:text-[9px]
                  "
                >
                  {pekerjaan}
                </p>

              </div>

            </div>


            {/* =================================================
                TAHUN
            ================================================= */}
            <div
              className="
                mt-1
                min-[375px]:mt-1.5
                sm:mt-2
              "
            >

              <p
                className="
                  text-[4px]
                  text-gray-400
                  min-[375px]:text-[5px]
                  sm:text-[7px]
                "
              >
                Tahun
              </p>

              <p
                className="
                  text-[5px]
                  font-semibold
                  text-gray-700
                  min-[375px]:text-[6px]
                  sm:text-[8px]
                "
              >
                {tahun}
              </p>

            </div>


            {/* =================================================
                FOOTER KARTU
            ================================================= */}
            <p
              className="
                absolute
                bottom-1
                left-2
                text-[3px]
                text-white
                min-[375px]:bottom-1.5
                min-[375px]:left-2.5
                min-[375px]:text-[4px]
                sm:bottom-2
                sm:left-4
                sm:text-[6px]
                md:text-[7px]
              "
            >
              Amanah • Transparan • Tepat Sasaran
            </p>

          </div>

        </div>


        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3">

          {/* DOWNLOAD */}
          <button
            type="button"
            onClick={handleDownload}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#16845d]
              px-3
              py-2
              text-[11px]
              font-semibold
              text-white
              transition
              hover:bg-[#116f4e]
              active:scale-[0.98]
              sm:gap-2
              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >

            <Download
              size={15}
              className="sm:h-[17px] sm:w-[17px]"
            />

            <span>
              Download Kartu
            </span>

          </button>


          {/* SHARE */}
          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2
              text-[11px]
              font-semibold
              text-gray-700
              transition
              hover:border-[#16845d]
              hover:bg-gray-50
              hover:text-[#16845d]
              active:scale-[0.98]
              sm:gap-2
              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >

            <Share2
              size={15}
              className="sm:h-[17px] sm:w-[17px]"
            />

            <span>
              Bagikan
            </span>

          </button>

        </div>


        {/* ===================================================
            INFORMASI
        =================================================== */}
        <div className="mt-4 space-y-3 sm:mt-5">

          {/* INFORMASI KARTU */}
          <div
            className="
              rounded-lg
              border
              border-[#dcefe5]
              bg-[#f1faf5]
              p-3
              sm:p-4
            "
          >

            <h2 className="text-sm font-bold text-[#176c4d] sm:text-base">
              Tentang Kartu Muzakki
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm">
              Kartu Muzakki merupakan kartu identitas
              yang digunakan oleh Muzakki yang telah
              terdaftar pada UPZ Universitas Siliwangi.
            </p>

          </div>


          {/* KEGUNAAN */}
          <div
            className="
              rounded-lg
              border
              border-gray-100
              bg-white
              p-3
              sm:p-4
            "
          >

            <h2 className="text-sm font-bold text-gray-800 sm:text-base">
              Kegunaan Kartu
            </h2>

            <ul
              className="
                mt-2
                list-disc
                list-inside
                space-y-1.5
                text-xs
                leading-5
                text-gray-600
                sm:text-sm
              "
            >

              <li>
                Sebagai identitas Muzakki UPZ Unsil
              </li>

              <li>
                Memudahkan administrasi pembayaran zakat
              </li>

              <li>
                Menjadi identitas saat menggunakan layanan Muzakki
              </li>

              <li>
                Membantu pencatatan data pembayaran zakat
              </li>

            </ul>

          </div>

        </div>

      </section>

    </div>
  );
}