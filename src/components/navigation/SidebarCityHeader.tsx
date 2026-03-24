import { StatusBadge } from "../ui/StatusBadge";
import type { CityData, SystemStatus } from "../../types/city";

export function SidebarCityHeader({ city, overallStatus }: { city: CityData; overallStatus: SystemStatus }) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <img src={city.logo} alt={`${city.name} logo`} className="h-14 w-14 object-contain" />
      <div className="mt-4">
        <StatusBadge status={overallStatus} />
      </div>
    </div>
  );
}
