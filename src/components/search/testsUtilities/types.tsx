export type TestSearchInputProps = {
  showDropdown?: boolean;
  highlightedIndex?: number;
  error?: string;
  onFocus?: () => void;
  onKeyDown?:  (event: React.KeyboardEvent<HTMLInputElement>) => void;
};