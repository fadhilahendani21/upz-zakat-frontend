import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Card from "../common/Card";
import { formatRupiah } from "../../utils/formatRupiah";

export default function DonutChartCard({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Dana</h3>

      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-xl font-bold text-gray-900">
            {formatRupiah(total).replace("Rp ", "")
              .length > 9
              ? (total / 1_000_000_000).toFixed(2).replace(".", ",") + " M"
              : formatRupiah(total)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="text-gray-900 font-medium">
              {formatRupiah(item.value)}{" "}
              <span className="text-gray-400 font-normal">
                ({item.percent}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
