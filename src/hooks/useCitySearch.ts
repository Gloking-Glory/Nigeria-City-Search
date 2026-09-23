import { useQuery } from "@tanstack/react-query";
import { searchNigeriaCities } from "@/src/services/nigeriaCitiesApi";

export function useCitySearch(search: string) {
  return useQuery({
    queryKey: ["cities", search],
    queryFn: ({ signal }) => searchNigeriaCities(search, signal),
    enabled: search.length >= 3,
  });
}