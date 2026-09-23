import { SearchResult } from "./types";

export type SearchDropdownProps = {
    results: SearchResult[];
    loading: boolean;
    error: string;
    onSelect: (result: SearchResult) => void;
}

export type SelectedCityDetailsProps = {
  city: SearchResult;
  onClose: () => void;
};
