import projectAuroraLogo from "../../../project-aurora-logo.svg";
import petrolinaLogo from "../../../petrolina-logo.svg";
import manausLogo from "../../../manaus-logo.svg";
import pelotasLogo from "../../../pelotas-logo.svg";
import petrolinaPanel from "../../../petrolina-panel.svg";
import manausPanel from "../../../manaus-panel.svg";
import pelotasPanel from "../../../pelotas-panel.svg";
import petrolinaMap from "../../../petrolina-map.svg";
import manausMap from "../../../manaus-map.svg";
import pelotasMap from "../../../pelotas-map.svg";
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
    logo: petrolinaLogo,
    heroImage: petrolinaPanel,
    secondaryImage: petrolinaPanel,
    mapImage: petrolinaMap,
    accent: "#FF8C00",
    accentSoft: "#FFBF00",
  },
  manaus: {
    logo: manausLogo,
    heroImage: manausPanel,
    secondaryImage: manausPanel,
    mapImage: manausMap,
    accent: "#FF3131",
    accentSoft: "#FF8B6E",
  },
  pelotas: {
    logo: pelotasLogo,
    heroImage: pelotasPanel,
    secondaryImage: pelotasPanel,
    mapImage: pelotasMap,
    accent: "#7D93A8",
    accentSoft: "#B8C9D9",
  },
};
