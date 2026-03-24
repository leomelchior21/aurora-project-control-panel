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
        animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <span className="relative z-10 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}
