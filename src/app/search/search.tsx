"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SearchResult, SearchType } from "@/src/components/utilities/types";
import { SearchIcon } from "@/src/components/utilities/svg";
import SearchDropdown from "@/src/components/searchDropdown";
import { useCitySearch } from "@/src/hooks/useCitySearch";
import CityDetail from "@/src/components/cityDetail";

export default function Search() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchType>();

  const searchValue = watch("search", "");

  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const isSelectingResult = useRef(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<SearchResult | null>(null);

  const {
    data: results = [], isFetching, isError, error
  } = useCitySearch(citySearch);

  const errorMessage = isError
    ? error instanceof Error
      ? error.message 
        : 'Unable to search locations.' 
    : "";

  useEffect(() => {
    if (isSelectingResult.current) {
      isSelectingResult.current = false;
      return;
    }

    const search = searchValue.trim();

    if (search.length < 3) {
      setCitySearch("");
      setShowDropdown(false);
      return;
    }

    const searchTimeout = setTimeout(() => {
      setCitySearch(search);
      setShowDropdown(true);
    }, 500);

    return () => clearTimeout(searchTimeout);
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

  const handleSelectResult = (cityResult: SearchResult) => {
    const cityName = cityResult.displayName;
    isSelectingResult.current = true;
    setValue('search', cityName);
    setSelectedCity(cityResult)
    setShowDropdown(false);
  };

  const handleCloseDetails = () => {
    setSelectedCity(null);
    setValue("search", "");
    setCitySearch("");
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
              autoComplete="off"
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
              loading={isFetching}
              error={errorMessage}
              onSelect={handleSelectResult}
            />
          )}
        </div>
      </form>

      {selectedCity && (
        <CityDetail
          city={selectedCity}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}