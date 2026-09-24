"use-client";

import { SearchInputProps } from "../utilities/propsTypes";
import { SearchIcon } from "../utilities/svg";

export default function SearchInput({
  error, onFocus, onKeyDown, register,
  searchResults, showDropdown, highlightedIndex
}: SearchInputProps) {
  return (
    <>
      <label
        htmlFor="search"
        className="mb-2 block text-base font-medium text-emerald-700"
      >
        Search and explore cities across Nigeria
      </label>

      <div
        className={`
          flex items-center
          rounded-xl
          border
          bg-white
          transition
          ${
            error
              ? "border-red-500"
              : "border-green-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-blue-100"
          }
        `}
      >
        <span className="pl-4 text-gray-400" aria-hidden="true">
          <SearchIcon />
        </span>

        <input
          id="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="city-search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 && searchResults[highlightedIndex]
              ? `city-option-${searchResults[highlightedIndex].id}`
                : undefined
          }
          type="text"
          autoComplete="off"
          placeholder="Search for a city in Nigeria e.g. Lagos, Ibadan..."
          {...register("search", {
            required: "Location is required",
          })}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="
            w-full
            rounded-xl
            px-3 py-3
            text-base
            text-gray-900
            outline-none
            placeholder:text-gray-400
          "
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </>
  );
}