import { UseFormRegister } from "react-hook-form";
import { SearchResult, SearchType } from "./types";

export type SearchDropdownProps = {
    results: SearchResult[];
    loading: boolean;
    error: string;
    highlightedIndex: number;
    onSelect: (result: SearchResult) => void;
    onMouseHighlight: (index: number) => void;
}

export type SelectedCityDetailsProps = {
  city: SearchResult;
  onClose: () => void;
};

export type SearchInputProps = {
  error?: string;
  showDropdown: boolean;
  highlightedIndex: number;
  searchResults: SearchResult[];
  onFocus: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  register: UseFormRegister<SearchType>;
};