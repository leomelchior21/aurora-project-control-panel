export type CitySlug = "solara" | "frostara" | "verdantia";

export type SystemStatus = "critical" | "attention" | "nominal";

export type LayerKey =
  | "mission-brief"
  | "compare-cities"
  | "temperature"
  | "water"
  | "air"
  | "sun"
  | "wind"
  | "energy"
  | "waste"
  | "housing"
  | "transportation"
  | "biodiversity";

export type ChartType = "line" | "area" | "bar" | "stacked-bar" | "donut" | "radial" | "progress" | "heatmap";

export interface MacroStat {
  label: string;
  value: string;
}

export interface SystemStat {
  label: string;
  value: string;
  note?: string;
}

export interface SummaryMetric {
  label: string;
  value: string;
}

export interface AlertItem {
  title: string;
  description: string;
}

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

export interface HeatmapCell {
  label: string;
  value: number;
}

export interface ChartSpec {
  type: ChartType;
  title: string;
  subtitle?: string;
  data?: Array<Record<string, string | number>>;
  series?: ChartSeries[];
  centerValue?: string;
  centerLabel?: string;
  value?: number;
  max?: number;
  segments?: SummaryMetric[];
  rows?: Array<{
    label: string;
    cells: HeatmapCell[];
  }>;
}

export interface SystemLayer {
  key: Exclude<LayerKey, "mission-brief">;
  label: string;
  icon: string;
  status: SystemStatus;
  state: string;
  miniSummary?: string;
  stats: SystemStat[];
  summaryStrip: SummaryMetric[];
  charts: ChartSpec[];
  alerts?: AlertItem[];
  zoneComparison?: SummaryMetric[];
}

export interface CityOverviewItem {
  label: string;
  status: SystemStatus;
}

export interface CityData {
  slug: CitySlug;
  name: string;
  logo: string;
  accent: string;
  accentSoft: string;
  oneLineDescription: string;
  missionBrief: string;
  heroImage: string;
  secondaryImage: string;
  macroStats: MacroStat[];
  breadcrumbLabel: string;
  systemsOverview: CityOverviewItem[];
  layers: SystemLayer[];
}
