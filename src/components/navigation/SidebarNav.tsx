import { useState } from "react";
import type { CityData, LayerKey } from "../../types/city";
import { LayerNavItem } from "./LayerNavItem";
import { SidebarCityHeader } from "./SidebarCityHeader";
import { CitySwitcher } from "./CitySwitcher";

export function SidebarNav({
  city,
  activeLayer,
  onSelectLayer,
  onSelectCity,
  compact = false,
}: {
  city: CityData;
  activeLayer: LayerKey;
  onSelectLayer: (layer: LayerKey) => void;
  onSelectCity: (slug: CityData["slug"]) => void;
  compact?: boolean;
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const visibleLayers = city.layers.filter((layer) =>
    ["water", "energy", "air", "temperature", "waste", "housing", "transportation"].includes(layer.key),
  );

  return (
    <aside className={compact ? "aurora-panel icon-tray flex h-full flex-col items-center gap-3 rounded-[28px] border border-white/10 p-3" : "aurora-panel flex h-full flex-col gap-4 rounded-[30px] border border-white/10 p-4"}>
      {!compact ? <SidebarCityHeader city={city} /> : null}
      {!compact ? <CitySwitcher currentCity={city} open={switcherOpen} onToggle={() => setSwitcherOpen((current) => !current)} onSelectCity={onSelectCity} /> : null}
      <div className={compact ? "flex flex-1 flex-col items-center gap-2" : "scrollbar-thin flex-1 overflow-auto pr-1"}>
        <div className={compact ? "flex flex-col items-center gap-2" : "grid gap-1.5"}>
          <LayerNavItem layerKey="mission-brief" label="Home" active={activeLayer === "mission-brief"} onClick={() => onSelectLayer("mission-brief")} compact={compact} />
          {visibleLayers.map((layer) => (
            <LayerNavItem
              key={layer.key}
              layerKey={layer.key}
              label={layer.label}
              status={layer.status}
              active={activeLayer === layer.key}
              onClick={() => onSelectLayer(layer.key)}
              compact={compact}
            />
          ))}
          {compact ? (
            <LayerNavItem
              layerKey="compare-cities"
              label="Compare"
              active={activeLayer === "compare-cities"}
              onClick={() => onSelectLayer("compare-cities")}
              compact
            />
          ) : (
            <LayerNavItem layerKey="compare-cities" label="Compare" active={activeLayer === "compare-cities"} onClick={() => onSelectLayer("compare-cities")} />
          )}
        </div>
      </div>
    </aside>
  );
}
