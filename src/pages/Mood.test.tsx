import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Mood from "./Mood";

// Mock the MoodSelector component
vi.mock("../components/MoodSelector", () => ({
  MoodSelector: ({ accessToken }: { accessToken: string }) => (
    <div data-testid="mood-selector" data-access-token={accessToken}>
      Mocked MoodSelector with token: {accessToken || "no token"}
    </div>
  ),
}));

describe("Mood Component", () => {
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it("renders MoodSelector component", () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue("test_token");

    render(<Mood />);

    expect(screen.getByTestId("mood-selector")).toBeInTheDocument();
  });

  it("passes empty string when no token is found in localStorage", () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);

    render(<Mood />);

    const moodSelector = screen.getByTestId("mood-selector");
    expect(moodSelector).toHaveAttribute("data-access-token", "");
    expect(moodSelector).toHaveTextContent(
      "Mocked MoodSelector with token: no token"
    );
  });

});
