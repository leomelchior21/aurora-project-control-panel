import { manaus } from "./manaus";
import { pelotas } from "./pelotas";
import { petrolina } from "./petrolina";
import type { CityData, CitySlug } from "../../types/city";

export const cityCollection: CityData[] = [petrolina, manaus, pelotas];

export const cityMap: Record<CitySlug, CityData> = {
  petrolina,
  manaus,
  pelotas,
};
