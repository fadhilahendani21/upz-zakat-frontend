import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import Card from "../common/Card";
import { formatRupiah } from "../../utils/formatRupiah";
import { formatDateTime } from "../../utils/formatDate";

export default function TransactionList({ data }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Transaksi Terbaru</h3>
        <button className="text-sm text-brand-600 font-medium hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {data.map((trx) => {
          const masuk = trx.jenis === "masuk";
          return (
            <div key={trx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    masuk
                      ? "bg-brand-50 text-brand-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {masuk ? (
                    <ArrowDownToLine size={16} />
                  ) : (
                    <ArrowUpFromLine size={16} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {trx.deskripsi}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(trx.waktu)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatRupiah(trx.nominal)}
                </p>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    masuk
                      ? "bg-brand-50 text-brand-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {masuk ? "Masuk" : "Keluar"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
