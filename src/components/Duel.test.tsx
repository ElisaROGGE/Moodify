import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Duel from "./Duel";
import type { Match, Artist } from "../utils/tournamentUtils";
import { mockArtist1, mockArtist2 } from "../test/mocks";

const mockMatch: Match = {
  id: "match1",
  artist1: mockArtist1,
  artist2: mockArtist2,
  completed: false,
};

const mockCompletedMatch: Match = {
  id: "match2",
  artist1: mockArtist1,
  artist2: mockArtist2,
  winner: mockArtist1,
  completed: true,
};

describe("Duel Component", () => {
  it("renders waiting message when artists are missing", () => {
    const incompleteMatch: Match = {
      id: "incomplete",
      artist1: { ...mockArtist1, name: "" },
      artist2: mockArtist2,
      completed: false,
    };

    render(
      <Duel
        match={incompleteMatch}
        onWinnerSelected={vi.fn()}
        isActive={true}
      />
    );

    expect(
      screen.getByText("En attente des résultats précédents...")
    ).toBeInTheDocument();
  });

  it("renders active duel with both artists", () => {
    render(
      <Duel match={mockMatch} onWinnerSelected={vi.fn()} isActive={true} />
    );

    expect(screen.getByText("🔥 Duel en cours")).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();
    expect(screen.getByText("Artist Two")).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("renders inactive duel", () => {
    render(
      <Duel match={mockMatch} onWinnerSelected={vi.fn()} isActive={false} />
    );

    expect(screen.getByText("Duel à venir")).toBeInTheDocument();
  });

  it("renders completed duel with winner", () => {
    render(
      <Duel
        match={mockCompletedMatch}
        onWinnerSelected={vi.fn()}
        isActive={false}
      />
    );

    expect(screen.getByText("🎉 Gagnant: Artist One")).toBeInTheDocument();
    expect(screen.getByText("🏆 Gagnant")).toBeInTheDocument();
  });

  it("calls onWinnerSelected when artist is clicked in active duel", async () => {
    const mockOnWinnerSelected = vi.fn();

    render(
      <Duel
        match={mockMatch}
        onWinnerSelected={mockOnWinnerSelected}
        isActive={true}
      />
    );

    const artist1Card = screen.getByText("Artist One").closest("div");
    fireEvent.click(artist1Card!);

    await waitFor(() => {
      expect(screen.getByText("⭐ Sélectionné !")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockOnWinnerSelected).toHaveBeenCalledWith(mockArtist1);
      },
      { timeout: 1000 }
    );
  });

  it("does not call onWinnerSelected when clicked in inactive duel", () => {
    const mockOnWinnerSelected = vi.fn();

    render(
      <Duel
        match={mockMatch}
        onWinnerSelected={mockOnWinnerSelected}
        isActive={false}
      />
    );

    const artist1Card = screen.getByText("Artist One").closest("div");
    fireEvent.click(artist1Card!);

    expect(mockOnWinnerSelected).not.toHaveBeenCalled();
  });

  it("displays artist popularity and followers", () => {
    render(
      <Duel match={mockMatch} onWinnerSelected={vi.fn()} isActive={true} />
    );

    expect(screen.getByText("Popularité: 80/100")).toBeInTheDocument();
    expect(screen.getByText("Popularité: 75/100")).toBeInTheDocument();
    expect(screen.getByText("1000k followers")).toBeInTheDocument();
    expect(screen.getByText("500k followers")).toBeInTheDocument();
  });
  it("shows emoji when artist has no images", () => {
    const artistWithoutImage: Artist = {
      ...mockArtist1,
      images: [],
    };

    render(
      <Duel
        match={{ ...mockMatch, artist1: artistWithoutImage }}
        onWinnerSelected={vi.fn()}
        isActive={true}
      />
    );

    expect(screen.getByText("🎵")).toBeInTheDocument();
  });
  it("shows unknown followers count when not available", () => {
    const artistWithoutFollowers: Artist = {
      ...mockArtist1,
      followers: { total: 0 },  
    };

    render(
      <Duel
        match={{ ...mockMatch, artist1: artistWithoutFollowers }}
        onWinnerSelected={vi.fn()}
        isActive={true}
      />
    );

    expect(screen.getByText("Followers inconnus")).toBeInTheDocument();
  });
});
