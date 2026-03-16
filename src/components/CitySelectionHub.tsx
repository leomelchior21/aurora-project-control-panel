import type { CityData, CitySlug } from "../types";
import { CityCard } from "./CityCard";

interface CitySelectionHubProps {
  cities: CityData[];
  onSelect: (slug: CitySlug) => void;
}

export function CitySelectionHub({ cities, onSelect }: CitySelectionHubProps) {
  return (
    <div className="min-h-screen overflow-y-auto p-3 md:p-4">
      <div className="glass panel-grid dashboard-enter mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] rounded-[28px] border border-white/10 p-4 shadow-aurora md:min-h-[calc(100vh-2rem)]">
        <section className="grid min-h-0 gap-4 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} onSelect={onSelect} />
          ))}
        </section>
      </div>
    </div>
  );
}
