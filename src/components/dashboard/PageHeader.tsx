import type { CityData, LayerKey, SystemLayer } from "../../types/city";
import { StatusBadge } from "../ui/StatusBadge";

export function PageHeader({
  city,
  layerKey,
  layer,
}: {
  city: CityData;
  layerKey: LayerKey;
  layer?: SystemLayer;
}) {
  const title = layerKey === "mission-brief" ? "Mission Brief" : layer?.label ?? "";
  const state = layerKey === "mission-brief" ? city.oneLineDescription : layer?.state ?? "";

  return (
    <div className="aurora-panel rounded-[28px] border border-white/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-headline text-[clamp(2rem,4vw,3.4rem)] leading-none text-white">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{state}</p>
        </div>
        {layer ? <StatusBadge status={layer.status} /> : null}
      </div>
    </div>
  );
}
