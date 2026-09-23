"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SearchResult, SearchType } from "@/src/components/utilities/types";
import { SearchIcon } from "@/src/components/utilities/svg";
import SearchDropdown from "@/src/components/searchDropdown";

export default function Search() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SearchType>();

  const searchValue = watch("search", "");

  const [results, setResults] = useState<SearchResult[]>([]);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const search = searchValue.trim();

    if (search.length < 3) {
      setResults([]);
      setShowDropdown(false);
      setIsLoading(false);
      setError("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        setShowDropdown(true);

        console.log("Searching API for:", search);

        // Temporary mock data for UI development
        const mockResults: SearchResult[] = [
          { id: 1, name: `${search}`, country: 'Country', state: 'State' },
          { id: 2, name: `${search} District`, country: 'Country', state: 'State' },
          { id: 3, name: `${search} State`, country: 'Country', state: 'State' },
          { id: 1, name: `${search}`, country: 'Country', state: 'State' },
          { id: 2, name: `${search} District`, country: 'Country', state: 'State' },
          { id: 3, name: `${search} State`, country: 'Country', state: 'State' },
          { id: 1, name: `${search}`, country: 'Country', state: 'State' },
          { id: 2, name: `${search} District`, country: 'Country', state: 'State' },
          { id: 3, name: `${search} State`, country: 'Country', state: 'State' },
          { id: 1, name: `${search}`, country: 'Country', state: 'State' },
          { id: 2, name: `${search} District`, country: 'Country', state: 'State' },
          { id: 3, name: `${search} State`, country: 'Country', state: 'State' },
          { id: 1, name: `${search}`, country: 'Country', state: 'State' },
          { id: 2, name: `${search} District`, country: 'Country', state: 'State' },
          { id: 3, name: `${search} State`, country: 'Country', state: 'State' },
        ];

        setResults(mockResults);
      } catch (err) {
        console.error(err);
        setError("Unable to search locations.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
        ) {
        setShowDropdown(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleSelectResult = () => {
    console.log('result');
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background.png')] bg-cover bg-center px-4 sm:px-6 lg:px-8">
      <form
        className="
          bg-white
          p-6 sm:p-8 lg:p-10
          rounded-2xl
          shadow-lg
          w-full
          max-w-sm sm:max-w-md lg:max-w-lg
        "
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-blue-600">
          Search Location
        </h2>

        <div ref={searchDropdownRef} className="relative">
          {/* <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location
          </label> */}

          <div
            className={`
              flex items-center
              border rounded-xl
              bg-white
              transition
              ${
                errors.search
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
              }
            `}
          >
            <span className="pl-4 text-gray-400" aria-hidden="true">
              <SearchIcon />
            </span>

            <input
              id="search"
              type="text"
              autoComplete="on"
              placeholder="Search for a location..."
              {...register("search", {
                required: "Location is required",
              })}
              onFocus={() => {
                if (searchValue.trim().length >= 3) {
                  setShowDropdown(true);
                }
              }}
              className="
                w-full
                px-3 py-3
                rounded-xl
                outline-none
                text-gray-900
                placeholder:text-gray-400
              "
            />
          </div>

          {errors.search && (
            <p className="mt-1 text-sm text-red-500">
              {errors.search.message}
            </p>
          )}

          {showDropdown && (
            <SearchDropdown
              results={results}
              loading={isLoading}
              error={error}
              onSelect={handleSelectResult}
            />
          )}
        </div>
      </form>
    </div>
  );
}