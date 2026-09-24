"use client";

import { SearchDropdownProps } from "../utilities/propsTypes";

export default function SearchDropdown({
    results, loading, error, 
    highlightedIndex, onMouseHighlight, onSelect
}: SearchDropdownProps) {
  return (
    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
                Searching...
            </div>
        ) : error ? (
            <div className="px-4 py-3 text-sm text-red-500">
                {error}
            </div>
        ) : results.length > 0 ? (
            <ul role="listbox" id="city-search-results" className="max-h-[250px] overflow-y-auto">
                {results.map((result, index) => (
                    <li key={result.id}>
                        <button
                            id={`city-option-${result.id}`}
                            type="button"
                            role="option"
                            aria-selected={highlightedIndex === index}
                            onMouseEnter={() => onMouseHighlight(index)}
                            onClick={() => onSelect(result)}
                            className={`
                                w-full
                                px-4 py-3
                                text-left
                                text-sm
                                text-gray-700
                                hover:bg-blue-50
                                transition
                                ${
                                    highlightedIndex === index
                                    ? "bg-blue-50"
                                    : ""
                                }
                            `}
                        >
                            {result.displayName}
                        </button>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
                No city located in Nigeria with that name.
            </div>
        )}
    </div>
  );
}