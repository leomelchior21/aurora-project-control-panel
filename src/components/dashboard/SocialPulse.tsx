import { socialPulseByCity } from "../../data/socialPulse";
import type { CityData, LayerKey } from "../../types/city";
import { SocialFeedPanel } from "./SocialFeedPanel";

const focusPillars = ["Environment", "Efficiency", "Economy", "Equity"];

function getFeedKey(layerKey: LayerKey) {
  return layerKey === "compare-cities" ? "compare" : null;
}

export function SocialPulse({
  city,
  layerKey,
}: {
  city: CityData;
  layerKey: LayerKey;
}) {
  const compareFeedKey = getFeedKey(layerKey);
  const entries = compareFeedKey ? socialPulseByCity[compareFeedKey] : socialPulseByCity[city.slug];

  return (
    <aside className="hidden h-[calc(100vh-2.4rem)] 2xl:flex 2xl:flex-col 2xl:sticky 2xl:top-3">
      <div className="mb-4 grid grid-cols-2 gap-2">
        {focusPillars.map((pillar, index) => (
          <div
            key={pillar}
            className={
              index === 0 || index === 3
                ? "rounded-[18px] border border-[#FF3131]/25 bg-[#FF3131]/8 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#FFD7D7]"
                : "rounded-[18px] border border-[#FFBF00]/25 bg-[#FFBF00]/8 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#FBE7A3]"
            }
          >
            {pillar}
          </div>
        ))}
      </div>
      <SocialFeedPanel entries={entries} title="Social Pulse" subtitle="These posts do not solve the problem. They show where pressure reaches everyday life first." scroll />
    </aside>
  );
}
