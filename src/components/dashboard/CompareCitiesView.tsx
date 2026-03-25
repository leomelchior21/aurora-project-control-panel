import { cityCollection } from "../../data/cities/index";
import { ChartRenderer } from "../charts/ChartRenderer";
import { StatusBadge } from "../ui/StatusBadge";
import { getStatusColor } from "../../features/city-dashboard/utils/status";
import type { ChartSpec, CityData, SystemLayer, SystemStatus } from "../../types/city";
import { chartTooltipStyle } from "../../lib/chartTheme";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const systemOrder: Array<SystemLayer["key"]> = [
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
];

const statusScore: Record<SystemStatus, number> = {
  critical: 92,
  attention: 61,
  nominal: 28,
};

function getLayer(city: CityData, key: SystemLayer["key"]) {
  return city.layers.find((layer) => layer.key === key);
}

function extractNumeric(value: string) {
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function compareMetricValue(layer: SystemLayer) {
  if (layer.key === "waste") return extractNumeric(layer.stats[1]?.value ?? `${statusScore[layer.status]}`);

  const source = layer.stats[0]?.value ?? "";
  const numeric = extractNumeric(source);

  if (numeric !== 0 || /0/.test(source)) return numeric;

  return statusScore[layer.status];
}

function citySummary(city: CityData) {
  const critical = city.layers.filter((layer) => layer.status === "critical").length;
  const attention = city.layers.filter((layer) => layer.status === "attention").length;
  const topLayer = city.layers.find((layer) => layer.status === "critical") ?? city.layers[0];

  return { critical, attention, topLayer };
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
      title: "System stress mix",
      subtitle: "Critical and attention systems by city",
      data: pressureBarData,
      series: [
        { key: "critical", label: "Critical", color: getStatusColor("critical") },
        { key: "attention", label: "Attention", color: getStatusColor("attention") },
      ],
    },
    {
      type: "bar",
      title: "Average city stress",
      subtitle: "Cross-city pressure score",
      data: stressAverageData,
      series: [{ key: "value", label: "Stress", color: "#69bff3" }],
    },
    {
      type: "heatmap",
      title: "System comparison matrix",
        subtitle: "Where each city struggles most",
        rows: systemOrder.map((key) => ({
          label: getLayer(cityCollection[0], key)?.label ?? key,
          cells: cityCollection.map((city: CityData) => ({
            label: city.name,
            value: statusScore[getLayer(city, key)?.status ?? "attention"],
          })),
      })),
    },
  ];
}

