import { cityCollection } from "../../data/cities/index";
import { ChartRenderer } from "../charts/ChartRenderer";
import { StatusBadge } from "../ui/StatusBadge";
import { getStatusColor } from "../../features/city-dashboard/utils/status";
import type { ChartSpec, CityData, SystemLayer, SystemStatus } from "../../types/city";

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
