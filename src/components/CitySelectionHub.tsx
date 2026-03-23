import type { CityData, CitySlug } from "../types";
import { CityCard } from "./CityCard";

interface CitySelectionHubProps {
  cities: CityData[];
  onSelect: (slug: CitySlug) => void;
}

export function CitySelectionHub({ cities, onSelect }: CitySelectionHubProps) {
  return (
    <div className="min-h-screen overflow-y-auto p-3 md:p-4">
      <div className="glass panel-grid dashboard-enter mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] rounded-[28px] border border-white/10 p-4 shadow-aurora md:min-h-[calc(100vh-2rem)]" style={{ gridTemplateRows: 'auto 1fr' }}>
        <header className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-slate-500">Aurora Project</p>
            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] text-white">City Analysis Platform</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Explore the environmental pressures, opportunities, and systems of three distinct fictional cities.
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-400 sm:block">
            {cities.length} cities available
          </span>
        </header>
        <section className="grid min-h-0 gap-4 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} onSelect={onSelect} />
          ))}
        </section>
      </div>
    </div>
  );
}
