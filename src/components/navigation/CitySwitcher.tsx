import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CityData, CitySlug } from "../../types/city";
import { cityCollection } from "../../data/cities/index";

export function CitySwitcher({
  currentCity,
  open,
  onToggle,
  onSelectCity,
}: {
  currentCity: CityData;
  open: boolean;
  onToggle: () => void;
  onSelectCity: (slug: CitySlug) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-[18px] border border-amber-400/40 bg-gradient-to-r from-amber-400/18 via-amber-300/12 to-orange-400/18 px-4 py-3 text-left text-sm font-medium text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.15)] transition hover:border-amber-300/60 hover:from-amber-300/24 hover:to-orange-300/24"
      >
        <span>Switch city</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.24 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-2 rounded-[22px] border border-white/10 bg-slate-950/60 p-2 backdrop-blur-xl">
              {cityCollection.map((city) => {
                const active = city.slug === currentCity.slug;

                return (
                  <button
                    key={city.slug}
                    type="button"
                    onClick={() => onSelectCity(city.slug)}
                    className="flex items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition"
                    style={{
                      borderColor: active ? `${city.accent}66` : "rgba(255,255,255,0.08)",
                      background: active ? `linear-gradient(135deg, ${city.accent}22, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <img src={city.logo} alt={`${city.name} logo`} className="h-10 w-10 object-contain" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{city.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{city.oneLineDescription}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
