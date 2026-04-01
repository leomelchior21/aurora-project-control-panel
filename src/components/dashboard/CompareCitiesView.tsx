import { useMemo, useState } from "react";
import { cityCollection } from "../../data/cities/index";
import { ChartRenderer } from "../charts/ChartRenderer";
import { StatusBadge } from "../ui/StatusBadge";
import { getStatusColor } from "../../features/city-dashboard/utils/status";
import type { ChartSpec, CityData, LayerKey, SystemLayer, SystemStatus } from "../../types/city";
import { cn } from "../../lib/utils";

const systemOrder = ["energy", "water", "climate", "air", "waste", "mobility", "biodiversity", "social"] as const satisfies ReadonlyArray<
  Exclude<LayerKey, "mission-brief" | "compare-cities">
>;

const statusScore: Record<SystemStatus, number> = {
  critical: 92,
  attention: 64,
  nominal: 32,
};

const layerNarratives: Record<Exclude<LayerKey, "mission-brief" | "compare-cities">, string> = {
  energy: "Compare how heat in Petrolina, humidity in Manaus, and winter in Pelotas all turn energy into a pressure multiplier.",
  water: "Watch how abundance means different things: scarcity in the semi-arid, contamination in the rainforest, and damp drainage stress in the south.",
  climate: "Climate is not the same as weather. It becomes urban pressure only after design choices amplify it.",
  air: "Air pressure reveals the body's version of the city: dust, humidity, smoke, ventilation, and refuge.",
  waste: "Waste becomes a comparative lens because leakage quickly turns into water stress, odor, flood risk, and distrust.",
  mobility: "Travel should be read as time plus exposure: heat, humidity, wind, shelter, and reliability all matter.",
  biodiversity: "This layer shows whether ecology is still functioning like infrastructure or only surviving as fragments.",
  social: "Public posts expose where system averages stop matching what residents actually feel in daily life.",
};

function getLayer(city: CityData, key: Exclude<LayerKey, "mission-brief" | "compare-cities">) {
  return city.layers.find((layer) => layer.key === key) as SystemLayer;
}

