import type { CitySlug } from "../types";

export interface CitySignal {
  headline: string;
  detail: string;
  system: string;
}

export interface CityTension {
  a: string;
  b: string;
  description: string;
}

export interface CityLeveragePoint {
  name: string;
  why: string;
  system: string;
  potential: number;
}

export interface CitySignalsData {
  critical: CitySignal;
  pressure: CitySignal;
  opportunity: CitySignal;
  resilience_score: number;
  resilience_label: string;
  tensions: CityTension[];
  leverage_points: CityLeveragePoint[];
}

export const citySignals: Record<CitySlug, CitySignalsData> = {
  solara: {
    critical: {
      headline: "Water Crisis",
      detail: "The city cannot reliably meet basic water needs. Every drought stretches the system to its limit.",
      system: "water",
    },
    pressure: {
      headline: "Extreme Heat",
      detail: "Surface temperatures stay dangerously high. Streets become hostile to daily life without shade.",
      system: "climate",
    },
    opportunity: {
      headline: "Solar Potential",
      detail: "Intense sunlight is a massive untapped resource. Energy abundance is within reach.",
      system: "energy",
    },
    resilience_score: 31,
    resilience_label: "Critically Stressed",
    tensions: [
      { a: "Water", b: "Housing", description: "More homes means more demand — but supply is already failing." },
      { a: "Shade", b: "Heat", description: "Without shade, streets become unusable during peak hours." },
      { a: "Mobility", b: "Exposure", description: "Moving around the city means surviving the heat." },
    ],
    leverage_points: [
      { name: "Solar Energy Grid", why: "Abundant sun can power cooling, water pumping and transport.", system: "energy", potential: 88 },
      { name: "Passive Cooling Streets", why: "Shade and white roofs cut surface temperature by up to 8°C.", system: "climate", potential: 74 },
      { name: "Greywater Reuse", why: "Recycling household water reduces demand by up to 30%.", system: "water", potential: 71 },
    ],
  },

  frostara: {
    critical: {
      headline: "Thermal Isolation",
      detail: "Cold limits mobility, agriculture, and outdoor life for months. The city must fight winter to function.",
      system: "climate",
    },
    pressure: {
      headline: "Energy Dependency",
      detail: "Heating demand is intense and constant. Without resilient energy, the city shuts down.",
      system: "energy",
    },
    opportunity: {
      headline: "Highland Wind & Geo",
      detail: "Elevation brings constant wind and geothermal access — two powerful clean energy sources.",
      system: "energy",
    },
    resilience_score: 48,
    resilience_label: "Under Pressure",
    tensions: [
      { a: "Cold", b: "Food Supply", description: "Freezing temperatures make local food production nearly impossible." },
      { a: "Energy", b: "Sustainability", description: "The need for heat clashes with low-carbon goals." },
      { a: "Mobility", b: "Winter", description: "Snow and ice turn simple trips into difficult journeys." },
    ],
    leverage_points: [
      { name: "Geothermal Heating", why: "The earth beneath the highlands runs warm year-round.", system: "energy", potential: 82 },
      { name: "Highland Wind Turbines", why: "Elevation makes wind faster and more consistent than lowland sites.", system: "energy", potential: 85 },
      { name: "Snowmelt Reservoirs", why: "Winter snow banks months of water for spring and summer use.", system: "water", potential: 79 },
    ],
  },

  verdantia: {
    critical: {
      headline: "Ecosystem Erosion",
      detail: "Forest fragmentation is cutting biodiversity corridors. Once broken, these links are hard to restore.",
      system: "biodiversity",
    },
    pressure: {
      headline: "Flood Vulnerability",
      detail: "Heavy rainfall with damaged ground cover creates flooding risk across low-lying zones.",
      system: "water",
    },
    opportunity: {
      headline: "Biomass & Green Systems",
      detail: "Organic abundance makes biogas, composting and green infrastructure highly viable.",
      system: "biodiversity",
    },
    resilience_score: 57,
    resilience_label: "Fragile Balance",
    tensions: [
      { a: "Urban Growth", b: "Forest Cover", description: "Every new building takes a bite from the surrounding canopy." },
      { a: "Rain", b: "Infrastructure", description: "Intense rainfall overwhelms drainage and damages roads." },
      { a: "Biodiversity", b: "Human Activity", description: "Wildlife corridors are severed by roads and construction." },
    ],
    leverage_points: [
      { name: "Urban Biodiversity Corridors", why: "Reconnecting forest patches restores ecosystems and climate regulation.", system: "biodiversity", potential: 91 },
      { name: "Living Roof Systems", why: "Green roofs absorb rainfall, cool the city and support pollinators.", system: "water", potential: 84 },
      { name: "Organic Biogas Network", why: "Abundant organic waste can power homes and reduce landfill pressure.", system: "energy", potential: 77 },
    ],
  },
};
