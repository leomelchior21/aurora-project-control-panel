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

const donutColors = ["#FF3131", "#FFBF00", "#C7762B", "#8D98A8", "#5B6270"];

function buildChartAriaLabel(chart: ChartSpec) {
  if ((chart.type === "line" || chart.type === "area" || chart.type === "bar" || chart.type === "stacked-bar") && chart.data?.length) {
    const rows = chart.data
      .map((entry) => Object.entries(entry).filter(([key]) => key !== "label").map(([key, value]) => `${key} ${value}`).join(", "))
      .map((value, index) => `${chart.data?.[index]?.label}: ${value}`)
      .join(". ");
    return `Gráfico ${chart.title}. ${rows}.`;
  }

  if (chart.type === "donut" && chart.segments?.length) {
    return `Gráfico de composição ${chart.title}. ${chart.segments.map((segment) => `${segment.label} ${segment.value}`).join(". ")}.`;
  }

  if (chart.type === "heatmap" && chart.rows?.length) {
    return `Mapa de calor ${chart.title}. ${chart.rows
      .map((row) => `${row.label}: ${row.cells.map((cell) => `${cell.label} ${cell.value}`).join(", ")}`)
      .join(". ")}.`;
  }

  if ((chart.type === "radial" || chart.type === "progress") && chart.centerValue) {
    return `${chart.title}. Valor central ${chart.centerValue}.`;
  }

  return `Gráfico ${chart.title}.`;
}

function getChartQuestion(chart: ChartSpec) {
  const normalized = `${chart.title} ${chart.subtitle ?? ""}`.toLowerCase();

  if (/esgoto|água|agua|rio|drenagem|igarap/.test(normalized)) {
    return "Onde esse sistema falhou antes de a água carregar essa pressão?";
  }

  if (/energia|solar|matriz|custo|consumo|pico/.test(normalized)) {
    return "Qual dependência escondida mantém esse sistema preso a gasto alto ou fonte suja?";
  }

  if (/calor|temperatura|umidade|mofo/.test(normalized)) {
    return "O que faz o corpo sentir ainda mais pressão do que o dado principal já mostra?";
  }

  if (/lixo|resíduo|residuo|descarte/.test(normalized)) {
    return "Quando esse volume cresce, qual outro sistema começa a falhar junto?";
  }

  return "Qual dependência oculta este gráfico sugere, mesmo sem dizer a resposta?";
}

function getPressureColor(value: number, max = 100) {
  const ratio = max === 0 ? 0 : (value / max) * 100;

  if (ratio >= 70) return getStatusColor("critical");
  if (ratio >= 40) return getStatusColor("attention");
  return getStatusColor("nominal");
}

function HeatmapBlock({ chart }: { chart: ChartSpec }) {
  const isSectorMatrix = chart.title === "Matriz de pressão";

  return (
    <div className={isSectorMatrix ? "grid gap-4" : "grid gap-3"}>
      {chart.rows?.map((row) => (
        <div key={row.label} className="grid grid-cols-[96px_1fr] items-center gap-3">
          <p className={isSectorMatrix ? "text-[11px] uppercase tracking-[0.22em] text-slate-500" : "text-xs uppercase tracking-[0.18em] text-slate-500"}>{row.label}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {row.cells.map((cell) => {
              const toneColor = getPressureColor(cell.value);
              const toneLabel = cell.value >= 80 ? "Crítico" : cell.value >= 50 ? "Atenção" : "Menor pressão";

              return (
                <div
                  key={cell.label}
                  className="relative overflow-hidden rounded-2xl border px-3 py-3 text-center"
                  style={{
                    borderColor: `${toneColor}33`,
                    background: `linear-gradient(180deg, ${toneColor}22, rgba(255,255,255,0.02))`,
                    boxShadow: cell.value >= 80 ? `0 0 0 1px ${toneColor}18 inset, 0 10px 28px rgba(70,0,0,0.18)` : `0 0 0 1px ${toneColor}10 inset`,
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-200">{cell.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{cell.value}</p>
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] uppercase tracking-[0.15em] text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: toneColor }} />
                    <span>{toneLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressMeter({ chart }: { chart: ChartSpec }) {
  const ratio = ((chart.value ?? 0) / (chart.max ?? 100)) * 100;
  const color = getPressureColor(chart.value ?? 0, chart.max ?? 100);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${ratio}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
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

export function ChartRenderer({
  chart,
  onHoverChange,
  highlighted = false,
}: {
  chart: ChartSpec;
  onHoverChange?: (hovered: boolean) => void;
  highlighted?: boolean;
}) {
  const [promptOpen, setPromptOpen] = useState(false);
  const primarySeries = chart.series?.[0];
  const secondarySeries = chart.series?.[1];
  const isSectorMatrix = chart.type === "heatmap" && chart.title === "Matriz de pressão";
  const ariaLabel = useMemo(() => buildChartAriaLabel(chart), [chart]);
  const radialColor = getPressureColor(chart.value ?? 0, chart.max ?? 100);

  return (
    <div
      className={`aurora-card data-scan rounded-[26px] p-5 ${highlighted ? "critical-siren" : ""}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      role="group"
      aria-label={ariaLabel}
      style={highlighted ? { borderColor: "rgba(255,191,0,0.36)", boxShadow: "0 0 0 1px rgba(255,191,0,0.18) inset, 0 0 32px rgba(255,191,0,0.14)" } : undefined}
    >
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{chart.subtitle}</p>
        <h3 className="mt-2 text-lg text-white">{chart.title}</h3>
      </div>

      <div className={isSectorMatrix ? "relative z-10 min-h-[360px]" : chart.type === "heatmap" ? "min-h-[260px]" : "h-[260px]"} aria-label={ariaLabel}>
        {chart.type === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data} {...sharedChartProps()}>
              <CartesianGrid stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={chartTooltipStyle} />
              {primarySeries ? <Line type="monotone" dataKey={primarySeries.key} stroke={primarySeries.color ?? "#FF3131"} strokeWidth={2.5} dot={false} /> : null}
              {secondarySeries ? <Line type="monotone" dataKey={secondarySeries.key} stroke={secondarySeries.color ?? "#FFBF00"} strokeWidth={2.5} dot={false} /> : null}
            </LineChart>
          </ResponsiveContainer>
        ) : chart.type === "area" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} {...sharedChartProps()}>
              <CartesianGrid stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="label" stroke={chartTextColor} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={chartTooltipStyle} />
              {primarySeries ? <Area type="monotone" dataKey={primarySeries.key} stroke={primarySeries.color ?? "#FF3131"} fill={primarySeries.color ?? "#FF3131"} fillOpacity={0.2} /> : null}
              {secondarySeries ? <Area type="monotone" dataKey={secondarySeries.key} stroke={secondarySeries.color ?? "#FFBF00"} fill={secondarySeries.color ?? "#FFBF00"} fillOpacity={0.14} /> : null}
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
              <RadialBar dataKey="value" cornerRadius={18} fill={radialColor} />
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

      <div className="mt-4 rounded-[20px] border border-white/10 bg-black/25 p-3">
        <button
          type="button"
          onClick={() => setPromptOpen((current) => !current)}
          className="w-full text-left"
          aria-expanded={promptOpen}
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300">Pergunta investigativa</p>
          <p className="mt-2 text-sm text-slate-300">{promptOpen ? getChartQuestion(chart) : "Clique para abrir uma pista de leitura crítica."}</p>
        </button>
      </div>
    </div>
  );
}