function extractNumber(value: string) {
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function makeStatusChart(entries: Array<{ city: CityData; layer: SystemLayer }>): ChartSpec {
  return {
    type: "bar",
    title: "Pressure Ladder",
    subtitle: "Status converted into a shared severity score",
    data: entries.map(({ city, layer }) => ({ label: city.name, value: statusScore[layer.status] })),
    series: [{ key: "value", label: "Severity", color: "#FF3131" }],
  };
}

function makeMetricChart(entries: Array<{ city: CityData; layer: SystemLayer }>): ChartSpec {
  const labels = entries[0].layer.summaryStrip.map((metric) => metric.label);
  return {
    type: "line",
    title: "Metric Drift",
    subtitle: "How the same four signals bend across the three cities",
    data: labels.map((label, index) => ({
      label,
      [entries[0].city.name]: extractNumber(entries[0].layer.summaryStrip[index].value),
      [entries[1].city.name]: extractNumber(entries[1].layer.summaryStrip[index].value),
      [entries[2].city.name]: extractNumber(entries[2].layer.summaryStrip[index].value),
    })),
    series: entries.map(({ city }) => ({ key: city.name, label: city.name, color: city.accent })),
  };
}

function MetricSwitchboard({ entries }: { entries: Array<{ city: CityData; layer: SystemLayer }> }) {
  const labels = entries[0].layer.summaryStrip.map((metric) => metric.label);

  return (
    <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#7D8590]">Metric switchboard</p>
        <h3 className="mt-2 text-2xl text-white">Same layer, different pressure shapes</h3>
      </div>

      <div className="grid gap-3">
        {labels.map((label, index) => (
          <div key={label} className="grid gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 xl:grid-cols-[180px_1fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Shared signal</p>
              <p className="mt-2 text-sm text-white">{label}</p>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {entries.map(({ city, layer }) => (
                <div
                  key={`${city.slug}-${label}`}
                  className="rounded-[18px] border px-4 py-3"
                  style={{
                    borderColor: `${city.accent}33`,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), linear-gradient(140deg, ${city.accent}14, transparent 52%)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">{city.name}</p>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getStatusColor(layer.status) }} />
                  </div>
                  <p className="mt-3 text-xl font-semibold text-white">{layer.summaryStrip[index].value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FieldNoteBraid({ entries }: { entries: Array<{ city: CityData; layer: SystemLayer }> }) {
  return (
    <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#7D8590]">Field note braid</p>
        <h3 className="mt-2 text-2xl text-white">Three local readings in one board</h3>
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {entries.map(({ city, layer }) => (
          <div
            key={city.slug}
            className="rounded-[22px] border p-4"
            style={{
              borderColor: `${city.accent}33`,
              background: `linear-gradient(180deg, rgba(16,18,24,0.96), rgba(9,12,16,0.98)), linear-gradient(140deg, ${city.accent}14, transparent 48%)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg text-white">{city.name}</p>
                <p className="mt-1 text-sm text-slate-300">{layer.state}</p>
              </div>
              <StatusBadge status={layer.status} />
            </div>
            <div className="mt-4 space-y-3">
              {layer.table.rows.map((row) => (
                <div key={row.label} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white">{row.label}</p>
                    <p className="text-sm font-semibold text-amber-200">{row.value}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompareCitiesView() {
  const [activeKey, setActiveKey] = useState<Exclude<LayerKey, "mission-brief" | "compare-cities">>("energy");
  const entries = useMemo(() => cityCollection.map((city) => ({ city, layer: getLayer(city, activeKey) })), [activeKey]);
  const statusChart = useMemo(() => makeStatusChart(entries), [entries]);
  const metricChart = useMemo(() => makeMetricChart(entries), [entries]);

  return (
    <div className="grid gap-4">
      <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#FFBF00]">Compare mode</p>
        <h3 className="mt-2 font-headline text-[clamp(1.8rem,3vw,2.8rem)] leading-none text-white">Switch layers. Find the repeated logic.</h3>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
          Every city now publishes the same eight layers. That makes comparison less about missing data and more about how the same system fails differently.
        </p>
      </section>

      <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
        <div className="flex flex-wrap gap-2">
          {systemOrder.map((key) => {
            const active = key === activeKey;
            const layer = entries[0].city.layers.find((item) => item.key === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition",
                  active ? "border-amber-300/40 bg-amber-300/12 text-white" : "border-white/10 bg-white/[0.03] text-slate-300 hover:text-white",
                )}
              >
                {layer?.label ?? key}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <MetricSwitchboard entries={entries} />

        <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#7D8590]">Common enemy</p>
          <h3 className="mt-2 text-2xl text-white">{entries[0].layer.label}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{layerNarratives[activeKey]}</p>

          <div className="mt-5 space-y-3">
            {entries.map(({ city, layer }) => (
              <div
                key={city.slug}
                className="rounded-[20px] border px-4 py-4"
                style={{
                  borderColor: `${city.accent}33`,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), linear-gradient(140deg, ${city.accent}14, transparent 52%)`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base text-white">{city.name}</p>
                  <StatusBadge status={layer.status} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{layer.miniSummary ?? layer.state}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartRenderer chart={statusChart} />
        <ChartRenderer chart={metricChart} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {entries.map(({ city, layer }) => (
          <div
            key={city.slug}
            className="rounded-[28px] border p-5"
            style={{
              borderColor: `${city.accent}33`,
              background: `linear-gradient(180deg, rgba(16,18,24,0.96), rgba(9,12,16,0.98)), linear-gradient(140deg, ${city.accent}18, transparent 48%)`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl text-white">{city.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{layer.state}</p>
              </div>
              <StatusBadge status={layer.status} />
            </div>
            <div className="mt-5 grid gap-3">
              {layer.summaryStrip.map((metric) => (
                <div key={`${city.slug}-${metric.label}`} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                    <p className="text-sm font-semibold text-white">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <FieldNoteBraid entries={entries} />
    </div>
  );
}
