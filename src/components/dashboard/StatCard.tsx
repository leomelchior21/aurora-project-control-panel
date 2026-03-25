import { motion } from "framer-motion";
import { getMetricTone } from "../../features/city-dashboard/utils/metricTone";
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
  const tone = getMetricTone(label, value);
  const cardColor = color ?? tone.color;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="aurora-card rounded-[24px] border p-5"
      style={{
        borderColor: `${cardColor}33`,
        background: `linear-gradient(180deg, rgba(9,16,30,0.94), rgba(5,10,20,0.96)), linear-gradient(140deg, ${cardColor}20, transparent 42%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${cardColor}10, 0 20px 50px rgba(2,6,23,0.34)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <MetricIcon label={label} color={cardColor} />
      </div>
      <p className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none text-white">
        <LiveValue value={value} label={label} />
      </p>
      {note ? <p className="mt-3 text-sm text-slate-400">{note}</p> : null}
    </motion.div>
  );
}
