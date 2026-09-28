import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefObject } from "react";
import SearchInput from "../searchInput";
import { SearchType } from '../../utilities/types';
import { useForm } from "react-hook-form";
import { SearchInputProps } from "../../utilities/propsTypes";

type TestFormProps = { showDropdown?: boolean; };

const TestForm = ({ showDropdown = false }: TestFormProps) => {
  const { register } = useForm<SearchType>();
  return (
    <SearchInput
      error=""
      onFocus={jest.fn()}
      onKeyDown={jest.fn()}
      register={register}
      searchResults={[]}
      showDropdown={showDropdown}
      highlightedIndex={-1}
    />
  );
};

describe("SearchInput", () => {
  it("shows search label and input bar", () => {
    render(<TestForm />);

    expect(
        screen.getByLabelText("Search and explore cities across Nigeria")
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText("Search for a city in Nigeria e.g. Lagos, Ibadan...")
    ).toBeInTheDocument();
  });

  it("has the correct combobox accesibility attributes", () => {
    render(<TestForm showDropdown={true} />);

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", "city-search-results");

  });
});
