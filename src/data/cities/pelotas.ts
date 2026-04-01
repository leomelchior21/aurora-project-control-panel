import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, stackedSeries, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "housing",
    label: "Housing Layer",
    icon: "building-2",
    status: "critical",
    state: "The walls hold moisture better than they hold heat, so mold and cold settle into daily life together.",
    miniSummary: "Pelotas turns architecture into exposure. Poor insulation, wet surfaces, and old envelopes mean residents pay for warmth they never fully receive.",
    summaryStrip: [
      { label: "Wall saturation", value: "88%" },
      { label: "Heat leakage", value: "40%" },
      { label: "Thermal barriers", value: "0.5%" },
      { label: "Wind chill peak", value: "-5C" },
    ],
    stats: [
      { label: "Historic building moisture", value: "88%" },
      { label: "Heat escaping walls", value: "40%" },
      { label: "Homes with insulation", value: "0.5%" },
      { label: "Chronic respiratory risk", value: "High" },
    ],
    charts: [
      {
        type: "heatmap",
        title: "The Mold Index",
        subtitle: "Wall moisture levels by building type",
        rows: [
          { label: "Historic center", cells: [{ label: "Stone walls", value: 88 }, { label: "Bedrooms", value: 82 }] },
          { label: "Social housing", cells: [{ label: "Exposed brick", value: 90 }, { label: "Living rooms", value: 84 }] },
          { label: "Retrofitted", cells: [{ label: "Protected walls", value: 42 }, { label: "Bedrooms", value: 38 }] },
        ],
      },
      {
        type: "bar",
        title: "The Thermal Leak",
        subtitle: "Energy in vs comfort out",
        data: [
          { label: "Heat generated", value: 100 },
          { label: "Comfort kept", value: 60 },
          { label: "Heat leaked", value: 40 },
        ],
        series: [{ key: "value", label: "Share", color: "#FFBF00" }],
      },
      donutChart(
        "Insulation Deficiency",
        "Homes with barriers vs exposed masonry",
        [
          { label: "Thermal barriers", value: "0.5" },
          { label: "Exposed brick/stone", value: "99.5" },
        ],
        "99.5%",
        "Exposed",
      ),
      {
        type: "line",
        title: "Wall Condensation Rate",
        subtitle: "Indoor tears during night cooling",
        data: [
          { label: "21h", drops: 18 },
          { label: "00h", drops: 32 },
          { label: "03h", drops: 49 },
          { label: "06h", drops: 41 },
        ],
        series: [{ key: "drops", label: "Condensation", color: "#7D93A8" }],
      },
    ],
    alerts: [
      makeAlert("Housing as exposure", "Cold is the trigger, but the deeper failure is architectural. The envelope leaks heat and stores dampness at the same time."),
    ],
  },
  {
    key: "energy",
    label: "Energy Layer",
    icon: "zap",
    status: "critical",
    state: "Winter demand surges because electric heaters work hardest exactly where homes leak the most heat.",
    miniSummary: "Pelotas reveals energy poverty as a design loop: inefficient buildings force expensive heating, and expensive heating still does not guarantee comfort.",
    summaryStrip: [
      { label: "Winter demand spike", value: "118%" },
      { label: "Income spent on bills", value: "35%" },
      { label: "Transmission loss", value: "18%" },
      { label: "Electric resistors", value: "70%" },
    ],
    stats: [
      { label: "Peak demand window", value: "18h-22h" },
      { label: "Low-wage winter burden", value: "35%" },
      { label: "Oxidized wiring losses", value: "18%" },
      { label: "Most common heater source", value: "Electric" },
    ],
    charts: [
      {
        type: "area",
        title: "Winter Peak Strain",
        subtitle: "Grid demand during cold snaps",
        data: [
          { label: "14h", demand: 44 },
          { label: "18h", demand: 78 },
          { label: "20h", demand: 118 },
          { label: "22h", demand: 102 },
          { label: "00h", demand: 61 },
        ],
        series: [{ key: "demand", label: "Demand", color: "#FF3131" }],
      },
      {
        type: "bar",
        title: "Energy Poverty",
        subtitle: "Share of income spent on electricity",
        data: [
          { label: "Low wage", burden: 35 },
          { label: "Median wage", burden: 18 },
          { label: "Upper income", burden: 7 },
        ],
        series: [{ key: "burden", label: "Income share", color: "#FFBF00" }],
      },
      {
        type: "radial",
        title: "Transmission Inefficiency",
        subtitle: "Power lost before reaching the home",
        value: 18,
        max: 100,
        centerValue: "18%",
        centerLabel: "Lost",
      },
      {
        type: "stacked-bar",
        title: "Heating Source Split",
        subtitle: "Most homes rely on inefficient resistors",
        data: stackedSeries(["Households"], { electric: [70], wood: [18], gas: [12] }),
        series: [
          { key: "electric", label: "Electric", color: "#FF3131" },
          { key: "wood", label: "Wood", color: "#C7762B" },
          { key: "gas", label: "Gas", color: "#8D98A8" },
        ],
      },
    ],
    alerts: [
      makeAlert("Paying for leakage", "The bill rises not only because winter is cold, but because homes and wires waste power before comfort reaches the body."),
    ],
  },
] as const;

export const pelotas: CityData = {
  slug: "pelotas",
  name: "Pelotas",
  logo: cityAssets.pelotas.logo,
  accent: cityAssets.pelotas.accent,
  accentSoft: cityAssets.pelotas.accentSoft,
  oneLineDescription: "A damp southern city where poor insulation turns winter into a cycle of mold, leakage, and energy poverty.",
  missionBrief:
    "Pelotas is not failing because it is cold. It is failing because the built environment does not protect people from the cold it already knows is coming. Moisture saturates walls, mold settles into bedrooms, and heat paid for by families escapes through uninsulated surfaces. When the Minuano wind cuts harder, the grid absorbs the pressure through electric heaters, overloaded circuits, and bills that consume an alarming share of household income.",
  heroImage: cityAssets.pelotas.heroImage,
  secondaryImage: cityAssets.pelotas.secondaryImage,
  mapImage: cityAssets.pelotas.mapImage,
  macroStats: [
    { label: "Humidity feeling", value: "90%+" },
    { label: "Mold in homes", value: "Frequent" },
    { label: "Heating burden", value: "High" },
    { label: "Minuano impact", value: "Severe" },
  ],
  breadcrumbLabel: "The Damp Cold",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
