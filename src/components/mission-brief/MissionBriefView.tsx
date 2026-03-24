import type { CityData } from "../../types/city";
import { StatCard } from "../dashboard/StatCard";
import { SystemsOverviewGrid } from "../dashboard/SystemsOverviewGrid";

export function MissionBriefView({ city }: { city: CityData }) {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="aurora-panel overflow-hidden rounded-[30px] border border-white/10">
          <img src={city.heroImage} alt={`${city.name} landscape`} className="h-[340px] w-full object-cover" />
        </div>
        <div className="grid gap-4">
          <div className="aurora-panel rounded-[30px] border border-white/10 p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">About The City</p>
            <p className="mt-4 text-base leading-7 text-slate-200">{city.missionBrief}</p>
          </div>
          <div className="aurora-panel overflow-hidden rounded-[30px] border border-white/10">
            <img src={city.secondaryImage} alt={`${city.name} street`} className="h-[180px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="aurora-panel rounded-[30px] border border-white/10 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">City Facts</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {city.macroStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>

        <div className="aurora-panel rounded-[30px] border border-white/10 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">System Status</p>
          <div className="mt-5">
            <SystemsOverviewGrid items={city.systemsOverview} />
          </div>
        </div>
      </section>
    </div>
  );
}
