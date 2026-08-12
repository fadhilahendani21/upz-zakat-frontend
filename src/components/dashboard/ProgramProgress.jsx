import { Link } from "react-router-dom";
import { GraduationCap, HeartHandshake, HeartPulse, Store, FolderKanban } from "lucide-react";
import Card from "../common/Card";
import { formatRupiah } from "../../utils/formatRupiah";

const iconMap = {
  "Beasiswa Mahasiswa Mustahik": GraduationCap,
  "Santunan Yatim & Dhuafa":     HeartHandshake,
  "Bantuan Kesehatan":           HeartPulse,
  "Bantuan UMKM Mustahik":       Store,
};

export default function ProgramProgress({ data }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Program Penyaluran Aktif</h3>
        <Link
          to="/dashboard/program"
          className="text-sm text-brand-600 font-medium hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-5">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Tidak ada program aktif.</p>
        ) : data.map((prog) => {
          const Icon = iconMap[prog.nama] ?? FolderKanban;
          return (
            <div key={prog.id}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {prog.nama}
                  </p>
                  <p className="text-xs text-gray-400">
                    {prog.penerima} Penerima
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatRupiah(prog.nominal)}
                  </p>
                  <p className="text-xs text-gray-400">{prog.progress}%</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${prog.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
