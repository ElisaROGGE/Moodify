import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TournamentBracketView from "./TournamentBracketView";
import type { TournamentBracket, Artist } from "../utils/tournamentUtils";

// Mock react-confetti
vi.mock("react-confetti", () => ({
  default: ({
    width,
    height,
    numberOfPieces,
  }: {
    width: number;
    height: number;
    numberOfPieces: number;
  }) => (
    <div
      data-testid="confetti"
      data-width={width}
      data-height={height}
      data-pieces={numberOfPieces}
    >
      Confetti Animation
    </div>
  ),
}));

// Mock window dimensions
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock data
const mockArtist1: Artist = {
  id: "artist1",
  name: "Artist One",
  images: [{ url: "https://example.com/image1.jpg", height: 100, width: 100 }],
  popularity: 80,
  external_urls: { spotify: "https://spotify.com/artist1" },
  followers: { total: 1000000 },
  genres: ["pop"],
};

const mockArtist2: Artist = {
  id: "artist2",
  name: "Artist Two",
  images: [{ url: "https://example.com/image2.jpg", height: 100, width: 100 }],
  popularity: 75,
  external_urls: { spotify: "https://spotify.com/artist2" },
  followers: { total: 500000 },
  genres: ["rock"],
};

const mockArtist3: Artist = {
  id: "artist3",
  name: "Artist Three",
  images: [],
  popularity: 70,
  external_urls: { spotify: "https://spotify.com/artist3" },
  followers: { total: 250000 },
  genres: ["jazz"],
};

const mockArtist4: Artist = {
  id: "artist4",
  name: "Artist Four",
  images: [{ url: "https://example.com/image4.jpg", height: 100, width: 100 }],
  popularity: 85,
  external_urls: { spotify: "https://spotify.com/artist4" },
  followers: { total: 1500000 },
  genres: ["electronic"],
};

const mockBrackets: TournamentBracket[] = [
  {
    round: 1,
    matches: [
      {
        id: "match1",
        artist1: mockArtist1,
        artist2: mockArtist2,
        winner: mockArtist1,
        completed: true,
      },
      {
        id: "match2",
        artist1: mockArtist3,
        artist2: mockArtist4,
        winner: mockArtist4,
        completed: true,
      },
    ],
  },
  {
    round: 2,
    matches: [
      {
        id: "final",
        artist1: mockArtist1,
        artist2: mockArtist4,
        winner: mockArtist1,
        completed: true,
      },
    ],
  },
];

const incompleteBrackets: TournamentBracket[] = [
  {
    round: 1,
    matches: [
      {
        id: "match1",
        artist1: mockArtist1,
        artist2: mockArtist2,
        completed: false,
      },
    ],
  },
];

describe("TournamentBracketView Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders tournament bracket without champion", () => {
    render(
      <TournamentBracketView
        brackets={incompleteBrackets}
        currentRound={0}
        currentMatch={0}
      />
    );

    expect(screen.getByText("Bracket du Tournoi")).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();
    expect(screen.getByText("Artist Two")).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("hides champion celebration when close button is clicked", () => {
    render(
      <TournamentBracketView
        brackets={mockBrackets}
        currentRound={1}
        currentMatch={0}
        champion={mockArtist1}
      />
    );

    // Vérifier que la célébration est visible
    expect(screen.getByText("🏆 CHAMPION DU TOURNOI 🏆")).toBeInTheDocument();

    // Cliquer sur le bouton de fermeture
    const closeButton = screen.getByTitle("Masquer la célébration");
    fireEvent.click(closeButton);

    // Vérifier que la célébration est masquée
    expect(
      screen.queryByText("🏆 CHAMPION DU TOURNOI 🏆")
    ).not.toBeInTheDocument();
    expect(screen.getByText("🏆 Voir le Champion")).toBeInTheDocument();
  });

  it("displays champion without image correctly", () => {
    render(
      <TournamentBracketView
        brackets={mockBrackets}
        currentRound={1}
        currentMatch={0}
        champion={mockArtist3} // Artiste sans image
      />
    );

    // Dans la section champion, devrait y avoir un placeholder
    const championSection = screen
      .getByText("🏆 CHAMPION DU TOURNOI 🏆")
      .closest("div");
    expect(championSection).toBeInTheDocument();
  });

  it("handles empty or incomplete match data", () => {
    const incompleteMatch: TournamentBracket[] = [
      {
        round: 1,
        matches: [
          {
            id: "waiting",
            artist1: { ...mockArtist1, name: "" },
            artist2: mockArtist2,
            completed: false,
          },
        ],
      },
    ];

    render(
      <TournamentBracketView
        brackets={incompleteMatch}
        currentRound={0}
        currentMatch={0}
      />
    );

    // Devrait afficher "En attente..." pour les matches incomplets
    expect(screen.getByText("En attente...")).toBeInTheDocument();
  });

  it("handles unknown follower count", () => {
    const artistWithoutFollowers: Artist = {
      ...mockArtist1,
      followers: { total: 0 },
    };

    render(
      <TournamentBracketView
        brackets={mockBrackets}
        currentRound={1}
        currentMatch={0}
        champion={artistWithoutFollowers}
      />
    );

    expect(screen.getByText("Followers inconnus")).toBeInTheDocument();
  });

  it("applies correct CSS classes for completed matches", () => {
    render(
      <TournamentBracketView
        brackets={mockBrackets}
        currentRound={1}
        currentMatch={0}
      />
    );

    // Les matches terminés devraient avoir des classes spécifiques
    const matchCards = document.querySelectorAll(
      ".border-yellow-500, .border-green-500"
    );
    expect(matchCards.length).toBeGreaterThan(0);
  });

});
