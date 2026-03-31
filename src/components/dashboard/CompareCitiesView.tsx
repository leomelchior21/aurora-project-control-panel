import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cityCollection } from "../../data/cities/index";
import { ChartRenderer } from "../charts/ChartRenderer";
import { StatusBadge } from "../ui/StatusBadge";
import { getStatusColor } from "../../features/city-dashboard/utils/status";
import type { ChartSpec, CityData, LayerKey, SystemLayer, SystemStatus } from "../../types/city";
import { chartGridColor, chartTextColor, chartTooltipStyle } from "../../lib/chartTheme";
import { cn } from "../../lib/utils";

const systemOrder = [
  "temperature",
  "water",
  "air",
  "sun",
  "wind",
  "energy",
  "waste",
  "housing",
  "transportation",
  "biodiversity",
] as const satisfies ReadonlyArray<Exclude<SystemLayer["key"], "compare-cities">>;

const statusScore: Record<SystemStatus, number> = {
  critical: 92,
  attention: 64,
  nominal: 32,
};

function getLayer(city: CityData, key: SystemLayer["key"]) {
  return city.layers.find((layer) => layer.key === key);
}

function getCompareKeys() {
  return systemOrder.filter((key) => cityCollection.some((city) => getLayer(city, key)));
}

function citySummary(city: CityData) {
  const critical = city.layers.filter((layer) => layer.status === "critical").length;
  const attention = city.layers.filter((layer) => layer.status === "attention").length;
  const topLayer = city.layers.find((layer) => layer.status === "critical") ?? city.layers[0];

  return { critical, attention, topLayer };
}

function layerPressureScore(layer?: SystemLayer) {
  if (!layer) return null;
  return statusScore[layer.status];
}

function getMatrixTone(value: number | null) {
  if (value === null) return { label: "Sem dado", color: "rgba(141,152,168,0.9)" };
  if (value >= 80) return { label: "Crítico", color: getStatusColor("critical") };
  if (value >= 50) return { label: "Atenção", color: getStatusColor("attention") };
  return { label: "Estável", color: getStatusColor("nominal") };
}

function makeCompareCharts(): ChartSpec[] {
  const pressureBarData = cityCollection.map((city: CityData) => {
    const critical = city.layers.filter((layer) => layer.status === "critical").length;
    const attention = city.layers.filter((layer) => layer.status === "attention").length;
    return { label: city.name, critical, attention };
  });

  const stressAverageData = cityCollection.map((city: CityData) => {
    const average = Math.round(city.layers.reduce((sum: number, layer: SystemLayer) => sum + statusScore[layer.status], 0) / city.layers.length);
    return { label: city.name, value: average };
  });

  return [
    {
      type: "stacked-bar",
      title: "Mistura de pressão",
      subtitle: "Camadas críticas e em atenção por cidade",
      data: pressureBarData,
      series: [
        { key: "critical", label: "Crítico", color: getStatusColor("critical") },
        { key: "attention", label: "Atenção", color: getStatusColor("attention") },
      ],
    },
    {
      type: "bar",
      title: "Pressão média publicada",
      subtitle: "Severidade média deste recorte",
      data: stressAverageData,
      series: [{ key: "value", label: "Pressão", color: "#FFBF00" }],
    },
  ];
}

