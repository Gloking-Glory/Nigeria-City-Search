import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefObject } from "react";
import SearchDropdown from "../searchDropdown";
import { mockResults } from "../testsUtilities/mocks";

describe("SearchDropdown", () => {
  const highlightedOptionRef = { current: null } as RefObject<HTMLButtonElement | null>;

  it("shows search results", () => {
    render(
      <SearchDropdown
        results={mockResults}
        loading={false}
        error=""
        highlightedIndex={-1}
        onSelect={jest.fn()}
        highlightedOptionRef={highlightedOptionRef}
        onMouseHighlight={jest.fn()}
      />
    );

    expect(
      screen.getByRole("option", {
        name: "Lagos, Lagos State, Nigeria",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Lagos-Iyidi, Ndokwa East LG, Delta State, Nigeria",
      })
    ).toBeInTheDocument();
  });

  it("shows a loading message while searching", () => {
    render(
      <SearchDropdown
        results={[]}
        loading={true}
        error=""
        highlightedIndex={-1}
        onSelect={jest.fn()}
        highlightedOptionRef={highlightedOptionRef}
        onMouseHighlight={jest.fn()}
      />
    );

    expect(
      screen.getByText("Searching...")
    ).toBeInTheDocument();
  });

  it("marks the highlighted result as selected", () => {
    render(
      <SearchDropdown
        results={mockResults}
        loading={false}
        error=""
        highlightedIndex={1}
        onSelect={jest.fn()}
        highlightedOptionRef={highlightedOptionRef}
        onMouseHighlight={jest.fn()}
      />
    );

    const cityOption1 = screen.getByRole("option", {
      name: "Lagos, Lagos State, Nigeria",
    });
  
    const cityOption2 = screen.getByRole("option", {
      name: "Lagos-Iyidi, Ndokwa East LG, Delta State, Nigeria",
    });

    expect(cityOption1).toHaveAttribute("aria-selected", "false");
    expect(cityOption2).toHaveAttribute("aria-selected", "true");
  });


  it('calls onSelect when a result is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    const handleMouseHighlight = jest.fn();

    render(
      <SearchDropdown
        results={mockResults}
        loading={false}
        error=""
        highlightedIndex={-1}
        onSelect={handleSelect}
        onMouseHighlight={handleMouseHighlight}
        highlightedOptionRef={highlightedOptionRef}
      />
    );

    const cityOption = screen.getByRole("option", {
      name: "Lagos, Lagos State, Nigeria",
    });

    await user.click(cityOption);

    expect(handleSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it('shows error message when search failed', () => {
    render(
      <SearchDropdown
        results={[]}
        loading={false}
        error="Unable to search locations."
        highlightedIndex={-1}
        onSelect={jest.fn()}
        highlightedOptionRef={highlightedOptionRef}
        onMouseHighlight={jest.fn()}
      />
    );

    expect(
      screen.getByText("Unable to search locations.")
    ).toBeInTheDocument();
  });

  it("shows empty state when there are no results", () => {
    render(
      <SearchDropdown
        results={[]}
        loading={false}
        error=""
        highlightedIndex={-1}
        onSelect={jest.fn()}
        highlightedOptionRef={highlightedOptionRef}
        onMouseHighlight={jest.fn()}
      />
    );

    expect(
      screen.getByText("No city located in Nigeria with that name.")
    ).toBeInTheDocument();
  });
});
