import projectAuroraLogo from "../../../project-aurora-logo.svg";
import solaraLogo from "../../../solara-logo.svg";
import frostaraLogo from "../../../frostara-logo.svg";
import verdantiaLogo from "../../../verdantia-logo.svg";
import solaraLandscape from "../../../solara-landscape.png";
import solaraStreetview from "../../../solara-streetview.png";
import frostaraLandscape from "../../../frostara-landscape.png";
import frostaraStreetview from "../../../frostara-streetview.png";
import verdantiaLandscape from "../../../verdantia-landscape.png";
import verdantiaStreetview from "../../../verdantia-streetview.png";
import solaraMap from "../../../mapa-solara.png";
import frostaraMap from "../../../mapa-frostara.png";
import verdantiaMap from "../../../mapa-verdantia.png";
import type { CitySlug } from "../../types/city";

export const auroraLogo = projectAuroraLogo;

export const cityAssets: Record<
  CitySlug,
  {
    logo: string;
    heroImage: string;
    secondaryImage: string;
    mapImage: string;
    accent: string;
    accentSoft: string;
  }
> = {
  solara: {
    logo: solaraLogo,
    heroImage: solaraLandscape,
    secondaryImage: solaraStreetview,
    mapImage: solaraMap,
    accent: "#d7a34f",
    accentSoft: "#ffcf80",
  },
  frostara: {
    logo: frostaraLogo,
    heroImage: frostaraLandscape,
    secondaryImage: frostaraStreetview,
    mapImage: frostaraMap,
    accent: "#69bff3",
    accentSoft: "#9fe7ff",
  },
  verdantia: {
    logo: verdantiaLogo,
    heroImage: verdantiaLandscape,
    secondaryImage: verdantiaStreetview,
    mapImage: verdantiaMap,
    accent: "#5fbc8d",
    accentSoft: "#92e0bc",
  },
};
