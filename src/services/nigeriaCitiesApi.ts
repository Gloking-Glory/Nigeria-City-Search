import { SearchResult } from "@/src/components/utilities/types";
import { OpenMeteoResponse } from "./types/openMeteo";

export async function searchNigeriaCities(
  search: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  if (!search.trim()) return [];

  const params = new URLSearchParams({
    name: search,
    countryCode: "NG",
    count: "20",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  const data: OpenMeteoResponse = await response.json();

  const cityDetails = (data.results ?? []).map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    state: city.admin1 ?? "",
    localGov: city.admin2 ?? "",
    displayName: `${city.name}${city.admin2 ? `, ${city.admin2} LG` : ""}, ${city.admin1}, ${city.country}`,
    type: city.feature_code,
  }));

  return cityDetails;
}