import { SearchResult } from "@/src/components/utilities/types";
import { NominatimResponse } from "./types/nominatim";

export async function searchNigeriaCities(
  search: string
): Promise<SearchResult[]> {
  if (!search.trim()) return [];

  const params = new URLSearchParams({
    q: search,
    countrycodes: "ng",
    featuretype: "settlement",
    addressdetails: "1",
    format: "json",
    limit: "5",
  });

  const fetchCityUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const response = await fetch(fetchCityUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  const data: NominatimResponse = await response.json();

  const cityDetails = data.map((city) => ({
    id: city.place_id,
    country: city.address?.country,
    state: city.address?.state,
    type: city.type,
    displayName: city.display_name,
    name: city.name
  }));

  return cityDetails;
}