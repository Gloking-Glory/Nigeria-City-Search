import { useQuery } from "@tanstack/react-query";
import { searchNigeriaCities } from "@/src/services/nigeriaCitiesApi";

export function useCitySearch(search: string) {
  return useQuery({
    queryKey: ["cities", search],
    queryFn: () => searchNigeriaCities(search),
    enabled: search.length >= 3,
  });
}