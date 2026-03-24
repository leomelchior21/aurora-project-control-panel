import type { CityData } from "../types";

interface CityCardProps {
  city: CityData;
  onSelect: (slug: CityData["slug"]) => void;
}

export function CityCard({ city, onSelect }: CityCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(city.slug)}
      className="glass relative flex min-h-[180px] items-center justify-center rounded-[24px] border border-white/10 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-aurora"
    >
      <span className="font-display text-[clamp(2rem,4vw,3.25rem)] tracking-[0.04em] text-white">{city.city}</span>
      <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${city.themeColor}, transparent)` }} />
    </button>
  );
}
