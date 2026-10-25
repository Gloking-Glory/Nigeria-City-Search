import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCitySearch } from "../useCitySearch";
import { searchNigeriaCities } from "@/src/services/nigeriaCitiesApi";
import { abujaMockCity, mockCity } from "@/src/components/search/testsUtilities/mocks";

jest.mock("@/src/services/nigeriaCitiesApi", () => ({
  searchNigeriaCities: jest.fn(),
}));

const mockSearchNigeriaCities = jest.mocked(searchNigeriaCities);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper(
    { children, }: { children: React.ReactNode; }
  ) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("useCitySearch", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("does not search when search value is less than 3 characters", () => {
    const { result } = renderHook(
      () => useCitySearch("La"),
      { wrapper: createWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockSearchNigeriaCities).not.toHaveBeenCalled();
  });

  it("trims whitespace before searching", async () => {
    mockSearchNigeriaCities.mockResolvedValue([]);
    
    const { result } = renderHook(
      () => useCitySearch("   Lagos   "),
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSearchNigeriaCities).toHaveBeenCalledWith(
      "Lagos",
      expect.any(AbortSignal)
    );
  });

  it("searches when search value has at least 3 characters", async () => {
    mockSearchNigeriaCities.mockResolvedValue([]);

    const { result } = renderHook(
      () => useCitySearch("Lag"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  
    expect(mockSearchNigeriaCities).toHaveBeenCalledWith(
      "Lag",
      expect.any(AbortSignal)
    );

    expect(result.current.data).toEqual([]);
  });

  it("exposes error when the search fails", async () => {
    mockSearchNigeriaCities.mockRejectedValue(
      new Error("Failed to fetch cities")
    );

    const { result } = renderHook(
      () => useCitySearch("Lag"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("Failed to fetch cities");
    });
  });

  it("searches again when the search term changes", async () => {
    mockSearchNigeriaCities
      .mockResolvedValueOnce([mockCity])
      .mockResolvedValueOnce([abujaMockCity]);

    const { result, rerender } = renderHook(
      ({ search }) => useCitySearch(search),
      {
        initialProps: { search: "Lag" },
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockCity]);
    });
  
    expect(mockSearchNigeriaCities).toHaveBeenNthCalledWith(
      1,
      "Lag",
      expect.any(AbortSignal)
    );
    
    rerender({ search: "Abu" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([abujaMockCity]);
    });
    
    expect(mockSearchNigeriaCities).toHaveBeenNthCalledWith(
      2,
      "Abu",
      expect.any(AbortSignal)
    );

    expect(mockSearchNigeriaCities).toHaveBeenCalledTimes(2);
  });
});