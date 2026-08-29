import { useState } from "react";
import {
  BookOpen,
  HelpCircle,
  X,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe,
  Receipt,
  Settings,
  HelpCircle as QuestionIcon,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useSettings } from "../../services/settingService";

const TABS = [
  { id: "overview", label: "Ikhtisar", icon: Layers },
  { id: "pengumpulan", label: "Pengumpulan", icon: ArrowDownToLine },
  { id: "penyaluran", label: "Penyaluran & Asnaf", icon: ArrowUpFromLine },
  { id: "donasi", label: "Donasi Online", icon: Globe },
  { id: "keuangan", label: "Keuangan & Laporan", icon: Receipt },
  { id: "pengaturan", label: "Pengaturan & Nisab", icon: Settings },
  { id: "faq", label: "Tanya Jawab (FAQ)", icon: QuestionIcon },
  { id: "kontak", label: "Kontak Bantuan", icon: Phone },
];

export default function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const settings = useSettings();

  if (!isOpen) return null;

  const brandName = settings?.profil?.namaSingkat || "UPZ Unsil";
  const fullName = settings?.profil?.namaLembaga || "Unit Pengumpul Zakat Universitas Siliwangi";
  const email = settings?.profil?.email || "upz@unsil.ac.id";
  const telepon = settings?.profil?.telepon || "0812-3456-7890";
  const alamat = settings?.profil?.alamat || "Gedung Rektorat Lt. 1, Universitas Siliwangi, Tasikmalaya";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Pusat Bantuan & Panduan Sistem</h2>
              <p className="text-xs text-brand-100">{fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Sidebar tabs + Content) */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          
          {/* Nav Tabs */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/70 p-2 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? "bg-brand-600 text-white shadow-sm font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-gray-400 shrink-0"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-gray-700 leading-relaxed">
            
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                  <h3 className="text-base font-bold text-brand-800 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-brand-600" />
                    Selamat Datang di Sistem Manajemen {brandName}
                  </h3>
                  <p className="text-xs text-brand-700 mt-1">
                    Sistem ini dirancang untuk mempermudah pencatatan, transparansi pengelolaan zakat, infak, dan sedekah, serta pelaporan akuntansi secara akuntabel.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Struktur Modul Utama:</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="border border-gray-100 rounded-xl p-3 bg-white hover:border-brand-200 transition">
                      <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-brand-700">
                        <ArrowDownToLine size={14} /> Pengumpulan & Muzakki
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pencatatan zakat masuk, donasi muzakki, dan donasi online.</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-3 bg-white hover:border-brand-200 transition">
                      <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-brand-700">
                        <ArrowUpFromLine size={14} /> Penyaluran & 8 Asnaf
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Distribusi zakat ke mustahik dan program sosial kampus.</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-3 bg-white hover:border-brand-200 transition">
                      <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-brand-700">
                        <Receipt size={14} /> Jurnal & Laporan Keuangan
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pembukuan akuntansi debit/kredit, neraca kas, dan laporan tahunan.</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-3 bg-white hover:border-brand-200 transition">
                      <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-brand-700">
                        <Settings size={14} /> Pengaturan Sistem & Nisab
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Kustomisasi profil lembaga, tarif nisab emas/perak, dan backup data.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1.5">Hak Akses & Peran Pengguna:</h4>
                  <ul className="text-xs space-y-1.5 text-gray-600 list-disc list-inside">
                    <li><strong className="text-gray-800">Administrator:</strong> Memiliki akses penuh ke seluruh modul, jurnal akuntansi, pengelolaan pengguna, dan pengaturan sistem.</li>
                    <li><strong className="text-gray-800">Operator:</strong> Bertugas mencatat data pengumpulan harian, memvalidasi donasi online, dan mengelola penerima manfaat (mustahik).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Pengumpulan */}
            {activeTab === "pengumpulan" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Panduan Modul Pengumpulan Zakat & Infaq</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Menambah Transaksi Pengumpulan</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Buka menu <strong>Pengumpulan</strong>, klik tombol <strong>+ Tambah Transaksi</strong>. Pilih nama muzakki, jenis zakat (Zakat Fitrah, Zakat Maal, Zakat Penghasilan, Infaq/Sedekah), nominal, serta metode pembayaran (Transfer / Tunai).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Manajemen Data Muzakki</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Di menu <strong>Muzakki</strong>, Anda dapat mendaftarkan muzakki baru baik perorangan (dosen, staf, mahasiswa) maupun lembaga/mitra. Data muzakki akan otomatis muncul pada autocomplete saat input transaksi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Pencetakan Bukti & Filter</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Gunakan filter pencarian berdasarkan tahun, bulan, atau kategori untuk mencetak rekapitulasi penerimaan dana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Penyaluran */}
            {activeTab === "penyaluran" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Panduan Penyaluran Zakat & 8 Asnaf</h3>
                
                <p className="text-xs text-gray-600">
                  Penyaluran zakat wajib memenuhi syariat dengan menyasar kepada salah satu dari 8 golongan Asnaf yang berhak menerima.
                </p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">1. Fakir:</span> Tidak memiliki harta & penghasilan tetap.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">2. Miskin:</span> Berpenghasilan namun tidak mencukupi kebutuhan pokok.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">3. Amil:</span> Pengurus / pengelola zakat yang ditunjuk resmi.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">4. Mualaf:</span> Orang yang baru masuk Islam / dikuatkan imannya.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">5. Riqab:</span> Upaya memerdekakan / membebaskan dari penindasan.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">6. Gharimin:</span> Orang yang terlilit hutang untuk kebutuhan dasar/maslahat.
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">7. Fisabilillah:</span> Aktivitas di jalan Allah (dakwah, beasiswa pendidikan).
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="font-bold text-brand-700">8. Ibnu Sabil:</span> Musafir / mahasiswa rantau yang kehabisan bekal.
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Kustomisasi Asnaf & Program:</h4>
                  <p className="text-xs text-gray-600">
                    Anda dapat menambah sub-kategori Asnaf kustom di <strong>Pengaturan Sistem &rarr; Zakat & Nisab</strong>. Kategori baru tersebut akan langsung muncul saat input data Mustahik.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Donasi Online */}
            {activeTab === "donasi" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Panduan Donasi Online & Verifikasi</h3>
                
                <p className="text-xs text-gray-600">
                  Donatur publik dapat menyalurkan donasi langsung melalui formulir publik di halaman <code>/donasi</code>.
                </p>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="p-3 rounded-xl border border-gray-100 bg-white">
                    <strong className="text-gray-900 block mb-0.5">Status &quot;Menunggu Verifikasi&quot;:</strong>
                    Donasi baru dari publik masuk dengan status pending. Operator dapat mengecek mutasi rekening bank untuk mencocokkan nominal dan kode donasi.
                  </div>
                  <div className="p-3 rounded-xl border border-gray-100 bg-white">
                    <strong className="text-gray-900 block mb-0.5">Status &quot;Terverifikasi&quot;:</strong>
                    Setelah dana masuk dikonfirmasi, klik tombol <strong>Verifikasi</strong>. Transaksi akan otomatis masuk ke pembukuan dan menambah total dana terkumpul di halaman utama.
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Keuangan */}
            {activeTab === "keuangan" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Panduan Jurnal Akuntansi & Laporan Keuangan</h3>
                
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="border-l-4 border-brand-500 pl-3 py-1">
                    <strong className="text-gray-900 block">Jurnal Umum (Debit / Kredit):</strong>
                    Mencatat setiap mutasi kas, biaya operasional amil, atau penyesuaian saldo kas bank UPZ.
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <strong className="text-gray-900 block">Rekening & Kas:</strong>
                    Menampilkan daftar akun kas tunai dan rekening bank (misal: Kas Bank BSI, Kas Operasional).
                  </div>
                  <div className="border-l-4 border-amber-500 pl-3 py-1">
                    <strong className="text-gray-900 block">Laporan Keuangan Tahunan:</strong>
                    Rekapitulasi komprehensif pemasukan vs pengeluaran, saldo bersih, serta grafik visual yang siap dicetak untuk audit.
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Pengaturan */}
            {activeTab === "pengaturan" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Pengaturan Sistem, Nisab & Backup</h3>
                
                <div className="space-y-2.5 text-xs text-gray-600">
                  <p>
                    <strong className="text-gray-900">1. Profil & Legalitas Lembaga:</strong> Mengubah Nama Lembaga, Nama Singkat (Brand), SK Pembentukan, NPWZ, serta Kontak & Alamat Sekretariat.
                  </p>
                  <p>
                    <strong className="text-gray-900">2. Zakat, Nisab & Asnaf:</strong> Mengatur harga emas/gram, harga perak/gram, biaya beras/jiwa untuk Zakat Fitrah, serta persentase nisab. Nilai ini menjadi acuan <strong>Kalkulator Zakat Publik</strong>.
                  </p>
                  <p>
                    <strong className="text-gray-900">3. Rekening Pembayaran:</strong> Menambah atau mengubah rekening bank tujuan transfer donasi.
                  </p>
                  <p>
                    <strong className="text-gray-900">4. Backup & Restore Data:</strong> Klik tombol <strong>&quot;Unduh Backup (.json)&quot;</strong> untuk menyimpan salinan cadangan, atau gunakan <strong>&quot;Restore / Import Backup&quot;</strong> jika ingin memulihkan pengaturan.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: FAQ */}
            {activeTab === "faq" && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">Pertanyaan Sering Diajukan (FAQ)</h3>

                <div className="space-y-2 text-xs">
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    <p className="font-semibold text-gray-900">Q: Di mana saya bisa mengubah profil atau kata sandi akun saya?</p>
                    <p className="text-gray-600 mt-1">A: Klik foto profil di sudut kanan atas Topbar &rarr; pilih <strong>Pengaturan Akun</strong>, atau buka menu <strong>Pengguna</strong> di sidebar.</p>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    <p className="font-semibold text-gray-900">Q: Mengapa data di halaman utama publik berbeda dengan database?</p>
                    <p className="text-gray-600 mt-1">A: Halaman publik (Program & Laporan) sudah terhubung ke database. Pastikan backend Laravel sedang berjalan dengan benar.</p>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    <p className="font-semibold text-gray-900">Q: Apa fungsi pengaturan harga emas dan perak di Pengaturan Sistem?</p>
                    <p className="text-gray-600 mt-1">A: Nilai tersebut digunakan sebagai batas minimal (nisab) pada fitur <strong>Kalkulator Zakat Publik</strong> di halaman <code>/hitung-zakat</code>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Kontak */}
            {activeTab === "kontak" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Kontak Dukungan Teknis & Sekretariat</h3>
                <p className="text-xs text-gray-600">
                  Jika Anda mengalami kendala teknis atau membutuhkan bantuan operasional sistem, silakan hubungi tim pengurus UPZ Unsil:
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="border border-gray-100 rounded-xl p-4 bg-white flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                        <Mail size={16} />
                      </div>
                      <p className="font-bold text-gray-800">Email Resmi</p>
                      <p className="text-gray-500 mt-0.5 break-all">{email}</p>
                    </div>
                    <a
                      href={`mailto:${email}`}
                      className="mt-3 inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline"
                    >
                      Kirim Email <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-4 bg-white flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-2">
                        <Phone size={16} />
                      </div>
                      <p className="font-bold text-gray-800">WhatsApp / Telepon</p>
                      <p className="text-gray-500 mt-0.5">{telepon}</p>
                    </div>
                    <a
                      href={`https://wa.me/${telepon.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline"
                    >
                      Hubungi WhatsApp <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-xs flex items-start gap-2.5">
                  <MapPin size={16} className="text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">Alamat Kantor:</strong>
                    <span className="text-gray-600">{alamat}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/80 shrink-0 text-xs text-gray-500">
          <span>{brandName} v1.0.0 — Bantuan & Dokumentasi Sistem</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}
