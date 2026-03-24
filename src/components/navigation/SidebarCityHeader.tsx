import { ArrowRightLeft } from "lucide-react";
import type { CityData } from "../../types/city";

export function SidebarCityHeader({
  city,
  onSwitchCity,
}: {
  city: CityData;
  onSwitchCity: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <img src={city.logo} alt={`${city.name} logo`} className="h-14 w-14 object-contain" />
      <button
        type="button"
        onClick={onSwitchCity}
        className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        aria-label="Switch city"
        title="Switch city"
      >
        <ArrowRightLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
