"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SearchResult, SearchType } from "@/src/components/utilities/types";
import SearchDropdown from "@/src/components/search/searchDropdown";
import { useCitySearch } from "@/src/hooks/useCitySearch";
import CityDetail from "@/src/components/search/cityDetail";
import SearchInput from "@/src/components/search/searchInput";

export default function Search() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchType>();

  const searchValue = watch("search", "");

  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const highlightedOptionRef = useRef<HTMLButtonElement>(null);  
  const isSelectingResult = useRef(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);   // handles dropdown options keyboard nav index
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

    setHighlightedIndex(-1);

    if (search.length < 3) {
      setCitySearch("");
      setSelectedCity(null);
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
        setHighlightedIndex(-1);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  useEffect(() => {
    // this add an effects that scrolls highlighted item into view when showing result dropdown
    if (highlightedIndex >= 0) {
      highlightedOptionRef.current?.scrollIntoView({
        block: "nearest",   // Only scroll if necessary to bring the highlighted element into the visible area
      });
    }
  }, [highlightedIndex]);

  const handleSelectResult = (cityResult: SearchResult) => {
    const cityName = cityResult.displayName;

    isSelectingResult.current = true;

    setValue('search', cityName);
    setSelectedCity(cityResult)
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleCloseDetails = () => {
    setSelectedCity(null);
    setValue("search", "");
    setCitySearch("");
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (searchValue.trim().length >=3) {
      setShowDropdown(true);
    }
  }
  const handleKeyboardNav = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();

      if (selectedCity) {
        handleCloseDetails();
        return;
      }

      if (showDropdown) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }

      return;
    }

    if (!showDropdown || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();         // removes browser default behavior 

      setHighlightedIndex((currentIndex) =>
        currentIndex < results.length - 1       // pressing ArrowDown at the bottom wraps back to the top
          ? currentIndex + 1
          : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((currentIndex) =>
        currentIndex > 0            // pressing ArrowUp at the first item wraps to the bottom
          ? currentIndex - 1
          : results.length - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();

      if (highlightedIndex >= 0) {
        handleSelectResult(results[highlightedIndex]);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flew-row gap-6 items-center justify-center bg-[url('/images/background.png')] bg-cover bg-center px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="
          bg-white
          p-6 sm:p-8 lg:p-10
          rounded-2xl
          shadow-lg
          w-full
          max-w-sm sm:max-w-md lg:max-w-lg
        "
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-emerald-300">
          Nigeria City Search
        </h2>

        <div ref={searchDropdownRef} className="relative">
          <SearchInput
            error={errors.search?.message}
            showDropdown={showDropdown}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyboardNav}
            register={register}
            highlightedIndex={highlightedIndex}
            searchResults={results}
          />

          {showDropdown && (
            <SearchDropdown
              results={results}
              loading={isFetching}
              error={errorMessage}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelectResult}
              onMouseHighlight={setHighlightedIndex}
              highlightedOptionRef={highlightedOptionRef}
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