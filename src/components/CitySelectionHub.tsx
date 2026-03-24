import type { CityData, CitySlug } from "../types";
import { CityCard } from "./CityCard";

interface CitySelectionHubProps {
  cities: CityData[];
  onSelect: (slug: CitySlug) => void;
}

export function CitySelectionHub({ cities, onSelect }: CitySelectionHubProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-[1200px] gap-4 lg:grid-cols-3">
        <section className="grid gap-4 lg:col-span-3 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} onSelect={onSelect} />
          ))}
        </section>
      </div>
    </div>
  );
}
