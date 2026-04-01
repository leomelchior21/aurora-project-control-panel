import type { CitySlug } from "../types/city";

export interface SocialPulseEntry {
  handle: string;
  city: string;
  severity: "critical" | "attention";
  text: string;
}

export const socialPulseByCity: Record<CitySlug | "compare", SocialPulseEntry[]> = {
  petrolina: [
    {
      handle: "@PetrolinaPulse",
      city: "Petrolina",
      severity: "critical",
      text: "The river is right there, yet my tap has been dry since Monday. Someone explain the math.",
    },
    {
      handle: "@PetrolinaPulse",
      city: "Petrolina",
      severity: "critical",
      text: "It is 1 PM and the transformer just exploded. No fans, no water, just sun.",
    },
    {
      handle: "@PetrolinaPulse",
      city: "Petrolina",
      severity: "attention",
      text: "The canal shines in the sun while the meter keeps spinning and the water keeps vanishing.",
    },
  ],
  manaus: [
    {
      handle: "@ManausLive",
      city: "Manaus",
      severity: "critical",
      text: "The igarape behind my house is not water anymore, it is a river of PET bottles.",
    },
    {
      handle: "@ManausLive",
      city: "Manaus",
      severity: "critical",
      text: "I am at the bus stop and I cannot breathe. It feels like a sauna made of exhaust fumes.",
    },
    {
      handle: "@ManausLive",
      city: "Manaus",
      severity: "attention",
      text: "The rain falls fast, but the city cannot move it because the drains are already full of plastic.",
    },
  ],
  pelotas: [
    {
      handle: "@PelotasProtest",
      city: "Pelotas",
      severity: "critical",
      text: "The walls are crying again. It is colder inside my house than it is in the street.",
    },
    {
      handle: "@PelotasProtest",
      city: "Pelotas",
      severity: "critical",
      text: "Just got my electric bill. I guess we are not eating meat this week. This city is a freezer.",
    },
    {
      handle: "@PelotasProtest",
      city: "Pelotas",
      severity: "attention",
      text: "Every winter we pay more to heat a house that leaks warmth through every surface.",
    },
  ],
  compare: [
    {
      handle: "@AuroraCompare",
      city: "Critical Connections",
      severity: "critical",
      text: "Petrolina wastes sun. Pelotas wastes heat. Different climates, same design failure.",
    },
    {
      handle: "@AuroraCompare",
      city: "Critical Connections",
      severity: "attention",
      text: "Water inequality in the semi-arid and flood blockage in the rainforest both expose who gets protected first.",
    },
    {
      handle: "@AuroraCompare",
      city: "Critical Connections",
      severity: "critical",
      text: "Shade missing in Petrolina and insulation missing in Pelotas point to the same question: who was this city built for?",
    },
  ],
};
