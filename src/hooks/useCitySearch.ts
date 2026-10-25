import { useQuery } from "@tanstack/react-query";
import { searchNigeriaCities } from "@/src/services/nigeriaCitiesApi";

export function useCitySearch(search: string) {
  const searchValue = search.trim();

  return useQuery({
    queryKey: ["cities", searchValue],
    queryFn: ({ signal }) => searchNigeriaCities(searchValue, signal),
    enabled: searchValue.length >= 3,
  });
}