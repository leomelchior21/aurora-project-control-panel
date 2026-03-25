import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { auroraLogo } from "../data/shared/assets";
import { cityCollection } from "../data/cities/index";

export function LandingPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col justify-center gap-8">
        <img src={auroraLogo} alt="Aurora Project" className="mx-auto h-40 w-40 object-contain" />

        <div className="grid gap-4 lg:grid-cols-3">
          {cityCollection.map((city, index) => (
            <motion.div key={city.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }}>
              <Link to={`/city/${city.slug}`} className="aurora-panel flex min-h-[260px] flex-col justify-between rounded-[32px] border border-white/10 p-6 transition hover:-translate-y-1 hover:border-white/20">
                <div>
                  <img src={city.logo} alt={`${city.name} logo`} className="h-14 w-14 object-contain" />
                  <h2 className="mt-8 font-headline text-[clamp(2rem,4vw,3.2rem)] leading-none text-white">{city.name}</h2>
                  <p className="mt-4 text-sm text-slate-300">{city.oneLineDescription}</p>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{city.breadcrumbLabel}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: city.accent }}>Open city</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
