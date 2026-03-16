import type { CityData } from "../types";
import { cityLogos, cityThemes } from "../data/logos";

interface CityCardProps {
  city: CityData;
  onSelect: (slug: CityData["slug"]) => void;
}

export function CityCard({ city, onSelect }: CityCardProps) {
  const theme = cityThemes[city.slug];
  const quickMetrics = city.dashboardMetrics.slice(0, 4);

  return (
    <button
      type="button"
      onClick={() => onSelect(city.slug)}
      className="group glass relative flex h-full flex-col rounded-[24px] border border-white/10 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-aurora"
    >
      <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${theme.panel} opacity-70`} />
      <div className="absolute inset-x-5 top-0 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${city.themeColor}, transparent)` }} />

      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <img src={cityLogos[city.slug]} alt={`${city.city} logo`} className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">City profile</p>
              <h2 className="font-display text-2xl text-white">{city.city}</h2>
            </div>
          </div>
          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-300">
            Ready
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{city.biome}</p>
          <p className="mt-2 text-sm text-slate-300">{city.tagline}</p>
        </div>

        <div className="mb-4 grid flex-1 gap-2">
          {quickMetrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2.5">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="truncate text-[11px] uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                <p className="text-sm font-semibold text-white">{metric.value}</p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${metric.value}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs uppercase tracking-[0.3em] text-slate-400">
          <span>{city.activeSystem.name}</span>
          <span className="transition group-hover:translate-x-1" style={{ color: theme.secondary }}>
            OPEN
          </span>
        </div>
      </div>
    </button>
  );
}
