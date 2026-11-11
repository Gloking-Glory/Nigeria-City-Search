import { within, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../search";
import { useCitySearch } from "@/src/hooks/useCitySearch";
import { mockCity, mockResults } from "@/src/components/search/testsUtilities/mocks";

jest.mock("@/src/hooks/useCitySearch", () => ({
  useCitySearch: jest.fn(),
}));

const mockUseCitySearch = jest.mocked(useCitySearch);

describe("Search", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

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
    jest.clearAllMocks();
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

  it("does not pass search value to hook when its shorter than 3 characters", async () => {
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

    act(() => {
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

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lag");
  });

  it("cancels the previous pending search when user type before 500ms", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Iba");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await user.type(input, "dan");

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(mockUseCitySearch).not.toHaveBeenCalledWith("Iba");

    act(() => {
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

    act(() => {
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

    act(() => {
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


  it("displays returned cities in the dropdown", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockImplementation((search) => ({
      data: search === "Lagos" ? mockResults : [],
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>));

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(
      screen.queryByText("Unable to search locations.")
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: mockResults[0].displayName })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: mockResults[1].displayName })
    ).toBeInTheDocument();
  });

  it("displays loading state while fetching results", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockImplementation(() => ({
      data: [],
      isFetching: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>));

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Searching...")
    ).toBeInTheDocument();
  });

  it("displays empty result message when no city is found", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Ijw");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Ijw");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("No city located in Nigeria with that name.")
    ).toBeInTheDocument();
  });

  it("displays an error message when search fails", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: [],
      isFetching: false,
      isError: true,
      error: new Error("Failed to fetch cities"),
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Failed to fetch cities")
    ).toBeInTheDocument();
  });

  it("displays fallback error message when error is not an Error instance", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: [],
      isFetching: false,
      isError: true,
      error: "Unable to search locations.",
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Unable to search locations.")
    ).toBeInTheDocument();
  });

  it("hides the dropdown when the input has fewer than 3 characters", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: mockResults[0].displayName })
    ).toBeInTheDocument();
    
    await user.clear(input);
    await user.type(input, "La");

    expect(input).toHaveValue("La");
    expect(mockUseCitySearch).not.toHaveBeenCalledWith("La");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("clears selected city details when the user starts a new short search", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: [mockCity],
      isFetching: false,
      isError: false,
      error: null
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("option", { name: mockCity.displayName })
    );

    expect(input).toHaveValue(mockCity.displayName);

    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "La");

    expect(input).toHaveValue("La");
    expect(
      screen.queryByRole("heading", { name: "City Details" })
    ).not.toBeInTheDocument();
  });

  it("closes the dropdown when user click outside the search area", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    await user.click(document.body);

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("reopen dropdown when user focuses on input after clicking outside", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    await user.click(document.body);

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();

    await user.click(input);

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("option")
    ).toHaveLength(mockResults.length);
  });

  it("selects a city when the user clicks a dropdown result", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: mockResults[0].displayName })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: mockResults[1].displayName })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("option", { name: mockResults[1].displayName })
    );

    expect(input).toHaveValue(mockResults[1].displayName);
    expect(mockUseCitySearch).not.toHaveBeenCalledWith(mockResults[1].displayName);

    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("displays the selected city details", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: mockResults[0].displayName })
    ).toBeInTheDocument();
    
    await user.click(
      screen.getByRole("option", { name: mockResults[0].displayName })
    );

    expect(input).toHaveValue(mockResults[0].displayName);

    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();

    const {
      name, displayName, state, country, type
    } = mockResults[0];

    const detailContainer = screen.getByRole("heading", {
      name: "City Details",
    }).parentElement!;

    expect(within(detailContainer).getByText(name)).toBeInTheDocument();
    expect(within(detailContainer).getByText(displayName)).toBeInTheDocument();
    expect(within(detailContainer).getByText(state)).toBeInTheDocument();
    expect(within(detailContainer).getByText(country)).toBeInTheDocument();
    expect(within(detailContainer).getByText(type)).toBeInTheDocument();
  });

  it("highlights results when the user presses ArrowDown", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(
      screen.getByRole("option", { name: mockResults[0].displayName })
    ).toBeInTheDocument();

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");

    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");

    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("highlights the previous result when the user presses ArrowUp", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    
    await user.keyboard("{ArrowUp}");

    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("wraps to the last result when ArrowUp is pressed on the first result", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");

    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowUp}");
    
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[options.length - 1]).toHaveAttribute("aria-selected", "true");
  });

  it("wraps to the first result when ArrowDown is pressed on the last result", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    for(let i = 0; i < options.length; i++) {
      await user.keyboard("{ArrowDown}");
    }

    expect(options[options.length - 1]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowDown}");

    expect(options[options.length - 1]).toHaveAttribute("aria-selected", "false");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("selects the highlighted result when the user presses Enter", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");
    
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");

    expect(input).toHaveValue(mockResults[0].displayName);
    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();

    const { name } = mockResults[0];

    const detailContainer = screen.getByRole("heading", {
      name: "City Details",
    }).parentElement!;

    expect(within(detailContainer).getByText(name)).toBeInTheDocument();
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("does not select a result when Enter is pressed without highlighted result", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{Enter}");

    expect(
      screen.queryByRole("heading", { name: "City Details" })
    ).not.toBeInTheDocument();

    const { name } = mockResults[0];

    expect(screen.queryByText(name)).not.toBeInTheDocument();
  });

  it("does not highlight or select a result when there are no results", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Ijw");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Ijw");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();

    await user.keyboard("{ArrowDown}");

    const option = screen.queryByRole("option");

    expect(option).not.toBeInTheDocument();
    expect(
      screen.getByText("No city located in Nigeria with that name.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "City Details" })
    ).not.toBeInTheDocument();
  });

  it("resets the highlighted index when the search term changes", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lag");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lag");

    let options = screen.getAllByRole("option");
    
    expect(options).toHaveLength(mockResults.length);

    expect(options[0]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    expect(options[1]).toHaveAttribute("aria-selected", "true");

    await user.clear(input);
    await user.type(input, "Lagos");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    options = screen.getAllByRole("option");
    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("closes the dropdown when Escape is pressed", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    expect(
      screen.getAllByRole("option")
    ).toHaveLength(mockResults.length);
    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(input).toHaveValue("Lagos");
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });

  it("closes selected city details when Escape is pressed", async () => {
    jest.useFakeTimers();
    mockUseCitySearch.mockReturnValue({
      data: mockResults,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCitySearch>);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lagos");
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockUseCitySearch).toHaveBeenLastCalledWith("Lagos");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(mockResults.length);
    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");

    expect(input).toHaveValue(mockResults[0].displayName);
    expect(input).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(input).toHaveValue("");
    expect(
      screen.queryByRole("heading", { name: "City Details" })
    ).not.toBeInTheDocument();
  });
});