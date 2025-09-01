import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import * as spotifyService from "../services/spotifyService";
import type { IUser } from "../services/userService";

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock du service Spotify
vi.mock("../services/spotifyService", () => ({
  fetchSpotifyProfile: vi.fn(),
}));

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockUser: IUser = {
  country: "FR",
  display_name: "John Doe",
  email: "john@example.com",
  explicit_content: { filter_enabled: false, filter_locked: false },
  external_urls: { spotify: "https://spotify.com/user/johndoe" },
  followers: { href: null, total: 1000 },
  href: "https://api.spotify.com/v1/users/johndoe",
  id: "johndoe",
  product: "premium",
  type: "user",
  uri: "spotify:user:johndoe",
};

const mockAuthUrl = "https://accounts.spotify.com/authorize?client_id=test";

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.getItem.mockReset();
  });

  it("shows login button when user is not authenticated", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<Navbar authUrl={mockAuthUrl} />);

    const loginButton = screen.getByRole("link", { name: "Connexion" });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", mockAuthUrl);
    expect(loginButton).toHaveClass("bg-green-500", "hover:bg-green-600");
  });

  it("fetches user profile when token is available", async () => {
    const mockToken = "valid-spotify-token";
    const mockFetchSpotifyProfile = vi.mocked(
      spotifyService.fetchSpotifyProfile
    );

    localStorageMock.getItem.mockReturnValue(mockToken);
    mockFetchSpotifyProfile.mockResolvedValue(mockUser);

    render(<Navbar authUrl={mockAuthUrl} />);

    await waitFor(() => {
      expect(mockFetchSpotifyProfile).toHaveBeenCalledWith(mockToken);
    });
  });


});
