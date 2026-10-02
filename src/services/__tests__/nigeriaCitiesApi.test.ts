import { searchNigeriaCities } from "../nigeriaCitiesApi";

describe("searchNigeriaCities", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
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
});
