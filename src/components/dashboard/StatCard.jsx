import { TrendingUp } from "lucide-react";
import Card from "../common/Card";

const colorMap = {
  green: "bg-brand-50 text-brand-600",
  blue: "bg-blue-50 text-blue-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  change,
  color = "green",
}) {
  return (
    <Card className="!p-5">
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">{sub}</p>
        {change !== undefined && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp size={12} /> {change}%
          </span>
        )}
      </div>
    </Card>
  );
}
