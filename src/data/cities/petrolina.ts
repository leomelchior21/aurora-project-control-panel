import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, progressChart, series, stackedSeries, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "water",
    label: "Água e Escassez",
    icon: "droplets",
    status: "critical",
    state: "O esgoto de 130 mil habitantes não é coletado e vai direto para o Rio.",
    miniSummary: "O rio está presente, mas a coleta, a distribuição e a prioridade política falham nos bairros mais frágeis.",
    summaryStrip: [
      { label: "Esgoto bruto", value: "27%" },
      { label: "Periferia sem água", value: "32%" },
      { label: "Dias sem água", value: "90" },
      { label: "Rio receptor", value: "São Francisco" },
    ],
    stats: [
      { label: "Sem coleta", value: "130 mil hab" },
      { label: "Esgoto sem tratamento", value: "4.8M m³/ano" },
      { label: "Centro sem abastecimento", value: "2%" },
      { label: "Periferia sem abastecimento", value: "32%" },
    ],
    charts: [
      donutChart("Destino do Esgoto", "Volume total gerado", [
        { label: "Tratado", value: "73" },
        { label: "Despejo bruto no rio", value: "27" },
      ], "27%", "Bruto"),
      {
        type: "bar",
        title: "Acesso por distrito",
        subtitle: "Famílias sem abastecimento",
        data: series([["Centro", 2], ["Distritos", 18], ["Periferia", 32]]),
        series: [{ key: "value", label: "Falta de água %" }],
      },
    ],
    alerts: [
      makeAlert("Paradoxo do rio", "A presença do São Francisco não impede a desigualdade de acesso quando coleta e distribuição falham ao mesmo tempo."),
    ],
  },
  {
    key: "energy",
    label: "Energia e Sol",
    icon: "zap",
    status: "attention",
    state: "Potencial solar de 300 dias por ano, mas a matriz urbana ainda é 91% fóssil/térmica.",
    miniSummary: "A cidade recebe sol suficiente para reduzir a dependência térmica, mas a infraestrutura pública permanece presa à inércia energética.",
    summaryStrip: [
      { label: "Dias de sol", value: "300/ano" },
      { label: "Matriz fóssil", value: "91%" },
      { label: "Solar real", value: "9%" },
      { label: "Rendimento perdido", value: "82%" },
    ],
    stats: [
      { label: "Energia fóssil/térmica", value: "91%" },
      { label: "Solar instalada real", value: "9%" },
      { label: "Prédios públicos travados", value: "82%" },
      { label: "Dependência térmica", value: "Alta" },
    ],
    charts: [
      {
        type: "stacked-bar",
        title: "Matriz energética urbana",
        subtitle: "Consumo atual",
        data: stackedSeries(["Consumo"], { fossil: [91], solar: [9] }),
        series: [
          { key: "fossil", label: "Fóssil/Térmica", color: "#FF3131" },
          { key: "solar", label: "Solar real", color: "#FFBF00" },
        ],
      },
      progressChart("Rendimento solar perdido", "Inércia em prédios públicos", 82, "82%", "Desperdiçado"),
    ],
    alerts: [
      makeAlert("Sol sem transição", "O potencial existe, mas a cidade continua convertendo abundância solar em dependência cara e suja."),
    ],
  },
] as const;

export const petrolina: CityData = {
  slug: "petrolina",
  name: "Petrolina",
  logo: cityAssets.petrolina.logo,
  accent: cityAssets.petrolina.accent,
  accentSoft: cityAssets.petrolina.accentSoft,
  oneLineDescription: "A abundância do Rio São Francisco mascarando um sistema de alto desperdício e desigualdade térmica.",
  missionBrief:
    "Petrolina é o coração do semiárido, mas seu pulso é irregular. Enquanto o agronegócio prospera, distritos periféricos enfrentam 90 dias sem água. A radiação solar é altíssima, mas a cidade continua refém de termelétricas fósseis e redes de distribuição ineficientes. O Rio São Francisco sofre com o despejo de toneladas de esgoto bruto anualmente.",
  heroImage: cityAssets.petrolina.heroImage,
  secondaryImage: cityAssets.petrolina.secondaryImage,
  mapImage: cityAssets.petrolina.mapImage,
  macroStats: [
    { label: "População", value: "386k" },
    { label: "Volume de esgoto s/ tratamento", value: "4.8M m³/ano" },
    { label: "Evaporação em canais", value: "Altíssima" },
    { label: "Clima", value: "Semiárido BSh" },
  ],
  breadcrumbLabel: "Nexo Água-Energia",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
