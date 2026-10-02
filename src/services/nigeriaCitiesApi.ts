import { SearchResult } from "@/src/components/utilities/types";
import { OpenMeteoResponse } from "./types/openMeteo";

export async function searchNigeriaCities(
  search: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const searchValue = search.trim();

  if (searchValue.length < 3) return [];

  const params = new URLSearchParams({
    name: searchValue,
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

  const cityDetails = (data.results ?? []).map((city) => {
    const {
      id, name, country,
      admin1: state, admin2: localGov, feature_code: type
    } = city;

    const formattedState =
      state === "Federal Capital Territory" || state === "FCT"
        ? "FCT"
        : state?.toLowerCase().endsWith("state")
          ? state
          : state
            ? `${state} State`
            : "";
    
    return {
      id, name, country, type,
      state: state ?? "",
      localGov: localGov ?? "",
      displayName: `${name}${localGov ? `, ${localGov} LG` : ""}, ${formattedState}, ${country}`,
    }
  });

  return cityDetails;
}