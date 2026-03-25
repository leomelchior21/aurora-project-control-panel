import type { CityOverviewItem } from "../../types/city";
import { getStatusColor, getStatusLabel } from "../../features/city-dashboard/utils/status";
import { PulseIndicator } from "../ui/PulseIndicator";
import { MetricIcon } from "../ui/MetricIcon";

export function SystemsOverviewGrid({ items }: { items: CityOverviewItem[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border p-4"
          style={{
            borderColor: `${getStatusColor(item.status)}33`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)), linear-gradient(140deg, ${getStatusColor(item.status)}16, transparent 46%)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white">{item.label}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">{getStatusLabel(item.status)}</p>
            </div>
            <div className="flex items-center gap-2">
              <PulseIndicator status={item.status} />
              <MetricIcon label={item.label} color={getStatusColor(item.status)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