function SystemCompareGraphic({ layers }: { layers: Array<{ city: CityData; layer: SystemLayer }> }) {
  const key = layers[0].layer.key;
  const values = layers.map(({ city, layer }) => ({
    label: city.name,
    value: compareMetricValue(layer),
    status: layer.status,
    color: city.accent,
  }));

  const sharedAxis = (
    <>
      <XAxis dataKey="label" stroke="rgba(170,182,204,0.8)" tickLine={false} axisLine={false} />
      <YAxis stroke="rgba(170,182,204,0.8)" tickLine={false} axisLine={false} width={28} />
      <Tooltip contentStyle={chartTooltipStyle} />
    </>
  );

  if (key === "temperature") {
    return (
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={values} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          {sharedAxis}
          <Line type="monotone" dataKey="value" stroke="#ff8b6e" strokeWidth={3} dot={{ r: 5, fill: "#ff8b6e" }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (key === "water") {
    return (
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={values} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          {sharedAxis}
          <Area type="monotone" dataKey="value" stroke="#69bff3" fill="#69bff3" fillOpacity={0.22} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (key === "air") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {values.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-white/10 p-4 text-center" style={{ background: `linear-gradient(180deg, ${getStatusColor(item.status)}22, rgba(255,255,255,0.02))` }}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <div className="mt-3 h-16 rounded-2xl" style={{ background: `linear-gradient(180deg, ${getStatusColor(item.status)}${Math.round((Math.min(Math.abs(item.value), 180) / 180) * 99).toString(16).padStart(2, "0")}, rgba(255,255,255,0.04))` }} />
            <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (key === "sun") {
    return (
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Pie data={values} dataKey="value" nameKey="label" innerRadius={44} outerRadius={72} paddingAngle={4}>
            {values.map((item) => (
              <Cell key={item.label} fill={item.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (key === "wind") {
    return (
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={values} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
          <XAxis type="number" stroke="rgba(170,182,204,0.8)" tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="label" stroke="rgba(170,182,204,0.8)" tickLine={false} axisLine={false} width={70} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="value" radius={[0, 10, 10, 0]}>
            {values.map((item) => (
              <Cell key={item.label} fill={item.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (key === "energy") {
    const data = layers.map(({ city, layer }) => ({
      label: city.name,
      fossil: extractNumeric(layer.stats[0]?.value ?? "0"),
      outages: Math.max(8, extractNumeric(layer.stats[3]?.value ?? "0") * 12),
    }));

    return (
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          {sharedAxis}
          <Bar dataKey="fossil" stackId="energy" fill={getStatusColor("critical")} radius={[8, 8, 0, 0]} />
          <Bar dataKey="outages" stackId="energy" fill="#f7b84b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (key === "waste") {
    const average = Math.round(values.reduce((sum, item) => sum + item.value, 0) / values.length);

    return (
      <ResponsiveContainer width="100%" height={170}>
        <RadialBarChart innerRadius="64%" outerRadius="100%" data={[{ value: average }]} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={14} fill={getStatusColor(average >= 60 ? "critical" : average >= 35 ? "attention" : "nominal")} />
          <Tooltip contentStyle={chartTooltipStyle} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }

  if (key === "housing") {
    return (
      <div className="grid gap-3">
        {values.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-white">{item.label}</p>
              <p className="text-sm text-slate-300">{item.value}%</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full" style={{ width: `${Math.max(6, Math.min(Math.abs(item.value), 100))}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (key === "transportation") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {values.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <div className="mt-4 flex h-20 items-end gap-1">
              {[0.45, 0.7, 0.95].map((multiplier, index) => (
                <div key={index} className="flex-1 rounded-t-full" style={{ height: `${Math.max(16, Math.min(item.value * multiplier, 100))}%`, background: `linear-gradient(180deg, ${item.color}, ${item.color}66)` }} />
              ))}
            </div>
            <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {values.map((item) => (
        <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white">{item.label}</p>
            <p className="text-sm text-slate-300">{item.value}</p>
          </div>
          <div className="mt-3 flex gap-1">
            {[0, 1, 2, 3, 4, 5].map((segment) => (
              <div
                key={segment}
                className="h-3 flex-1 rounded-full"
                style={{
                  background: segment < Math.max(1, Math.round(Math.min(Math.abs(item.value), 100) / 18))
                    ? `linear-gradient(90deg, ${item.color}, ${item.color}99)`
                    : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompareCitiesView() {
  const charts = makeCompareCharts();

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-3">
        {cityCollection.map((city) => {
          const summary = citySummary(city);

          return (
            <div
              key={city.slug}
              className="rounded-[28px] border p-5"
              style={{
                borderColor: `${city.accent}33`,
                background: `linear-gradient(180deg, rgba(9,16,30,0.9), rgba(5,10,20,0.95)), linear-gradient(140deg, ${city.accent}18, transparent 48%)`,
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
                <StatusBadge status={summary.critical >= 6 ? "critical" : "attention"} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Critical systems</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{summary.critical}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Attention systems</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{summary.attention}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Highest pressure</p>
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

      <section>
        <ChartRenderer chart={charts[2]} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {systemOrder.map((key) => {
          const layers: Array<{ city: CityData; layer: SystemLayer }> = cityCollection.map((city: CityData) => ({ city, layer: getLayer(city, key)! }));

          return (
            <div key={key} className="aurora-panel rounded-[28px] border border-white/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Cross-city system map</p>
                  <h3 className="mt-2 text-xl text-white">{layers[0].layer.label}</h3>
                </div>
              </div>

              <div className="mt-5">
                <SystemCompareGraphic layers={layers} />
              </div>

              <div className="mt-5 grid gap-3">
                {layers.map(({ city, layer }: { city: CityData; layer: SystemLayer }) => (
                  <div
                    key={`${city.slug}-${layer.key}`}
                    className="flex items-center justify-between rounded-[20px] border px-4 py-4"
                    style={{
                      borderColor: `${getStatusColor(layer.status)}33`,
                      background: `linear-gradient(140deg, ${getStatusColor(layer.status)}18, rgba(255,255,255,0.02) 55%)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={city.logo} alt={`${city.name} logo`} className="h-11 w-11 object-contain" />
                      <div>
                        <p className="text-base text-white">{city.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{layer.state}</p>
                      </div>
                    </div>
                    <StatusBadge status={layer.status} />
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
