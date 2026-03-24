import {
  AlertTriangle,
  Building2,
  Droplets,
  Gauge,
  Leaf,
  Mountain,
  Move,
  Shield,
  Sun,
  Thermometer,
  Timer,
  Trees,
  Users,
  Wallet,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Array<[RegExp, LucideIcon]> = [
  [/temp|heat|cold|cool/i, Thermometer],
  [/water|flood|drain|rain/i, Droplets],
  [/air|smoke|mold/i, Wind],
  [/sun|uv|light/i, Sun],
  [/wind|airflow/i, Wind],
  [/energy|power|solar|battery/i, Zap],
  [/waste|trash|recycl/i, AlertTriangle],
  [/home|housing|building/i, Building2],
  [/transport|trip|travel|walk|access|transit/i, Move],
  [/nature|green|species|habitat|biodiversity/i, Trees],
  [/population|people/i, Users],
  [/gdp|cost|money/i, Wallet],
  [/area|range|elevation/i, Mountain],
  [/safe|risk|protect|shield/i, Shield],
  [/time|day|month/i, Timer],
  [/comfort|score|level/i, Gauge],
];

export function MetricIcon({ label, color }: { label: string; color: string }) {
  const Icon = iconMap.find(([pattern]) => pattern.test(label))?.[1] ?? Leaf;

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20" style={{ color }}>
      <Icon className="h-4.5 w-4.5" />
    </div>
  );
}
