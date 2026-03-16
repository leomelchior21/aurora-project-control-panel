import projectAuroraLogo from "../../project-aurora-logo.svg";
import solaraLogo from "../../solara-logo.svg";
import frostaraLogo from "../../frostara-logo.svg";
import verdantiaLogo from "../../verdantia-logo.svg";
import type { CitySlug } from "../types";

export const cityLogos: Record<CitySlug, string> = {
  solara: solaraLogo,
  frostara: frostaraLogo,
  verdantia: verdantiaLogo,
};

export const auroraLogo = projectAuroraLogo;

export const cityThemes: Record<
  CitySlug,
  {
    primary: string;
    secondary: string;
    glow: string;
    panel: string;
  }
> = {
  solara: {
    primary: "#FF4D4D",
    secondary: "#FF9A5A",
    glow: "rgba(255, 108, 84, 0.45)",
    panel: "from-rose-500/20 via-orange-400/10 to-transparent",
  },
  frostara: {
    primary: "#4D7CFF",
    secondary: "#7DD3FC",
    glow: "rgba(96, 165, 250, 0.42)",
    panel: "from-blue-500/20 via-cyan-300/10 to-transparent",
  },
  verdantia: {
    primary: "#1BC47D",
    secondary: "#6EE7B7",
    glow: "rgba(16, 185, 129, 0.42)",
    panel: "from-emerald-500/20 via-lime-300/10 to-transparent",
  },
};