function CompactMatrixPanel({ compareKeys }: { compareKeys: Array<Exclude<LayerKey, "mission-brief" | "compare-cities">> }) {
  const [mode, setMode] = useState<"grid" | "strips">("grid");

  return (
    <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Leitura cruzada</p>
          <h3 className="mt-2 text-2xl text-white">Matriz de pressão</h3>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {[
            { key: "grid", label: "Grade" },
            { key: "strips", label: "Faixas" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key as "grid" | "strips")}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition",
                mode === item.key ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-2.5">
        {compareKeys.map((key) => {
          const referenceLayer = cityCollection.find((city) => getLayer(city, key))?.layers.find((layer) => layer.key === key);
          const label = referenceLayer?.label ?? key;
          const entries = cityCollection.map((city: CityData) => {
            const layer = getLayer(city, key);
            const value = layerPressureScore(layer);
            return { city, layer, value, tone: getMatrixTone(value) };
          });

          return (
            <div key={key} className="grid grid-cols-[110px_1fr] items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
              {mode === "grid" ? (
                <div className="grid gap-2 md:grid-cols-3">
                  {entries.map(({ city, value, tone }) => (
                    <div
                      key={city.slug}
                      className="rounded-[14px] border px-3 py-3"
                      style={{
                        borderColor: `${tone.color}33`,
                        background: value === null ? "rgba(255,255,255,0.02)" : `linear-gradient(180deg, ${tone.color}1f, rgba(255,255,255,0.02))`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] uppercase tracking-[0.18em] text-slate-200">{city.name}</span>
                        <span className="text-sm font-semibold text-white">{value ?? "—"}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.color }} />
                        <span className="text-[9px] uppercase tracking-[0.16em] text-slate-400">{tone.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-1.5">
                  {entries.map(({ city, value, tone }) => (
                    <div key={city.slug} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="min-w-[68px] text-[9px] uppercase tracking-[0.18em] text-slate-300">{city.name}</div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: value === null ? "8%" : `${value}%`,
                              background: value === null ? "rgba(141,152,168,0.35)" : `linear-gradient(90deg, ${tone.color}, ${tone.color}aa)`,
                            }}
                          />
                        </div>
                        <div className="w-10 text-right text-xs font-semibold text-white">{value ?? "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SystemCompareGraphic({
  entries,
  systemKey,
}: {
  entries: Array<{ city: CityData; layer?: SystemLayer }>;
  systemKey: Exclude<LayerKey, "mission-brief" | "compare-cities">;
}) {
  const available = entries.filter((entry): entry is { city: CityData; layer: SystemLayer } => Boolean(entry.layer));

  if (!available.length) {
    return <p className="text-sm text-slate-400">Nenhum dado publicado para este eixo.</p>;
  }

  const values = available.map(({ city, layer }) => ({
    label: city.name,
    value: layerPressureScore(layer) ?? 0,
    color: city.accent,
  }));

  if (systemKey === "temperature") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={values} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={chartGridColor} vertical={false} />
          <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
          <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={28} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="#FF3131" strokeWidth={3} dot={{ r: 5, fill: "#FF3131" }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (systemKey === "water") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={values} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={chartGridColor} vertical={false} />
          <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
          <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={28} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="#FFBF00" fill="#FFBF00" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (systemKey === "energy") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={values} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={chartGridColor} vertical={false} />
          <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
          <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={28} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {values.map((item) => (
              <Cell key={item.label} fill={item.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="grid gap-3">
      {values.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-white">{item.label}</p>
            <p className="text-sm text-slate-300">{item.value}</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompareCitiesView() {
  const charts = makeCompareCharts();
  const compareKeys = useMemo(() => getCompareKeys(), []);

  return (
    <div className="grid gap-4">
      <section className="aurora-panel rounded-[28px] border border-white/10 p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300">Sem resposta pronta</p>
        <h3 className="mt-2 font-headline text-[clamp(1.8rem,3vw,2.8rem)] leading-none text-white">Compare as pressões, não procure conforto.</h3>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
          Cada cidade publica só os eixos mais expostos deste recorte. Onde houver vazio, leia como ausência de dado publicado e não como ausência de problema.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {cityCollection.map((city) => {
          const summary = citySummary(city);

          return (
            <div
              key={city.slug}
              className="rounded-[28px] border p-5"
              style={{
                borderColor: `${city.accent}33`,
                background: `linear-gradient(180deg, rgba(16,16,18,0.94), rgba(9,10,12,0.98)), linear-gradient(140deg, ${city.accent}18, transparent 48%)`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={city.logo} alt={`${city.name} logo`} className="h-14 w-14 object-contain" />
                  <div>
                    <h3 className="text-xl text-white">{city.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{city.oneLineDescription}</p>
                  </div>
                </div>
                <StatusBadge status={summary.critical >= 1 ? "critical" : "attention"} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Camadas críticas</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{summary.critical}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Em atenção</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{summary.attention}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Maior pressão</p>
                  <p className="mt-3 text-lg font-semibold text-white">{summary.topLayer.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartRenderer chart={charts[0]} />
        <ChartRenderer chart={charts[1]} />
      </section>

      <CompactMatrixPanel compareKeys={compareKeys} />

      <section className="grid gap-4 xl:grid-cols-2">
        {compareKeys.map((key) => {
          const entries = cityCollection.map((city: CityData) => ({ city, layer: getLayer(city, key) }));
          const label = entries.find((entry) => entry.layer)?.layer?.label ?? key;

          return (
            <div key={key} className="aurora-panel rounded-[28px] border border-white/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Mapa cruzado</p>
                  <h3 className="mt-2 text-xl text-white">{label}</h3>
                </div>
              </div>

              <div className="mt-5">
                <SystemCompareGraphic entries={entries} systemKey={key} />
              </div>

              <div className="mt-5 grid gap-3">
                {entries.map(({ city, layer }) => (
                  <div
                    key={`${city.slug}-${key}`}
                    className="flex items-center justify-between rounded-[20px] border px-4 py-4"
                    style={{
                      borderColor: `${getStatusColor(layer?.status ?? "nominal")}33`,
                      background: layer
                        ? `linear-gradient(140deg, ${getStatusColor(layer.status)}18, rgba(255,255,255,0.02) 55%)`
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={city.logo} alt={`${city.name} logo`} className="h-11 w-11 object-contain" />
                      <div>
                        <p className="text-base text-white">{city.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{layer ? layer.state : "Eixo não publicado neste recorte."}</p>
                      </div>
                    </div>
                    {layer ? <StatusBadge status={layer.status} /> : <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Sem dado</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
