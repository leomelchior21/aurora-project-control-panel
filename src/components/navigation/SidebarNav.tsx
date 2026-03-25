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
}: {
  city: CityData;
  activeLayer: LayerKey;
  onSelectLayer: (layer: LayerKey) => void;
  onSelectCity: (slug: CityData["slug"]) => void;
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <aside className="aurora-panel flex h-full flex-col gap-4 rounded-[30px] border border-white/10 p-4">
      <SidebarCityHeader city={city} />
      <CitySwitcher currentCity={city} open={switcherOpen} onToggle={() => setSwitcherOpen((current) => !current)} onSelectCity={onSelectCity} />
      <div className="scrollbar-thin flex-1 overflow-auto pr-1">
        <div className="grid gap-1.5">
          <LayerNavItem layerKey="mission-brief" label="Mission Brief" active={activeLayer === "mission-brief"} onClick={() => onSelectLayer("mission-brief")} />
          {city.layers.map((layer) => (
            <LayerNavItem
              key={layer.key}
              layerKey={layer.key}
              label={layer.label}
              status={layer.status}
              active={activeLayer === layer.key}
              onClick={() => onSelectLayer(layer.key)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
