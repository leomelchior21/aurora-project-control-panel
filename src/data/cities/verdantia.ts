import type { CityData } from "../../types/city";
import { cityAssets } from "../shared/assets";
import { donutChart, makeAlert, progressChart, series, stackedSeries, statusSummary } from "../shared/helpers";

const layers = [
  {
    key: "temperature", label: "Temperature", icon: "thermometer", status: "attention", state: "Heat and humidity combine into persistent discomfort",
    summaryStrip: [{ label: "Avg temp", value: "28C" }, { label: "Humidity", value: "91%" }, { label: "Heat index", value: "36C" }, { label: "Comfort", value: "Low" }],
    stats: [{ label: "Air temp", value: "28C" }, { label: "Humidity", value: "91%" }, { label: "Feels-like heat", value: "36C" }, { label: "Comfort", value: "Low" }],
    charts: [
      { type: "area", title: "Feels-like heat", subtitle: "One day", data: [{ label: "06", air: 24, heatIndex: 28 }, { label: "10", air: 28, heatIndex: 34 }, { label: "14", air: 31, heatIndex: 36 }, { label: "18", air: 29, heatIndex: 34 }, { label: "22", air: 26, heatIndex: 30 }], series: [{ key: "heatIndex", label: "Feels like" }, { key: "air", label: "Air temp" }] },
      { type: "radial", title: "Humidity meter", subtitle: "Ambient humidity", value: 91, max: 100, centerValue: "91%", centerLabel: "Humidity" },
      { type: "bar", title: "Air vs heat index", subtitle: "Temperature comparison", data: series([["Air", 28], ["Heat index", 36]]), series: [{ key: "value", label: "Temp" }] },
      { type: "progress", title: "Comfort gauge", subtitle: "Thermal comfort", value: 34, max: 100, centerValue: "Low", centerLabel: "Comfort" },
    ],
  },
  {
    key: "water", label: "Water", icon: "droplets", status: "critical", state: "Water is abundant, but quality and drainage are failing",
    summaryStrip: [{ label: "Water quality", value: "58%" }, { label: "Flood risk", value: "47%" }, { label: "Untreated", value: "31%" }, { label: "Drainage", value: "Low" }],
    stats: [{ label: "Water quality", value: "58%" }, { label: "Flood risk", value: "47%" }, { label: "Dirty water", value: "31%" }, { label: "Drainage", value: "Low" }],
    charts: [
      { type: "area", title: "Flood risk curve", subtitle: "Rain event response", data: series([["Low rain", 18], ["Moderate", 33], ["Heavy", 47], ["Extreme", 69]]), series: [{ key: "value", label: "Risk" }] },
      { type: "bar", title: "Treated vs untreated", subtitle: "Water handling", data: series([["Treated", 69], ["Untreated", 31]]), series: [{ key: "value", label: "Share" }] },
      { type: "radial", title: "Water quality", subtitle: "WQI", value: 58, max: 100, centerValue: "58%", centerLabel: "WQI" },
      progressChart("Drainage efficiency", "Network readiness", 36, "Low", "Drainage"),
    ],
    alerts: [makeAlert("Flooding follows clogging", "Drainage underperformance turns heavy rain into a system-wide failure.")],
  },
  {
    key: "air", label: "Air", icon: "wind", status: "critical", state: "Poor circulation traps humidity and pollutants",
    summaryStrip: [{ label: "Air score", value: "142" }, { label: "Airflow", value: "Low" }, { label: "Mold risk", value: "High" }, { label: "Trapped air", value: "Severe" }],
    stats: [{ label: "Air score", value: "142" }, { label: "Airflow", value: "Low" }, { label: "Mold risk", value: "High" }, { label: "Trapped air", value: "Severe" }],
    charts: [
      { type: "heatmap", title: "Stagnant air zones", subtitle: "Zone map", rows: [{ label: "River belt", cells: [{ label: "A", value: 88 }, { label: "B", value: 80 }, { label: "C", value: 72 }] }, { label: "Dense core", cells: [{ label: "A", value: 93 }, { label: "B", value: 86 }, { label: "C", value: 78 }] }] },
      { type: "radial", title: "Air score", subtitle: "Today", value: 71, max: 100, centerValue: "142", centerLabel: "Air" },
      { type: "stacked-bar", title: "Air condition stack", subtitle: "Circulation, humidity, mold", data: stackedSeries(["Condition"], { circulation: [28], humidity: [91], mold: [76] }), series: [{ key: "circulation", label: "Circulation" }, { key: "humidity", label: "Humidity" }, { key: "mold", label: "Mold risk" }] },
      { type: "progress", title: "Trapped air", subtitle: "Today", value: 87, max: 100, centerValue: "Severe", centerLabel: "Risk" },
    ],
  },
  {
    key: "sun", label: "Sun", icon: "sun", status: "attention", state: "Sunlight exists, but vegetation and cloud cover reduce capture",
    summaryStrip: [{ label: "Solar capture", value: "42%" }, { label: "Blockage", value: "High" }, { label: "Cloud cover", value: "Frequent" }, { label: "Solar energy", value: "Limited" }],
    stats: [{ label: "Solar Capture", value: "42%" }, { label: "Light Blockage", value: "High" }, { label: "Cloud Cover", value: "Frequent" }, { label: "Energy from Sun", value: "Limited" }],
    charts: [
      donutChart("Usable sunlight", "Capture vs blockage", [{ label: "Usable", value: "42" }, { label: "Blocked", value: "58" }], "42%", "Usable"),
      { type: "line", title: "Cloud cover trend", subtitle: "Monthly cover", data: series([["Jan", 72], ["Mar", 68], ["May", 63], ["Jul", 59], ["Sep", 66], ["Nov", 71]]), series: [{ key: "value", label: "Cloud cover" }] },
      progressChart("Solar capture", "Current efficiency", 42, "42%", "Capture"),
      { type: "progress", title: "Blockage severity", subtitle: "Current light loss", value: 78, max: 100, centerValue: "High", centerLabel: "Blockage" },
    ],
  },
  {
    key: "wind", label: "Wind", icon: "wind", status: "critical", state: "Weak airflow reduces comfort and system health",
    summaryStrip: [{ label: "Airflow", value: "Weak" }, { label: "Open air zones", value: "Low" }, { label: "Heat build-up", value: "High" }, { label: "Trapped air", value: "Severe" }],
    stats: [{ label: "Airflow", value: "Weak" }, { label: "Open air zones", value: "Low" }, { label: "Heat build-up", value: "High" }, { label: "Trapped air", value: "Severe" }],
    charts: [
      { type: "bar", title: "Open air paths", subtitle: "By area", data: series([["Open", 24], ["Partial", 36], ["Blocked", 40]]), series: [{ key: "value", label: "Share" }] },
      progressChart("Open air reach", "Across the city", 29, "29%", "Reach"),
      { type: "line", title: "Heat build-up", subtitle: "One day", data: series([["06", 18], ["10", 42], ["14", 71], ["18", 63], ["22", 44]]), series: [{ key: "value", label: "Heat" }] },
      { type: "progress", title: "Weak airflow severity", subtitle: "Alert tile", value: 85, max: 100, centerValue: "Severe", centerLabel: "Risk" },
    ],
  },
  {
    key: "energy", label: "Energy", icon: "zap", status: "critical", state: "Fossil grid is unstable and fails under heavy demand",
    summaryStrip: [{ label: "Fossil", value: "89%" }, { label: "Renewable", value: "0%" }, { label: "Blackouts", value: "Frequent" }, { label: "Demand peaks", value: "High" }],
    stats: [{ label: "Fossil power", value: "89%" }, { label: "Renewables", value: "0%" }, { label: "Blackouts", value: "Frequent" }, { label: "Demand peaks", value: "High" }],
    charts: [
      donutChart("Energy mix", "Supply mix", [{ label: "Fossil", value: "89" }, { label: "Renewable", value: "0" }, { label: "Other", value: "11" }], "89%", "Fossil"),
      { type: "line", title: "Demand peaks", subtitle: "Blackout and demand trend", data: [{ label: "W1", demand: 61, blackouts: 2 }, { label: "W2", demand: 74, blackouts: 3 }, { label: "W3", demand: 69, blackouts: 2 }, { label: "W4", demand: 82, blackouts: 4 }], series: [{ key: "demand", label: "Demand" }, { key: "blackouts", label: "Blackouts" }] },
      { type: "radial", title: "Power stability", subtitle: "Today", value: 28, max: 100, centerValue: "28", centerLabel: "Stable" },
      { type: "bar", title: "Stable vs unstable hours", subtitle: "Daily operations", data: series([["Stable", 11], ["Unstable", 13]]), series: [{ key: "value", label: "Hours" }] },
    ],
    alerts: [makeAlert("Grid strain", "Flooded infrastructure and fossil dependence make outages frequent across the wettest zones.")],
  },
  {
    key: "waste", label: "Waste", icon: "trash-2", status: "attention", state: "Organic waste is high and disposal pressure persists",
    summaryStrip: [{ label: "Organic", value: "68%" }, { label: "Recycling", value: "52%" }, { label: "Illegal", value: "19%" }, { label: "Overflow", value: "Frequent" }],
    stats: [{ label: "Organic Waste", value: "68%" }, { label: "Recycling Rate", value: "52%" }, { label: "Illegal Disposal", value: "19%" }, { label: "Overflow Areas", value: "Frequent" }],
    charts: [
      donutChart("Waste composition", "Material split", [{ label: "Organic", value: "68" }, { label: "Plastic", value: "12" }, { label: "Other", value: "20" }], "68%", "Organic"),
      { type: "bar", title: "Disposal destination", subtitle: "Waste routing", data: series([["Recycled", 52], ["Managed disposal", 29], ["Illegal", 19]]), series: [{ key: "value", label: "Share" }] },
      progressChart("Recycling progress", "Current rate", 52, "52%", "Recycling"),
      { type: "heatmap", title: "Overflow hotspots", subtitle: "Neighborhood alerts", rows: [{ label: "West", cells: [{ label: "A", value: 76 }, { label: "B", value: 82 }] }, { label: "East", cells: [{ label: "A", value: 61 }, { label: "B", value: 69 }] }] },
    ],
  },
  {
    key: "housing", label: "Housing", icon: "building-2", status: "critical", state: "Housing is highly exposed to floods and poor ventilation",
    summaryStrip: [{ label: "Flood resistant", value: "34%" }, { label: "Ventilation", value: "Low" }, { label: "Informal", value: "29%" }, { label: "Risk", value: "High" }],
    stats: [{ label: "Safer homes", value: "34%" }, { label: "Airflow quality", value: "Low" }, { label: "Informal homes", value: "29%" }, { label: "Building risk", value: "High" }],
    charts: [
      { type: "bar", title: "Resistant vs exposed", subtitle: "Housing split", data: series([["Resistant", 34], ["Exposed", 66]]), series: [{ key: "value", label: "Share" }] },
      { type: "radial", title: "Airflow in homes", subtitle: "Today", value: 31, max: 100, centerValue: "Low", centerLabel: "Air" },
      donutChart("Settlement distribution", "Formal vs informal", [{ label: "Formal", value: "71" }, { label: "Informal", value: "29" }], "29%", "Informal"),
      { type: "progress", title: "Structural risk", subtitle: "Current exposure", value: 83, max: 100, centerValue: "High", centerLabel: "Risk" },
    ],
  },
  {
    key: "transportation", label: "Transportation", icon: "tram-front", status: "attention", state: "Mobility is regularly interrupted by terrain and flooding",
    summaryStrip: [{ label: "Access", value: "58%" }, { label: "Flood stops", value: "Frequent" }, { label: "Travel time", value: "68 min" }, { label: "Transit quality", value: "Moderate" }],
    stats: [{ label: "Access", value: "58%" }, { label: "Flood stops", value: "Frequent" }, { label: "Travel time", value: "68 min avg" }, { label: "Transit quality", value: "Moderate" }],
    charts: [
      { type: "radial", title: "Access", subtitle: "Today", value: 58, max: 100, centerValue: "58%", centerLabel: "Access" },
      { type: "line", title: "Interruption timeline", subtitle: "Flood disruption pattern", data: series([["Jan", 7], ["Mar", 5], ["May", 6], ["Jul", 3], ["Sep", 4], ["Nov", 7]]), series: [{ key: "value", label: "Interruptions" }] },
      { type: "bar", title: "Transport quality", subtitle: "By mode", data: series([["Bus", 46], ["Boat", 62], ["Rail", 58]]), series: [{ key: "value", label: "Quality" }] },
      { type: "line", title: "Average travel time", subtitle: "Commute pressure", data: series([["W1", 64], ["W2", 68], ["W3", 72], ["W4", 68]]), series: [{ key: "value", label: "Minutes" }] },
    ],
  },
  {
    key: "biodiversity", label: "Biodiversity", icon: "trees", status: "attention", state: "Natural richness remains high, but degradation is increasing",
    summaryStrip: [{ label: "Native index", value: "87%" }, { label: "Habitat loss", value: "+11%" }, { label: "Human impact", value: "High" }, { label: "Protection", value: "Limited" }],
    stats: [{ label: "Nature score", value: "87%" }, { label: "Habitat loss", value: "+11%" }, { label: "Human pressure", value: "High" }, { label: "Protected areas", value: "Limited" }],
    charts: [
      { type: "radial", title: "Biodiversity health", subtitle: "Native index", value: 87, max: 100, centerValue: "87%", centerLabel: "Native" },
      { type: "line", title: "Habitat loss trend", subtitle: "Annual loss", data: series([["Y1", 100], ["Y2", 104], ["Y3", 111]]), series: [{ key: "value", label: "Loss" }] },
      { type: "bar", title: "Protected nature", subtitle: "Safe and open", data: series([["Protected", 24], ["Exposed", 76]]), series: [{ key: "value", label: "Share" }] },
      { type: "progress", title: "Human impact", subtitle: "Pressure tile", value: 79, max: 100, centerValue: "High", centerLabel: "Impact" },
    ],
  },
] as const;

