import { useEffect, useState } from "react";
import type { CityData, CitySlug, ClimateMetric, DashboardMetric } from "../types";
import { cityLogos, cityThemes } from "../data/logos";
import { cityLayerConfigs, type DashboardLayer } from "../data/cityLayerConfigs";
import { SystemDependencyMap } from "./SystemDependencyMap";

interface CityDashboardProps {
  city: CityData;
  cities: CityData[];
  onBack: () => void;
  onSelectCity: (slug: CitySlug) => void;
}

const layers: Array<{ id: DashboardLayer; label: string; icon: string; nodeId?: string }> = [
  { id: "home", label: "Home", icon: "grid", nodeId: "energy" },
  { id: "climate", label: "Climate", icon: "sun", nodeId: "energy" },
  { id: "water", label: "Water", icon: "drop", nodeId: "water" },
  { id: "air", label: "Air", icon: "air", nodeId: "housing" },
  { id: "energy", label: "Energy", icon: "bolt", nodeId: "energy" },
  { id: "mobility", label: "Mobility", icon: "route", nodeId: "mobility" },
  { id: "waste", label: "Waste", icon: "waste", nodeId: "housing" },
  { id: "biodiversity", label: "Biodiversity", icon: "leaf", nodeId: "biodiversity" },
  { id: "compare", label: "Compare", icon: "compare" },
];

function metricById(city: CityData, id: DashboardMetric["id"]) {
  return city.dashboardMetrics.find((metric) => metric.id === id)!;
}

type SeasonalMetricKey = "heat" | "rainfall" | "humidity" | "thermal_comfort";

const seasonalMetricLabels: Record<SeasonalMetricKey, string> = {
  heat: "Heat",
  rainfall: "Rainfall",
  humidity: "Humidity",
  thermal_comfort: "Thermal Comfort",
};

const heatIndexToCelsius = (value: number) => Math.round(7 + value * 0.35);

const formatClimateValue = (metricId: ClimateMetric["id"] | SeasonalMetricKey, value: number) =>
  metricId === "heat" ? `${heatIndexToCelsius(value)}°C` : `${value}`;

const seasonalPatterns: Record<SeasonalMetricKey, number[]> = {
  heat: [0.92, 0.97, 1, 1.04, 1.08, 1.02],
  rainfall: [0.78, 0.84, 0.92, 1, 0.9, 0.82],
  humidity: [0.88, 0.93, 0.97, 1, 0.95, 0.9],
  thermal_comfort: [0.86, 0.9, 0.94, 1, 0.92, 0.88],
};

const climateSummaryByProfile = (metrics: ClimateMetric[]) => {
  const lookup = Object.fromEntries(metrics.map((metric) => [metric.id, metric.value])) as Record<ClimateMetric["id"], number>;

  if (lookup.heat >= 80 && lookup.rainfall <= 30) {
    return "Extreme heat and low rainfall define the climate pressure here.";
  }

  if (lookup.humidity >= 85 && lookup.rainfall >= 80) {
    return "High humidity and rainfall dominate this climate profile, while wind remains moderate.";
  }

  if (lookup.wind >= 70) {
    return "Wind strongly shapes comfort here, even when other climate signals stay moderate.";
  }

  return "Climate signals are mixed here, so comfort changes with both moisture and temperature.";
};

const seasonalInsight = (metric: SeasonalMetricKey, points: Array<{ label: string; value: number }>) => {
  const sorted = [...points].sort((a, b) => b.value - a.value);
  const peak = sorted[0];

  switch (metric) {
    case "heat":
      return `Seasonal heat peaks around ${peak.label}, keeping thermal stress elevated through the year.`;
    case "rainfall":
      return `${peak.label} brings the strongest rainfall pulse, increasing water-related system pressure.`;
    case "humidity":
      return `Humidity builds toward ${peak.label}, which can reduce comfort and slow surface drying.`;
    default:
      return `Thermal comfort shifts most around ${peak.label}, showing when daily life feels easier or harder.`;
  }
};

const clamp100 = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function buildSeasonalSeries(city: CityData, metric: SeasonalMetricKey) {
  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  const sourceValue =
    metric === "thermal_comfort"
      ? city.raw.thermalComfort
      : metric === "heat"
        ? city.raw.heat
        : metric === "rainfall"
          ? city.raw.rainfall
          : city.raw.humidity;

  return months.map((label, index) => ({
    label,
    value:
      metric === "heat"
        ? heatIndexToCelsius(clamp100(sourceValue * seasonalPatterns[metric][index]))
        : clamp100(sourceValue * seasonalPatterns[metric][index]),
  }));
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 360;

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue}</>;
}

