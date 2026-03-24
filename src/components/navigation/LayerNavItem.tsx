import { motion } from "framer-motion";
import { Home, Thermometer, Droplets, Wind, Sun, Zap, Trash2, Building2, TramFront, Trees } from "lucide-react";
import type { LayerKey, SystemStatus } from "../../types/city";
import { cn } from "../../lib/utils";
import { PulseIndicator } from "../ui/PulseIndicator";

const iconMap = {
  "mission-brief": Home,
  temperature: Thermometer,
  water: Droplets,
  air: Wind,
  sun: Sun,
  wind: Wind,
  energy: Zap,
  waste: Trash2,
  housing: Building2,
  transportation: TramFront,
  biodiversity: Trees,
} as const;

export function LayerNavItem({
  layerKey,
  label,
  status,
  active,
  onClick,
}: {
  layerKey: LayerKey;
  label: string;
  status?: SystemStatus;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = iconMap[layerKey];

  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition",
        active ? "border-white/20 bg-white/[0.08] text-white" : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04]",
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{label}</p>
      </div>
      {status ? <PulseIndicator status={status} /> : null}
    </motion.button>
  );
}
