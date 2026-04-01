import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, progressChart, stackedSeries, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "energy",
    label: "Energy Layer",
    icon: "zap",
    status: "critical",
    state: "Three hundred days of sun, but the urban grid still leans on fossil heat and unstable afternoon peaks.",
    miniSummary: "Petrolina exposes an efficiency failure: abundant solar radiation exists, but the city still burns dirty fuel and wastes public energy systems.",
    summaryStrip: [
      { label: "Fossil anchor", value: "91%" },
      { label: "Solar capture", value: "9%" },
      { label: "Opportunity gap", value: "80%" },
      { label: "Grid stability", value: "22%" },
    ],
    stats: [
      { label: "Urban demand supplied by thermal sources", value: "91%" },
      { label: "Actual solar capture", value: "9%" },
      { label: "Public lighting still inefficient", value: "75%" },
      { label: "Danger window", value: "40C afternoons" },
    ],
    charts: [
      {
        type: "stacked-bar",
        title: "The Fossil Anchor",
        subtitle: "Urban demand vs supply source",
        data: stackedSeries(["Urban demand", "Supply source"], { fossil: [91, 91], solar: [9, 9] }),
        series: [
          { key: "fossil", label: "Fossil/Thermal - Heavy oil and diesel", color: "#FF3131" },
          { key: "solar", label: "Solar", color: "#FFBF00" },
        ],
      },
      {
        type: "area",
        title: "The Solar Opportunity Gap",
        subtitle: "Potential radiation vs actual grid capture",
        data: [
          { label: "08h", potential: 38, actual: 7 },
          { label: "10h", potential: 70, actual: 12 },
          { label: "12h", potential: 100, actual: 20 },
          { label: "14h", potential: 92, actual: 19 },
          { label: "16h", potential: 63, actual: 13 },
        ],
        series: [
          { key: "potential", label: "Potential energy", color: "#FFBF00" },
          { key: "actual", label: "Actual grid capture", color: "#FF3131" },
        ],
      },
      {
        type: "radial",
        title: "Peak Demand Stress",
        subtitle: "Danger zone during hot afternoons",
        value: 22,
        max: 100,
        centerValue: "22%",
        centerLabel: "Grid stability",
      },
      donutChart(
        "Public Lighting Waste",
        "Mercury vapor lamps vs LED",
        [
          { label: "Mercury vapor", value: "75" },
          { label: "LED", value: "25" },
        ],
        "75%",
        "Inefficient",
      ),
    ],
    alerts: [
      makeAlert("Efficiency failure", "The city is not short on sun. It is short on conversion, public retrofit, and fair energy planning."),
    ],
  },
  {
    key: "water",
    label: "Water Layer",
    icon: "droplets",
    status: "critical",
    state: "The Sao Francisco is visible, but raw sewage, evaporation, and unequal distribution still define who gets water first.",
    miniSummary: "Petrolina turns abundance into scarcity. Water exists in the landscape, yet treatment, oxygen, and access collapse where vulnerability is highest.",
    summaryStrip: [
      { label: "Raw sewage in river", value: "27%" },
      { label: "Access wealthy districts", value: "98%" },
      { label: "Access outlying favelas", value: "68%" },
      { label: "Dissolved oxygen", value: "14%" },
    ],
    stats: [
      { label: "Raw sewage dumped into river", value: "4.8M m3/year" },
      { label: "Residents affected by dry taps", value: "130k" },
      { label: "Canal evaporation pressure", value: "Extreme" },
      { label: "Peripheral outages", value: "90 days" },
    ],
    charts: [
      donutChart(
        "The River Wound",
        "Share of sewage flow",
        [
          { label: "Treated", value: "73" },
          { label: "Untreated", value: "27" },
        ],
        "27%",
        "Untreated",
      ),
      {
        type: "bar",
        title: "Geographic Inequality",
        subtitle: "Water access by territory",
        data: [
          { label: "River-front districts", access: 98 },
          { label: "Outlying favelas", access: 68 },
        ],
        series: [{ key: "access", label: "Water access", color: "#FF3131" }],
      },
      {
        type: "area",
        title: "The Evaporation Leak",
        subtitle: "Water lost in open irrigation canals",
        data: [
          { label: "08h", lost: 12 },
          { label: "10h", lost: 19 },
          { label: "12h", lost: 28 },
          { label: "14h", lost: 31 },
          { label: "16h", lost: 24 },
        ],
        series: [{ key: "lost", label: "Lost cubic meters", color: "#FF8C00" }],
      },
      progressChart("River Oxygen Levels", "Dissolved oxygen near discharge points", 14, "14%", "Oxygen"),
    ],
    alerts: [
      makeAlert("Water-energy nexus", "Pumping, treating, and losing water also burns energy. Scarcity is intensified by technical waste and social inequality together."),
    ],
  },
] as const;

export const petrolina: CityData = {
  slug: "petrolina",
  name: "Petrolina",
  logo: cityAssets.petrolina.logo,
  accent: cityAssets.petrolina.accent,
  accentSoft: cityAssets.petrolina.accentSoft,
  oneLineDescription: "A semi-arid paradox where river proximity and constant sun still feed scarcity, heat, and fossil dependence.",
  missionBrief:
    "Petrolina is framed as abundance: a major river, aggressive irrigation, and solar radiation almost every day of the year. But that surface story hides pressure. Poor districts still go dry, open canals lose water under violent heat, and untreated sewage damages the same river that should sustain the city. Energy repeats the pattern: high solar potential, low public capture, and a grid dragged by thermal dependence.",
  heroImage: cityAssets.petrolina.heroImage,
  secondaryImage: cityAssets.petrolina.secondaryImage,
  mapImage: cityAssets.petrolina.mapImage,
  macroStats: [
    { label: "Population", value: "386k" },
    { label: "Untreated sewage flow", value: "4.8M m3/year" },
    { label: "Canal evaporation", value: "Extreme" },
    { label: "Climate", value: "Semi-Arid BSh" },
  ],
  breadcrumbLabel: "The Semi-Arid Paradox",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
