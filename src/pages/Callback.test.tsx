import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Callback from "./Callback";

// Mock the Navbar component
vi.mock("../components/Navbar", () => ({
  default: ({ authUrl }: { authUrl: string }) => (
    <nav data-testid="navbar" data-auth-url={authUrl}>
      Mocked Navbar
    </nav>
  ),
}));

describe("Callback Component", () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock fetch
    global.fetch = mockFetch;

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

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        href: "",
        search: "",
        assign: vi.fn(),
        replace: vi.fn(),
      },
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });


  it("successfully handles OAuth callback with valid code and verifier", async () => {
    // Setup successful scenario
    window.location.href = "http://localhost:3000/callback?code=test_code";
    window.location.search = "?code=test_code";

    vi.mocked(window.localStorage.getItem).mockReturnValue("test_verifier");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "test_access_token",
          token_type: "Bearer",
          expires_in: 3600,
        }),
    });

    render(<Callback />);

    // Wait for the callback to be processed
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://accounts.spotify.com/api/token",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
      );
    });

    // Verify localStorage operations
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "spotify_access_token",
      "test_access_token"
    );
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      "spotify_code_verifier"
    );

    // Verify redirect
    expect(window.location.href).toBe("/");
  });

  it("displays error when authorization code is missing", async () => {
    // Setup scenario without code
    window.location.search = "";
    vi.mocked(window.localStorage.getItem).mockReturnValue("test_verifier");

    render(<Callback />);

    await waitFor(() => {
      expect(screen.getByText("Erreur")).toBeInTheDocument();
      expect(
        screen.getByText("Code d'autorisation manquant dans l'URL")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("displays error when code verifier is missing from localStorage", async () => {
    // Setup scenario without verifier
    window.location.search = "?code=test_code";
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);

    render(<Callback />);

    await waitFor(() => {
      expect(screen.getByText("Erreur")).toBeInTheDocument();
      expect(
        screen.getByText("Code verifier manquant dans le localStorage")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles Spotify API error response", async () => {
    // Setup scenario with API error
    window.location.search = "?code=test_code";
    vi.mocked(window.localStorage.getItem).mockReturnValue("test_verifier");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve("invalid_grant"),
    });

    render(<Callback />);

    await waitFor(() => {
      expect(screen.getByText("Erreur")).toBeInTheDocument();
      expect(screen.getByText(/HTTP error! status: 400/)).toBeInTheDocument();
    });

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });


  it("handles response without access token", async () => {
    // Setup scenario where API returns success but no token
    window.location.search = "?code=test_code";
    vi.mocked(window.localStorage.getItem).mockReturnValue("test_verifier");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          // Missing access_token
          token_type: "Bearer",
          expires_in: 3600,
        }),
    });

    render(<Callback />);

    await waitFor(() => {
      expect(screen.getByText("Erreur")).toBeInTheDocument();
      expect(screen.getByText("Token non reçu")).toBeInTheDocument();
    });

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });

});
