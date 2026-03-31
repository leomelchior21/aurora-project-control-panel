import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, series, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "housing",
    label: "Vazamento Térmico",
    icon: "building-2",
    status: "critical",
    state: "Casas perdem 40% do calor interno por falta de isolamento básico.",
    miniSummary: "O frio entra, o calor pago escapa e a umidade fixa o mofo dentro de casa.",
    summaryStrip: [
      { label: "Calor perdido", value: "40%" },
      { label: "Mofo em casas", value: "Frequente" },
      { label: "Umidade", value: "90%+" },
      { label: "Risco", value: "Crítico" },
    ],
    stats: [
      { label: "Eficiência histórica", value: "22%" },
      { label: "Eficiência em novos prédios", value: "45%" },
      { label: "Meta saudável", value: "90%" },
      { label: "Risco de mofo", value: "88%" },
    ],
    charts: [
      {
        type: "bar",
        title: "Eficiência térmica",
        subtitle: "Prédios históricos vs novos",
        data: series([["Históricos", 22], ["Novos", 45], ["Meta", 90]]),
        series: [{ key: "value", label: "Eficiência %", color: "#7D93A8" }],
      },
      {
        type: "radial",
        title: "Risco de mofo",
        subtitle: "Umidade nas paredes",
        value: 88,
        max: 100,
        centerValue: "Crítico",
        centerLabel: "Risco",
      },
    ],
    alerts: [
      makeAlert("Casa que chora", "A umidade permanente transforma paredes em fonte contínua de mofo e doença respiratória."),
    ],
  },
  {
    key: "energy",
    label: "Pico de Inverno",
    icon: "zap",
    status: "attention",
    state: "Demanda elétrica dispara no frio devido ao uso de aquecedores de alta resistência.",
    miniSummary: "O sistema gasta mais para aquecer menos, porque a maior parte do calor se perde antes de proteger a casa.",
    summaryStrip: [
      { label: "Gasto com aquecimento", value: "Alto" },
      { label: "Energia perdida", value: "40%" },
      { label: "Minuano", value: "Impacto severo" },
      { label: "Sobrecarga", value: "Elevada" },
    ],
    stats: [
      { label: "Junho", value: "94" },
      { label: "Julho", value: "118" },
      { label: "Agosto", value: "88" },
      { label: "Energia perdida", value: "40%" },
    ],
    charts: [
      {
        type: "line",
        title: "Consumo vs temperatura",
        subtitle: "Pico de inverno",
        data: [
          { label: "Jun", temp: 8, energy: 94 },
          { label: "Jul", temp: 4, energy: 118 },
          { label: "Ago", temp: 10, energy: 88 },
        ],
        series: [
          { key: "energy", label: "Energia", color: "#FF3131" },
          { key: "temp", label: "Frio", color: "#FFBF00" },
        ],
      },
      donutChart("Perda de custo", "Energia gasta em vazamentos", [
        { label: "Útil", value: "60" },
        { label: "Perdida", value: "40" },
      ], "40%", "Perda"),
    ],
    alerts: [
      makeAlert("Pagar não basta", "O pico elétrico cresce porque a casa perde calor mais rápido do que a rede consegue responder com eficiência."),
    ],
  },
] as const;

export const pelotas: CityData = {
  slug: "pelotas",
  name: "Pelotas",
  logo: cityAssets.pelotas.logo,
  accent: cityAssets.pelotas.accent,
  accentSoft: cityAssets.pelotas.accentSoft,
  oneLineDescription: "Uma cidade histórica enfrentando a pobreza energética sob o vento Minuano.",
  missionBrief:
    "Em Pelotas, a umidade é permanente. Prédios históricos e casas populares choram com a condensação, gerando mofo crônico e doenças respiratórias. O custo para aquecer uma casa é proibitivo, e a maior parte desse calor vaza por janelas e paredes sem isolamento. O vento Minuano derruba a sensação térmica enquanto a rede elétrica sofre picos de sobrecarga ineficiente.",
  heroImage: cityAssets.pelotas.heroImage,
  secondaryImage: cityAssets.pelotas.secondaryImage,
  mapImage: cityAssets.pelotas.mapImage,
  macroStats: [
    { label: "Sensação de umidade", value: "90%+" },
    { label: "Mofo em residências", value: "Frequente" },
    { label: "Gasto com aquecimento", value: "Alto" },
    { label: "Vento Minuano", value: "Impacto severo" },
  ],
  breadcrumbLabel: "Pobreza Energética",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
