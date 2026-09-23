import { SearchResult } from "@/src/components/utilities/types";

export async function searchNigeriaCities(
  search: string
): Promise<SearchResult[]> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=20&countryCode=NG&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  const data = await response.json();
  console.log(data);

  return data;
}
