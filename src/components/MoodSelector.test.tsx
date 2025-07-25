import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MoodSelector } from "./MoodSelector";
import * as spotifyService from "../services/spotifyService";
import { mockPlaylists } from "../test/mocks";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../services/spotifyService", () => ({
  findPlaylistByMood: vi.fn(),
}));

const mockAccessToken = "mock-access-token";

describe("MoodSelector Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays playlists when mood is selected successfully", async () => {
    const mockFindPlaylistByMood = vi.mocked(spotifyService.findPlaylistByMood);
    mockFindPlaylistByMood.mockResolvedValue(mockPlaylists);

    render(<MoodSelector accessToken={mockAccessToken} />);

    const happyButton = screen.getByTestId("mood-happy");
    fireEvent.click(happyButton);

    await waitFor(() => {
      expect(
        screen.getByText("Playlists pour l'humeur sélectionnée :")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Happy Vibes")).toBeInTheDocument();
    expect(screen.getByText("Chill Out Zone")).toBeInTheDocument();
    expect(
      screen.getByText("Feel good music for happy moments")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Relaxing tunes for peaceful times")
    ).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    const mockFindPlaylistByMood = vi.mocked(spotifyService.findPlaylistByMood);
    const mockError = new Error("API Error");
    mockFindPlaylistByMood.mockRejectedValue(mockError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<MoodSelector accessToken={mockAccessToken} />);

    const happyButton = screen.getByTestId("mood-happy");
    fireEvent.click(happyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la récupération des recommandations :",
        mockError
      );
      expect(logSpy).toHaveBeenCalledWith(mockError);
    });

    expect(screen.getByText("Quelle est ton humeur ?")).toBeInTheDocument();

    consoleSpy.mockRestore();
    logSpy.mockRestore();
  });

});
