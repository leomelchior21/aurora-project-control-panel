import type { CityData } from "../../types/city";

export function SidebarCityHeader({
  city,
}: {
  city: CityData;
}) {
  return (
    <div className="relative flex min-h-[156px] items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
      <div
        className="absolute inset-x-8 top-5 h-16 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${city.accent}33 0%, transparent 70%)` }}
      />
      <img src={city.logo} alt={`${city.name} logo`} className="relative h-24 w-24 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.08)]" />
    </div>
  );
}
