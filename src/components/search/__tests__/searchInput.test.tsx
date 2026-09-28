import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "../searchInput";
import { SearchType } from '../../utilities/types';
import { useForm } from "react-hook-form";
import { TestSearchInputProps } from "../testsUtilities/types";
import { mockResults } from "../testsUtilities/mocks";

const TestSearchInput = ({
    showDropdown = false, highlightedIndex = -1, error = "",
    onFocus = jest.fn(), onKeyDown = jest.fn()
}: TestSearchInputProps) => {
  const { register } = useForm<SearchType>();
  return (
    <SearchInput
      error={error}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      register={register}
      searchResults={mockResults}
      showDropdown={showDropdown}
      highlightedIndex={highlightedIndex}
    />
  );
};

describe("SearchInput", () => {
  it("shows search label and input bar", () => {
    render(<TestSearchInput />);

    expect(
        screen.getByLabelText("Search and explore cities across Nigeria")
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText("Search for a city in Nigeria e.g. Lagos, Ibadan...")
    ).toBeInTheDocument();
  });

  it("allows the user to type into the input", async () => {
    const user = userEvent.setup();

    render(<TestSearchInput />);

    const input = screen.getByRole("combobox");
    
    await user.type(input, "Lagos");

    expect(input).toHaveValue("Lagos");

  });

  it("has the correct combobox accessibility attributes", () => {
    render(<TestSearchInput showDropdown={true} />);

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", "city-search-results");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
  });

  it("sets aria-expanded to false when dropdown is closed", () => {
    render(<TestSearchInput showDropdown={false} />);

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded", "false"
    );
  });

  it("sets aria-activedescendant to the highlighted result", () => {
    render(<TestSearchInput showDropdown={true} highlightedIndex={1} />);

    expect(
      screen.getByRole("combobox")      
    ).toHaveAttribute(
        "aria-activedescendant",
        "city-option-2"
    );
  });

  it("does not set aria-activedescendant when no result is highlighted", () => {
    render(<TestSearchInput showDropdown={true} highlightedIndex={-1} />);

    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-activedescendant");
  });

  it("shows validation error when provided", () => {
    render(<TestSearchInput error={"Location is required"} />);

    expect(
      screen.getByText("Location is required")
    ).toBeInTheDocument();
  });

  it("does not show an error when error is not provided", () => {
    render(<TestSearchInput />);

    expect(
      screen.queryByText("Location is required")
    ).not.toBeInTheDocument();
  });

  it("calls onFocus when input receives focus", async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();

    render(<TestSearchInput onFocus={handleFocus} />);

    const input = screen.getByRole("combobox");

    await user.click(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown when keyboard is pressed", async () => {
    const user = userEvent.setup();
    const handleKeydown = jest.fn();

    render(<TestSearchInput onKeyDown={handleKeydown} />);

    const input = screen.getByRole("combobox");

    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(handleKeydown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "ArrowDown",
      })
    );
  });
});
