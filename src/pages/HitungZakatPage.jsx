import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Briefcase,
  Coins,
  Users2,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { formatRupiah } from "../utils/formatRupiah";
import {
  hitungZakatPenghasilan,
  hitungZakatMaal,
  hitungZakatFitrah,
  getZakatConfig,
} from "../services/zakatService";

const TABS = [
  { id: "penghasilan", label: "Zakat Penghasilan", icon: Briefcase },
  { id: "maal", label: "Zakat Maal", icon: Coins },
  { id: "fitrah", label: "Zakat Fitrah", icon: Users2 },
];

function CurrencyInput({ label, value, onChange, placeholder = "0" }) {
  function handleChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw ? Number(raw) : 0);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={value ? value.toLocaleString("id-ID") : ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function HasilCard({ wajib, jumlah, keterangan }) {
  return (
    <Card
      className={`border-2 ${
        wajib ? "border-brand-600 bg-brand-50" : "border-gray-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            wajib ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            {wajib ? "Anda wajib menunaikan zakat sebesar" : "Status"}
          </p>
          {wajib ? (
            <p className="text-2xl font-bold text-brand-700 mt-0.5">
              {formatRupiah(jumlah)}
            </p>
          ) : (
            <p className="font-semibold text-gray-700 mt-0.5">
              Belum wajib zakat
            </p>
          )}
          {keterangan && (
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {keterangan}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function HitungZakatPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("penghasilan");
  const [config, setConfig] = useState(getZakatConfig());

  // Listen to system settings changes
  useEffect(() => {
    function onSettingsUpdate() {
      setConfig(getZakatConfig());
    }
    window.addEventListener("upz_settings_updated", onSettingsUpdate);
    return () => window.removeEventListener("upz_settings_updated", onSettingsUpdate);
  }, []);

  // Zakat Penghasilan
  const [penghasilan, setPenghasilan] = useState(0);
  const hasilPenghasilan = hitungZakatPenghasilan(penghasilan);

  // Zakat Maal
  const [totalHarta, setTotalHarta] = useState(0);
  const [totalUtang, setTotalUtang] = useState(0);
  const hasilMaal = hitungZakatMaal(totalHarta, totalUtang);

  // Zakat Fitrah
  const [jumlahJiwa, setJumlahJiwa] = useState(1);
  const hasilFitrah = hitungZakatFitrah(jumlahJiwa);

  function goBayar(jumlah, jenisId) {
    navigate("/donasi", { state: { nominal: jumlah, jenisId } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
      <section className="w-full bg-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-14">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Cek Perhitungan Zakat
            </h1>

            <p className="mt-4 text-sm sm:text-base text-green-50 leading-relaxed max-w-3xl mx-auto">
              Hitung kewajiban zakat Anda dengan mudah dan akurat berdasarkan
              nisab yang berlaku, sebelum menunaikannya.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-brand-800/80 border border-brand-500/40 text-xs px-3.5 py-1.5 rounded-full text-green-100">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span>Acuan Harga Emas Sistem: <strong>{formatRupiah(config.hargaEmasPerGram)}/gram</strong> (Nisab 85 gr: {formatRupiah(config.hargaEmasPerGram * config.nisabGramEmas)})</span>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-6 pb-16">

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-2 mb-6 mt-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:border-brand-300"
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Zakat Penghasilan */}
        {tab === "penghasilan" && (
          <div className="space-y-5">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-1">
                Zakat Penghasilan
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Masukkan penghasilan bersih Anda per bulan.
              </p>
              <CurrencyInput
                label="Penghasilan per Bulan"
                value={penghasilan}
                onChange={setPenghasilan}
                placeholder="5.000.000"
              />
              <p className="flex items-start gap-2 text-xs text-gray-500 mt-3">
                <Info size={14} className="mt-0.5 shrink-0" />
                Nisab zakat penghasilan setara 85 gram emas per tahun (
                {formatRupiah(hasilPenghasilan.nisab)}). Kadar zakat 2,5%.
              </p>
            </Card>

            <HasilCard
              wajib={hasilPenghasilan.wajibZakat}
              jumlah={hasilPenghasilan.jumlahZakat}
              keterangan={
                hasilPenghasilan.wajibZakat
                  ? "Dihitung dari 2,5% penghasilan bulanan Anda."
                  : "Penghasilan tahunan Anda belum mencapai nisab."
              }
            />

            {hasilPenghasilan.wajibZakat && (
              <Button
                icon={ArrowRight}
                className="w-full"
                onClick={() =>
                  goBayar(hasilPenghasilan.jumlahZakat, "zakat-penghasilan")
                }
              >
                Tunaikan Sekarang
              </Button>
            )}
          </div>
        )}

        {/* Zakat Maal */}
        {tab === "maal" && (
          <div className="space-y-5">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-1">
                Zakat Maal
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Masukkan total harta (tabungan, emas, aset lancar) yang sudah
                dimiliki selama 1 tahun (haul), dan utang jatuh tempo jika
                ada.
              </p>
              <div className="space-y-4">
                <CurrencyInput
                  label="Total Harta Dimiliki"
                  value={totalHarta}
                  onChange={setTotalHarta}
                  placeholder="150.000.000"
                />
                <CurrencyInput
                  label="Total Utang Jatuh Tempo (opsional)"
                  value={totalUtang}
                  onChange={setTotalUtang}
                  placeholder="0"
                />
              </div>
              <p className="flex items-start gap-2 text-xs text-gray-500 mt-3">
                <Info size={14} className="mt-0.5 shrink-0" />
                Nisab zakat maal setara 85 gram emas ({formatRupiah(
                  hasilMaal.nisab
                )}). Kadar zakat 2,5% dari harta bersih.
              </p>
            </Card>

            <HasilCard
              wajib={hasilMaal.wajibZakat}
              jumlah={hasilMaal.jumlahZakat}
              keterangan={
                hasilMaal.wajibZakat
                  ? `Dihitung dari 2,5% harta bersih (${formatRupiah(
                      hasilMaal.hartaBersih
                    )}).`
                  : "Harta bersih Anda belum mencapai nisab."
              }
            />

            {hasilMaal.wajibZakat && (
              <Button
                icon={ArrowRight}
                className="w-full"
                onClick={() => goBayar(hasilMaal.jumlahZakat, "zakat-maal")}
              >
                Tunaikan Sekarang
              </Button>
            )}
          </div>
        )}

        {/* Zakat Fitrah */}
        {tab === "fitrah" && (
          <div className="space-y-5">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-1">
                Zakat Fitrah
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Masukkan jumlah jiwa yang akan ditunaikan zakat fitrahnya
                (termasuk diri sendiri dan tanggungan).
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jumlah Jiwa
                </label>
                <input
                  type="number"
                  min={1}
                  value={jumlahJiwa}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setJumlahJiwa("");
                    } else {
                      setJumlahJiwa(Number(value));
                    }
                  }}
                  onBlur={() => {
                    if (!jumlahJiwa || jumlahJiwa < 1) {
                      setJumlahJiwa(1);
                    }
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <p className="flex items-start gap-2 text-xs text-gray-500 mt-3">
                <Info size={14} className="mt-0.5 shrink-0" />
                Setara 2,5 kg makanan pokok per jiwa, dikonversi
                {" "}{formatRupiah(hasilFitrah.perJiwa)} per jiwa.
              </p>
            </Card>

            <HasilCard
              wajib={jumlahJiwa > 0}
              jumlah={hasilFitrah.jumlahZakat}
              keterangan={`Total untuk ${jumlahJiwa} jiwa.`}
            />

            <Button
              icon={ArrowRight}
              className="w-full"
              onClick={() => goBayar(hasilFitrah.jumlahZakat, "zakat-fitrah")}
            >
              Tunaikan Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}