function SidebarIcon({ icon, active }: { icon: string; active: boolean }) {
  const stroke = active ? "#ffffff" : "#94a3b8";
  const className = "h-5 w-5 shrink-0";

  switch (icon) {
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      );
    case "drop":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M12 3c3 4 5 6.5 5 9.4A5 5 0 1 1 7 12.4C7 9.5 9 7 12 3Z" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z" />
        </svg>
      );
    case "air":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M4 9h10a3 3 0 1 0-3-3" />
          <path d="M2 13h15a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M5 17h9a2 2 0 1 1-2 2" />
        </svg>
      );
    case "route":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 18h4a4 4 0 0 0 4-4V8" />
        </svg>
      );
    case "waste":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M5 7h14" />
          <path d="M9 4h6" />
          <path d="M7 7l1 12h8l1-12" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M12 21v-8" />
          <path d="M7 13c0-4 4-7 10-8 0 6-3 10-7 10-1.7 0-3-.7-3-2Z" />
          <path d="M12 12c0-3-2-5-6-6 0 4 2 7 5 7" />
        </svg>
      );
    case "compare":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M6 18h4V8H6v10ZM14 18h4V4h-4v14Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
      );
  }
}

function MetricTile({ metric, color }: { metric: DashboardMetric; color: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[clamp(1.6rem,2vw,2.2rem)] font-semibold text-white">
          <AnimatedNumber value={metric.value} />
        </p>
        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${metric.value}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function CompactMetricRow({ metrics, color }: { metrics: DashboardMetric[]; color: string }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {metrics.map((metric) => (
        <MetricTile key={metric.id} metric={metric} color={color} />
      ))}
    </section>
  );
}

function LineChart({ data, color, title, subtitle }: { data: Array<{ label: string; value: number }>; color: string; title: string; subtitle: string }) {
  const chartHeight = 100;
  const chartWidth = 100;
  const points = data.map((point, index) => {
    const x = (index / Math.max(1, data.length - 1)) * chartWidth;
    const y = chartHeight - point.value;
    return { ...point, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [`0,${chartHeight}`, ...points.map((point) => `${point.x},${point.y}`), `${chartWidth},${chartHeight}`].join(" ");
  const ticks = [25, 50, 75];

  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
          <h3 className="text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="h-44 w-full overflow-visible">
        {ticks.map((tick) => (
          <line key={tick} x1="0" y1={chartHeight - tick} x2="100" y2={chartHeight - tick} stroke="rgba(148,163,184,0.14)" strokeWidth="0.8" />
        ))}
        <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
        <polygon points={area} fill={`${color}20`} />
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={polyline} />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="2.6" fill={color} />
            <circle cx={point.x} cy={point.y} r="5" fill={`${color}25`} />
          </g>
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 sm:grid-cols-6">
        {data.map((point) => (
          <div key={point.label} className="rounded-xl border border-white/8 bg-white/[0.02] px-2 py-2">
            <p>{point.label}</p>
            <p className="mt-1 text-sm font-semibold text-white">{point.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({ data, title, subtitle, color }: { data: Array<{ label: string; value: number }>; title: string; subtitle: string; color: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
          <h3 className="text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="grid gap-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-sm text-slate-300">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecyclingPieChart({
  title,
  subtitle,
  data,
  colors,
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
  colors: string[];
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);
  const unrecycled = data.find((item) => item.label.toLowerCase() === "unrecycled")?.value ?? 0;
  let progressOffset = 0;

  return (
    <div className="p-1">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-4 xl:grid-cols-[240px_1fr] xl:items-center">
        <svg viewBox="0 0 120 120" className="mx-auto h-64 w-64 shrink-0">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
          {data.map((item, index) => {
            const segmentLength = (item.value / total) * circumference;
            const dashArray = `${segmentLength} ${circumference}`;
            const dashOffset = -progressOffset;
            progressOffset += segmentLength;

            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
              />
            );
          })}
          <text x="60" y="56" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700">
            {unrecycled}%
          </text>
          <text x="60" y="70" textAnchor="middle" fill="rgba(248,113,113,0.82)" fontSize="7.5">
            unrecycled
          </text>
          <text x="60" y="80" textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="6.5">
            to nature
          </text>
        </svg>

        <div className="grid gap-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
              <span className="text-xs font-semibold text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrganicReturnChart({
  title,
  subtitle,
  data,
  color,
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
  color: string;
}) {
  const points = data.map((item, index) => ({
    ...item,
    x: 34 + index * 46,
    y: 96 - item.value * 0.62,
  }));

  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
      <div className="mt-4">
        <svg viewBox="0 0 160 120" className="h-40 w-full">
          <defs>
            <marker id="organic-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0L6 3L0 6Z" fill={color} />
            </marker>
          </defs>
          {points.map((point, index) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="16" fill={`${color}1c`} stroke={color} strokeWidth="1.5" />
              <text x={point.x} y={point.y - 2} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="700">
                {point.value}
              </text>
              <text x={point.x} y={point.y + 26} textAnchor="middle" fill="rgba(226,232,240,0.82)" fontSize="8">
                {point.label}
              </text>
              {index < points.length - 1 ? (
                <path
                  d={`M${point.x + 16} ${point.y} C ${point.x + 26} ${point.y - 18}, ${points[index + 1].x - 26} ${points[index + 1].y - 18}, ${points[index + 1].x - 16} ${points[index + 1].y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  markerEnd="url(#organic-arrow)"
                />
              ) : null}
            </g>
          ))}
        </svg>
        <p className="text-sm text-slate-300">Organic material can move from food scraps back into soil support when the loop stays active.</p>
      </div>
    </div>
  );
}

function MultiToneRing({
  title,
  subtitle,
  data,
  colors,
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
  colors: string[];
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);
  let progressOffset = 0;

  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-4 xl:grid-cols-[140px_1fr] xl:items-center">
        <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32 shrink-0">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          {data.map((item, index) => {
            const segmentLength = (item.value / total) * circumference;
            const dashArray = `${segmentLength} ${circumference}`;
            const dashOffset = -progressOffset;
            progressOffset += segmentLength;

            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
              />
            );
          })}
        </svg>

        <div className="grid gap-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RingSummary({ title, value, color, subtitle }: { title: string; value: number; color: string; subtitle: string }) {
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
      <div className="mt-4 flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0">
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div>
          <p className="text-[clamp(1.8rem,2.2vw,2.5rem)] font-semibold text-white">
            <AnimatedNumber value={value} />
          </p>
          <p className="text-sm text-slate-300">Score out of 100</p>
        </div>
      </div>
    </div>
  );
}

function TextStack({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomInsightCards({
  cards,
}: {
  cards: Array<{ label: string; value: string; note: string; tone?: "positive" | "warning" | "neutral" }>;
}) {
  const iconForCard = (label: string, tone?: "positive" | "warning" | "neutral") => {
    const key = label.toLowerCase();
    if (key.includes("risk") || tone === "warning") {
      return <path d="M12 4 20 19H4L12 4Zm0 5v4m0 3h.01" />;
    }
    if (key.includes("system") || key.includes("source") || key.includes("energy")) {
      return <path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z" />;
    }
    if (key.includes("water")) {
      return <path d="M12 3c3 4 5 6.5 5 9.4A5 5 0 1 1 7 12.4C7 9.5 9 7 12 3Z" />;
    }
    if (key.includes("linked") || key.includes("cities")) {
      return <path d="M7 12h10M12 7v10M5 5h4v4H5zM15 15h4v4h-4z" />;
    }
    if (key.includes("air")) {
      return <path d="M4 9h10a3 3 0 1 0-3-3M2 13h15a2.5 2.5 0 1 1-2.5 2.5M5 17h9a2 2 0 1 1-2 2" />;
    }
    if (key.includes("waste") || key.includes("recycled") || key.includes("organic")) {
      return <path d="M8 6h8l2 3-6 11L6 9l2-3Zm0 0 4 4 4-4" />;
    }
    if (key.includes("comfort") || key.includes("heat")) {
      return <path d="M12 3v10a4 4 0 1 0 4 4" />;
    }
    return <path d="M5 12h14M12 5v14" />;
  };

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const badgeClass =
          card.tone === "positive"
            ? "bg-emerald-100 text-emerald-600"
            : card.tone === "warning"
              ? "bg-rose-100 text-rose-500"
              : "bg-slate-200 text-slate-500";

        return (
          <div key={`${card.label}-${card.value}`} className="rounded-[26px] bg-white p-5 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {iconForCard(card.label, card.tone)}
                </svg>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeClass}`}>{card.tone ?? "neutral"}</span>
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-600">{card.label}</p>
            <p className="mt-2 text-[clamp(2rem,2.4vw,2.8rem)] font-bold leading-none text-slate-950">{card.value}</p>
            <p className="mt-3 max-w-[22ch] text-[15px] leading-6 text-slate-600">{card.note}</p>
          </div>
        );
      })}
    </section>
  );
}

function ClimatePanel({
  metrics,
  city,
  color,
}: {
  metrics: ClimateMetric[];
  city: CityData;
  color: string;
}) {
  const [activeSeasonalMetric, setActiveSeasonalMetric] = useState<SeasonalMetricKey>("heat");
  const series = buildSeasonalSeries(city, activeSeasonalMetric);
  const maxPoint = series.reduce((best, point) => (point.value > best.value ? point : best), series[0]);
  const minPoint = series.reduce((best, point) => (point.value < best.value ? point : best), series[0]);
  const chartHeight = 100;
  const chartWidth = 90;
  const chartStartX = 10;
  const chartMin = activeSeasonalMetric === "heat" ? Math.floor((Math.min(...series.map((point) => point.value)) - 2) / 5) * 5 : 0;
  const chartMax = activeSeasonalMetric === "heat" ? Math.ceil((Math.max(...series.map((point) => point.value)) + 2) / 5) * 5 : 100;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const points = series.map((point, index) => ({
    ...point,
    x: chartStartX + (index / Math.max(1, series.length - 1)) * chartWidth,
    y: chartHeight - ((point.value - chartMin) / chartRange) * chartHeight,
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [`${chartStartX},${chartHeight}`, ...points.map((point) => `${point.x},${point.y}`), `${chartStartX + chartWidth},${chartHeight}`].join(" ");
  const climateSummary = climateSummaryByProfile(metrics);
  const radii = [18, 32, 46, 60, 74];
  const seasonalTicks =
    activeSeasonalMetric === "heat"
      ? Array.from({ length: 5 }, (_, index) => chartMin + ((chartMax - chartMin) / 4) * index)
      : [20, 40, 60, 80, 100];

  return (
    <div className="grid gap-3 xl:grid-cols-[1.02fr_1.08fr]">
      <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
        <div className="mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Climate</p>
            <h3 className="text-[clamp(1rem,1.6vw,1.2rem)] font-semibold text-white">Climate signature</h3>
            <p className="mt-2 text-sm text-slate-300">Five core climate signals arranged as radial bars.</p>
          </div>
        </div>
        <div className="grid gap-5">
          <svg viewBox="0 0 260 260" className="mx-auto h-[clamp(16rem,30vw,21rem)] w-[clamp(16rem,30vw,21rem)]">
            {radii.map((radius, index) => (
              <g key={radius}>
                <circle cx="130" cy="130" r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1.2" />
                <text x="130" y={130 - radius + 10} fill="rgba(148,163,184,0.55)" fontSize="8" textAnchor="middle">
                  {(index + 1) * 20}
                </text>
              </g>
            ))}
            {metrics.map((metric, index) => {
              const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
              const barRadius = 18 + metric.value * 0.56;
              const innerX = 130 + Math.cos(angle) * 18;
              const innerY = 130 + Math.sin(angle) * 18;
              const outerX = 130 + Math.cos(angle) * barRadius;
              const outerY = 130 + Math.sin(angle) * barRadius;
              const labelX = 130 + Math.cos(angle) * 96;
              const labelY = 130 + Math.sin(angle) * 96;
              const valueX = 130 + Math.cos(angle) * (barRadius + 14);
              const valueY = 130 + Math.sin(angle) * (barRadius + 14);

              return (
                <g key={metric.id}>
                  <line x1="130" y1="130" x2={labelX} y2={labelY} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
                  <line x1={innerX} y1={innerY} x2={outerX} y2={outerY} stroke={color} strokeWidth="14" strokeLinecap="round" />
                  <circle cx={outerX} cy={outerY} r="5" fill={color} />
                  <text
                    x={labelX}
                    y={labelY + (labelY > 130 ? 12 : -8)}
                    fill="rgba(226,232,240,0.92)"
                    fontSize="10"
                    letterSpacing="1.1"
                    textAnchor="middle"
                  >
                    {metric.label.toUpperCase()}
                  </text>
                  <text x={valueX} y={valueY} fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
                    {formatClimateValue(metric.id, metric.value)}
                  </text>
                </g>
              );
            })}
            <circle cx="130" cy="130" r="14" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.18)" />
          </svg>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-[clamp(1.15rem,1.8vw,1.55rem)] font-semibold text-white">{formatClimateValue(metric.id, metric.value)}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-300">{climateSummary}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Seasonal behavior</p>
              <h3 className="text-[clamp(1rem,1.6vw,1.2rem)] font-semibold text-white">{seasonalMetricLabels[activeSeasonalMetric]} across the year</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(seasonalMetricLabels) as SeasonalMetricKey[]).map((metricKey) => {
                const active = metricKey === activeSeasonalMetric;
                return (
                  <button
                    key={metricKey}
                    type="button"
                    onClick={() => setActiveSeasonalMetric(metricKey)}
                    className="rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition"
                    style={
                      active
                        ? { borderColor: color, backgroundColor: `${color}22`, color: "#ffffff" }
                        : { borderColor: "rgba(255,255,255,0.1)", color: "rgb(148 163 184)" }
                    }
                  >
                    {seasonalMetricLabels[metricKey]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_180px]">
            <svg viewBox="0 0 112 100" className="h-56 w-full overflow-visible">
              {seasonalTicks.map((tick) => (
                <g key={tick}>
                  <line
                    x1="10"
                    y1={100 - ((tick - chartMin) / chartRange) * 100}
                    x2="106"
                    y2={100 - ((tick - chartMin) / chartRange) * 100}
                    stroke="rgba(148,163,184,0.14)"
                    strokeWidth="0.8"
                  />
                  <text x="6" y={103 - ((tick - chartMin) / chartRange) * 100} textAnchor="end" fill="rgba(148,163,184,0.6)" fontSize="6">
                    {activeSeasonalMetric === "heat" ? `${Math.round(tick)}°` : Math.round(tick)}
                  </text>
                </g>
              ))}
              <line x1="10" y1="100" x2="106" y2="100" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
              <line x1="10" y1="10" x2="10" y2="100" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
              <polygon points={area} fill={`${color}20`} />
              <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />
              {points.map((point) => {
                const isPeak = point.label === maxPoint.label && point.value === maxPoint.value;
                const isLow = point.label === minPoint.label && point.value === minPoint.value;
                return (
                  <g key={point.label}>
                    <circle cx={point.x} cy={point.y} r={isPeak || isLow ? 3.8 : 2.8} fill={color} />
                    {(isPeak || isLow) ? <circle cx={point.x} cy={point.y} r="7" fill={`${color}22`} /> : null}
                    <text x={point.x} y="108" textAnchor="middle" fill="rgba(226,232,240,0.78)" fontSize="6.5">
                      {point.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Highest point</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {maxPoint.label} · {formatClimateValue(activeSeasonalMetric, maxPoint.value)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Lowest point</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {minPoint.label} · {formatClimateValue(activeSeasonalMetric, minPoint.value)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Seasonal peak</p>
                <p className="mt-2 text-sm text-slate-200">{seasonalInsight(activeSeasonalMetric, series)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareMetricCard({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const areaPoints = data.map((item, index) => {
    const x = 24 + index * 56;
    const y = 116 - (item.value / maxValue) * 82;
    return { ...item, x, y };
  });
  const areaPolygon = `24,116 ${areaPoints.map((point) => `${point.x},${point.y}`).join(" ")} 136,116`;

  return (
    <div className="grid gap-4 rounded-[22px] border border-white/10 bg-slate-950/55 p-4 xl:grid-cols-[0.95fr_260px] xl:items-center">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Compare</p>
        <h3 className="mt-1 text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-white">{title}</h3>
        <div className="mt-4 grid gap-2.5">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-white">{item.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[20px] border border-white/10 bg-white/[0.02] p-3">
        <svg viewBox="0 0 160 140" className="h-44 w-full">
          <defs>
            <linearGradient id={`compare-area-${title.replace(/\s+/g, "-").toLowerCase()}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {areaPoints.map((point, index) => (
                <stop key={point.label} offset={`${(index / Math.max(areaPoints.length - 1, 1)) * 100}%`} stopColor={point.color} />
              ))}
            </linearGradient>
          </defs>
          <line x1="18" y1="116" x2="142" y2="116" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
          <line x1="18" y1="34" x2="142" y2="34" stroke="rgba(148,163,184,0.1)" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points={areaPolygon} fill={`url(#compare-area-${title.replace(/\s+/g, "-").toLowerCase()})`} opacity="0.24" />
          <polyline
            points={areaPoints.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {areaPoints.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5" fill={point.color} />
              <circle cx={point.x} cy={point.y} r="9" fill={point.color} opacity="0.16" />
              <text x={point.x} y="132" textAnchor="middle" fill="rgba(226,232,240,0.8)" fontSize="8" letterSpacing="1.5">
                {point.label.slice(0, 3).toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function CompareLayer({ cities }: { cities: CityData[] }) {
  const ids: DashboardMetric["id"][] = [
    "climate_stress",
    "water_pressure",
    "energy_potential",
    "ecosystem_sensitivity",
    "mobility_complexity",
  ];

  return (
    <div className="grid gap-3">
      <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Compare</p>
        <h2 className="mt-1 text-[clamp(1.2rem,2vw,1.5rem)] font-semibold text-white">City-to-city comparison</h2>
      </div>
      <div className="grid gap-3">
        {ids.map((id) => (
          <CompareMetricCard
            key={id}
            data={cities.map((entry) => ({ label: entry.city, value: metricById(entry, id).value, color: entry.themeColor }))}
            title={metricById(cities[0], id).label}
          />
        ))}
      </div>
    </div>
  );
}

function bottomCardsForLayer(city: CityData, layerConfig: (typeof cityLayerConfigs)[CitySlug], activeLayer: DashboardLayer) {
  const climateLookup = Object.fromEntries(city.climateMetrics.map((metric) => [metric.id, metric.value])) as Record<ClimateMetric["id"], number>;

  switch (activeLayer) {
    case "climate":
      return [
        { label: "Heat level", value: formatClimateValue("heat", climateLookup.heat), note: "Surface heat stays important across daily life.", tone: "warning" as const },
        { label: "Rainfall", value: `${climateLookup.rainfall}`, note: "Rain rhythm shapes exposure and seasonal change.", tone: "neutral" as const },
        { label: "Humidity", value: `${climateLookup.humidity}`, note: "Moisture changes comfort and drying speed.", tone: "neutral" as const },
        { label: "Comfort", value: `${climateLookup.thermal_comfort}`, note: layerConfig.climate.comfort[0]?.value ?? "Comfort shifts through the year.", tone: "positive" as const },
      ];
    case "water":
      return [
        { label: "Water load", value: `${metricById(city, "water_pressure").value}`, note: layerConfig.water.riskCards[0]?.value ?? "Water systems stay under pressure.", tone: "warning" as const },
        { label: "Supply reliability", value: `${layerConfig.water.storageVsDemand[1]?.value ?? 0}`, note: "Reliable supply changes daily resilience.", tone: "positive" as const },
        { label: "Drainage stress", value: `${layerConfig.water.riskCards[1]?.value ?? ""}`, note: "Storms and runoff affect access and housing.", tone: "neutral" as const },
        { label: "Linked systems", value: `${layerConfig.water.linkedSystems.length}`, note: layerConfig.water.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "air":
      return [
        { label: "Air exposure", value: `${layerConfig.air.airQualityDrivers[0]?.value ?? 0}`, note: layerConfig.air.watchpoints[0]?.value ?? "Air conditions affect comfort.", tone: "warning" as const },
        { label: "Ventilation", value: `${layerConfig.air.airQualityDrivers[2]?.value ?? 0}`, note: "Air movement can ease pressure in exposed spaces.", tone: "positive" as const },
        { label: "Indoor load", value: `${layerConfig.air.exposurePattern[1]?.value ?? 0}`, note: "Buildings feel air conditions differently than streets.", tone: "neutral" as const },
        { label: "Linked systems", value: `${layerConfig.air.linkedSystems.length}`, note: layerConfig.air.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "energy":
      return [
        { label: "Active system", value: `${city.activeSystem.score}`, note: city.activeSystem.opportunity, tone: "positive" as const },
        { label: "Demand load", value: `${layerConfig.energy.generationVsDemand[1]?.value ?? 0}`, note: city.activeSystem.constraint, tone: "warning" as const },
        { label: "Best source", value: `${layerConfig.energy.sourcePotential[0]?.value ?? 0}`, note: layerConfig.energy.sourcePotential[0]?.label ?? "Source potential", tone: "positive" as const },
        { label: "Linked systems", value: `${layerConfig.energy.linkedSystems.length}`, note: layerConfig.energy.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "mobility":
      return [
        { label: "Route exposure", value: `${layerConfig.mobility.routeExposure[0]?.value ?? 0}`, note: layerConfig.mobility.routines[1]?.value ?? "Routes face daily friction.", tone: "warning" as const },
        { label: "Walking comfort", value: `${layerConfig.mobility.routeExposure[2]?.value ?? 0}`, note: "Comfort changes how far people can move easily.", tone: "neutral" as const },
        { label: "Access factors", value: `${layerConfig.mobility.accessFactors[0]?.value ?? 0}`, note: "Terrain and weather shape movement patterns.", tone: "neutral" as const },
        { label: "Linked systems", value: `${layerConfig.mobility.linkedSystems.length}`, note: layerConfig.mobility.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "waste":
      return [
        { label: "Unrecycled", value: `${layerConfig.waste.recyclingMix.find((item) => item.label === "Unrecycled")?.value ?? 0}%`, note: "This shows waste still escaping the recovery loop.", tone: "warning" as const },
        { label: "Organic share", value: `${layerConfig.waste.recyclingMix.find((item) => item.label === "Organic")?.value ?? 0}%`, note: "Organic material can return through safer handling.", tone: "positive" as const },
        { label: "Handling stress", value: `${layerConfig.waste.handlingPressure[0]?.value ?? 0}`, note: layerConfig.waste.watchpoints[0]?.value ?? "Waste handling stays exposed.", tone: "warning" as const },
        { label: "Linked systems", value: `${layerConfig.waste.linkedSystems.length}`, note: layerConfig.waste.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "biodiversity":
      return [
        { label: "Sensitivity", value: `${metricById(city, "ecosystem_sensitivity").value}`, note: layerConfig.biodiversity.preservation[0]?.value ?? "Ecology stays highly responsive.", tone: "warning" as const },
        { label: "Composting", value: `${layerConfig.biodiversity.compostLoop[1]?.value ?? 0}`, note: "Organic return helps connect food and soil again.", tone: "positive" as const },
        { label: "Habitat stress", value: `${layerConfig.biodiversity.habitatPressure[1]?.value ?? 0}`, note: layerConfig.biodiversity.preservation[1]?.value ?? "Habitat edges need careful attention.", tone: "warning" as const },
        { label: "Linked systems", value: `${layerConfig.biodiversity.linkedSystems.length}`, note: layerConfig.biodiversity.linkedSystems.join(", "), tone: "neutral" as const },
      ];
    case "compare":
      return [
        { label: "Cities", value: `${3}`, note: "Solara, Frostara and Verdantia stay aligned here.", tone: "neutral" as const },
        { label: "Shared metrics", value: `${5}`, note: "The same five top signals are compared side by side.", tone: "positive" as const },
        { label: "Use", value: "Context", note: "Compare patterns before discussing tradeoffs in class.", tone: "neutral" as const },
        { label: "Focus", value: "Differences", note: "Look for the hardest mix of pressure and opportunity.", tone: "warning" as const },
      ];
    default:
      return [
        { label: "City pressure", value: `${city.cityPressureIndex}`, note: "Overall planning difficulty across connected systems.", tone: "warning" as const },
        { label: "Urban stress", value: `${city.urbanStress}`, note: "How hard daily city life may feel under these conditions.", tone: "neutral" as const },
        { label: "Active system", value: `${city.activeSystem.score}`, note: city.activeSystem.opportunity, tone: "positive" as const },
        { label: "Primary risk", value: city.primaryRisk, note: city.secondaryRisk, tone: "warning" as const },
      ];
  }
}

export function CityDashboard({ city, cities, onBack, onSelectCity }: CityDashboardProps) {
  const theme = cityThemes[city.slug];
  const layerConfig = cityLayerConfigs[city.slug];
  const [activeLayer, setActiveLayer] = useState<DashboardLayer>("home");
  const [activeNodeId, setActiveNodeId] = useState("energy");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveNodeId((current) => {
      if (activeLayer === "water") {
        return "water";
      }
      if (activeLayer === "mobility") {
        return "mobility";
      }
      if (activeLayer === "air" || activeLayer === "waste") {
        return "housing";
      }
      if (activeLayer === "biodiversity") {
        return "biodiversity";
      }
      return current === "food" ? "food" : "energy";
    });
  }, [city.slug]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [city.slug, activeLayer]);

  const renderMainLayer = () => {
    switch (activeLayer) {
      case "compare":
        return <CompareLayer cities={cities} />;
      case "climate":
        return <ClimatePanel city={city} metrics={city.climateMetrics} color={theme.primary} />;
      case "water":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <RingSummary title="Water system load" value={metricById(city, "water_pressure").value} color={theme.primary} subtitle="Main gauge" />
            <HorizontalBars data={layerConfig.water.storageVsDemand} title="Storage vs demand" subtitle="Water balance" color={theme.secondary} />
            <LineChart data={layerConfig.water.seasonalBalance} color={theme.primary} title="Seasonal water balance" subtitle="Water cycle" />
          </div>
        );
      case "air":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <HorizontalBars data={layerConfig.air.airQualityDrivers} title="Air quality drivers" subtitle="Exposure profile" color={theme.primary} />
            <HorizontalBars data={layerConfig.air.exposurePattern} title="Exposure pattern" subtitle="Comfort and material load" color={theme.secondary} />
          </div>
        );
      case "energy":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <HorizontalBars data={layerConfig.energy.generationVsDemand} title="Generation vs demand" subtitle="Energy profile" color={theme.primary} />
            <HorizontalBars data={layerConfig.energy.sourcePotential} title="Source potential" subtitle="Energy sources" color={theme.secondary} />
          </div>
        );
      case "mobility":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <HorizontalBars data={layerConfig.mobility.routeExposure} title="Route exposure" subtitle="Movement friction" color={theme.primary} />
            <HorizontalBars data={layerConfig.mobility.accessFactors} title="Access complexity" subtitle="Access factors" color={theme.secondary} />
          </div>
        );
      case "waste":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <HorizontalBars data={layerConfig.waste.wasteFlow} title="Waste flow" subtitle="Collection and recovery" color={theme.primary} />
            <HorizontalBars data={layerConfig.waste.handlingPressure} title="Handling pressure" subtitle="Operational stress" color={theme.secondary} />
            <RecyclingPieChart
              title="Recycling mix"
              subtitle="What can return to the cycle"
              data={layerConfig.waste.recyclingMix}
              colors={[theme.primary, theme.secondary, "#fbbf24", "#38bdf8", "#a3e635", "#f87171"]}
            />
          </div>
        );
      case "biodiversity":
        return (
          <div className="grid gap-3 xl:grid-cols-2">
            <RingSummary title="Ecosystem sensitivity" value={metricById(city, "ecosystem_sensitivity").value} color={theme.primary} subtitle="Ecology score" />
            <HorizontalBars data={layerConfig.biodiversity.habitatPressure} title="Habitat pressure" subtitle="Ecological stress" color={theme.secondary} />
            <HorizontalBars data={layerConfig.biodiversity.coexistence} title="Coexistence with infrastructure" subtitle="Relationship chart" color={theme.primary} />
            <OrganicReturnChart
              title="Organic return loop"
              subtitle="Composting and soil return"
              data={layerConfig.biodiversity.compostLoop}
              color={theme.secondary}
            />
          </div>
        );
      default:
        return (
          <div className="grid gap-3">
            <section className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr_0.9fr]">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">City overview</p>
                <h2 className="mt-1 text-[clamp(1.2rem,2vw,1.6rem)] font-semibold text-white">{city.city}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{city.tagline}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {layerConfig.home.snapshot.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <RingSummary title="City pressure index" value={city.cityPressureIndex} color={theme.primary} subtitle="Overall challenge" />
              <HorizontalBars data={layerConfig.home.opportunityScores} title="Opportunities" subtitle="Best leverage points" color={theme.secondary} />
            </section>

            <section className="grid gap-3 xl:grid-cols-[1fr_1fr_0.85fr]">
              <MultiToneRing
                data={layerConfig.home.environmentalTrend}
                colors={[theme.primary, theme.secondary, "#fbbf24", "#38bdf8"]}
                title="Environmental profile"
                subtitle="Mixed trend"
              />
              <HorizontalBars data={layerConfig.home.pressureMix} title="City load balance" subtitle="Pressure mix" color={theme.secondary} />
              <TextStack title="Top tensions" subtitle="Watch these" items={layerConfig.home.topTensions} />
            </section>

            <section className="grid gap-3">
              <div className="min-h-[360px]">
                <SystemDependencyMap city={city} activeNodeId={activeNodeId} onNodeChange={setActiveNodeId} />
              </div>
            </section>
          </div>
        );
    }
  };

  const bottomCards = bottomCardsForLayer(city, layerConfig, activeLayer);

  return (
    <div className="h-screen overflow-hidden p-2 md:p-3">
      <div className="mx-auto grid h-full max-w-[1720px] grid-rows-[auto_1fr] p-2 md:p-3">
        <header className="grid gap-3 rounded-[24px] border border-white/10 bg-slate-950/55 px-4 py-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] lg:hidden"
              aria-label="Toggle layers menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <img src={cityLogos[city.slug]} alt={`${city.city} logo`} className="h-[5.4rem] w-[5.4rem] shrink-0 object-contain" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-[clamp(1.5rem,2.4vw,2rem)] text-white">{city.city}</h1>
              <p className="truncate text-sm text-slate-300">{city.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-white/[0.12]"
            >
              Cities
            </button>
            {cities.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => onSelectCity(entry.slug)}
                className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] transition ${
                  entry.slug === city.slug ? "text-white" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
                style={entry.slug === city.slug ? { borderColor: theme.secondary, backgroundColor: `${theme.primary}22` } : undefined}
              >
                {entry.city}
              </button>
            ))}
          </div>
        </header>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden">
            <div className="h-full w-[min(82vw,320px)] rounded-r-[28px] border-r border-white/10 bg-slate-950/95 p-4 shadow-aurora">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Layers</p>
                  <p className="mt-1 text-lg font-semibold text-white">City modules</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                  aria-label="Close layers menu"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <div className="grid gap-2">
                {layers.map((layer) => {
                  const active = activeLayer === layer.id;
                  return (
                    <button
                      key={`mobile-${layer.id}`}
                      type="button"
                      onClick={() => {
                        setActiveLayer(layer.id);
                        if (layer.nodeId) {
                          setActiveNodeId(layer.nodeId);
                        }
                      }}
                      className="flex items-center gap-3 rounded-[18px] border border-transparent px-3 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
                      style={active ? { backgroundColor: `${theme.primary}20`, borderColor: theme.secondary } : undefined}
                    >
                      <SidebarIcon icon={layer.icon} active={active} />
                      <p className={`text-sm ${active ? "text-white" : "text-slate-300"}`}>{layer.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid min-h-0 gap-3 pt-3 lg:grid-cols-[minmax(210px,240px)_minmax(0,1fr)]">
          <aside className="sticky top-0 hidden max-h-full self-start overflow-auto rounded-[24px] border border-white/10 bg-slate-950/55 p-3 lg:block">
            <div className="grid gap-2">
              {layers.map((layer) => {
                const active = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => {
                        setActiveLayer(layer.id);
                        if (layer.nodeId) {
                          setActiveNodeId(layer.nodeId);
                        }
                      }}
                    className="flex items-center gap-3 rounded-[18px] border border-transparent px-3 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
                    style={active ? { backgroundColor: `${theme.primary}20`, borderColor: theme.secondary } : undefined}
                  >
                    <SidebarIcon icon={layer.icon} active={active} />
                    <div className="min-w-0">
                      <p className={`truncate text-sm ${active ? "text-white" : "text-slate-300"}`}>{layer.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="scrollbar-thin min-h-0 overflow-auto pr-1">
            {activeLayer === "home" ? <CompactMetricRow metrics={city.dashboardMetrics} color={theme.primary} /> : null}
            <div className={`${activeLayer === "home" ? "mt-3" : ""} grid gap-3`}>
              {renderMainLayer()}
            </div>
            <div className="mt-4">
              <BottomInsightCards cards={bottomCards} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