export const verdantia: CityData = {
  slug: "verdantia",
  name: "Verdantia",
  logo: cityAssets.verdantia.logo,
  accent: cityAssets.verdantia.accent,
  accentSoft: cityAssets.verdantia.accentSoft,
  oneLineDescription: "A humid rainforest metropolis overwhelmed by water, density, and ecological pressure.",
  missionBrief:
    "Verdantia is surrounded by natural abundance, but that abundance is unstable. High humidity, flooding risk, uneven air flow, and pressure on ecosystems make the city difficult to manage. Nature is present everywhere, yet the urban system fails to protect it properly and still relies on a fragile fossil grid.",
  heroImage: cityAssets.verdantia.heroImage,
  secondaryImage: cityAssets.verdantia.secondaryImage,
  macroStats: [
    { label: "Population", value: "3.1M" },
    { label: "Area", value: "1,540 km2" },
    { label: "Density", value: "2,012/km2" },
    { label: "GDP", value: "$74B" },
    { label: "Climate", value: "Tropical Rainforest" },
    { label: "Ecological Pressure", value: "High" },
  ],
  breadcrumbLabel: "Rainforest Metropolis",
  systemsOverview: statusSummary(layers as unknown as CityData["layers"]),
  layers: layers as unknown as CityData["layers"],
};
