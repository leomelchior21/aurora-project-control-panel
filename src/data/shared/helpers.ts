import type { AlertItem, ChartSpec, SummaryMetric, SystemLayer, SystemStatus } from "../../types/city";

export const statusOrder: SystemStatus[] = ["critical", "attention", "nominal"];

export function series(values: Array<[string, number]>, key = "value") {
  return values.map(([label, value]) => ({ label, [key]: value }));
}

export function stackedSeries(
  labels: string[],
  groups: Record<string, number[]>,
) {
  return labels.map((label, index) => ({
    label,
    ...Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, values[index]])),
  }));
}

export function statusSummary(layers: SystemLayer[]) {
  return layers.map((layer) => ({ label: layer.label, status: layer.status }));
}

export function makeAlert(title: string, description: string): AlertItem {
  return { title, description };
}

export function progressChart(title: string, subtitle: string, value: number, centerValue: string, centerLabel: string): ChartSpec {
  return {
    type: "progress",
    title,
    subtitle,
    value,
    max: 100,
    centerValue,
    centerLabel,
  };
}

export function donutChart(title: string, subtitle: string, segments: SummaryMetric[], centerValue?: string, centerLabel?: string): ChartSpec {
  return {
    type: "donut",
    title,
    subtitle,
    segments,
    centerValue,
    centerLabel,
  };
}
