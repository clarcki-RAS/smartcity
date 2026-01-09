import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ListTodo,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { stats } from "@/lib/mock/stats";

const iconMap = {
  blue: ListTodo,
  red: AlertTriangle,
  orange: Loader2,
  green: CheckCircle2,
};

const colorMap = {
  blue: "text-blue-600 bg-blue-100",
  red: "text-red-600 bg-red-100",
  orange: "text-orange-600 bg-orange-100",
  green: "text-green-600 bg-green-100",
};

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = iconMap[stat.color as keyof typeof iconMap];

        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              
              {/* Header */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${colorMap[stat.color as keyof typeof colorMap]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>

              {/* Value */}
              <div className="flex items-end justify-between mt-4">
                <span className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500">
                  {stat.delta}
                </span>
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
