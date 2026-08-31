import { useState, useEffect, useCallback } from "react";
import {
  FileText, CheckCircle2, XCircle, Clock, ChevronDown,
  RefreshCw, MessageSquare, User, Phone,
} from "lucide-react";
import Button from "../../components/common/Button";
import { Pagination, SearchInput } from "../../components/dashboard/ui";
import { getAgreementRequests, approveRequest, rejectRequest } from "../../services/agreementService";

const STATUS_TABS = [
  { key: "pending",    label: "Menunggu",  icon: Clock,         color: "amber"  },
  { key: "disetujui", label: "Disetujui", icon: CheckCircle2,  color: "emerald" },
  { key: "ditolak",   label: "Ditolak",   icon: XCircle,       color: "red"    },
  { key: "all",       label: "Semua",     icon: FileText,      color: "gray"   },
];

const FREKUENSI_LABEL = {
  bulanan:    "Bulanan",
  triwulanan: "Triwulanan",
  semesteran: "Semesteran",
  tahunan:    "Tahunan",
  ramadan:    "Ramadan",
};

function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function StatusBadge({ status }) {
  if (status === "pending")    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"><Clock size={11} /> Menunggu</span>;
  if (status === "disetujui")  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={11} /> Disetujui</span>;
  if (status === "ditolak")    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200"><XCircle size={11} /> Ditolak</span>;
  return null;
}

