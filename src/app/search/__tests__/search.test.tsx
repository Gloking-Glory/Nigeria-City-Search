import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../search";
import { useCitySearch } from "@/src/hooks/useCitySearch";
import { mockCity } from "@/src/components/search/testsUtilities/mocks";

jest.mock("@/src/hooks/useCitySearch", () => ({
  useCitySearch: jest.fn(),
}));

const mockUseCitySearch = jest.mocked(useCitySearch);

describe("Search", () => {
  beforeEach(() => {
    mockUseCitySearch.mockReset();

    mockUseCitySearch.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders the search header", () => {
    render(<Search />);

    expect(
      screen.getByRole("heading", { name: "Nigeria City Search" })
    ).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<Search />);

    expect(
      screen.getByRole("combobox", { name: "Search and explore cities across Nigeria"})
    ).toBeInTheDocument();
  });

  it("does not display dropdown initially", () => {
    render(<Search />);

    expect(
      screen.queryByText("Searching...")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("does not display city details initially", () => {
    render(<Search />);

    expect(
      screen.queryByRole("heading", { name: "City Details" })
    ).not.toBeInTheDocument();
  });

  it("does not pass search value to hook when is less than 3", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "La");

    expect(mockUseCitySearch).not.toHaveBeenCalledWith("La");
  });

  it("does not trigger search immediately after entering 3 or more characters", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");

    expect(mockUseCitySearch).not.toHaveBeenCalledWith("Lagos");
  });

  it("triggers a search after 500ms debounce period", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
  });

  it("trims whitespace before searching", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "   Lag   ");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lag");
  });

  it("cancels previous pending search when user type before 500ms", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Iba");

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await user.type(input, "dan");

    await act(async () => {
      jest.advanceTimersByTime(499);
    });

    expect(mockUseCitySearch).not.toHaveBeenCalledWith("Iba");

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Ibadan");
  });

  it("does not display dropdown when waiting debounce period", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lag");

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
    expect(mockUseCitySearch).not.toHaveBeenCalledWith("Lag");
  });

  it("displays dropdown after debounce period completed", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockImplementation((search) => ({
      data: search === "Lagos" ? [mockCity] : [],
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>));

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: mockCity.displayName })
    ).toBeInTheDocument();
  });
});