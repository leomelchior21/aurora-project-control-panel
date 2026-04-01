import { useState } from "react";
import type { CityData, LayerKey, SummaryMetric, SystemLayer } from "../../types/city";
import { getMetricTone } from "../../features/city-dashboard/utils/metricTone";
import { StatusBadge } from "../ui/StatusBadge";
import { StatCard } from "./StatCard";
import { ChartRenderer } from "../charts/ChartRenderer";
import { AlertCard } from "./AlertCard";
import { MetricIcon } from "../ui/MetricIcon";
import { LiveValue } from "../ui/LiveValue";

function getPrompt(city: CityData, layer: SystemLayer, metric: SummaryMetric) {
  const key = `${city.slug}-${layer.key}-${metric.label}`.toLowerCase();

  if (key.includes("petrolina-water")) {
    return "If the river is this close, why does distribution still protect wealthy districts before peripheral ones?";
  }

  if (key.includes("petrolina-energy")) {
    return "Who benefits when solar abundance exists, but the city remains locked into fossil dependence?";
  }

  if (key.includes("manaus-air")) {
    return "What disappeared from the center so that heat, humidity, and trapped air now amplify each other?";
  }

  if (key.includes("manaus-waste")) {
    return "When waste takes the water path, which system fails first: drainage, oxygen, or the neighborhood itself?";
  }

  if (key.includes("pelotas-housing")) {
    return "Is cold the main problem, or the architecture that lets paid heat escape?";
  }

  if (key.includes("pelotas-energy")) {
    return "How much of the electricity bill becomes real comfort, and how much disappears into leaks and losses?";
  }

  if (layer.status === "critical") {
    return "Where did this system fail before this number ever appeared?";
  }

  return "What hidden dependency is still missing from the way this number is usually discussed?";
}

export function SystemLayerView({
  city,
  layer,
  onSelectLayer,
}: {
  city: CityData;
  layer: SystemLayer;
  onSelectLayer?: (layer: LayerKey) => void;
}) {
  const [activeMetric, setActiveMetric] = useState<SummaryMetric | null>(null);
  const [nexusHot, setNexusHot] = useState(false);
  const hasPetrolinaNexus = city.slug === "petrolina" && layer.key === "water";

  return (
    <div className="grid gap-4">
      <section className="aurora-panel rounded-[30px] border border-white/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Immediate read</p>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">{layer.miniSummary ?? layer.state}</p>
          </div>
          <StatusBadge status={layer.status} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {layer.summaryStrip.map((item) => {
            const metricTone = getMetricTone(item.label, item.value);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveMetric((current) => (current?.label === item.label ? null : item))}
                className={`rounded-[20px] border px-4 py-3 text-left transition hover:-translate-y-0.5 ${metricTone.status === "critical" ? "critical-siren" : ""}`}
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
              </button>
            );
          })}
        </div>
        {activeMetric ? (
          <div className="mt-4 rounded-[22px] border border-amber-400/25 bg-black/30 p-4">
            <p className="text-[10px] uppercase tracking-[0.26em] text-amber-300">Investigative prompt</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">{getPrompt(city, layer, activeMetric)}</p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {layer.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
        ))}
      </section>

      {hasPetrolinaNexus ? (
        <section className={`aurora-panel rounded-[30px] border border-white/10 p-6 ${nexusHot ? "critical-siren" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300">Hidden dependency</p>
              <h3 className="mt-2 font-headline text-[clamp(1.4rem,2.2vw,2rem)] leading-none text-white">Water pulls energy. Energy pushes pressure back into water.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Hover the water charts and watch this card light up. That glow is the clue: pumping, treating, distributing, and losing water also consumes energy.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectLayer?.("energy")}
              className="rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-amber-100 transition hover:bg-amber-300/16"
            >
              Open Energy Layer
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {layer.charts.map((chart) => (
          <ChartRenderer
            key={`${layer.key}-${chart.title}`}
            chart={chart}
            onHoverChange={hasPetrolinaNexus ? setNexusHot : undefined}
          />
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
