import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
import type { ChartSpec } from "../../types/city";
import { chartGridColor, chartTextColor, chartTooltipStyle } from "../../lib/chartTheme";
import { getStatusColor } from "../../features/city-dashboard/utils/status";

const donutColors = ["#ff6b6b", "#f7b84b", "#53d48a", "#69bff3", "#a78bfa"];

function HeatmapBlock({ chart }: { chart: ChartSpec }) {
  return (
    <div className="grid gap-3">
      {chart.rows?.map((row) => (
        <div key={row.label} className="grid grid-cols-[96px_1fr] items-center gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{row.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {row.cells.map((cell) => (
              <div key={cell.label} className="rounded-2xl border border-white/10 p-3 text-center" style={{ background: `rgba(255,107,107,${Math.max(0.12, cell.value / 120)})` }}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-200">{cell.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{cell.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressMeter({ chart }: { chart: ChartSpec }) {
  const ratio = ((chart.value ?? 0) / (chart.max ?? 100)) * 100;
  const color = ratio >= 70 ? getStatusColor("critical") : ratio >= 40 ? getStatusColor("attention") : getStatusColor("nominal");

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${ratio}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }} />
      </div>
      <div className="mt-6 text-center">
        <p className="text-[2.5rem] font-semibold leading-none text-white">{chart.centerValue}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">{chart.centerLabel}</p>
      </div>
    </div>
  );
}

function sharedChartProps() {
  return {
    margin: { top: 8, right: 8, left: -16, bottom: 0 },
  };
}

export function ChartRenderer({ chart }: { chart: ChartSpec }) {
  const primarySeries = chart.series?.[0];
  const secondarySeries = chart.series?.[1];

  return (
    <div className="aurora-card rounded-[26px] p-5">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{chart.subtitle}</p>
        <h3 className="mt-2 text-lg text-white">{chart.title}</h3>
      </div>

      <div className="h-[260px]">
        {chart.type === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data} {...sharedChartProps()}>
              <CartesianGrid stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={chartTooltipStyle} />
              {primarySeries ? <Line type="monotone" dataKey={primarySeries.key} stroke={primarySeries.color ?? "#69bff3"} strokeWidth={2.5} dot={false} /> : null}
              {secondarySeries ? <Line type="monotone" dataKey={secondarySeries.key} stroke={secondarySeries.color ?? "#f7b84b"} strokeWidth={2.5} dot={false} /> : null}
            </LineChart>
          </ResponsiveContainer>
        ) : chart.type === "area" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} {...sharedChartProps()}>
              <CartesianGrid stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={chartTooltipStyle} />
              {primarySeries ? <Area type="monotone" dataKey={primarySeries.key} stroke={primarySeries.color ?? "#69bff3"} fill={primarySeries.color ?? "#69bff3"} fillOpacity={0.22} /> : null}
              {secondarySeries ? <Area type="monotone" dataKey={secondarySeries.key} stroke={secondarySeries.color ?? "#f7b84b"} fill={secondarySeries.color ?? "#f7b84b"} fillOpacity={0.16} /> : null}
            </AreaChart>
          </ResponsiveContainer>
        ) : chart.type === "bar" || chart.type === "stacked-bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} {...sharedChartProps()}>
              <CartesianGrid stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={chartTooltipStyle} />
              {chart.series?.map((seriesItem, index) => (
                <Bar key={seriesItem.key} dataKey={seriesItem.key} stackId={chart.type === "stacked-bar" ? "stack" : undefined} fill={seriesItem.color ?? donutColors[index % donutColors.length]} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : chart.type === "donut" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={chartTooltipStyle} />
              <Pie data={chart.segments?.map((segment) => ({ ...segment, value: Number(segment.value) }))} dataKey="value" nameKey="label" innerRadius={70} outerRadius={94} paddingAngle={4}>
                {chart.segments?.map((segment, index) => <Cell key={segment.label} fill={donutColors[index % donutColors.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : chart.type === "radial" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: chart.value ?? 0 }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, chart.max ?? 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={18} fill="#69bff3" />
              <Tooltip contentStyle={chartTooltipStyle} />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : chart.type === "progress" ? (
          <ProgressMeter chart={chart} />
        ) : chart.type === "heatmap" ? (
          <HeatmapBlock chart={chart} />
        ) : null}
      </div>

      {chart.type === "donut" && chart.segments ? (
        <div className="mt-4 grid gap-2">
          {chart.segments.map((segment, index) => (
            <div key={segment.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: donutColors[index % donutColors.length] }} />
                <span className="text-sm text-slate-300">{segment.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">{segment.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
