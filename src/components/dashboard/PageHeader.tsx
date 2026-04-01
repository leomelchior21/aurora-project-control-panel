import type { CityData, LayerKey, SystemLayer } from "../../types/city";
import { StatusBadge } from "../ui/StatusBadge";

const lensMap: Record<LayerKey, string[]> = {
  "mission-brief": ["Environment", "Efficiency", "Economy", "Equity"],
  "compare-cities": ["Environment", "Efficiency", "Economy", "Equity"],
  energy: ["Efficiency", "Economy", "Environment"],
  water: ["Environment", "Equity", "Efficiency"],
  climate: ["Environment", "Equity", "Design"],
  air: ["Environment", "Health", "Equity"],
  waste: ["Environment", "Efficiency", "Equity"],
  mobility: ["Equity", "Access", "Efficiency"],
  biodiversity: ["Environment", "Protection", "Equity"],
  social: ["Voice", "Trust", "Response"],
};

export function PageHeader({
  city,
  layerKey,
  layer,
}: {
  city: CityData;
  layerKey: LayerKey;
  layer?: SystemLayer;
}) {
  const title = layerKey === "mission-brief" ? city.name : layerKey === "compare-cities" ? "Critical Connections" : layer?.label ?? "";
  const state =
    layerKey === "mission-brief"
      ? city.oneLineDescription
      : layerKey === "compare-cities"
        ? "Switch layers and read the same system side by side. The goal is not to find a winner, but to see repeated failure patterns."
        : layer?.state ?? "";
  const lenses = lensMap[layerKey];

  return (
    <div
      className="aurora-panel rounded-[28px] border border-white/10 p-5 md:p-6"
      style={{
        background: `linear-gradient(180deg, rgba(14,17,23,0.98), rgba(9,12,16,0.98)), linear-gradient(130deg, ${city.accent}18, transparent 48%)`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FFBF00]">{city.breadcrumbLabel}</p>
          <h2 className="mt-3 font-headline text-[clamp(2rem,4vw,3.5rem)] leading-none text-white">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{state}</p>
        </div>

        <div className="min-w-[220px]">
          <div className="flex flex-wrap justify-end gap-2">
            {lenses.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 flex justify-end">{layer ? <StatusBadge status={layer.status} /> : null}</div>
        </div>
      </div>
    </div>
  );
}
