import type { CityOverviewItem } from "../../types/city";
import { getStatusLabel } from "../../features/city-dashboard/utils/status";
import { PulseIndicator } from "../ui/PulseIndicator";

export function SystemsOverviewGrid({ items }: { items: CityOverviewItem[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white">{item.label}</p>
            <PulseIndicator status={item.status} />
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">{getStatusLabel(item.status)}</p>
        </div>
      ))}
    </div>
  );
}
