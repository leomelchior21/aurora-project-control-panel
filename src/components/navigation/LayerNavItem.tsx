import { motion } from "framer-motion";
import { Home, Thermometer, Droplets, Wind, Sun, Zap, Trash2, Building2, TramFront, Trees, PanelsTopLeft } from "lucide-react";
import type { LayerKey, SystemStatus } from "../../types/city";
import { cn } from "../../lib/utils";
import { PulseIndicator } from "../ui/PulseIndicator";

const iconMap = {
  "mission-brief": Home,
  "compare-cities": PanelsTopLeft,
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
  compact = false,
}: {
  layerKey: LayerKey;
  label: string;
  status?: SystemStatus;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const Icon = iconMap[layerKey];

  return (
    <motion.button
      whileHover={compact ? { scale: 1.05 } : { x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        compact
          ? "relative flex h-14 w-14 items-center justify-center rounded-[18px] border text-left transition"
          : "relative flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition",
        active
          ? "border-white/20 bg-white/[0.08] text-white shadow-[0_0_24px_rgba(255,191,0,0.14)]"
          : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04]",
      )}
    >
      <div className={cn("flex items-center justify-center rounded-2xl border border-white/10 bg-black/20", compact ? "h-10 w-10" : "h-10 w-10")}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      {!compact ? (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{label}</p>
          </div>
          {status ? <PulseIndicator status={status} /> : null}
        </>
      ) : status ? (
        <span className="absolute right-1.5 top-1.5">
          <PulseIndicator status={status} />
        </span>
      ) : null}
    </motion.button>
  );
}
