import type { SystemStatus } from "../../types/city";
import { getStatusColor, getStatusLabel } from "../../features/city-dashboard/utils/status";
import { PulseIndicator } from "./PulseIndicator";

export function StatusBadge({ status }: { status: SystemStatus }) {
  const color = getStatusColor(status);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] ${status === "critical" ? "critical-siren" : ""}`}
      style={{ borderColor: `${color}88`, color, background: `linear-gradient(135deg, ${color}18, rgba(255,255,255,0.02))` }}
    >
      <PulseIndicator status={status} />
      <span>{getStatusLabel(status)}</span>
    </div>
  );
}
