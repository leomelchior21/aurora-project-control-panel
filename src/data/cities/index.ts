import { frostara } from "./frostara";
import { solara } from "./solara";
import { verdantia } from "./verdantia";
import type { CityData, CitySlug } from "../../types/city";

export const cityCollection: CityData[] = [solara, frostara, verdantia];

export const cityMap: Record<CitySlug, CityData> = {
  solara,
  frostara,
  verdantia,
};
