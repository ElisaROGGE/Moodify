export interface Artist {
  id: string;
  name: string;
  images: { url: string; height: number | null; width: number | null }[];
  popularity: number;
  external_urls: { spotify: string };
  followers: { total: number };
  genres: string[];
}

export interface TournamentBracket {
  round: number;
  matches: Match[];
}

export interface Match {
  id: string;
  artist1: Artist;
  artist2: Artist;
  winner?: Artist;
  completed: boolean;
}

export interface TournamentState {
  artists: Artist[];
  brackets: TournamentBracket[];
  currentRound: number;
  currentMatch: number;
  champion?: Artist;
  completed: boolean;
}

export function createTournamentBrackets(artists: Artist[]): TournamentBracket[] {
  const brackets: TournamentBracket[] = [];
  let currentArtists = [...artists];
  let round = 1;

  while (currentArtists.length > 1) {
    const matches: Match[] = [];
    
    for (let i = 0; i < currentArtists.length; i += 2) {
      matches.push({
        id: `round-${round}-match-${i / 2 + 1}`,
        artist1: currentArtists[i],
        artist2: currentArtists[i + 1],
        completed: false,
      });
    }

    brackets.push({
      round,
      matches,
    });

    // Préparer le prochain round avec des placeholders
    currentArtists = matches.map(() => ({} as Artist));
    round++;
  }

  return brackets;
}

export function getRoundName(round: number, totalRounds: number): string {
  if (round === totalRounds) return "Finale";
  if (round === totalRounds - 1) return "Demi-finale";
  if (round === totalRounds - 2) return "Quart de finale";
  if (round === 1) return "Premier tour";
  return `Round ${round}`;
}

export function advanceWinner(
  brackets: TournamentBracket[],
  roundIndex: number,
  matchIndex: number,
  winner: Artist
): TournamentBracket[] {
  const newBrackets = [...brackets];
  
  // Marquer le match comme terminé avec le gagnant
  newBrackets[roundIndex].matches[matchIndex] = {
    ...newBrackets[roundIndex].matches[matchIndex],
    winner,
    completed: true,
  };

  // Si ce n'est pas la finale, avancer le gagnant au round suivant
  if (roundIndex < brackets.length - 1) {
    const nextRound = newBrackets[roundIndex + 1];
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const isFirstSlot = matchIndex % 2 === 0;

    if (isFirstSlot) {
      nextRound.matches[nextMatchIndex].artist1 = winner;
    } else {
      nextRound.matches[nextMatchIndex].artist2 = winner;
    }
  }

  return newBrackets;
}
