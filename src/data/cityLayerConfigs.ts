import type { CitySlug } from "../types";

export type DashboardLayer = "home" | "climate" | "water" | "air" | "energy" | "mobility" | "waste" | "biodiversity" | "compare";

type XYPoint = { label: string; value: number };

export interface LayerConfig {
  home: {
    environmentalTrend: XYPoint[];
    pressureMix: XYPoint[];
    opportunityScores: XYPoint[];
    topTensions: string[];
    snapshot: Array<{ label: string; value: string }>;
  };
  climate: {
    seasonalTrend: XYPoint[];
    distribution: XYPoint[];
    comfort: Array<{ label: string; value: string }>;
    notes: string[];
  };
  water: {
    storageVsDemand: XYPoint[];
    seasonalBalance: XYPoint[];
    riskCards: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
  air: {
    airQualityDrivers: XYPoint[];
    exposurePattern: XYPoint[];
    watchpoints: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
  energy: {
    generationVsDemand: XYPoint[];
    sourcePotential: XYPoint[];
    thermalLinks: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
  mobility: {
    routeExposure: XYPoint[];
    accessFactors: XYPoint[];
    routines: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
  waste: {
    wasteFlow: XYPoint[];
    handlingPressure: XYPoint[];
    recyclingMix: XYPoint[];
    watchpoints: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
  biodiversity: {
    habitatPressure: XYPoint[];
    coexistence: XYPoint[];
    compostLoop: XYPoint[];
    preservation: Array<{ label: string; value: string }>;
    linkedSystems: string[];
  };
}

export const cityLayerConfigs: Record<CitySlug, LayerConfig> = {
  solara: {
    home: {
      environmentalTrend: [
        { label: "Heat", value: 93 },
        { label: "Water", value: 91 },
        { label: "Wind", value: 42 },
        { label: "Comfort", value: 34 },
      ],
      pressureMix: [
        { label: "Climate", value: 84 },
        { label: "Water", value: 91 },
        { label: "Mobility", value: 61 },
        { label: "Eco", value: 63 },
      ],
      opportunityScores: [
        { label: "Solar", value: 88 },
        { label: "Passive Cooling", value: 74 },
        { label: "Dryland Systems", value: 71 },
      ],
      topTensions: ["Water vs Housing", "Shade vs Heat", "Mobility vs Exposure"],
      snapshot: [
        { label: "Main pressure", value: "Water scarcity" },
        { label: "Best leverage", value: "Solar energy" },
        { label: "Daily challenge", value: "Heat exposure" },
      ],
    },
    climate: {
      seasonalTrend: [
        { label: "Jan", value: 90 },
        { label: "Mar", value: 92 },
        { label: "May", value: 95 },
        { label: "Jul", value: 88 },
        { label: "Sep", value: 84 },
        { label: "Nov", value: 87 },
      ],
      distribution: [
        { label: "Heat", value: 93 },
        { label: "Rain", value: 18 },
        { label: "Humidity", value: 29 },
        { label: "Wind", value: 42 },
        { label: "Comfort", value: 34 },
      ],
      comfort: [
        { label: "Morning comfort", value: "Higher before midday heat" },
        { label: "Peak stress", value: "Midday outdoors" },
        { label: "Best strategy", value: "Shade and cooling surfaces" },
      ],
      notes: ["Dry air amplifies dehydration.", "Low rainfall means each storm matters more."],
    },
    water: {
      storageVsDemand: [
        { label: "Storage need", value: 94 },
        { label: "Supply reliability", value: 28 },
        { label: "Reuse value", value: 84 },
      ],
      seasonalBalance: [
        { label: "Wet pulse", value: 32 },
        { label: "Dry season", value: 92 },
        { label: "Recovery", value: 41 },
      ],
      riskCards: [
        { label: "Scarcity profile", value: "Persistent" },
        { label: "Drainage profile", value: "Short intense storms" },
      ],
      linkedSystems: ["Housing", "Public Space", "Food", "Energy"],
    },
    air: {
      airQualityDrivers: [
        { label: "Dust exposure", value: 82 },
        { label: "Heat haze", value: 76 },
        { label: "Ventilation relief", value: 42 },
      ],
      exposurePattern: [
        { label: "Street heat", value: 88 },
        { label: "Indoor cooling load", value: 73 },
        { label: "Shade effect", value: 46 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Dry heat raises dust and surface stress" },
        { label: "Best relief", value: "Air movement improves comfort in shaded areas" },
      ],
      linkedSystems: ["Housing", "Shade", "Mobility", "Public Space"],
    },
    energy: {
      generationVsDemand: [
        { label: "Solar generation", value: 88 },
        { label: "Cooling demand", value: 76 },
        { label: "Grid stress", value: 64 },
      ],
      sourcePotential: [
        { label: "Solar", value: 88 },
        { label: "Wind", value: 42 },
        { label: "Backup", value: 35 },
      ],
      thermalLinks: [
        { label: "Main opportunity", value: "Roofs receive intense sun" },
        { label: "Main constraint", value: "Cooling load rises with heat" },
      ],
      linkedSystems: ["Housing", "Water", "Shade", "Mobility"],
    },
    mobility: {
      routeExposure: [
        { label: "Sun exposure", value: 88 },
        { label: "Route shade", value: 24 },
        { label: "Walking comfort", value: 34 },
      ],
      accessFactors: [
        { label: "Distance friction", value: 61 },
        { label: "Rest points", value: 40 },
        { label: "Surface heat", value: 84 },
      ],
      routines: [
        { label: "Best hours", value: "Morning and late day" },
        { label: "Weak point", value: "Long unshaded routes" },
      ],
      linkedSystems: ["Shade", "Housing", "Water", "Public Space"],
    },
    waste: {
      wasteFlow: [
        { label: "Collection strain", value: 58 },
        { label: "Organic recovery", value: 62 },
        { label: "Material loss", value: 48 },
      ],
      handlingPressure: [
        { label: "Heat exposure", value: 79 },
        { label: "Storage hygiene", value: 72 },
        { label: "Route coverage", value: 54 },
      ],
      recyclingMix: [
        { label: "Organic", value: 29 },
        { label: "Plastic", value: 14 },
        { label: "Paper", value: 12 },
        { label: "Metal", value: 9 },
        { label: "Glass", value: 14 },
        { label: "Unrecycled", value: 22 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Heat accelerates odor and storage stress" },
        { label: "Best relief", value: "Fast collection and shaded storage reduce pressure" },
      ],
      linkedSystems: ["Housing", "Mobility", "Public Space", "Water"],
    },
    biodiversity: {
      habitatPressure: [
        { label: "Fragility", value: 63 },
        { label: "Soil risk", value: 58 },
        { label: "Vegetation stress", value: 67 },
      ],
      coexistence: [
        { label: "Native planting", value: 78 },
        { label: "Hard surface risk", value: 86 },
        { label: "Erosion pressure", value: 72 },
      ],
      compostLoop: [
        { label: "Food scraps", value: 64 },
        { label: "Composting", value: 58 },
        { label: "Soil return", value: 61 },
      ],
      preservation: [
        { label: "Priority", value: "Keep plant cover" },
        { label: "Watch for", value: "Bare dry soils" },
      ],
      linkedSystems: ["Water", "Food", "Public Space"],
    },
  },
  frostara: {
    home: {
      environmentalTrend: [
        { label: "Cold", value: 72 },
        { label: "Wind", value: 81 },
        { label: "Water", value: 54 },
        { label: "Comfort", value: 41 },
      ],
      pressureMix: [
        { label: "Climate", value: 72 },
        { label: "Water", value: 54 },
        { label: "Mobility", value: 59 },
        { label: "Eco", value: 58 },
      ],
      opportunityScores: [
        { label: "Wind", value: 79 },
        { label: "Hydro", value: 68 },
        { label: "Passive Solar", value: 64 },
      ],
      topTensions: ["Heating vs Energy", "Slope vs Access", "Wind vs Public Space"],
      snapshot: [
        { label: "Main pressure", value: "Thermal exposure" },
        { label: "Best leverage", value: "Wind energy" },
        { label: "Daily challenge", value: "Cold mobility routes" },
      ],
    },
    climate: {
      seasonalTrend: [
        { label: "Jan", value: 46 },
        { label: "Mar", value: 42 },
        { label: "May", value: 35 },
        { label: "Jul", value: 28 },
        { label: "Sep", value: 40 },
        { label: "Nov", value: 48 },
      ],
      distribution: [
        { label: "Heat", value: 39 },
        { label: "Rain", value: 57 },
        { label: "Humidity", value: 55 },
        { label: "Wind", value: 81 },
        { label: "Comfort", value: 41 },
      ],
      comfort: [
        { label: "Main issue", value: "Cold + wind exposure" },
        { label: "Best gain", value: "Sun-facing shelter" },
        { label: "Peak stress", value: "Winter routes" },
      ],
      notes: ["Cold changes circulation and public life.", "Wind reshapes thermal comfort."],
    },
    water: {
      storageVsDemand: [
        { label: "Storage need", value: 48 },
        { label: "Supply reliability", value: 66 },
        { label: "Drainage care", value: 58 },
      ],
      seasonalBalance: [
        { label: "Wet season", value: 61 },
        { label: "Cold season", value: 54 },
        { label: "Recovery", value: 63 },
      ],
      riskCards: [
        { label: "Scarcity profile", value: "Moderate" },
        { label: "Terrain profile", value: "Slope-sensitive" },
      ],
      linkedSystems: ["Housing", "Mobility", "Energy", "Public Space"],
    },
    air: {
      airQualityDrivers: [
        { label: "Wind exposure", value: 81 },
        { label: "Cold air load", value: 78 },
        { label: "Air stagnation", value: 28 },
      ],
      exposurePattern: [
        { label: "Open-route exposure", value: 84 },
        { label: "Indoor sealing need", value: 76 },
        { label: "Sheltered comfort", value: 49 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Cold wind shapes daily exposure more than pollution" },
        { label: "Best relief", value: "Sheltered edges and filtered airflow improve comfort" },
      ],
      linkedSystems: ["Housing", "Mobility", "Energy", "Public Space"],
    },
    energy: {
      generationVsDemand: [
        { label: "Wind generation", value: 79 },
        { label: "Heating demand", value: 82 },
        { label: "Grid stress", value: 68 },
      ],
      sourcePotential: [
        { label: "Wind", value: 79 },
        { label: "Water", value: 66 },
        { label: "Solar", value: 52 },
      ],
      thermalLinks: [
        { label: "Main opportunity", value: "Strong wind and mountain water" },
        { label: "Main constraint", value: "Heating raises demand" },
      ],
      linkedSystems: ["Housing", "Mobility", "Public Space", "Water"],
    },
    mobility: {
      routeExposure: [
        { label: "Slope friction", value: 76 },
        { label: "Wind exposure", value: 81 },
        { label: "Walking comfort", value: 41 },
      ],
      accessFactors: [
        { label: "Terrain", value: 82 },
        { label: "Cold routes", value: 74 },
        { label: "Shelter quality", value: 52 },
      ],
      routines: [
        { label: "Best routes", value: "Protected and sun-facing" },
        { label: "Weak point", value: "Open exposed links" },
      ],
      linkedSystems: ["Housing", "Energy", "Public Space"],
    },
    waste: {
      wasteFlow: [
        { label: "Collection coverage", value: 66 },
        { label: "Sorting potential", value: 61 },
        { label: "Organic handling", value: 52 },
      ],
      handlingPressure: [
        { label: "Cold-weather storage", value: 44 },
        { label: "Slope logistics", value: 71 },
        { label: "Seasonal route delay", value: 63 },
      ],
      recyclingMix: [
        { label: "Organic", value: 24 },
        { label: "Plastic", value: 15 },
        { label: "Paper", value: 14 },
        { label: "Metal", value: 9 },
        { label: "Glass", value: 11 },
        { label: "Unrecycled", value: 27 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Terrain and seasonal exposure complicate collection routes" },
        { label: "Best relief", value: "Protected transfer points stabilize service in cold weather" },
      ],
      linkedSystems: ["Mobility", "Housing", "Public Space", "Energy"],
    },
    biodiversity: {
      habitatPressure: [
        { label: "Fragility", value: 58 },
        { label: "Slope risk", value: 62 },
        { label: "Vegetation stress", value: 54 },
      ],
      coexistence: [
        { label: "Shelter value", value: 68 },
        { label: "Erosion pressure", value: 61 },
        { label: "Habitat balance", value: 56 },
      ],
      compostLoop: [
        { label: "Food scraps", value: 48 },
        { label: "Composting", value: 54 },
        { label: "Soil return", value: 52 },
      ],
      preservation: [
        { label: "Priority", value: "Protect slope cover" },
        { label: "Watch for", value: "Exposure and runoff" },
      ],
      linkedSystems: ["Mobility", "Water", "Housing"],
    },
  },
  verdantia: {
    home: {
      environmentalTrend: [
        { label: "Rain", value: 92 },
        { label: "Humidity", value: 94 },
        { label: "Eco", value: 95 },
        { label: "Comfort", value: 49 },
      ],
      pressureMix: [
        { label: "Climate", value: 74 },
        { label: "Water", value: 67 },
        { label: "Mobility", value: 58 },
        { label: "Eco", value: 95 },
      ],
      opportunityScores: [
        { label: "Renewables", value: 73 },
        { label: "Nature-Based Drainage", value: 86 },
        { label: "Shaded Access", value: 71 },
      ],
      topTensions: ["Growth vs Habitat", "Rain vs Access", "Drainage vs Hard Surfaces"],
      snapshot: [
        { label: "Main pressure", value: "Flood sensitivity" },
        { label: "Best leverage", value: "Ecological drainage" },
        { label: "Daily challenge", value: "Humidity and runoff" },
      ],
    },
    climate: {
      seasonalTrend: [
        { label: "Jan", value: 74 },
        { label: "Mar", value: 78 },
        { label: "May", value: 81 },
        { label: "Jul", value: 84 },
        { label: "Sep", value: 79 },
        { label: "Nov", value: 76 },
      ],
      distribution: [
        { label: "Heat", value: 68 },
        { label: "Rain", value: 92 },
        { label: "Humidity", value: 94 },
        { label: "Wind", value: 46 },
        { label: "Comfort", value: 49 },
      ],
      comfort: [
        { label: "Main issue", value: "Humidity traps heat" },
        { label: "Best gain", value: "Air movement and shade" },
        { label: "Peak stress", value: "Rain-heavy days" },
      ],
      notes: ["Abundant rain still creates pressure.", "Warm humid air changes comfort differently than dry heat."],
    },
    water: {
      storageVsDemand: [
        { label: "Storage need", value: 62 },
        { label: "Supply reliability", value: 84 },
        { label: "Drainage care", value: 95 },
      ],
      seasonalBalance: [
        { label: "Flood pulse", value: 91 },
        { label: "Drainage load", value: 95 },
        { label: "Recovery", value: 58 },
      ],
      riskCards: [
        { label: "Scarcity profile", value: "Moderate pressure" },
        { label: "Flood profile", value: "Very important" },
      ],
      linkedSystems: ["Drainage", "Housing", "Mobility", "Biodiversity"],
    },
    air: {
      airQualityDrivers: [
        { label: "Humidity load", value: 94 },
        { label: "Mold risk", value: 86 },
        { label: "Wind flushing", value: 46 },
      ],
      exposurePattern: [
        { label: "Indoor dampness", value: 88 },
        { label: "Outdoor comfort", value: 57 },
        { label: "Rain-soaked surfaces", value: 91 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Heavy humidity affects comfort and material drying" },
        { label: "Best relief", value: "Air movement helps when paired with shaded ventilation" },
      ],
      linkedSystems: ["Housing", "Biodiversity", "Mobility", "Drainage"],
    },
    energy: {
      generationVsDemand: [
        { label: "Renewable generation", value: 73 },
        { label: "Humidity demand", value: 61 },
        { label: "Grid stress", value: 58 },
      ],
      sourcePotential: [
        { label: "Solar openings", value: 73 },
        { label: "River logic", value: 64 },
        { label: "Biomass caution", value: 41 },
      ],
      thermalLinks: [
        { label: "Main opportunity", value: "Renewables with ecological limits" },
        { label: "Main constraint", value: "Wet conditions complicate systems" },
      ],
      linkedSystems: ["Housing", "Drainage", "Mobility", "Biodiversity"],
    },
    mobility: {
      routeExposure: [
        { label: "Rain exposure", value: 86 },
        { label: "Route continuity", value: 58 },
        { label: "Walking comfort", value: 57 },
      ],
      accessFactors: [
        { label: "Drainage", value: 92 },
        { label: "Bridge need", value: 64 },
        { label: "Surface wetness", value: 88 },
      ],
      routines: [
        { label: "Best routes", value: "Shaded and drained" },
        { label: "Weak point", value: "Flood-prone links" },
      ],
      linkedSystems: ["Drainage", "Housing", "Biodiversity"],
    },
    waste: {
      wasteFlow: [
        { label: "Collection continuity", value: 57 },
        { label: "Organic pressure", value: 83 },
        { label: "Material recovery", value: 64 },
      ],
      handlingPressure: [
        { label: "Wet storage risk", value: 92 },
        { label: "Flood disruption", value: 87 },
        { label: "Drainage clogging", value: 95 },
      ],
      recyclingMix: [
        { label: "Organic", value: 38 },
        { label: "Plastic", value: 12 },
        { label: "Paper", value: 10 },
        { label: "Metal", value: 6 },
        { label: "Glass", value: 16 },
        { label: "Unrecycled", value: 18 },
      ],
      watchpoints: [
        { label: "Main issue", value: "Rain and organic load quickly turn waste into drainage pressure" },
        { label: "Best relief", value: "Covered handling and clean collection routes reduce spillover" },
      ],
      linkedSystems: ["Drainage", "Water", "Mobility", "Housing"],
    },
    biodiversity: {
      habitatPressure: [
        { label: "Fragility", value: 95 },
        { label: "Habitat stress", value: 92 },
        { label: "Canopy value", value: 88 },
      ],
      coexistence: [
        { label: "Infrastructure balance", value: 76 },
        { label: "Habitat risk", value: 94 },
        { label: "Preservation need", value: 95 },
      ],
      compostLoop: [
        { label: "Food scraps", value: 72 },
        { label: "Composting", value: 69 },
        { label: "Soil return", value: 74 },
      ],
      preservation: [
        { label: "Priority", value: "Protect living systems first" },
        { label: "Watch for", value: "Fragmentation from expansion" },
      ],
      linkedSystems: ["Water", "Mobility", "Housing", "Drainage"],
    },
  },
};
