export type CitySlug = "solara" | "frostara" | "verdantia";

export interface CsvCityRow {
  city: string;
  biome: string;
  tagline: string;
  theme_color: string;
  climate_stress: string;
  water_pressure: string;
  energy_potential: string;
  ecosystem_sensitivity: string;
  mobility_complexity: string;
  city_pressure_index: string;
  heat: string;
  rainfall: string;
  humidity: string;
  wind: string;
  thermal_comfort: string;
  urban_stress: string;
  active_system: string;
  active_system_score: string;
  active_system_opportunity: string;
  active_system_constraint: string;
  active_system_dependencies: string;
  primary_risk: string;
  secondary_risk: string;
  investigative_prompt: string;
}

export interface DashboardMetric {
  id: "climate_stress" | "water_pressure" | "energy_potential" | "ecosystem_sensitivity" | "mobility_complexity";
  label: string;
  value: number;
}

export interface ClimateMetric {
  id: "heat" | "rainfall" | "humidity" | "wind" | "thermal_comfort";
  label: string;
  value: number;
}

export interface ActiveSystemData {
  name: string;
  score: number;
  opportunity: string;
  constraint: string;
  dependencies: string[];
}

export interface CityData {
  city: string;
  slug: CitySlug;
  biome: string;
  tagline: string;
  themeColor: string;
  accentSoft: string;
  glowColor: string;
  dashboardMetrics: DashboardMetric[];
  climateMetrics: ClimateMetric[];
  cityPressureIndex: number;
  urbanStress: number;
  activeSystem: ActiveSystemData;
  primaryRisk: string;
  secondaryRisk: string;
  investigativePrompt: string;
  raw: {
    climateStress: number;
    waterPressure: number;
    energyPotential: number;
    ecosystemSensitivity: number;
    mobilityComplexity: number;
    cityPressureIndex: number;
    heat: number;
    rainfall: number;
    humidity: number;
    wind: number;
    thermalComfort: number;
    urbanStress: number;
  };
}
