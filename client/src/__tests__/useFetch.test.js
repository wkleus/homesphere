/**
 * tests for the useFetch custom hook as the central data-fetching
 * utility used by RealEstate, EstateDetails and Heading;
 *
 * no real HTTP requests are made because fetch is mocked via vi.
 * stubGlobal; renderHook renders the hook in a React environment
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import useFetch from "../hooks/useFetch";

describe("useFetch", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  test("returns loading:true and data:null before the fetch resolves", () => {
    // promise that never resolves holds the hook in its initial loaded state
    fetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFetch("https://api.example.com"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test("returns data and clears loading on a successful fetch", async () => {
    // success case – confirms that the data has been set and the loading state cleared after retrieval
    const mockData = [{ id: "1", address: "Test Street 1" }];
    fetch.mockResolvedValue({ ok: true, json: async () => mockData });

    const { result } = renderHook(() => useFetch("https://api.example.com"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  test("does not call fetch when url is undefined", () => {
    // protects against fetch(undefined) if useParams has not yet resolved
    renderHook(() => useFetch(undefined));
    expect(fetch).not.toHaveBeenCalled();
  });
});
