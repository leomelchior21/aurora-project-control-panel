import { StatusBadge } from "../ui/StatusBadge";
import type { CityData, SystemStatus } from "../../types/city";

export function SidebarCityHeader({ city, overallStatus }: { city: CityData; overallStatus: SystemStatus }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <img src={city.logo} alt={`${city.name} logo`} className="h-12 w-12 object-contain" />
      <h1 className="mt-4 font-headline text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-white">{city.name}</h1>
      <p className="mt-3 text-sm text-slate-300">{city.oneLineDescription}</p>
      <div className="mt-4">
        <StatusBadge status={overallStatus} />
      </div>
    </div>
  );
}
