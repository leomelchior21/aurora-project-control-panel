import type { CityData, LayerKey } from "../../types/city";
import { LayerNavItem } from "./LayerNavItem";
import { SidebarCityHeader } from "./SidebarCityHeader";

export function SidebarNav({
  city,
  activeLayer,
  onSelectLayer,
  onSwitchCity,
}: {
  city: CityData;
  activeLayer: LayerKey;
  onSelectLayer: (layer: LayerKey) => void;
  onSwitchCity: () => void;
}) {
  return (
    <aside className="aurora-panel flex h-full flex-col gap-4 rounded-[30px] border border-white/10 p-4">
      <SidebarCityHeader city={city} onSwitchCity={onSwitchCity} />
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
