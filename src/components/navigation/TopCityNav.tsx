import { cityCollection } from "../../data/cities/index";
import type { CityData, CitySlug, LayerKey } from "../../types/city";
import { cn } from "../../lib/utils";

export function TopCityNav({
  city,
  activeLayer,
  onSelectCity,
  onSelectLayer,
}: {
  city: CityData;
  activeLayer: LayerKey;
  onSelectCity: (slug: CitySlug) => void;
  onSelectLayer: (layer: LayerKey) => void;
}) {
  return (
    <div className="aurora-panel glossy-nav rounded-[28px] border border-white/10 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#FFBF00]">Systemic Failure Reader</p>
          <p className="mt-2 text-sm text-slate-300">Read the city as pressure, not promise.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cityCollection.map((item) => {
            const active = item.slug === city.slug && activeLayer !== "compare-cities";

            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => onSelectCity(item.slug)}
                className={cn("nav-chip", active && "nav-chip-active")}
                style={active ? { borderColor: `${item.accent}77`, boxShadow: `0 0 24px ${item.accent}30` } : undefined}
              >
                {item.name}
              </button>
            );
          })}

          <span className="mx-1 hidden h-6 w-px bg-white/10 md:block" />

          <button
            type="button"
            onClick={() => onSelectLayer("compare-cities")}
            className={cn("nav-chip", activeLayer === "compare-cities" && "nav-chip-active")}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
