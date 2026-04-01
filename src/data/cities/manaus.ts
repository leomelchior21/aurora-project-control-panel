import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, progressChart, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "air",
    label: "Air + Temperature",
    icon: "wind",
    status: "critical",
    state: "Humidity, heat islands, and trapped PM2.5 turn the center into a stagnant heat chamber.",
    miniSummary: "Manaus shows how a rainforest city can still become thermally hostile when asphalt, exhaust, and blocked airflow replace shade and ventilation.",
    summaryStrip: [
      { label: "Ambient humidity", value: "94%" },
      { label: "Heat index", value: "46C" },
      { label: "Asphalt vs canopy", value: "14C" },
      { label: "Natural airflow loss", value: "70%" },
    ],
    stats: [
      { label: "Air temperature", value: "34C" },
      { label: "PM2.5 hot spot", value: "Critical" },
      { label: "Industrial district surface pressure", value: "High" },
      { label: "Bus terminal ventilation", value: "Failing" },
    ],
    charts: [
      {
        type: "area",
        title: "The Humidity Trap",
        subtitle: "Humidity, temperature, and heat index",
        data: [
          { label: "10h", humidity: 91, heat: 38 },
          { label: "12h", humidity: 94, heat: 42 },
          { label: "14h", humidity: 94, heat: 46 },
          { label: "16h", humidity: 92, heat: 43 },
          { label: "18h", humidity: 89, heat: 37 },
        ],
        series: [
          { key: "humidity", label: "Ambient humidity", color: "#1FB6FF" },
          { key: "heat", label: "Heat index", color: "#FF3131" },
        ],
      },
      {
        type: "heatmap",
        title: "Urban Heat Islands",
        subtitle: "Industrial district vs forest reserve",
        rows: [
          { label: "Industrial district", cells: [{ label: "Asphalt", value: 94 }, { label: "Canopy", value: 16 }] },
          { label: "Central terminal", cells: [{ label: "Asphalt", value: 88 }, { label: "Canopy", value: 20 }] },
          { label: "Forest reserve", cells: [{ label: "Asphalt", value: 24 }, { label: "Canopy", value: 80 }] },
        ],
      },
      {
        type: "radial",
        title: "Stagnant Air Quality",
        subtitle: "PM2.5 trapped by weak wind",
        value: 84,
        max: 100,
        centerValue: "PM2.5",
        centerLabel: "Critical",
      },
      {
        type: "bar",
        title: "Ventilation Loss",
        subtitle: "Open wind paths vs high-rise blockages",
        data: [
          { label: "Open wind paths", airflow: 30 },
          { label: "High-rise blockages", airflow: 70 },
        ],
        series: [{ key: "airflow", label: "Share", color: "#FFBF00" }],
      },
    ],
    alerts: [
      makeAlert("Rainforest without relief", "The forest biome is nearby, but the built core has stripped away the cooling services that once stabilized urban life."),
    ],
  },
  {
    key: "waste",
    label: "Waste Layer",
    icon: "trash-2",
    status: "critical",
    state: "Plastic and sewage choke the igarapes, turning water pathways into slow toxic storage.",
    miniSummary: "Waste in Manaus is not only a landfill issue. It is a drainage, water, methane, and public health failure unfolding in the open.",
    summaryStrip: [
      { label: "Plastic pulse", value: "30 ton/day" },
      { label: "Formal collection", value: "40%" },
      { label: "River dumping", value: "60%" },
      { label: "Waterways clogged", value: "65%" },
    ],
    stats: [
      { label: "Sewage coverage", value: "40%" },
      { label: "Peak plastic entry during rain", value: "30 ton/day" },
      { label: "Anaerobic methane risk", value: "High" },
      { label: "Blocked igarapés", value: "65%" },
    ],
    charts: [
      {
        type: "line",
        title: "The Plastic Pulse",
        subtitle: "Daily tons entering igarapes",
        data: [
          { label: "Mon", tons: 14 },
          { label: "Tue", tons: 17 },
          { label: "Wed", tons: 21 },
          { label: "Storm", tons: 30 },
          { label: "Fri", tons: 18 },
        ],
        series: [{ key: "tons", label: "Tons", color: "#FF3131" }],
      },
      donutChart(
        "Collection Failure",
        "Formal city collection vs informal dumping",
        [
          { label: "Formal collection", value: "40" },
          { label: "Informal or river dumping", value: "60" },
        ],
        "60%",
        "Missed",
      ),
      {
        type: "bar",
        title: "Decomposition Lag",
        subtitle: "Wet waste vs dry conditions",
        data: [
          { label: "Wet waste", days: 15 },
          { label: "Dry condition", days: 7 },
        ],
        series: [{ key: "days", label: "Rot cycle", color: "#C7762B" }],
      },
      progressChart("Drainage Blockage", "Natural igarapés physically clogged", 65, "65%", "Blocked"),
    ],
    alerts: [
      makeAlert("Water path collapse", "When waste blocks the igarape, the city loses drainage, oxygen, and a basic environmental memory all at once."),
    ],
  },
] as const;

export const manaus: CityData = {
  slug: "manaus",
  name: "Manaus",
  logo: cityAssets.manaus.logo,
  accent: cityAssets.manaus.accent,
  accentSoft: cityAssets.manaus.accentSoft,
  oneLineDescription: "A tropical metropolis where humidity, exhaust, and plastic pollution override the cooling logic of the rainforest.",
  missionBrief:
    "Manaus is surrounded by the largest rainforest on Earth, yet central urban life reads like environmental amnesia. Heat islands intensify under asphalt, air stagnates between towers and traffic, and the body feels temperatures far beyond the thermometer because humidity never releases its grip. At the same time, igarapés carry plastic, sewage, and blocked drainage, turning what should be living water paths into evidence of civic neglect.",
  heroImage: cityAssets.manaus.heroImage,
  secondaryImage: cityAssets.manaus.secondaryImage,
  mapImage: cityAssets.manaus.mapImage,
  macroStats: [
    { label: "Sewage coverage", value: "40%" },
    { label: "Plastic in igarapes", value: "30 ton/day" },
    { label: "Tree canopy deficit", value: "Critical" },
    { label: "Climate", value: "Tropical Equatorial" },
  ],
  breadcrumbLabel: "The Drowning Rainforest",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
