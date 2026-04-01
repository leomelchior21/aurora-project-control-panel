import type { SocialPulseEntry } from "../../data/socialPulse";
import { cn } from "../../lib/utils";

export function SocialFeedPanel({
  entries,
  title = "Social Feed",
  subtitle = "Public posts read as system signals",
  scroll = false,
}: {
  entries: SocialPulseEntry[];
  title?: string;
  subtitle?: string;
  scroll?: boolean;
}) {
  const feed = scroll ? [...entries, ...entries] : entries;

  return (
    <section className="aurora-panel rounded-[28px] border border-white/10 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#7D8590]">Live citizen feed</p>
          <h3 className="mt-2 font-headline text-[2rem] leading-none text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
        </div>
        <span className="rounded-full border border-[#FF3131]/35 bg-[#FF3131]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#FFD0D0]">
          Live
        </span>
      </div>

      <div className={cn("rounded-[24px] border border-white/10 bg-[rgba(6,10,14,0.72)]", scroll ? "ticker-frame overflow-hidden" : "")}>
        <div className={cn(scroll ? "ticker-column" : "divide-y divide-white/8")}>
          {feed.map((entry, index) => (
            <article key={`${entry.handle}-${index}`} className="border-b border-white/8 px-4 py-4 last:border-b-0">
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
    </section>
  );
}
