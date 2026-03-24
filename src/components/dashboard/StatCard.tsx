import { motion } from "framer-motion";
import { MetricIcon } from "../ui/MetricIcon";
import { LiveValue } from "../ui/LiveValue";

export function StatCard({
  label,
  value,
  note,
  color = "#69bff3",
}: {
  label: string;
  value: string;
  note?: string;
  color?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className="aurora-card rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <MetricIcon label={label} color={color} />
      </div>
      <p className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none text-white">
        <LiveValue value={value} label={label} />
      </p>
      {note ? <p className="mt-3 text-sm text-slate-400">{note}</p> : null}
    </motion.div>
  );
}
