import { Download, Share2, CreditCard } from "lucide-react";

export default function KartuNPWZ() {
  const user = JSON.parse(
    localStorage.getItem("muzakki_user") || "{}"
  );

  const nama = user.name || "Nama Muzakki";
  const npwz = user.npwz || "BELUM TERDAFTAR";

  const handleDownload = () => {
    alert("Fitur download kartu NPWZ akan segera tersedia");
  };

  const handleShare = () => {
    alert("Fitur share kartu NPWZ akan segera tersedia");
  };

  return (
    <div className="w-full bg-[#fbfdfc] text-[#263238] p-3 sm:p-4 md:p-5">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <CreditCard
            size={20}
            className="text-[#16845d] shrink-0"
          />

          <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#16845d]">
            Kartu NPWZ
          </h1>
        </div>

        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Kartu identitas Nomor Pokok Wajib Zakat Anda.
        </p>
      </div>


      {/* =====================================================
          CARD CONTAINER
      ===================================================== */}
      <section className="w-full max-w-3xl mx-auto">

        {/* ===================================================
            KARTU NPWZ
            DESAIN SAMA DENGAN DASHBOARD
        =================================================== */}
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
            shadow-sm
          "
        >

          {/* =================================================
              DEKORASI
          ================================================= */}
          <div
            className="
              absolute
              right-0
              top-0
              w-[45%]
              h-full
              bg-[#d9b12d]/20
            "
          />


          {/* =================================================
              ISI KARTU
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


            {/* =================================================
                NPWZ
            ================================================= */}
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
                {npwz}
              </p>

            </div>


            {/* =================================================
                MUZAKKI
            ================================================= */}
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


            {/* =================================================
                FOOTER KARTU
            ================================================= */}
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


        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-3 sm:mt-4">

          <button
            type="button"
            onClick={handleDownload}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              sm:gap-2
              px-3
              sm:px-4
              py-2
              sm:py-2.5
              bg-[#16845d]
              hover:bg-[#116f4e]
              text-white
              text-[11px]
              sm:text-sm
              font-semibold
              rounded-lg
              active:scale-[0.98]
              transition
            "
          >
            <Download
              size={15}
              className="sm:w-[17px] sm:h-[17px]"
            />

            <span>Download Kartu</span>
          </button>


          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              items-center
              justify-center
              gap-1.5
              sm:gap-2
              px-3
              sm:px-4
              py-2
              sm:py-2.5
              border
              border-gray-300
              bg-white
              text-gray-700
              text-[11px]
              sm:text-sm
              font-semibold
              rounded-lg
              hover:bg-gray-50
              hover:border-[#16845d]
              hover:text-[#16845d]
              active:scale-[0.98]
              transition
            "
          >
            <Share2
              size={15}
              className="sm:w-[17px] sm:h-[17px]"
            />

            <span>Bagikan</span>
          </button>

        </div>


        {/* ===================================================
            INFORMASI NPWZ
        =================================================== */}
        <div className="mt-4 sm:mt-5 space-y-3">

          {/* TENTANG NPWZ */}
          <div
            className="
              bg-[#f3f9fd]
              border
              border-[#cce3f2]
              rounded-lg
              p-3
              sm:p-4
            "
          >

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#2182c4]">
                Tentang NPWZ:
              </strong>{" "}
              NPWZ adalah Nomor Pokok Wajib Zakat yang
              digunakan sebagai identitas wajib zakat yang
              telah terdaftar.
            </p>

          </div>


          {/* MANFAAT NPWZ */}
          <div
            className="
              bg-[#edf9f2]
              border
              border-[#d6ecdf]
              rounded-lg
              p-3
              sm:p-4
            "
          >

            <h2 className="text-sm sm:text-base font-bold text-[#176c4d] mb-2">
              Manfaat NPWZ
            </h2>

            <ul
              className="
                text-xs
                sm:text-sm
                text-gray-600
                space-y-1.5
                list-disc
                list-inside
              "
            >
              <li>
                Sebagai identitas wajib zakat yang terdaftar
              </li>

              <li>
                Memudahkan administrasi pembayaran zakat
              </li>

              <li>
                Membantu pencatatan data pembayaran zakat
              </li>

              <li>
                Menjadi bagian dari administrasi UPZ
              </li>
            </ul>

          </div>

        </div>

      </section>

    </div>
  );
}