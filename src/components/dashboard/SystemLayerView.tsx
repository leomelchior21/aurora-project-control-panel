import type { SystemLayer } from "../../types/city";
import { getMetricTone } from "../../features/city-dashboard/utils/metricTone";
import { StatusBadge } from "../ui/StatusBadge";
import { StatCard } from "./StatCard";
import { ChartRenderer } from "../charts/ChartRenderer";
import { AlertCard } from "./AlertCard";
import { MetricIcon } from "../ui/MetricIcon";
import { LiveValue } from "../ui/LiveValue";

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
          {layer.summaryStrip.map((item) => {
            const metricTone = getMetricTone(item.label, item.value);

            return (
            <div
              key={item.label}
              className="rounded-[20px] border px-4 py-3"
              style={{
                borderColor: `${metricTone.color}33`,
                background: `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)), linear-gradient(140deg, ${metricTone.color}18, transparent 48%)`,
                boxShadow: `0 0 0 1px ${metricTone.color}10 inset`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <MetricIcon label={item.label} color={metricTone.color} />
              </div>
              <p className="mt-3 text-base font-semibold text-white">
                <LiveValue value={item.value} label={item.label} />
              </p>
            </div>
          )})}
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
