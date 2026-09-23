"use client";

import { SearchResult } from "./utilities/types";

type SearchDropdownProps = {
    results: SearchResult[];
    loading: boolean;
    error: string;
    onSelect: (result: SearchResult) => void;
}

export default function SearchDropdown({
    results, loading, error, onSelect
}: SearchDropdownProps) {
  return (
    <div>
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
            <ul className="max-h-[250px] overflow-y-auto">
                {results.map((result) => (
                <li key={result.id}>
                    <button
                    type="button"
                    onClick={() => onSelect(result)}
                    className="
                        w-full
                        px-4 py-3
                        text-left
                        text-sm
                        text-gray-700
                        hover:bg-blue-50
                        transition
                    "
                    >
                    {result.name}
                    </button>
                </li>
                ))}
            </ul>
            ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
                No locations found.
            </div>
            )}
        </div>
    </div>
  );
}