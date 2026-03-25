import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import type { CityData } from "../../types/city";
import { StatCard } from "../dashboard/StatCard";
import { SystemsOverviewGrid } from "../dashboard/SystemsOverviewGrid";

export function MissionBriefView({ city }: { city: CityData }) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-4">
        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <button
            type="button"
            onClick={() => setExpandedImage(city.heroImage)}
            className="aurora-panel group relative overflow-hidden rounded-[30px] border border-white/10 text-left"
          >
            <img src={city.heroImage} alt={`${city.name} landscape`} className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/50 text-white">
              <Expand className="h-4 w-4" />
            </span>
          </button>
          <div className="grid gap-4">
            <div className="aurora-panel rounded-[30px] border border-white/10 p-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">About The City</p>
              <p className="mt-4 text-base leading-7 text-slate-200">{city.missionBrief}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedImage(city.secondaryImage)}
              className="aurora-panel group relative overflow-hidden rounded-[30px] border border-white/10 text-left"
            >
              <img src={city.secondaryImage} alt={`${city.name} street`} className="h-[180px] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/50 text-white">
                <Expand className="h-4 w-4" />
              </span>
            </button>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="aurora-panel rounded-[30px] border border-white/10 p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">City Facts</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {city.macroStats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} color={city.accent} />
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

        <section className="grid gap-4">
          <button
            type="button"
            onClick={() => setExpandedImage(city.mapImage)}
            className="aurora-panel group relative overflow-hidden rounded-[30px] border border-white/10 text-left"
          >
            <img src={city.mapImage} alt={`${city.name} map`} className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.01]" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-950/78 via-slate-950/28 to-transparent px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">City Map</p>
                <p className="mt-2 text-sm text-slate-200">Territory and urban layout reference</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/50 text-white">
                <Expand className="h-4 w-4" />
              </span>
            </div>
          </button>
        </section>
      </div>

      <AnimatePresence>
        {expandedImage ? (
          <motion.button
            type="button"
            onClick={() => setExpandedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-sm"
          >
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              src={expandedImage}
              alt="Expanded city view"
              className="max-h-[90vh] max-w-[90vw] rounded-[28px] border border-white/10 object-contain shadow-2xl"
            />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  );
}
