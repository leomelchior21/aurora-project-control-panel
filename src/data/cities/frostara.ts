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
      { type: "bar", title: "Heating access", subtitle: "Population coverage", data: series([["Access", 62], ["No access", 38]]), series: [{ key: "value", label: "Coverage" }] },
      { type: "progress", title: "Extreme day count", subtitle: "Cold pressure", value: 71, max: 100, centerValue: "71", centerLabel: "Days" },
    ],
  },
  {
    key: "water", label: "Water", icon: "droplets", status: "critical", state: "Water access is restricted by freezing conditions",
    summaryStrip: [{ label: "Frozen", value: "72%" }, { label: "Liquid", value: "28%" }, { label: "Pipe failures", value: "+18%" }, { label: "Storage", value: "Low" }],
    stats: [{ label: "Frozen Supply", value: "72%" }, { label: "Liquid Access", value: "28%" }, { label: "Pipe Failures", value: "+18%" }, { label: "Water Storage", value: "Low" }],
    charts: [
      donutChart("Water state", "Availability split", [{ label: "Frozen", value: "72" }, { label: "Liquid", value: "28" }], "72%", "Frozen"),
      { type: "bar", title: "Infrastructure failures", subtitle: "Pipe stress", data: series([["Base", 100], ["Current", 118]]), series: [{ key: "value", label: "Index" }] },
      progressChart("Storage resilience", "Reserve strength", 24, "Low", "Storage"),
      { type: "line", title: "Seasonal availability", subtitle: "Liquid access", data: series([["Winter", 18], ["Spring", 34], ["Summer", 41], ["Autumn", 29]]), series: [{ key: "value", label: "Availability" }] },
    ],
  },
  {
    key: "air", label: "Air", icon: "wind", status: "attention", state: "Indoor air quality is under stress from enclosed heating environments",
    summaryStrip: [{ label: "AQI", value: "112" }, { label: "Indoor issues", value: "High" }, { label: "Ventilation", value: "39%" }, { label: "Heating pollution", value: "+21%" }],
    stats: [{ label: "AQI", value: "112" }, { label: "Indoor Air Quality Issues", value: "High" }, { label: "Ventilation Efficiency", value: "39%" }, { label: "Pollution from Heating", value: "+21%" }],
    charts: [
      { type: "radial", title: "AQI", subtitle: "Current severity", value: 62, max: 100, centerValue: "112", centerLabel: "AQI" },
      { type: "bar", title: "Indoor vs outdoor air", subtitle: "Condition score", data: series([["Indoor", 68], ["Outdoor", 44]]), series: [{ key: "value", label: "Stress" }] },
      { type: "line", title: "Heating pollution", subtitle: "Trend", data: series([["Y1", 100], ["Y2", 109], ["Y3", 121]]), series: [{ key: "value", label: "Index" }] },
      progressChart("Ventilation efficiency", "Building performance", 39, "39%", "Ventilation"),
    ],
  },
  {
    key: "sun", label: "Sun", icon: "sun-dim", status: "critical", state: "Solar conditions are weak and highly seasonal",
    summaryStrip: [{ label: "Solar output", value: "9%" }, { label: "Dark months", value: "5" }, { label: "Lighting dependency", value: "83%" }, { label: "Variability", value: "Extreme" }],
    stats: [{ label: "Solar Output", value: "9%" }, { label: "Dark Months", value: "5" }, { label: "Artificial Lighting Dependency", value: "83%" }, { label: "Seasonal Variability", value: "Extreme" }],
    charts: [
      { type: "area", title: "Daylight curve", subtitle: "Annual daylight", data: series([["Jan", 3], ["Mar", 6], ["May", 12], ["Jul", 16], ["Sep", 10], ["Nov", 4]]), series: [{ key: "value", label: "Hours" }] },
      donutChart("Lighting dependency", "Natural vs artificial", [{ label: "Artificial", value: "83" }, { label: "Natural", value: "17" }], "83%", "Artificial"),
      { type: "bar", title: "Light source split", subtitle: "Daily use", data: series([["Natural", 17], ["Artificial", 83]]), series: [{ key: "value", label: "Share" }] },
      progressChart("Dark season duration", "Severity", 83, "5", "Months"),
    ],
  },
  {
    key: "wind", label: "Wind", icon: "wind", status: "critical", state: "Wind dramatically amplifies cold exposure",
    summaryStrip: [{ label: "Wind chill", value: "-28C" }, { label: "Heat loss", value: "+52%" }, { label: "Barrier", value: "17%" }, { label: "Exposure", value: "High" }],
    stats: [{ label: "Wind Chill", value: "-28C" }, { label: "Heat Loss Impact", value: "+52%" }, { label: "Wind Barrier Coverage", value: "17%" }, { label: "Outdoor Exposure Risk", value: "High" }],
    charts: [
      { type: "radial", title: "Wind chill", subtitle: "Exposure severity", value: 91, max: 100, centerValue: "-28C", centerLabel: "Chill" },
      { type: "bar", title: "Barrier coverage", subtitle: "Protected vs exposed", data: series([["Protected", 17], ["Exposed", 83]]), series: [{ key: "value", label: "Coverage" }] },
      { type: "bar", title: "Heat loss with wind", subtitle: "Impact comparison", data: series([["No wind", 100], ["With wind", 152]]), series: [{ key: "value", label: "Loss" }] },
      progressChart("Exposure risk", "Outdoor conditions", 88, "High", "Risk"),
    ],
  },
  {
    key: "energy", label: "Energy", icon: "zap", status: "critical", state: "Energy system is expensive, fossil-heavy, and unstable",
    summaryStrip: [{ label: "Fossil", value: "64%" }, { label: "Renewable", value: "18%" }, { label: "Cost", value: "+45%" }, { label: "Shortages", value: "Frequent" }],
    stats: [{ label: "Fossil Dependency", value: "64%" }, { label: "Renewable Share", value: "18%" }, { label: "Energy Cost", value: "+45%" }, { label: "Shortages", value: "Frequent" }],
    charts: [
      donutChart("Energy mix", "Supply mix", [{ label: "Fossil", value: "64" }, { label: "Renewable", value: "18" }, { label: "Other", value: "18" }], "64%", "Fossil"),
      { type: "bar", title: "Cost increase", subtitle: "Relative to baseline", data: series([["Baseline", 100], ["Current", 145]]), series: [{ key: "value", label: "Index" }] },
      { type: "line", title: "Winter demand", subtitle: "Peak demand curve", data: series([["06", 44], ["10", 67], ["14", 78], ["18", 91], ["22", 73]]), series: [{ key: "value", label: "Demand" }] },
      { type: "progress", title: "Shortage frequency", subtitle: "Grid alert", value: 82, max: 100, centerValue: "Frequent", centerLabel: "Shortage" },
    ],
    alerts: [makeAlert("Winter spikes", "Demand surges and grid instability align during dark cold periods.")],
  },
  {
    key: "waste", label: "Waste", icon: "trash-2", status: "critical", state: "Low decomposition creates buildup and storage stress",
    summaryStrip: [{ label: "Decomposition", value: "Very Low" }, { label: "Accumulation", value: "High" }, { label: "Recycling", value: "21%" }, { label: "Overflow", value: "Frequent" }],
    stats: [{ label: "Decomposition Rate", value: "Very Low" }, { label: "Waste Accumulation", value: "High" }, { label: "Recycling", value: "21%" }, { label: "Storage Overflow", value: "Frequent" }],
    charts: [
      { type: "bar", title: "Waste destination", subtitle: "Current handling", data: series([["Recycled", 21], ["Stored", 46], ["Overflow", 33]]), series: [{ key: "value", label: "Share" }] },
      { type: "line", title: "Accumulation trend", subtitle: "Stored waste volume", data: series([["W1", 38], ["W2", 43], ["W3", 49], ["W4", 57]]), series: [{ key: "value", label: "Volume" }] },
      progressChart("Recycling progress", "Current rate", 21, "21%", "Recycle"),
      { type: "progress", title: "Overflow alert", subtitle: "Storage pressure", value: 84, max: 100, centerValue: "High", centerLabel: "Risk" },
    ],
  },
  {
    key: "housing", label: "Housing", icon: "building-2", status: "attention", state: "Insulation exists, but housing still leaks energy",
    summaryStrip: [{ label: "Insulated", value: "58%" }, { label: "Efficiency", value: "Low" }, { label: "Heating failures", value: "+14%" }, { label: "Overcrowding", value: "Moderate" }],
    stats: [{ label: "Insulated Housing", value: "58%" }, { label: "Energy Efficiency", value: "Low" }, { label: "Heating Failures", value: "+14%" }, { label: "Overcrowding", value: "Moderate" }],
    charts: [
      { type: "bar", title: "Insulation split", subtitle: "Housing stock", data: series([["Insulated", 58], ["Not insulated", 42]]), series: [{ key: "value", label: "Share" }] },
      { type: "radial", title: "Efficiency meter", subtitle: "Current building efficiency", value: 36, max: 100, centerValue: "Low", centerLabel: "Efficiency" },
      { type: "line", title: "Heating failures", subtitle: "Trend", data: series([["Y1", 100], ["Y2", 107], ["Y3", 114]]), series: [{ key: "value", label: "Index" }] },
      { type: "bar", title: "Housing condition", subtitle: "Condition blocks", data: series([["Core", 52], ["Outer", 41], ["Industrial edge", 33]]), series: [{ key: "value", label: "Condition" }] },
    ],
  },
  {
    key: "transportation", label: "Transportation", icon: "tram-front", status: "critical", state: "Cold and ice repeatedly disrupt mobility",
    summaryStrip: [{ label: "Failure days", value: "48" }, { label: "Accidents", value: "High" }, { label: "Transit reliability", value: "61%" }, { label: "Trip cost", value: "High" }],
    stats: [{ label: "Mobility Failure Days", value: "48/year" }, { label: "Ice-related Accidents", value: "High" }, { label: "Public Transport Reliability", value: "61%" }, { label: "Energy Cost per Trip", value: "High" }],
    charts: [
      { type: "radial", title: "Reliability", subtitle: "Transit reliability", value: 61, max: 100, centerValue: "61%", centerLabel: "Transit" },
      { type: "bar", title: "Incident count", subtitle: "Winter mobility incidents", data: series([["Road", 72], ["Transit", 41], ["Pedestrian", 58]]), series: [{ key: "value", label: "Incidents" }] },
      { type: "line", title: "Interruption timeline", subtitle: "Monthly service interruptions", data: series([["Jan", 9], ["Feb", 8], ["Mar", 5], ["Apr", 3], ["Nov", 8], ["Dec", 10]]), series: [{ key: "value", label: "Days" }] },
      { type: "bar", title: "Operations", subtitle: "Normal vs winter", data: series([["Normal", 100], ["Winter", 61]]), series: [{ key: "value", label: "Performance" }] },
    ],
  },
  {
    key: "biodiversity", label: "Biodiversity", icon: "trees", status: "critical", state: "Ecological recovery is slow and fragile",
    summaryStrip: [{ label: "Native survival", value: "22%" }, { label: "Controlled ecosystems", value: "Limited" }, { label: "Green", value: "9%" }, { label: "Recovery", value: "Slow" }],
    stats: [{ label: "Native Survival", value: "22%" }, { label: "Controlled Ecosystems", value: "Limited" }, { label: "Green Coverage", value: "9%" }, { label: "Recovery Rate", value: "Slow" }],
    charts: [
      donutChart("Biodiversity capacity", "Current resilience", [{ label: "Stable", value: "22" }, { label: "At risk", value: "78" }], "22%", "Stable"),
      { type: "bar", title: "Green coverage", subtitle: "Current urban green", data: series([["Green", 9], ["Non-green", 91]]), series: [{ key: "value", label: "Coverage" }] },
      { type: "line", title: "Recovery timeline", subtitle: "Projected recovery speed", data: series([["Y1", 22], ["Y2", 24], ["Y3", 27], ["Y4", 30]]), series: [{ key: "value", label: "Index" }] },
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
