import { useState } from "react";
import { motion } from "framer-motion";
import { getMetricTone } from "../../features/city-dashboard/utils/metricTone";
import { MetricIcon } from "../ui/MetricIcon";
import { LiveValue } from "../ui/LiveValue";

function getInvestigationQuestion(label: string, status: "critical" | "attention" | "nominal") {
  const normalized = label.toLowerCase();

  if (/water|sewage|river|drain|igarap/.test(normalized)) {
    return "Where did this water system fail before it reached this point?";
  }

  if (/energy|solar|demand|peak|cost|loss|lighting/.test(normalized)) {
    return "Which hidden dependency is pushing this energy burden upward?";
  }

  if (/heat|temperature|humidity|mold|risk|air/.test(normalized)) {
    return "What makes this environment more hostile than the main number alone suggests?";
  }

  return status === "critical" ? "Where did this system fail?" : "What hidden dependency is present here?";
}

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
  const [promptOpen, setPromptOpen] = useState(false);
  const isInvestigative = tone.status !== "nominal";

  return (
    <motion.button
      type="button"
      onClick={() => isInvestigative && setPromptOpen((current) => !current)}
      whileHover={{ y: -4 }}
      className={`aurora-card w-full rounded-[24px] border p-5 text-left ${tone.status === "critical" ? "critical-siren" : ""}`}
      aria-expanded={isInvestigative ? promptOpen : undefined}
      aria-label={`${label}: ${value}`}
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
      {isInvestigative && promptOpen ? (
        <div className="mt-4 rounded-[18px] border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300">Investigative prompt</p>
          <p className="mt-2 text-sm text-slate-200">{getInvestigationQuestion(label, tone.status)}</p>
        </div>
      ) : null}
    </motion.button>
  );
}
