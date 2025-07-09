import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<Props> = ({ Icon, label, value, color }) => {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardContent className="p-6 flex items-center gap-4">
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
