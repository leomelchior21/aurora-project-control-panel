import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { makeAlert, progressChart, series, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "temperature",
    label: "Ilhas de Calor",
    icon: "thermometer",
    status: "critical",
    state: "A diferença térmica entre o centro e a floresta chega a 8°C no meio-dia.",
    miniSummary: "Asfalto, sombra rara e umidade extrema fazem o corpo sentir um calor muito maior do que o termômetro mostra.",
    summaryStrip: [
      { label: "Sensação máxima", value: "46°C" },
      { label: "Diferença centro/floresta", value: "8°C" },
      { label: "Sombra no centro", value: "2%" },
      { label: "Arborização", value: "Crítica" },
    ],
    stats: [
      { label: "Termômetro", value: "34°C" },
      { label: "Sente como", value: "46°C" },
      { label: "Centro sem sombra", value: "98%" },
      { label: "Reserva com sombra", value: "90%" },
    ],
    charts: [
      {
        type: "area",
        title: "O peso da umidade",
        subtitle: "Sensação térmica real",
        data: [
          { label: "10h", real: 31, feels: 38 },
          { label: "14h", real: 34, feels: 46 },
          { label: "18h", real: 30, feels: 37 },
        ],
        series: [
          { key: "feels", label: "Sente como", color: "#FF3131" },
          { key: "real", label: "Termômetro", color: "#FFBF00" },
        ],
      },
      {
        type: "heatmap",
        title: "Zonas de calor urbano",
        subtitle: "Centro versus reserva",
        rows: [
          { label: "Centro", cells: [{ label: "Asfalto", value: 98 }, { label: "Sombra", value: 2 }] },
          { label: "Reserva", cells: [{ label: "Asfalto", value: 10 }, { label: "Sombra", value: 90 }] },
        ],
      },
    ],
    alerts: [
      makeAlert("Selva de pedra", "A floresta está ao redor, mas o centro perdeu os serviços ambientais que antes resfriavam a cidade."),
    ],
  },
  {
    key: "waste",
    label: "Resíduos Hídricos",
    icon: "trash-2",
    status: "critical",
    state: "Toneladas de plástico flutuante bloqueiam a drenagem natural da cidade.",
    miniSummary: "Os igarapés deixaram de ser caminhos de água e viraram canais de lixo, esgoto e baixa oxigenação.",
    summaryStrip: [
      { label: "Lixo diário", value: "30 ton/dia" },
      { label: "Esgoto tratado", value: "40%" },
      { label: "Igarapés mortos", value: "12%" },
      { label: "Oxigenação", value: "Baixa" },
    ],
    stats: [
      { label: "Cobertura de esgoto", value: "40%" },
      { label: "Lixo nos igarapés", value: "30 ton/dia" },
      { label: "Oxigenação da água", value: "12%" },
      { label: "Drenagem bloqueada", value: "Alta" },
    ],
    charts: [
      {
        type: "line",
        title: "Acúmulo de lixo flutuante",
        subtitle: "Toneladas retiradas mensalmente",
        data: series([["Jan", 280], ["Mar", 340], ["Mai", 920], ["Jul", 410]]),
        series: [{ key: "value", label: "Toneladas", color: "#FF3131" }],
      },
      progressChart("Igarapés 'mortos'", "Nível de oxigenação da água", 12, "Baixo", "Vida"),
    ],
    alerts: [
      makeAlert("Água sem caminho", "Quando o lixo flutuante cresce, a drenagem falha e a cidade perde sua memória hídrica."),
    ],
  },
] as const;

export const manaus: CityData = {
  slug: "manaus",
  name: "Manaus",
  logo: cityAssets.manaus.logo,
  accent: cityAssets.manaus.accent,
  accentSoft: cityAssets.manaus.accentSoft,
  oneLineDescription: "A metrópole que deu as costas para o rio e se transformou em uma ilha de calor sufocante.",
  missionBrief:
    "Cercada pela maior floresta do mundo, Manaus falha em saneamento básico: 60% do esgoto ainda é despejado sem tratamento nos igarapés. O asfalto e a falta de árvores no centro criam ilhas de calor onde a sensação térmica supera os 45°C. Os caminhos de canoa agora são caminhos de lixo plastificado e poluição química.",
  heroImage: cityAssets.manaus.heroImage,
  secondaryImage: cityAssets.manaus.secondaryImage,
  mapImage: cityAssets.manaus.mapImage,
  macroStats: [
    { label: "Cobertura de esgoto", value: "40%" },
    { label: "Lixo nos igarapés", value: "30 ton/dia" },
    { label: "Déficit de arborização", value: "Crítico" },
    { label: "Clima", value: "Tropical Equatorial" },
  ],
  breadcrumbLabel: "Selva de Pedra",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
