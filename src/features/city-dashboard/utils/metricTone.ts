import { getStatusColor } from "./status";
import type { SystemStatus } from "../../../types/city";

const lowIsBad = [
  /shade/i,
  /sombra/i,
  /reuse/i,
  /reuso/i,
  /clean/i,
  /limp/i,
  /capture/i,
  /captura/i,
  /protected/i,
  /proteg/i,
  /cooling/i,
  /storage/i,
  /armazen/i,
  /adapted/i,
  /comfort/i,
  /confort/i,
  /walk/i,
  /green/i,
  /verde/i,
  /survival/i,
  /vida/i,
  /heating access/i,
  /acesso/i,
  /fresh air/i,
  /airflow quality/i,
  /qualidade/i,
  /transit/i,
  /resistant/i,
  /resistent/i,
  /drainage/i,
  /drenagem/i,
  /ventilation/i,
  /ventila/i,
  /efici/i,
  /oxigena/i,
];

const highIsBad = [
  /temp/i,
  /calor/i,
  /heat/i,
  /incident/i,
  /inciden/i,
  /loss/i,
  /perda/i,
  /evaporation/i,
  /evapora/i,
  /consumption/i,
  /consumo/i,
  /use$/i,
  /aqi/i,
  /smoke/i,
  /dust/i,
  /esgoto/i,
  /lixo/i,
  /uv/i,
  /exposure/i,
  /expos/i,
  /turbulence/i,
  /waste/i,
  /despejo/i,
  /shortage/i,
  /falta/i,
  /informal/i,
  /commute/i,
  /energy\/trip/i,
  /expansion/i,
  /flood/i,
  /umidade/i,
  /untreated/i,
  /mofo/i,
  /blockage/i,
  /bloque/i,
  /blackout/i,
  /sobrecarga/i,
  /organic/i,
  /risk/i,
  /risco/i,
  /fossil/i,
  /fóssil/i,
  /cost/i,
  /gasto/i,
  /failure/i,
  /falha/i,
  /accident/i,
  /severo/i,
  /human impact/i,
  /impacto/i,
];

function extractNumber(value: string) {
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function classifyWordValue(value: string) {
  const normalized = value.toLowerCase();

  if (/(critical|severe|very high|frequent|high|low|weak|limited|unstable|fossil|crítico|critico|alto|altíssima|altissima|baixa|baixo|severo|severa|frequente|bruto|morto)/i.test(normalized)) {
    return "critical" satisfies SystemStatus;
  }

  if (/(attention|moderate|occasional|medium|atenção|atencao|moderado|moderada|elevada|elevado)/i.test(normalized)) {
    return "attention" satisfies SystemStatus;
  }

  if (/(nominal|stable|good|estável|estavel|bom|boa)/i.test(normalized)) {
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
