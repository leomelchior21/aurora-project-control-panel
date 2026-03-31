import { motion } from "framer-motion";
import type { SystemStatus } from "../../types/city";
import { getStatusColor } from "../../features/city-dashboard/utils/status";

export function PulseIndicator({ status }: { status: SystemStatus }) {
  const color = getStatusColor(status);

  return (
    <div className="relative flex h-2.5 w-2.5 items-center justify-center">
      <motion.span
        className="absolute h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0.04, 0.8] }}
        transition={{ duration: status === "critical" ? 1.2 : 2, repeat: Infinity }}
      />
      <span className="relative z-10 h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: color, color }} />
    </div>
  );
}
