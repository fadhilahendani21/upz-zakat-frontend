import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../common/Card";

export default function LineChartCard({ data }) {
  return (
    <Card className="lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Grafik Pengumpulan dan Penyaluran
        </h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
          <option>Tahun 2025</option>
          <option>Tahun 2024</option>
        </select>
      </div>

      <div className="flex items-center gap-5 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Pengumpulan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Penyaluran
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1_000_000}jt`}
          />
          <Tooltip
            formatter={(value) => "Rp " + Number(value).toLocaleString("id-ID")}
          />
          <Line type="monotone" dataKey="pengumpulan" stroke="#2e7d38" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="penyaluran" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
