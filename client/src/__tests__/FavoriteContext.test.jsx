/**
 * tests for FavoritesContext as a global favorites state used by
 * RealEstateCard (heart icon), Favorites page and Navbar (counter
 * badge)
 *
 * localStorage is cleared before/after each test for a clean state.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "../context/FavoritesContext";

const wrapper = ({ children }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

const mockEntry = {
  id: "1",
  address: "Bergstraße 14, Garmisch",
  category: "Residence",
};

describe("FavoritesContext", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  test("toggleFavorite adds and then removes the same entry", () => {
    // first call adds an entry, second call to the same entry removes it
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.toggleFavorite(mockEntry));
    expect(result.current.favorites).toHaveLength(1);

    act(() => result.current.toggleFavorite(mockEntry));
    expect(result.current.favorites).toHaveLength(0);
  });

  test("isFavorite returns true for a saved entry and false for an unknown id", () => {
    // cover both branches used to decide between a filled and an outlined heart symbol
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.toggleFavorite(mockEntry));

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("999")).toBe(false);
  });

  test("persists to localStorage and reloads favorites on init", () => {
    // ensure that favorites are retained via localStorage after a page reload
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => result.current.toggleFavorite(mockEntry));

    const stored = JSON.parse(localStorage.getItem("homesphere-favorites"));
    expect(stored[0].id).toBe("1");

    // simulate reload - new hook instance should read from localStorage
    const { result: reloaded } = renderHook(() => useFavorites(), { wrapper });
    expect(reloaded.current.favorites).toHaveLength(1);
  });

  test("throws when used outside FavoritesProvider", () => {
    // ensure that a clear error is displayed
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useFavorites())).toThrow(
      "useFavorites must be used within a FavoritesProvider",
    );

    consoleSpy.mockRestore();
  });
});
