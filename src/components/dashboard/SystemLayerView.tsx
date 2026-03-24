import type { SystemLayer } from "../../types/city";
import { StatusBadge } from "../ui/StatusBadge";
import { StatCard } from "./StatCard";
import { ChartRenderer } from "../charts/ChartRenderer";
import { AlertCard } from "./AlertCard";

export function SystemLayerView({ layer }: { layer: SystemLayer }) {
  return (
    <div className="grid gap-4">
      <section className="aurora-panel rounded-[30px] border border-white/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">At A Glance</p>
            {layer.miniSummary ? <p className="mt-3 max-w-3xl text-sm text-slate-300">{layer.miniSummary}</p> : null}
          </div>
          <StatusBadge status={layer.status} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {layer.summaryStrip.map((item) => (
            <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {layer.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {layer.charts.map((chart) => (
          <ChartRenderer key={`${layer.key}-${chart.title}`} chart={chart} />
        ))}
      </section>

      {layer.alerts?.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {layer.alerts.map((alert) => (
            <AlertCard key={alert.title} title={alert.title} description={alert.description} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
