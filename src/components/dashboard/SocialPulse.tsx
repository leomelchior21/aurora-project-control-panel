import { socialPulseByCity } from "../../data/socialPulse";
import type { CityData, LayerKey } from "../../types/city";
import { cn } from "../../lib/utils";

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
  const feed = [...entries, ...entries];

  return (
    <aside className="aurora-panel social-shell hidden h-[calc(100vh-2.4rem)] rounded-[28px] border border-white/10 p-4 xl:flex xl:flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#7D8590]">Live Citizen Feed</p>
          <h3 className="mt-2 font-headline text-[2rem] leading-none text-white">Social Pulse</h3>
        </div>
        <span className="rounded-full border border-[#FF3131]/35 bg-[#FF3131]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#FFD0D0]">
          Live
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {focusPillars.map((pillar, index) => (
          <div
            key={pillar}
            className={cn(
              "rounded-[18px] border px-3 py-2 text-[10px] uppercase tracking-[0.18em]",
              index === 0 || index === 3 ? "border-[#FF3131]/25 bg-[#FF3131]/8 text-[#FFD7D7]" : "border-[#FFBF00]/25 bg-[#FFBF00]/8 text-[#FBE7A3]",
            )}
          >
            {pillar}
          </div>
        ))}
      </div>

      <div className="rounded-[22px] border border-white/10 bg-black/22 px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#7D8590]">Reading bias</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          These posts do not solve the problem. They show where pressure reaches daily life first.
        </p>
      </div>

      <div className="ticker-frame mt-4 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(6,10,14,0.72)]">
        <div className="ticker-column">
          {feed.map((entry, index) => (
            <article
              key={`${entry.handle}-${index}`}
              className="border-b border-white/8 px-4 py-4 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white">{entry.handle}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#7D8590]">{entry.city}</p>
                </div>
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    entry.severity === "critical" ? "bg-[#FF3131] shadow-[0_0_14px_rgba(255,49,49,0.9)]" : "bg-[#FFBF00] shadow-[0_0_14px_rgba(255,191,0,0.75)]",
                  )}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{entry.text}</p>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
