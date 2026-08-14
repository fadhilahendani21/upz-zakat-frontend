import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  Landmark,
  Pencil,
  Plus,
  Wallet,
  X,
} from "lucide-react";

const rekeningKasData = [
  {
    id: 1,
    nama: "Bank BRI Unit Unsil",
    nomor: "1234-5678-9012-3456",
    saldo: 8425000,
    status: "Aktif",
    type: "Bank",
    icon: Landmark,
  },
  {
    id: 2,
    nama: "Bank Mandiri UPZ",
    nomor: "004-001-0001234-5",
    saldo: 15650000,
    status: "Aktif",
    type: "Bank",
    icon: Building2,
  },
  {
    id: 3,
    nama: "Kas Operasional",
    nomor: "Kas Umum / Internal",
    saldo: 3250000,
    status: "Aktif",
    type: "Kas",
    icon: Wallet,
  },
  {
    id: 4,
    nama: "Kas Program Zakat",
    nomor: "Kas Dana Zakat",
    saldo: 10250000,
    status: "Aktif",
    type: "Kas",
    icon: CreditCard,
  },
  {
    id: 5,
    nama: "Bank BNI Donasi",
    nomor: "009-8765-4321-1122",
    saldo: 4800000,
    status: "Tidak Aktif",
    type: "Bank",
    icon: Landmark,
  },
  {
    id: 6,
    nama: "Kas Penyaluran Mustahik",
    nomor: "Kas Penyaluran",
    saldo: 6700000,
    status: "Aktif",
    type: "Kas",
    icon: Wallet,
  },
];

const mutationData = {
  1: [
    { tanggal: "2025-05-09", jenis: "Setoran", nominal: 2500000, keterangan: "Zakat fitrah" },
    { tanggal: "2025-05-11", jenis: "Penyaluran", nominal: -1200000, keterangan: "Bantuan sembako" },
    { tanggal: "2025-05-13", jenis: "Setoran", nominal: 1800000, keterangan: "Donatur rutin" },
  ],
  2: [
    { tanggal: "2025-05-05", jenis: "Setoran", nominal: 3500000, keterangan: "Infaq jum'at" },
    { tanggal: "2025-05-18", jenis: "Penyaluran", nominal: -900000, keterangan: "Pembelian obat" },
  ],
  3: [
    { tanggal: "2025-05-08", jenis: "Setoran", nominal: 1400000, keterangan: "Pendapatan operasional" },
    { tanggal: "2025-05-17", jenis: "Pengeluaran", nominal: -750000, keterangan: "Perlengkapan kantor" },
  ],
  4: [
    { tanggal: "2025-05-01", jenis: "Setoran", nominal: 4200000, keterangan: "Program berbuka puasa" },
    { tanggal: "2025-05-24", jenis: "Penyaluran", nominal: -1600000, keterangan: "Bantuan kesehatan" },
  ],
  5: [
    { tanggal: "2025-05-14", jenis: "Penarikan", nominal: -600000, keterangan: "Biaya administrasi" },
  ],
  6: [
    { tanggal: "2025-05-06", jenis: "Setoran", nominal: 2800000, keterangan: "Donasi program" },
    { tanggal: "2025-05-22", jenis: "Penyaluran", nominal: -2100000, keterangan: "Mustahik" },
  ],
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RekeningKas() {
  const [rekeningList, setRekeningList] = useState(rekeningKasData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMutationModal, setShowMutationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    nomor: "",
    saldo: "",
    type: "Bank",
    status: "Aktif",
  });

  function openAddModal() {
    setFormData({ nama: "", nomor: "", saldo: "", type: "Bank", status: "Aktif" });
    setShowAddModal(true);
  }

  function openEditModal(item) {
    setSelectedItem(item);
    setFormData({
      nama: item.nama,
      nomor: item.nomor,
      saldo: String(item.saldo),
      type: item.type,
      status: item.status,
    });
    setShowEditModal(true);
  }

  function openMutationModal(item) {
    setSelectedItem(item);
    setShowMutationModal(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddSubmit(event) {
    event.preventDefault();

    const newItem = {
      id: Date.now(),
      nama: formData.nama,
      nomor: formData.nomor,
      saldo: Number(formData.saldo) || 0,
      status: formData.status,
      type: formData.type,
      icon: formData.type === "Bank" ? Landmark : Wallet,
    };

    setRekeningList((prev) => [newItem, ...prev]);
    setShowAddModal(false);
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    setRekeningList((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              nama: formData.nama,
              nomor: formData.nomor,
              saldo: Number(formData.saldo) || 0,
              type: formData.type,
              status: formData.status,
            }
          : item
      )
    );

    setShowEditModal(false);
    setSelectedItem(null);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Rekening & Kas
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <Plus size={16} />
          Tambah Rekening/Kas Baru
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rekeningList.map(({ id, nama, nomor, saldo, status, type, icon: Icon }) => (
          <article
            key={id}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {type}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900">{nama}</h2>
                </div>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  status === "Aktif"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Nomor Rekening
              </p>
              <p className="text-sm font-medium text-gray-700">{nomor}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Saldo
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatRupiah(saldo)}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => openMutationModal({ id, nama, nomor, saldo, status, type })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <ArrowUpRight size={14} />
                Detail Mutasi
              </button>

              <button
                type="button"
                onClick={() => openEditModal({ id, nama, nomor, saldo, status, type })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </article>
        ))}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-xl font-bold text-gray-900">Tambah Rekening / Kas Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-700"
                aria-label="Tutup modal tambah"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nama</label>
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="Contoh: Bank BRI Unit Unsil"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nomor Rekening</label>
                <input
                  name="nomor"
                  value={formData.nomor}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="Masukkan nomor rekening"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Saldo Awal</label>
                  <input
                    name="saldo"
                    type="number"
                    value={formData.saldo}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Jenis</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Kas">Kas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Rekening / Kas</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-700"
                aria-label="Tutup modal edit"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nama</label>
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nomor Rekening</label>
                <input
                  name="nomor"
                  value={formData.nomor}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Saldo Awal</label>
                  <input
                    name="saldo"
                    type="number"
                    value={formData.saldo}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Jenis</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Kas">Kas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMutationModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Riwayat Mutasi
                </p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">{selectedItem.nama}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMutationModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-700"
                aria-label="Tutup modal mutasi"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto px-5 py-5">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Tanggal</th>
                    <th className="px-3 py-2 font-semibold">Jenis</th>
                    <th className="px-3 py-2 font-semibold">Keterangan</th>
                    <th className="px-3 py-2 font-semibold text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {(mutationData[selectedItem.id] || []).map((mutasi, index) => (
                    <tr key={`${selectedItem.id}-${index}`} className="border-t border-gray-200">
                      <td className="px-3 py-3 text-gray-700">{mutasi.tanggal}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            mutasi.nominal >= 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {mutasi.jenis}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{mutasi.keterangan}</td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900">
                        {mutasi.nominal >= 0 ? "+" : "-"}
                        {formatRupiah(Math.abs(mutasi.nominal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowMutationModal(false)}
                className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
