import type { SystemStatus } from "../../types/city";
import { getStatusColor, getStatusLabel } from "../../features/city-dashboard/utils/status";
import { PulseIndicator } from "./PulseIndicator";

export function StatusBadge({ status }: { status: SystemStatus }) {
  const color = getStatusColor(status);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em]" style={{ borderColor: `${color}55`, color }}>
      <PulseIndicator status={status} />
      <span>{getStatusLabel(status)}</span>
    </div>
  );
}
