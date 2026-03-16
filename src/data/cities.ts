import csvRaw from "../../aurora_project_cities_dataset.csv?raw";
import solaraLandscape from "../../solara-landscape.png";
import solaraStreetview from "../../solara-streetview.png";
import frostaraLandscape from "../../frostara-landscape.png";
import frostaraStreetview from "../../frostara-streetview.png";
import verdantiaLandscape from "../../verdantia-landscape.png";
import verdantiaStreetview from "../../verdantia-streetview.png";
import type { CityData, CitySlug, ClimateMetric, CsvCityRow, DashboardMetric } from "../types";
import { cityThemes } from "./logos";

const missionBriefAssets: Record<
  CitySlug,
  {
    hero: string;
    street: string;
    text: string;
  }
> = {
  solara: {
    hero: solaraLandscape,
    street: solaraStreetview,
    text:
      "Solara sits in a dry valley where heat and water scarcity shape everyday life. Summers are long and intense, and the city must carefully manage its water system. Many neighborhoods grew quickly without much planning. Roads are crowded, buildings trap heat, and energy demand rises during the hottest months. Solara has huge potential for solar energy, but the city still struggles with waste, transportation, and water efficiency.",
  },
  frostara: {
    hero: frostaraLandscape,
    street: frostaraStreetview,
    text:
      "Frostara lies between steep mountains and a cold coastline. Strong winds and long cold seasons make life harder for buildings, infrastructure, and transport. The harbor is the heart of the city, supporting fishing and industry, but these activities also affect air quality and nearby ecosystems. Energy is essential here, because heating buildings and maintaining infrastructure in a cold climate requires reliable power.",
  },
  verdantia: {
    hero: verdantiaLandscape,
    street: verdantiaStreetview,
    text:
      "Verdantia grew inside one of the most biodiverse rainforest regions on the planet. Dense jungle surrounds the city, and rivers carry life through the valley. Rapid growth has pushed the city deeper into the forest. Roads, industry, and housing now compete with fragile ecosystems. Waste management, biodiversity protection, and water quality are major challenges in this environment.",
  },
};

const parseCsv = (csv: string): CsvCityRow[] => {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
      }

      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  const [header, ...dataRows] = rows;

  return dataRows.map((row) =>
    header.reduce<CsvCityRow>((record, column, columnIndex) => {
      record[column as keyof CsvCityRow] = (row[columnIndex] ?? "") as never;
      return record;
    }, {} as CsvCityRow),
  );
};

const toInt = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, parsed));
};

const metricDefinitions: Array<{ key: keyof CityData["raw"]; label: string; id: DashboardMetric["id"] }> = [
  { key: "climateStress", label: "Climate Stress", id: "climate_stress" },
  { key: "waterPressure", label: "Water System Load", id: "water_pressure" },
  { key: "energyPotential", label: "Energy Potential", id: "energy_potential" },
  { key: "ecosystemSensitivity", label: "Ecosystem Sensitivity", id: "ecosystem_sensitivity" },
  { key: "mobilityComplexity", label: "Mobility Complexity", id: "mobility_complexity" },
];

const climateDefinitions: Array<{ key: keyof Pick<CityData["raw"], "heat" | "rainfall" | "humidity" | "wind" | "thermalComfort">; label: string; id: ClimateMetric["id"] }> = [
  { key: "heat", label: "Heat", id: "heat" },
  { key: "rainfall", label: "Rainfall", id: "rainfall" },
  { key: "humidity", label: "Humidity", id: "humidity" },
  { key: "wind", label: "Wind", id: "wind" },
  { key: "thermalComfort", label: "Thermal Comfort", id: "thermal_comfort" },
];

const slugFromCity = (city: string): CitySlug => city.toLowerCase() as CitySlug;

const normalizeCity = (row: CsvCityRow): CityData => {
  const slug = slugFromCity(row.city);
  const theme = cityThemes[slug];
  const missionBrief = missionBriefAssets[slug];

  const raw = {
    climateStress: toInt(row.climate_stress),
    waterPressure: toInt(row.water_pressure),
    energyPotential: toInt(row.energy_potential),
    ecosystemSensitivity: toInt(row.ecosystem_sensitivity),
    mobilityComplexity: toInt(row.mobility_complexity),
    cityPressureIndex: toInt(row.city_pressure_index),
    heat: toInt(row.heat),
    rainfall: toInt(row.rainfall),
    humidity: toInt(row.humidity),
    wind: toInt(row.wind),
    thermalComfort: toInt(row.thermal_comfort),
    urbanStress: toInt(row.urban_stress),
  };

  return {
    city: row.city,
    slug,
    biome: row.biome,
    tagline: row.tagline,
    missionBriefHeroImage: missionBrief.hero,
    missionBriefStreetImage: missionBrief.street,
    missionBriefText: missionBrief.text,
    themeColor: row.theme_color,
    accentSoft: theme.secondary,
    glowColor: theme.glow,
    dashboardMetrics: metricDefinitions.map((definition) => ({
      id: definition.id,
      label: definition.label,
      value: raw[definition.key],
    })),
    climateMetrics: climateDefinitions.map((definition) => ({
      id: definition.id,
      label: definition.label,
      value: raw[definition.key],
    })),
    cityPressureIndex: raw.cityPressureIndex,
    urbanStress: raw.urbanStress,
    activeSystem: {
      name: row.active_system,
      score: toInt(row.active_system_score),
      opportunity: row.active_system_opportunity,
      constraint: row.active_system_constraint,
      dependencies: row.active_system_dependencies.split("|").map((entry) => entry.trim()).filter(Boolean),
    },
    primaryRisk: row.primary_risk,
    secondaryRisk: row.secondary_risk,
    investigativePrompt: row.investigative_prompt,
    raw,
  };
};

export const cityData = parseCsv(csvRaw).map(normalizeCity);
