import projectAuroraLogo from "../../../project-aurora-logo.svg";
import petrolinaLandscape from "../../../petrolina-landscape.png";
import petrolinaStreetview from "../../../petrolina-streetview.png";
import petrolinaMap from "../../../mapa-petrolina.png";
import manausLandscape from "../../../manaus-landscape.png";
import manausStreetview from "../../../manaus-streetview.png";
import manausMap from "../../../mapa-manaus.png";
import pelotasLandscape from "../../../pelotas-landscape.png";
import pelotasStreetview from "../../../pelotas-streetview.png";
import pelotasMap from "../../../mapa-pelotas.png";
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
  petrolina: {
    logo: projectAuroraLogo,
    heroImage: petrolinaLandscape,
    secondaryImage: petrolinaStreetview,
    mapImage: petrolinaMap,
    accent: "#FF8C00",
    accentSoft: "#FFBF00",
  },
  manaus: {
    logo: projectAuroraLogo,
    heroImage: manausLandscape,
    secondaryImage: manausStreetview,
    mapImage: manausMap,
    accent: "#FF3131",
    accentSoft: "#FF8B6E",
  },
  pelotas: {
    logo: projectAuroraLogo,
    heroImage: pelotasLandscape,
    secondaryImage: pelotasStreetview,
    mapImage: pelotasMap,
    accent: "#7D93A8",
    accentSoft: "#B8C9D9",
  },
};
