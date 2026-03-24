import type { CitySlug } from "../types";

export interface Intervention {
  id: string;
  name: string;
  tagline: string;
  description: string;
  effort: "low" | "medium" | "high";
  timeframe: string;
  systemsHelped: string[];
  signalType: "critical" | "pressure" | "opportunity";
  impactScore: number;
}

export const cityInterventions: Record<CitySlug, Intervention[]> = {
  solara: [
    {
      id: "solar_grid",
      name: "Distributed Solar Grid",
      tagline: "Harness the desert sun",
      description:
        "Install solar panels on rooftops and open areas to generate clean energy and reduce heat absorption in urban surfaces.",
      effort: "medium",
      timeframe: "2–4 years",
      systemsHelped: ["Energy", "Climate"],
      signalType: "opportunity",
      impactScore: 88,
    },
    {
      id: "fog_harvesting",
      name: "Fog & Dew Collection",
      tagline: "Capture moisture from thin air",
      description:
        "Deploy mesh nets and condensation collectors to gather water from night air. Proven in semi-arid regions to supplement supply.",
      effort: "low",
      timeframe: "6–18 months",
      systemsHelped: ["Water"],
      signalType: "critical",
      impactScore: 72,
    },
    {
      id: "passive_cooling",
      name: "Passive Cooling Streets",
      tagline: "Design shade into the city fabric",
      description:
        "Plant drought-resistant trees, build covered walkways, and paint roofs white to cut surface temperature and make streets livable.",
      effort: "medium",
      timeframe: "1–3 years",
      systemsHelped: ["Climate", "Mobility", "Air"],
      signalType: "pressure",
      impactScore: 74,
    },
    {
      id: "greywater_reuse",
      name: "Greywater Reuse System",
      tagline: "Every drop counts twice",
      description:
        "Capture and filter household greywater for irrigation and toilet flushing. Cuts demand by up to 30% with no new water source needed.",
      effort: "medium",
      timeframe: "1–2 years",
      systemsHelped: ["Water", "Waste"],
      signalType: "critical",
      impactScore: 68,
    },
  ],

  frostara: [
    {
      id: "geothermal_heating",
      name: "Geothermal Heating Network",
      tagline: "Draw warmth from the earth",
      description:
        "Tap geothermal energy to heat homes and public buildings year-round, ending dependence on fossil fuel for winter survival.",
      effort: "high",
      timeframe: "3–6 years",
      systemsHelped: ["Energy", "Climate"],
      signalType: "opportunity",
      impactScore: 82,
    },
    {
      id: "snow_reservoirs",
      name: "Snowmelt Storage Reservoirs",
      tagline: "Bank winter water for dry months",
      description:
        "Build insulated underground tanks that capture snowmelt, ensuring a stable water supply during warmer, drier months.",
      effort: "medium",
      timeframe: "2–4 years",
      systemsHelped: ["Water"],
      signalType: "pressure",
      impactScore: 79,
    },
    {
      id: "wind_turbines",
      name: "Highland Wind Turbines",
      tagline: "Let altitude work for you",
      description:
        "Deploy wind turbines on surrounding highlands where wind is consistent and strong, providing reliable clean power even in winter.",
      effort: "medium",
      timeframe: "2–4 years",
      systemsHelped: ["Energy"],
      signalType: "opportunity",
      impactScore: 85,
    },
    {
      id: "vertical_farms",
      name: "Enclosed Vertical Farms",
      tagline: "Grow food inside the city",
      description:
        "Use insulated growing towers in unused buildings to produce food year-round, bypassing the constraints of cold and short seasons.",
      effort: "medium",
      timeframe: "1–3 years",
      systemsHelped: ["Biodiversity", "Mobility", "Waste"],
      signalType: "pressure",
      impactScore: 71,
    },
  ],

  verdantia: [
    {
      id: "bio_corridors",
      name: "Urban Biodiversity Corridors",
      tagline: "Let the forest breathe through the city",
      description:
        "Connect fragmented forest patches through the urban fabric with green corridors, restoring wildlife movement and carbon capture.",
      effort: "medium",
      timeframe: "2–5 years",
      systemsHelped: ["Biodiversity", "Air", "Climate"],
      signalType: "critical",
      impactScore: 91,
    },
    {
      id: "living_roofs",
      name: "Living Roof Water Systems",
      tagline: "Let buildings drink the rain",
      description:
        "Install living roofs and bio-swales to capture, filter, and store abundant rainfall before it causes flooding and erosion.",
      effort: "medium",
      timeframe: "1–3 years",
      systemsHelped: ["Water", "Biodiversity", "Climate"],
      signalType: "pressure",
      impactScore: 84,
    },
    {
      id: "biogas",
      name: "Organic Waste Biogas",
      tagline: "Turn waste into clean energy",
      description:
        "Collect organic waste from markets and homes to generate biogas for cooking and electricity, reducing landfill pressure simultaneously.",
      effort: "low",
      timeframe: "1–2 years",
      systemsHelped: ["Energy", "Waste", "Biodiversity"],
      signalType: "opportunity",
      impactScore: 77,
    },
    {
      id: "canopy_transit",
      name: "Canopy Transit Route",
      tagline: "Move through the city above the ground",
      description:
        "Build elevated walkways and cable-guided transit linking neighborhoods above the forest floor, reducing ground-level habitat damage.",
      effort: "high",
      timeframe: "4–7 years",
      systemsHelped: ["Mobility", "Biodiversity", "Air"],
      signalType: "pressure",
      impactScore: 80,
    },
  ],
};
