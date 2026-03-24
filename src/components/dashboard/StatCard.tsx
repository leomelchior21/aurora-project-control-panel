import { motion } from "framer-motion";

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="aurora-card rounded-[24px] p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none text-white">{value}</p>
      {note ? <p className="mt-3 text-sm text-slate-400">{note}</p> : null}
    </motion.div>
  );
}
