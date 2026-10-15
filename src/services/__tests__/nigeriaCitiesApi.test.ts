import { fctMockResult, mockApiResult, stateSuffixMockResult } from "@/src/components/search/testsUtilities/mocks";
import { searchNigeriaCities } from "../nigeriaCitiesApi";

describe("searchNigeriaCities", () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("trims whitespace before searching", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    await searchNigeriaCities("  Lagos   ");

    const requestUrl = fetchMock.mock.calls[0][0] as string;
    const url = new URL(requestUrl);

    expect(url.searchParams.get("name")).toBe("Lagos");
    expect(url.searchParams.get("countryCode")).toBe("NG");
  });

  it("trims whitespace before checking search value length", async () => {
    const result = await searchNigeriaCities("   La   ");

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not fetch when search value is less than 3 characters", async () => {
    const result = await searchNigeriaCities("La");

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends correct API parameters", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    await searchNigeriaCities("Lagos");

    const requestUrl = fetchMock.mock.calls[0][0] as string;
    const url = new URL(requestUrl);

    expect(url.origin).toBe("https://geocoding-api.open-meteo.com");
    expect(url.pathname).toBe("/v1/search");

    expect(url.searchParams.get("name")).toBe("Lagos");
    expect(url.searchParams.get("countryCode")).toBe("NG");
    expect(url.searchParams.get("count")).toBe("20");
    expect(url.searchParams.get("language")).toBe("en");
    expect(url.searchParams.get("format")).toBe("json");
  });

  it("transforms API results into Search Results object", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [ mockApiResult ],
      }),
    } as Response);

    const result = await searchNigeriaCities("Lagos");

    expect(result[0]).toEqual({
      id: 7099097,
      name: "Lagos Iyede-Ame",
      country: "Nigeria",
      type: "PPLA2",
      state: "Delta State",
      localGov: "Ndokwa East",
      displayName: "Lagos Iyede-Ame, Ndokwa East LG, Delta State, Nigeria"
    });
  });

  it("does not duplicate State suffix when API already includes it", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [ stateSuffixMockResult ],
      }),
    } as Response);

    const result = await searchNigeriaCities("Oyo");

    expect(result[0].state).toBe("Oyo State");
    expect(result[0].displayName).toBe("Oyo, Oyo West LG, Oyo State, Nigeria")
  });

  it("handles missing state and local government", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{
          id: 4, name: "Lag",
          country: "Nigeria", feature_code: "PPL"
        }]
      })
    } as Response);

    const result = await searchNigeriaCities("Lag");

    expect(result[0]).toEqual({
      id: 4, name: "Lag",
      country: "Nigeria", type: "PPL",
      state: "", localGov: "",
      displayName: "Lag, Nigeria"
    });
  });

  it("formats Abuja FCT", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [ fctMockResult ],
      }),
    } as Response);

    const result = await searchNigeriaCities("Abuja");

    expect(result[0].state).toBe("FCT");
    expect(result[0].displayName).toBe("Abuja, Municipal Area Council LG, FCT, Nigeria");
  });

  it("returns empty array when the API returns no results", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
      }),
    } as Response);

    const result = await searchNigeriaCities("Lagos");

    expect(result).toEqual([]);
  });

  it("returns an empty array when results are missing", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    const result = await searchNigeriaCities("Lagos");

    expect(result).toEqual([]);
  });
  
  it("throws an error when API responds with a failure status", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(
      searchNigeriaCities("Lagos")
    ).rejects.toThrow("Failed to fetch cities");
  });

  it("handles network error", async () => {
    fetchMock.mockRejectedValue(
      new Error("Network Error")
    );

    await expect(
      searchNigeriaCities("Lagos")
    ).rejects.toThrow("Network Error");
  });

  it("passes the AbortSignal to fetch", async () => {
    const abortController = new AbortController();

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);
    
    await searchNigeriaCities("Lagos", abortController.signal);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("name=Lagos"),
      expect.objectContaining({
        signal: abortController.signal
      })
    );
  });
});
