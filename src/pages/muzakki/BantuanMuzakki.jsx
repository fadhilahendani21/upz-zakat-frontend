import { HelpCircle, MessageCircle, Phone, Mail, FileText, Video } from "lucide-react";

export default function BantuanMuzakki() {
  const faqs = [
    {
      q: "Bagaimana cara membayar zakat?",
      a: "Anda dapat membayar zakat melalui menu 'Tunaikan Zakat'. Untuk Dosen & Staf UNSIL, pembayaran dilakukan otomatis melalui potong gaji setiap bulan.",
    },
    {
      q: "Berapa nisab zakat penghasilan?",
      a: "Nisab zakat penghasilan setara dengan 85 gram emas (saat ini sekitar Rp 102.000.000/tahun atau Rp 8.500.000/bulan). Zakatnya adalah 2,5% dari penghasilan.",
    },
    {
      q: "Bagaimana cara mengubah data profil?",
      a: "Buka menu 'Profil Saya', klik tombol 'Edit Profil', ubah data yang diperlukan, lalu klik 'Simpan'.",
    },
    {
      q: "Apa itu NPWZ?",
      a: "NPWZ (Nomor Pokok Wajib Zakat) adalah identitas wajib zakat yang diterbitkan oleh BAZNAS. NPWZ dapat digunakan untuk pengurangan Penghasilan Kena Pajak (PKP).",
    },
    {
      q: "Bagaimana cara melihat riwayat pembayaran?",
      a: "Buka menu 'Riwayat Pembayaran' untuk melihat seluruh transaksi zakat Anda. Anda juga dapat mengunduh bukti pembayaran di halaman tersebut.",
    },
    {
      q: "Apakah saya bisa membatalkan pembayaran zakat?",
      a: "Pembayaran zakat yang sudah diproses tidak dapat dibatalkan. Namun, Anda dapat menghubungi admin UPZ UNSIL untuk penanganan lebih lanjut.",
    },
  ];

  const contacts = [
    {
      icon: Phone,
      label: "Telepon",
      value: "(0265) 330634",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "0821-1637-5827",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Mail,
      label: "Email",
      value: "upz@unsil.ac.id",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pusat Bantuan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Temukan jawaban untuk pertanyaan Anda atau hubungi kami
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Panduan Pengguna</p>
            <p className="text-sm text-gray-500">Pelajari cara menggunakan sistem</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition text-left">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Video size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Tutorial Video</p>
            <p className="text-sm text-gray-500">Tonton video panduan</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition text-left">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Live Chat</p>
            <p className="text-sm text-gray-500">Chat dengan admin</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="px-4 py-3 bg-gray-50 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition flex items-center justify-between">
                  {faq.q}
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-4 py-3 text-sm text-gray-600 bg-white">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Hubungi Kami</h3>
            <div className="space-y-3">
              {contacts.map((contact, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 ${contact.bg} rounded-lg`}
                >
                  <contact.icon size={20} className={contact.color} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">{contact.label}</p>
                    <p className="font-medium text-gray-900">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-2">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-sm text-emerald-100 mb-4">
              Tim kami siap membantu Anda. Hubungi kami melalui kontak di atas atau kirim pesan langsung.
            </p>
            <button className="w-full px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition">
              Kirim Pesan
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tips:</strong> Gunakan fitur kalkulator zakat untuk menghitung zakat Anda secara otomatis!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
