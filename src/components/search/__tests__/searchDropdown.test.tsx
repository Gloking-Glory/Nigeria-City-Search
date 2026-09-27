import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchResult } from "../../utilities/types";
import SearchDropdown from "../searchDropdown";

const mockResults: SearchResult[] = [
  {
    id: 1,
    name: "Lagos",
    localGov: "",
    state: "Lagos",
    country: "Nigeria",
    displayName: "Lagos, Lagos State, Nigeria",
    type: "PPLA2",
  },
  {
    id: 2,
    name: "Lagos",
    localGov: "Ndokwa East",
    state: "Delta State",
    country: "Nigeria",
    displayName: "Lagos-Iyidi, Ndokwa East LG, Delta State, Nigeria",
    type: "PPL",
  },
];

describe("SearchDropdown", () => {
  it("renders search results", () => {
    render(
      <SearchDropdown
        results={mockResults}
        loading={false}
        error=""
        highlightedIndex={-1}
        onSelect={jest.fn()}
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
});