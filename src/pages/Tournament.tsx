import { useEffect, useState, useCallback } from "react";
import { findTopArtists } from "../services/spotifyService";
import type { Artist, TournamentState } from "../utils/tournamentUtils";
import {
  createTournamentBrackets,
  advanceWinner,
  getRoundName,
} from "../utils/tournamentUtils";
import Duel from "../components/Duel";
import TournamentBracketView from "../components/TournamentBracketView";
import DuelTransition from "../components/DuelTransition";
import MatchInfo from "../components/MatchInfo";

export default function Tournament() {
  const token = localStorage.getItem("spotify_access_token");
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBracket, setShowBracket] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right"
  >("left");
  const [lastWinner, setLastWinner] = useState<Artist | undefined>(undefined);

  const initializeTournament = useCallback((artists: Artist[]) => {
    const shuffledArtists = [...artists].sort(() => Math.random() - 0.5);
    const brackets = createTournamentBrackets(shuffledArtists);

    setTournament({
      artists: shuffledArtists,
      brackets,
      currentRound: 0,
      currentMatch: 0,
      completed: false,
    });
  }, []);

  const getTopArtists = useCallback(async () => {
    if (token) {
      try {
        setLoading(true);
        const artists = await findTopArtists(token);
        if (artists && artists.length >= 16) {
          const selectedArtists = artists.slice(0, 16);
          setTopArtists(selectedArtists);
          initializeTournament(selectedArtists);
        } else {
          console.error("Pas assez d'artistes trouvés (minimum 16 requis)");
        }
      } catch (error) {
        console.error("Error fetching top artists:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No Spotify access token found.");
      setLoading(false);
    }
  }, [token, initializeTournament]);

  const handleWinnerSelected = (winner: Artist) => {
    if (!tournament || isTransitioning) return;

    setLastWinner(winner);
    setIsTransitioning(true);
    setAnimationDirection("left");

    // Attendre la fin de l'animation de sortie
    setTimeout(() => {
      const newBrackets = advanceWinner(
        tournament.brackets,
        tournament.currentRound,
        tournament.currentMatch,
        winner
      );

      let nextRound = tournament.currentRound;
      let nextMatch = tournament.currentMatch + 1;

      if (
        nextMatch >= tournament.brackets[tournament.currentRound].matches.length
      ) {
        nextRound++;
        nextMatch = 0;
        setAnimationDirection("right");
      }

      if (tournament.currentRound === tournament.brackets.length - 1) {
        setTournament({
          ...tournament,
          brackets: newBrackets,
          champion: winner,
          completed: true,
        });
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      } else {
        setTournament({
          ...tournament,
          brackets: newBrackets,
          currentRound: nextRound,
          currentMatch: nextMatch,
        });
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      }
    }, 400);
  };

  const getCurrentMatch = () => {
    if (!tournament) return null;

    if (tournament.currentRound >= tournament.brackets.length) {
      return null;
    }

    return tournament.brackets[tournament.currentRound].matches[
      tournament.currentMatch
    ];
  };

  const resetTournament = () => {
    if (topArtists.length >= 16) {
      setLastWinner(undefined);
      setIsTransitioning(false);
      initializeTournament(topArtists);
    }
  };

  useEffect(() => {
    getTopArtists();
  }, [getTopArtists]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">
            Chargement de vos artistes préférés...
          </h2>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-4">🎵 Tournoi d'Artistes</h2>
          <p className="text-xl mb-8">
            Connectez-vous à Spotify pour commencer le tournoi !
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Se connecter à Spotify
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Erreur</h2>
          <p className="text-xl mb-8">
            Impossible de créer le tournoi. Pas assez d'artistes trouvés.
          </p>
          <button
            onClick={getTopArtists}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = getCurrentMatch();
  console.log(tournament.champion)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2" aria-label="trophy">
            🏆 Tournoi d'Artistes Spotify
          </h1>
        </header>

        {/* Informations du match en cours */}
        {!showBracket && !tournament.completed && currentMatch && (
          <MatchInfo
            roundName={getRoundName(
              tournament.currentRound + 1,
              tournament.brackets.length
            )}
            matchNumber={tournament.currentMatch + 1}
            totalMatches={
              tournament.brackets[tournament.currentRound]?.matches.length || 0
            }
            lastWinner={lastWinner}
            isTransitioning={isTransitioning}
          />
        )}

        <div className="flex justify-center space-x-4 mb-8">
            {!tournament.champion && (
                
          <button
            onClick={() => setShowBracket(!showBracket)}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
          >
            {showBracket ? "Masquer le Bracket" : "Voir le Bracket"}
          </button>
            )}

          <button
            onClick={resetTournament}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Nouveau Tournoi
          </button>
        </div>

        {showBracket ? (
          <TournamentBracketView
            brackets={tournament.brackets}
            currentRound={tournament.currentRound}
            currentMatch={tournament.currentMatch}
            champion={tournament.champion}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {tournament.completed ? (
              <TournamentBracketView
                brackets={tournament.brackets}
                currentRound={tournament.currentRound}
                currentMatch={tournament.currentMatch}
                champion={tournament.champion}
              />
            ) : currentMatch ? (
              <DuelTransition
                isTransitioning={isTransitioning}
                direction={animationDirection}
              >
                <Duel
                  match={currentMatch}
                  onWinnerSelected={handleWinnerSelected}
                  isActive={!isTransitioning}
                />
              </DuelTransition>
            ) : (
              <div className="text-center text-white">
                <h2 className="text-2xl font-semibold">
                  Tournoi en préparation...
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
