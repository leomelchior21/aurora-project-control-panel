import { getStatusColor } from "./status";
import type { SystemStatus } from "../../../types/city";

const lowIsBad = [
  /shade/i,
  /reuse/i,
  /clean/i,
  /capture/i,
  /protected/i,
  /cooling/i,
  /storage/i,
  /adapted/i,
  /comfort/i,
  /walk/i,
  /green/i,
  /survival/i,
  /heating access/i,
  /fresh air/i,
  /airflow quality/i,
  /transit/i,
  /access/i,
  /resistant/i,
  /quality/i,
  /drainage/i,
  /ventilation/i,
];

const highIsBad = [
  /temp/i,
  /heat/i,
  /incident/i,
  /loss/i,
  /evaporation/i,
  /consumption/i,
  /use$/i,
  /aqi/i,
  /smoke/i,
  /dust/i,
  /uv/i,
  /exposure/i,
  /turbulence/i,
  /waste/i,
  /shortage/i,
  /informal/i,
  /commute/i,
  /energy\/trip/i,
  /expansion/i,
  /flood/i,
  /untreated/i,
  /humidity/i,
  /blockage/i,
  /blackout/i,
  /organic/i,
  /risk/i,
  /fossil/i,
  /cost/i,
  /failure/i,
  /accident/i,
  /human impact/i,
];

function extractNumber(value: string) {
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function classifyWordValue(value: string) {
  const normalized = value.toLowerCase();

  if (/(critical|severe|very high|frequent|high|low|weak|limited|unstable|fossil)/i.test(normalized)) {
    return "critical" satisfies SystemStatus;
  }

  if (/(attention|moderate|occasional|medium)/i.test(normalized)) {
    return "attention" satisfies SystemStatus;
  }

  if (/(nominal|stable|good)/i.test(normalized)) {
    return "nominal" satisfies SystemStatus;
  }

  return null;
}

export function getMetricStatus(label: string, value: string): SystemStatus {
  const byWord = classifyWordValue(value);
  if (byWord) return byWord;

  const amount = extractNumber(value);
  if (amount === null) return "attention";

  const normalizedLabel = label.toLowerCase();

  if (highIsBad.some((pattern) => pattern.test(normalizedLabel))) {
    if (amount >= 70) return "critical";
    if (amount >= 35) return "attention";
    return "nominal";
  }

  if (lowIsBad.some((pattern) => pattern.test(normalizedLabel))) {
    if (amount <= 30) return "critical";
    if (amount <= 55) return "attention";
    return "nominal";
  }

  if (value.includes("+")) {
    if (amount >= 20) return "critical";
    if (amount >= 8) return "attention";
  }

  return "attention";
}

export function getMetricTone(label: string, value: string) {
  const status = getMetricStatus(label, value);
  return {
    status,
    color: getStatusColor(status),
  };
}
