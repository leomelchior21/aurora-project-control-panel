import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, progressChart, series, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "temperature",
    label: "Temperature",
    icon: "thermometer-snowflake",
    status: "critical",
    state: "Extreme cold continues to undermine daily life",
    summaryStrip: [{ label: "Avg temp", value: "-15C" }, { label: "Extreme days", value: "71" }, { label: "Heating access", value: "62%" }, { label: "Heat loss", value: "29%" }],
    stats: [{ label: "Avg Temp", value: "-15C" }, { label: "Extreme Days", value: "71/year" }, { label: "Indoor Heating Access", value: "62%" }, { label: "Heat Loss Rate", value: "29%" }],
    charts: [
      { type: "line", title: "Seasonal temperature profile", subtitle: "Annual curve", data: series([["Jan", -22], ["Mar", -18], ["May", -8], ["Jul", 2], ["Sep", -4], ["Nov", -17]]), series: [{ key: "value", label: "Temp" }] },
      { type: "radial", title: "Indoor comfort", subtitle: "Heated interior reach", value: 62, max: 100, centerValue: "62%", centerLabel: "Access" },
      { type: "bar", title: "Who has heating", subtitle: "Homes with access", data: series([["Access", 62], ["No access", 38]]), series: [{ key: "value", label: "Coverage" }] },
      { type: "progress", title: "Extreme day count", subtitle: "Cold pressure", value: 71, max: 100, centerValue: "71", centerLabel: "Days" },
    ],
  },
  {
    key: "water", label: "Water", icon: "droplets", status: "critical", state: "Water access is restricted by freezing conditions",
    summaryStrip: [{ label: "Frozen", value: "72%" }, { label: "Liquid", value: "28%" }, { label: "Pipe failures", value: "+18%" }, { label: "Storage", value: "Low" }],
    stats: [{ label: "Frozen Supply", value: "72%" }, { label: "Liquid Access", value: "28%" }, { label: "Pipe Failures", value: "+18%" }, { label: "Water Storage", value: "Low" }],
    charts: [
      donutChart("Frozen and liquid water", "Water state", [{ label: "Frozen", value: "72" }, { label: "Liquid", value: "28" }], "72%", "Frozen"),
      { type: "bar", title: "Broken pipes", subtitle: "Pipe problems", data: series([["Before", 100], ["Now", 118]]), series: [{ key: "value", label: "Level" }] },
      progressChart("Stored water", "Backup water", 24, "Low", "Stored"),
      { type: "line", title: "Water through the year", subtitle: "Liquid water", data: series([["Winter", 18], ["Spring", 34], ["Summer", 41], ["Autumn", 29]]), series: [{ key: "value", label: "Water" }] },
    ],
  },
  {
    key: "air", label: "Air", icon: "wind", status: "attention", state: "Indoor air quality is under stress from enclosed heating environments",
    summaryStrip: [{ label: "Air score", value: "112" }, { label: "Indoor issues", value: "High" }, { label: "Fresh air", value: "39%" }, { label: "Heating smoke", value: "+21%" }],
    stats: [{ label: "Air score", value: "112" }, { label: "Indoor air issues", value: "High" }, { label: "Airflow quality", value: "39%" }, { label: "Heating pollution", value: "+21%" }],
    charts: [
      { type: "radial", title: "Air score", subtitle: "Today", value: 62, max: 100, centerValue: "112", centerLabel: "Air" },
      { type: "bar", title: "Indoor vs outdoor air", subtitle: "Condition score", data: series([["Indoor", 68], ["Outdoor", 44]]), series: [{ key: "value", label: "Stress" }] },
      { type: "line", title: "Heating smoke", subtitle: "Over time", data: series([["Y1", 100], ["Y2", 109], ["Y3", 121]]), series: [{ key: "value", label: "Level" }] },
      progressChart("Fresh air", "Inside buildings", 39, "39%", "Fresh air"),
    ],
  },
  {
    key: "sun", label: "Sun", icon: "sun-dim", status: "critical", state: "Solar conditions are weak and highly seasonal",
    summaryStrip: [{ label: "Solar output", value: "9%" }, { label: "Dark months", value: "5" }, { label: "Need for lights", value: "83%" }, { label: "Season change", value: "Extreme" }],
    stats: [{ label: "Solar output", value: "9%" }, { label: "Dark months", value: "5" }, { label: "Need for lights", value: "83%" }, { label: "Season change", value: "Extreme" }],
    charts: [
      { type: "area", title: "Daylight curve", subtitle: "Annual daylight", data: series([["Jan", 3], ["Mar", 6], ["May", 12], ["Jul", 16], ["Sep", 10], ["Nov", 4]]), series: [{ key: "value", label: "Hours" }] },
      donutChart("Lighting dependency", "Natural vs artificial", [{ label: "Artificial", value: "83" }, { label: "Natural", value: "17" }], "83%", "Artificial"),
      { type: "bar", title: "Light source split", subtitle: "Daily use", data: series([["Natural", 17], ["Artificial", 83]]), series: [{ key: "value", label: "Share" }] },
      progressChart("Dark season", "How long it lasts", 83, "5", "Months"),
    ],
  },
  {
    key: "wind", label: "Wind", icon: "wind", status: "critical", state: "Wind dramatically amplifies cold exposure",
    summaryStrip: [{ label: "Wind chill", value: "-28C" }, { label: "Heat loss", value: "+52%" }, { label: "Barrier", value: "17%" }, { label: "Exposure", value: "High" }],
    stats: [{ label: "Feels-like cold", value: "-28C" }, { label: "Heat loss", value: "+52%" }, { label: "Wind barriers", value: "17%" }, { label: "Outdoor risk", value: "High" }],
    charts: [
      { type: "radial", title: "Feels-like cold", subtitle: "Today", value: 91, max: 100, centerValue: "-28C", centerLabel: "Cold" },
      { type: "bar", title: "Wind barriers", subtitle: "Safe and open", data: series([["Protected", 17], ["Exposed", 83]]), series: [{ key: "value", label: "Share" }] },
      { type: "bar", title: "Heat loss with wind", subtitle: "Impact comparison", data: series([["No wind", 100], ["With wind", 152]]), series: [{ key: "value", label: "Loss" }] },
      progressChart("Exposure risk", "Outdoor conditions", 88, "High", "Risk"),
    ],
  },
  {
    key: "energy", label: "Energy", icon: "zap", status: "critical", state: "Energy system is expensive, fossil-heavy, and unstable",
    summaryStrip: [{ label: "Fossil", value: "96%" }, { label: "Renewable", value: "0%" }, { label: "Cost", value: "+45%" }, { label: "Shortages", value: "Frequent" }],
    stats: [{ label: "Fossil power", value: "96%" }, { label: "Renewables", value: "0%" }, { label: "Energy cost", value: "+45%" }, { label: "Shortages", value: "Frequent" }],
    charts: [
      donutChart("Energy mix", "Supply mix", [{ label: "Fossil", value: "96" }, { label: "Renewable", value: "0" }, { label: "Other", value: "4" }], "96%", "Fossil"),
      { type: "bar", title: "Energy cost", subtitle: "Then and now", data: series([["Before", 100], ["Now", 145]]), series: [{ key: "value", label: "Level" }] },
      { type: "line", title: "Winter demand", subtitle: "Peak demand curve", data: series([["06", 44], ["10", 67], ["14", 78], ["18", 91], ["22", 73]]), series: [{ key: "value", label: "Demand" }] },
      { type: "progress", title: "Shortage frequency", subtitle: "Grid alert", value: 82, max: 100, centerValue: "Frequent", centerLabel: "Shortage" },
    ],
    alerts: [makeAlert("Winter spikes", "Demand surges and grid instability align during dark cold periods.")],
  },
  {
    key: "waste", label: "Waste", icon: "trash-2", status: "critical", state: "Low decomposition creates buildup and storage stress",
    summaryStrip: [{ label: "Breakdown", value: "Very Low" }, { label: "Build-up", value: "High" }, { label: "Recycling", value: "21%" }, { label: "Overflow", value: "Frequent" }],
    stats: [{ label: "Breakdown", value: "Very Low" }, { label: "Waste build-up", value: "High" }, { label: "Recycling", value: "21%" }, { label: "Overflow", value: "Frequent" }],
    charts: [
      { type: "bar", title: "Waste destination", subtitle: "Current handling", data: series([["Recycled", 21], ["Stored", 46], ["Overflow", 33]]), series: [{ key: "value", label: "Share" }] },
      { type: "line", title: "Waste build-up", subtitle: "Stored waste", data: series([["W1", 38], ["W2", 43], ["W3", 49], ["W4", 57]]), series: [{ key: "value", label: "Waste" }] },
      progressChart("Recycling progress", "Current rate", 21, "21%", "Recycle"),
      { type: "progress", title: "Overflow alert", subtitle: "Storage pressure", value: 84, max: 100, centerValue: "High", centerLabel: "Risk" },
    ],
  },
  {
    key: "housing", label: "Housing", icon: "building-2", status: "attention", state: "Insulation exists, but housing still leaks energy",
    summaryStrip: [{ label: "Insulated", value: "58%" }, { label: "Power use", value: "Low" }, { label: "Heating failures", value: "+14%" }, { label: "Crowding", value: "Moderate" }],
    stats: [{ label: "Insulated homes", value: "58%" }, { label: "Power use", value: "Low" }, { label: "Heating failures", value: "+14%" }, { label: "Crowding", value: "Moderate" }],
    charts: [
      { type: "bar", title: "Insulation split", subtitle: "Housing stock", data: series([["Insulated", 58], ["Not insulated", 42]]), series: [{ key: "value", label: "Share" }] },
      { type: "radial", title: "Power use", subtitle: "Homes today", value: 36, max: 100, centerValue: "Low", centerLabel: "Power" },
      { type: "line", title: "Heating failures", subtitle: "Over time", data: series([["Y1", 100], ["Y2", 107], ["Y3", 114]]), series: [{ key: "value", label: "Level" }] },
      { type: "bar", title: "Housing condition", subtitle: "Condition blocks", data: series([["Core", 52], ["Outer", 41], ["Industrial edge", 33]]), series: [{ key: "value", label: "Condition" }] },
    ],
  },
  {
    key: "transportation", label: "Transportation", icon: "tram-front", status: "critical", state: "Cold and ice repeatedly disrupt mobility",
    summaryStrip: [{ label: "Failure days", value: "48" }, { label: "Accidents", value: "High" }, { label: "Transit reliability", value: "61%" }, { label: "Trip cost", value: "High" }],
    stats: [{ label: "Failure days", value: "48/year" }, { label: "Ice accidents", value: "High" }, { label: "Transit service", value: "61%" }, { label: "Trip energy use", value: "High" }],
    charts: [
      { type: "radial", title: "Transit service", subtitle: "Today", value: 61, max: 100, centerValue: "61%", centerLabel: "Transit" },
      { type: "bar", title: "Incident count", subtitle: "Winter mobility incidents", data: series([["Road", 72], ["Transit", 41], ["Pedestrian", 58]]), series: [{ key: "value", label: "Incidents" }] },
      { type: "line", title: "Interruption timeline", subtitle: "Monthly service interruptions", data: series([["Jan", 9], ["Feb", 8], ["Mar", 5], ["Apr", 3], ["Nov", 8], ["Dec", 10]]), series: [{ key: "value", label: "Days" }] },
      { type: "bar", title: "Operations", subtitle: "Normal vs winter", data: series([["Normal", 100], ["Winter", 61]]), series: [{ key: "value", label: "Performance" }] },
    ],
  },
  {
    key: "biodiversity", label: "Biodiversity", icon: "trees", status: "critical", state: "Ecological recovery is slow and fragile",
    summaryStrip: [{ label: "Native survival", value: "22%" }, { label: "Controlled ecosystems", value: "Limited" }, { label: "Green", value: "9%" }, { label: "Recovery", value: "Slow" }],
    stats: [{ label: "Species survival", value: "22%" }, { label: "Safe nature areas", value: "Limited" }, { label: "Green space", value: "9%" }, { label: "Recovery", value: "Slow" }],
    charts: [
      donutChart("Nature health", "Today", [{ label: "Stable", value: "22" }, { label: "At risk", value: "78" }], "22%", "Stable"),
      { type: "bar", title: "Green space", subtitle: "Today", data: series([["Green", 9], ["Non-green", 91]]), series: [{ key: "value", label: "Share" }] },
      { type: "line", title: "Nature recovery", subtitle: "Over time", data: series([["Y1", 22], ["Y2", 24], ["Y3", 27], ["Y4", 30]]), series: [{ key: "value", label: "Level" }] },
      { type: "progress", title: "Ecosystem vulnerability", subtitle: "Current fragility", value: 88, max: 100, centerValue: "High", centerLabel: "Risk" },
    ],
  },
] as const;

export const frostara: CityData = {
  slug: "frostara",
  name: "Frostara",
  logo: cityAssets.frostara.logo,
  accent: cityAssets.frostara.accent,
  accentSoft: cityAssets.frostara.accentSoft,
  oneLineDescription: "A freezing city where survival depends on energy, insulation, and resilience.",
  missionBrief:
    "Frostara lives under constant thermal pressure. Extreme cold, long dark periods, frozen water access, and wind exposure make infrastructure difficult to maintain. Energy is essential, but costly and unstable. The city is forced to spend much of its strength just to remain functional.",
  heroImage: cityAssets.frostara.heroImage,
  secondaryImage: cityAssets.frostara.secondaryImage,
  mapImage: cityAssets.frostara.mapImage,
  macroStats: [
    { label: "Population", value: "1.3M" },
    { label: "Area", value: "890 km2" },
    { label: "Density", value: "1,460/km2" },
    { label: "GDP", value: "$51B" },
    { label: "Climate", value: "Subpolar" },
    { label: "Frozen Season Pressure", value: "Very High" },
  ],
  breadcrumbLabel: "Subpolar City",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