// ── Modal Detail + Approve/Reject ─────────────────────────────────────────────
function ReviewModal({ item, onClose, onDone }) {
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(null); // "approve" | "reject"
  const [errorMsg, setErrorMsg] = useState("");
  const [expanded, setExpanded] = useState(false);

  const isPending = item.status === "pending";

  async function handleApprove() {
    setLoading("approve");
    setErrorMsg("");
    try {
      await approveRequest(item.id, catatan);
      onDone("disetujui");
    } catch (e) {
      setErrorMsg(e.message || "Gagal menyetujui.");
      setLoading(null);
    }
  }

  async function handleReject() {
    setLoading("reject");
    setErrorMsg("");
    try {
      await rejectRequest(item.id, catatan);
      onDone("ditolak");
    } catch (e) {
      setErrorMsg(e.message || "Gagal menolak.");
      setLoading(null);
    }
  }

  const totalLama  = (item.kesepakatan_lama  || []).reduce((s, x) => s + Number(x.nominal || 0), 0);
  const totalBaru  = (item.perubahan_diajukan || []).reduce((s, x) => s + Number(x.nominal || 0), 0);
  const selisih    = totalBaru - totalLama;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#08734f] to-emerald-600 px-6 py-4 flex items-start justify-between">
          <div className="text-white">
            <h3 className="font-bold text-base">Tinjau Permohonan Perubahan</h3>
            <p className="text-[11px] text-emerald-100 mt-0.5">ID #{item.id} · {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Info Muzakki */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <User size={15} /> {item.nama_muzakki}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
              {item.nip  && <span>NIP: {item.nip}</span>}
              {item.nik  && <span>NIK: {item.nik}</span>}
              {item.no_hp && (
                <span className="flex items-center gap-1"><Phone size={10} />{item.no_hp}</span>
              )}
            </div>
            <div><StatusBadge status={item.status} /></div>
          </div>

          {/* Perbandingan Kesepakatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lama */}
            <div className="rounded-xl border border-slate-200 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Kesepakatan Saat Ini</p>
              {(item.kesepakatan_lama || []).length === 0
                ? <p className="text-xs text-slate-400 italic">Tidak ada data</p>
                : (item.kesepakatan_lama || []).map((k, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium text-slate-700">{k.jenis}</span>
                    <span className="text-slate-400"> — {formatRp(k.nominal)} / {FREKUENSI_LABEL[k.frekuensi] || k.frekuensi}</span>
                  </div>
                ))
              }
              <p className="text-xs font-semibold text-slate-700 pt-1 border-t border-slate-100">Total: {formatRp(totalLama)}</p>
            </div>

            {/* Baru */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Perubahan Diajukan</p>
              {(item.perubahan_diajukan || []).map((k, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-slate-700">{k.jenis}</span>
                  <span className="text-slate-400"> — {formatRp(k.nominal)} / {FREKUENSI_LABEL[k.frekuensi] || k.frekuensi}</span>
                </div>
              ))}
              <p className="text-xs font-semibold text-emerald-700 pt-1 border-t border-emerald-100">
                Total: {formatRp(totalBaru)}
                {selisih !== 0 && (
                  <span className={`ml-2 ${selisih > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ({selisih > 0 ? "+" : ""}{formatRp(selisih)})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Alasan */}
          {item.alasan && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
              <p className="text-[11px] font-semibold text-amber-700 mb-1 flex items-center gap-1">
                <MessageSquare size={12} /> Alasan Muzakki
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{item.alasan}</p>
            </div>
          )}

          {/* Catatan admin jika sudah diproses */}
          {!isPending && item.catatan_admin && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold text-slate-500 mb-1">Catatan Admin</p>
              <p className="text-xs text-slate-700">{item.catatan_admin}</p>
            </div>
          )}

          {/* Form Aksi (hanya jika pending) */}
          {isPending && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Catatan Admin <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan untuk muzakki..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none focus:border-[#08734f] focus:outline-none focus:ring-1 focus:ring-[#08734f]/30"
                  maxLength={255}
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorMsg}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!!loading}
                  className="flex-1 rounded-lg border border-red-200 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                >
                  {loading === "reject" ? "Menolak..." : "✕ Tolak"}
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!!loading}
                  className="flex-1 rounded-lg bg-[#08734f] py-2.5 text-xs font-semibold text-white hover:bg-[#065a3d] disabled:opacity-50 transition"
                >
                  {loading === "approve" ? "Menyetujui..." : "✓ Setujui & Terapkan"}
                </button>
              </div>
            </>
          )}

          {!isPending && (
            <button type="button" onClick={onClose} className="w-full rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export default function ZakatRequests() {
  const [activeTab, setActiveTab]   = useState("pending");
  const [requests, setRequests]     = useState([]);
  const [meta, setMeta]             = useState(null);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [selected, setSelected]     = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAgreementRequests({ status: activeTab, page });
      setRequests(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [activeTab]);

  function handleDone(result) {
    setSelected(null);
    setSuccessMsg(result === "disetujui"
      ? "✓ Permohonan disetujui. Data kesepakatan muzakki telah diperbarui."
      : "Permohonan ditolak.");
    setTimeout(() => setSuccessMsg(""), 5000);
    load();
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-medium">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Action Toolbar & Status Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold border transition ${
                isActive
                  ? "bg-[#08734f] text-white border-[#08734f] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-lg px-3.5 py-2 hover:bg-slate-50 shadow-2xs transition"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Memuat data...</div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">Tidak ada permintaan</p>
            <p className="text-xs text-slate-400 mt-1">Tidak ada permintaan dengan status "{STATUS_TABS.find(t => t.key === activeTab)?.label}"</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((req) => {
              const totalBaru = (req.perubahan_diajukan || []).reduce((s, x) => s + Number(x.nominal || 0), 0);
              const totalLama = (req.kesepakatan_lama  || []).reduce((s, x) => s + Number(x.nominal || 0), 0);
              const selisih   = totalBaru - totalLama;
              return (
                <div
                  key={req.id}
                  className="flex items-start sm:items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/70 transition cursor-pointer"
                  onClick={() => setSelected(req)}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">{req.nama_muzakki}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {req.nip ? `NIP: ${req.nip}` : req.nik ? `NIK: ${req.nik}` : "—"} · {req.no_hp || "—"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Diajukan:{" "}
                      {(req.perubahan_diajukan || []).map((k) => k.jenis).join(", ")}
                      {" · "}
                      <span className="font-semibold">{formatRp(totalBaru)}</span>
                      {selisih !== 0 && (
                        <span className={`ml-1 ${selisih > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          ({selisih > 0 ? "+" : ""}{formatRp(selisih)})
                        </span>
                      )}
                    </div>
                    {req.alasan && (
                      <p className="text-[11px] text-slate-400 italic truncate">"{req.alasan}"</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-slate-400">
                      {new Date(req.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelected(req); }}
                      className="mt-1.5 text-[11px] font-semibold text-[#08734f] underline underline-offset-2 hover:text-emerald-700"
                    >
                      {req.status === "pending" ? "Tinjau →" : "Detail →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-5 py-4 border-t border-slate-100">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <ReviewModal
          item={selected}
          onClose={() => setSelected(null)}
          onDone={handleDone}
        />
      )}
    </div>
  );
}
