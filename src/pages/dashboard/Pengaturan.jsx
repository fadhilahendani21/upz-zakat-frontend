import { useState, useEffect } from "react";
import {
  Building2,
  Coins,
  Tags,
  ShieldCheck,
  Database,
  Globe,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Plus,
  X,
  Phone,
  Mail,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { inputCls } from "../../components/dashboard/ui";
import { formatRupiah } from "../../utils/formatRupiah";
import {
  getSettings,
  saveSettings,
  resetSettings,
  exportBackupData,
  importBackupData,
} from "../../services/settingService";
import { NumericFormat } from "react-number-format";

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState("profil");
  const [settings, setSettings] = useState(getSettings());
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Input states for adding new asnaf / jenis dana tags
  const [newAsnaf, setNewAsnaf] = useState("");
  const [newJenisDana, setNewJenisDana] = useState("");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleSaveAll(e) {
    e?.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      saveSettings(settings);
      setSuccessMsg("Semua perubahan pengaturan sistem berhasil disimpan dan diterapkan!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mereset semua pengaturan ke nilai default pabrik?"
      )
    ) {
      const def = resetSettings();
      setSettings(def);
      setSuccessMsg("Pengaturan telah dikembalikan ke nilai default.");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  function handleImportBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        importBackupData(content);
        setSettings(getSettings());
        setSuccessMsg("Restore data backup JSON berhasil! Seluruh pengaturan telah diperbarui.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } catch (err) {
        setErrorMsg(err.message || "Gagal mengunggah berkas backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // Tag management handlers
  function addAsnafTag() {
    if (!newAsnaf.trim()) return;
    if (settings.kategori.asnafList.includes(newAsnaf.trim())) return;
    setSettings({
      ...settings,
      kategori: {
        ...settings.kategori,
        asnafList: [...settings.kategori.asnafList, newAsnaf.trim()],
      },
    });
    setNewAsnaf("");
  }

  function removeAsnafTag(item) {
    setSettings({
      ...settings,
      kategori: {
        ...settings.kategori,
        asnafList: settings.kategori.asnafList.filter((a) => a !== item),
      },
    });
  }

  function addJenisDanaTag() {
    if (!newJenisDana.trim()) return;
    if (settings.kategori.jenisDanaList.includes(newJenisDana.trim())) return;
    setSettings({
      ...settings,
      kategori: {
        ...settings.kategori,
        jenisDanaList: [...settings.kategori.jenisDanaList, newJenisDana.trim()],
      },
    });
    setNewJenisDana("");
  }

  function removeJenisDanaTag(item) {
    setSettings({
      ...settings,
      kategori: {
        ...settings.kategori,
        jenisDanaList: settings.kategori.jenisDanaList.filter((j) => j !== item),
      },
    });
  }

  const totalNisabMaal =
    (Number(settings.zakat.hargaEmasPerGram) || 0) *
    (Number(settings.zakat.nisabZakatMaalGram) || 85);

  const zakatFitrahPerJiwa =
    (Number(settings.zakat.hargaBerasPerKg) || 0) * 2.5;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-sm border border-brand-100">
              <Building2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">
                  Pengaturan Sistem UPZ
                </h1>
                <span className="text-[10px] font-semibold bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Konfigurasi profil lembaga, acuan nisab zakat, notifikasi pesan, dan parameter operasional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="!py-2 !px-3 text-xs"
              title="Reset ke pengaturan awal"
            >
              <RotateCcw size={13} />
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="!py-2 !px-4 text-xs font-semibold"
            >
              <Save size={14} />
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 mt-6 pt-4 overflow-x-auto">
          {[
            { id: "profil", label: "Profil & Legalitas", icon: Building2 },
            { id: "zakat", label: "Zakat & Nisab", icon: Coins },
            { id: "kategori", label: "Kategori & Asnaf", icon: Tags },
            { id: "privasi", label: "Privasi & Keamanan", icon: ShieldCheck },
            { id: "backup", label: "Backup & Umum", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-300">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-800">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PROFIL LEMBAGA & LEGALITAS */}
      {/* ========================================================================= */}
      {activeTab === "profil" && (
        <Card className="!p-6 space-y-5">
          <div className="pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Identitas & Legalitas UPZ
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Informasi ini tampil pada halaman publik, footer web, kwitansi resmi, dan dokumen LPJ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Nama Lengkap Lembaga *
              </label>
              <input
                type="text"
                value={settings.profil.namaLembaga}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, namaLembaga: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Nama Singkat / Brand
              </label>
              <input
                type="text"
                value={settings.profil.namaSingkat}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, namaSingkat: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Nomor SK & Dasar Legalitas
            </label>
            <input
              type="text"
              value={settings.profil.nomorSk}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profil: { ...settings.profil, nomorSk: e.target.value },
                })
              }
              className={inputCls}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Contoh: SK Rektor Pembentukan UPZ & SK BAZNAS Kota/Provinsi/RI.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
              Alamat Lengkap Sekretariat
            </label>
            <textarea
              rows={2}
              value={settings.profil.alamat}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profil: { ...settings.profil, alamat: e.target.value },
                })
              }
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                No. WhatsApp Layanan
              </label>
              <input
                type="text"
                value={settings.profil.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, whatsapp: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Email Resmi
              </label>
              <input
                type="email"
                value={settings.profil.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, email: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Website Resmi
              </label>
              <input
                type="text"
                value={settings.profil.website}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, website: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Rekening Penerimaan Zakat (Utama)
              </label>
              <input
                type="text"
                value={settings.profil.rekeningUtama}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, rekeningUtama: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Rekening Penerimaan Infaq / Sedekah
              </label>
              <input
                type="text"
                value={settings.profil.rekeningInfaq}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profil: { ...settings.profil, rekeningInfaq: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ZAKAT & NISAB */}
      {/* ========================================================================= */}
      {activeTab === "zakat" && (
        <div className="space-y-5">
          <Card className="!p-6 space-y-5">
            <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Parameter Acuan Nisab & Harga Emas
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Parameter ini langsung diterapkan pada Kalkulator Zakat publik dan perhitungan transaksi zakat maal.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                Update terakhir: {settings.zakat.updateTerakhirEmas || "Hari ini"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Harga Emas Acuan (Rp/gram) *
                </label>
                <NumericFormat
                  value={settings.zakat.hargaEmasPerGram}
                  onValueChange={(v) =>
                    setSettings({
                      ...settings,
                      zakat: {
                        ...settings.zakat,
                        hargaEmasPerGram: Number(v.value) || 0,
                        updateTerakhirEmas: new Date().toISOString().split("T")[0],
                      },
                    })
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Standar harga emas murni Antam / Logam Mulia.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Nisab Zakat Maal (Gram Emas) *
                </label>
                <input
                  type="number"
                  value={settings.zakat.nisabZakatMaalGram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      zakat: {
                        ...settings.zakat,
                        nisabZakatMaalGram: Number(e.target.value) || 85,
                      },
                    })
                  }
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Standar syariat & BAZNAS: 85 gram emas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Harga Beras Acuan (Rp/Kg) *
                </label>
                <NumericFormat
                  value={settings.zakat.hargaBerasPerKg}
                  onValueChange={(v) =>
                    setSettings({
                      ...settings,
                      zakat: {
                        ...settings.zakat,
                        hargaBerasPerKg: Number(v.value) || 0,
                      },
                    })
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  className={inputCls}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Standar beras konsumsi daerah Tasikmalaya.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Kadar Zakat Maal & Penghasilan (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.zakat.kadarZakatPersen}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        zakat: {
                          ...settings.zakat,
                          kadarZakatPersen: Number(e.target.value) || 2.5,
                        },
                      })
                    }
                    className={inputCls}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Maksimal Alokasi Hak Amil (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={settings.zakat.persentaseHakAmil}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        zakat: {
                          ...settings.zakat,
                          persentaseHakAmil: Number(e.target.value) || 12.5,
                        },
                      })
                    }
                    className={inputCls}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Maksimal 1/8 bagian (12.5%) dari dana zakat yang terkumpul.
                </p>
              </div>
            </div>
          </Card>

          {/* Live Summary Calculation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200">
              <div className="flex items-center gap-2 text-brand-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-amber-500" />
                Total Nisab Zakat Maal Saat Ini
              </div>
              <p className="text-2xl font-bold text-brand-900">
                {formatRupiah(totalNisabMaal)}
              </p>
              <p className="text-xs text-brand-700 mt-1">
                Setara {settings.zakat.nisabZakatMaalGram} gram emas × {formatRupiah(settings.zakat.hargaEmasPerGram)}/gram.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Coins size={14} className="text-blue-500" />
                Zakat Fitrah Per Jiwa (2.5 Kg)
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatRupiah(zakatFitrahPerJiwa)} / jiwa
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Dihitung dari 2.5 kg × {formatRupiah(settings.zakat.hargaBerasPerKg)}/kg beras.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KATEGORI & ASNAF */}
      {/* ========================================================================= */}
      {activeTab === "kategori" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Asnaf List */}
          <Card className="!p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Daftar Kategori 8 Asnaf (Penyaluran)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Kategori asnaf penerima manfaat zakat aktif di sistem.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[100px] p-3 bg-gray-50 rounded-xl border border-gray-200">
              {settings.kategori.asnafList.map((asnaf) => (
                <span
                  key={asnaf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-2xs"
                >
                  {asnaf}
                  <button
                    type="button"
                    onClick={() => removeAsnafTag(asnaf)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah kategori asnaf baru..."
                value={newAsnaf}
                onChange={(e) => setNewAsnaf(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAsnafTag())}
                className={inputCls}
              />
              <Button type="button" onClick={addAsnafTag} className="!py-2 !px-3 shrink-0">
                <Plus size={15} />
                Tambah
              </Button>
            </div>
          </Card>

          {/* Jenis Dana List */}
          <Card className="!p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Jenis Dana Zakat & Infaq (Pengumpulan)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Opsi jenis dana penerimaan zakat, infaq, dan sedekah.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[100px] p-3 bg-gray-50 rounded-xl border border-gray-200">
              {settings.kategori.jenisDanaList.map((jenis) => (
                <span
                  key={jenis}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-2xs"
                >
                  {jenis}
                  <button
                    type="button"
                    onClick={() => removeJenisDanaTag(jenis)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah jenis dana baru..."
                value={newJenisDana}
                onChange={(e) => setNewJenisDana(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addJenisDanaTag())}
                className={inputCls}
              />
              <Button type="button" onClick={addJenisDanaTag} className="!py-2 !px-3 shrink-0">
                <Plus size={15} />
                Tambah
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRIVASI & KEAMANAN */}
      {/* ========================================================================= */}
      {activeTab === "privasi" && (
        <Card className="!p-6 space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Kebijakan Privasi & Transparansi Publik
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Atur bagaimana data muzakki dan donatur ditampilkan pada portal website publik.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/70 transition cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privasi.defaultAnonimPublik}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privasi: {
                      ...settings.privasi,
                      defaultAnonimPublik: e.target.checked,
                    },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Samarkan Nama Donatur Secara Default (Hamba Allah)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Jika diaktifkan, nama muzakki/donatur di daftar transaksi terbaru publik akan disamarkan sebagai &quot;Hamba Allah&quot; demi menjaga privasi donatur.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50/70 transition cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privasi.tampilkanDonasiOnlineDiLanding}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privasi: {
                      ...settings.privasi,
                      tampilkanDonasiOnlineDiLanding: e.target.checked,
                    },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Tampilkan Widget Transparansi Donasi Online di Halaman Beranda
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Menampilkan live ticker total dana yang masuk dari publik di halaman depan.
                </p>
              </div>
            </label>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Retensi Data Log & Riwayat (Bulan)
              </label>
              <input
                type="number"
                value={settings.privasi.retensiLogBulan}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privasi: {
                      ...settings.privasi,
                      retensiLogBulan: Number(e.target.value) || 24,
                    },
                  })
                }
                className={`${inputCls} max-w-xs`}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Data transaksi utama tersimpan permanen untuk keperluan audit tahunan BAZNAS.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BACKUP & PENGATURAN UMUM */}
      {/* ========================================================================= */}
      {activeTab === "backup" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Backup / Export Data */}
            <Card className="!p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Backup & Export Data
                  </h2>
                  <p className="text-xs text-gray-400">Unduh salinan cadangan</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Unduh berkas JSON cadangan berisi seluruh profil lembaga, acuan nisab/zakat, daftar asnaf, dan preferensi privasi untuk disimpan aman di komputer Anda.
              </p>

              <button
                type="button"
                onClick={exportBackupData}
                className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Download size={15} />
                Download Backup Data (.json)
              </button>
            </Card>

            {/* Restore / Import Data */}
            <Card className="!p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Restore / Import Backup
                  </h2>
                  <p className="text-xs text-gray-400">Pulihkan pengaturan dari file JSON</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Jika sistem tidak sengaja ter-reset, pilih berkas JSON cadangan yang pernah Anda unduh untuk memulihkan seluruh pengaturan sistem secara instan.
              </p>

              <label className="w-full py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer text-center">
                <Upload size={15} />
                Unggah & Pulihkan Berkas (.json)
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </Card>
          </div>

          {/* Regional & Format Settings */}
          <Card className="!p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Format Wilayah & Sistem
                </h2>
                <p className="text-xs text-gray-400">Zona waktu & mata uang</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Zona Waktu Sistem
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.umum.zonaWaktu}
                  className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Mata Uang Acuan
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.umum.mataUang}
                  className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Global Bottom Save Action */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="!py-2.5 !px-4 text-xs"
        >
          <RotateCcw size={14} />
          Reset Default
        </Button>
        <Button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="!py-2.5 !px-6 text-sm font-semibold"
        >
          <Save size={16} />
          {saving ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
        </Button>
      </div>
    </div>
  );
}
