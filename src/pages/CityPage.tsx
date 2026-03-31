import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cityMap } from "../data/cities/index";
import type { CitySlug, LayerKey } from "../types/city";
import { SidebarNav } from "../components/navigation/SidebarNav";
import { PageHeader } from "../components/dashboard/PageHeader";
import { MissionBriefView } from "../components/mission-brief/MissionBriefView";
import { SystemLayerView } from "../components/dashboard/SystemLayerView";
import { CompareCitiesView } from "../components/dashboard/CompareCitiesView";
import { cn } from "../lib/utils";
import { useState } from "react";

export function CityPage() {
  const { slug } = useParams<{ slug: CitySlug }>();
  const city = slug ? cityMap[slug] : undefined;
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const activeLayer = useMemo<LayerKey>(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return "mission-brief";
    return hash as LayerKey;
  }, [location.hash]);

  if (!city) {
    return <div className="p-8 text-white">Cidade não encontrada.</div>;
  }

  const layer = city.layers.find((item) => item.key === activeLayer);
  const handleSelectCity = (nextSlug: CitySlug) => {
    navigate(`/city/${nextSlug}${activeLayer === "mission-brief" ? "" : `#${activeLayer}`}`);
    setNavOpen(false);
  };

  const handleSelectLayer = (nextLayer: LayerKey) => {
    navigate(`/city/${city.slug}${nextLayer === "mission-brief" ? "" : `#${nextLayer}`}`);
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen px-3 py-3 md:px-4">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
          <button onClick={() => setNavOpen(true)} className="aurora-panel flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Aurora Project</p>
            <p className="text-lg text-white">{city.name}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <SidebarNav city={city} activeLayer={activeLayer} onSelectLayer={handleSelectLayer} onSelectCity={handleSelectCity} />
          </div>

          <AnimatePresence>
            {navOpen ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden">
                <motion.div initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} className="h-full w-[min(88vw,340px)] p-3">
                  <div className="mb-3 flex justify-end">
                    <button onClick={() => setNavOpen(false)} className="aurora-panel flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <SidebarNav city={city} activeLayer={activeLayer} onSelectLayer={handleSelectLayer} onSelectCity={handleSelectCity} />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <main className={cn("space-y-4")}>
            <PageHeader city={city} layerKey={activeLayer} layer={layer} />
            <AnimatePresence mode="wait">
              <motion.div key={activeLayer} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                {activeLayer === "mission-brief" ? (
                  <MissionBriefView city={city} />
                ) : activeLayer === "compare-cities" ? (
                  <CompareCitiesView />
                ) : layer ? (
                  <SystemLayerView city={city} layer={layer} onSelectLayer={handleSelectLayer} />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
