import { useState } from "react";
import ReactConfetti from "react-confetti";
import type { TournamentBracket, Artist } from "../utils/tournamentUtils";
import { getRoundName } from "../utils/tournamentUtils";

interface TournamentBracketViewProps {
  brackets: TournamentBracket[];
  currentRound: number;
  currentMatch: number;
  champion?: Artist;
}

export default function TournamentBracketView({
  brackets,
  currentRound,
  currentMatch,
  champion,
}: TournamentBracketViewProps) {
  const [showChampion, setShowChampion] = useState(true);

  return (
    <div className="space-y-8">
      {champion && showChampion && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-8 text-center relative overflow-hidden">
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={1000}
            recycle={false}
          />

          <button
            onClick={() => setShowChampion(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            title="Masquer la célébration"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-3xl font-bold text-white mb-4">
            🏆 CHAMPION DU TOURNOI 🏆
          </h2>
          <div className="bg-white rounded-lg p-6 inline-block">
            {champion.images && champion.images.length > 0 ? (
              <img
                src={champion.images[0].url}
                alt={champion.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">🎵</span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800">
              {champion.name}
            </h3>
            <p className="text-gray-600 mt-2">
              Popularité: {champion.popularity}/100
            </p>
            <p className="text-gray-600">
              {champion.followers?.total
                ? `${Math.round(champion.followers.total / 1000)}k followers`
                : "Followers inconnus"}
            </p>
          </div>
        </div>
      )}

      {/* Bouton pour réafficher la célébration si elle a été masquée */}
      {champion && !showChampion && (
        <div className="text-center">
          <button
            onClick={() => setShowChampion(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🏆 Voir le Champion
          </button>
        </div>
      )}

      {/* Section du bracket - toujours visible */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {champion ? "Récapitulatif du Tournoi" : "Bracket du Tournoi"}
        </h2>

        <div className="space-y-8">
          {brackets.map((bracket, roundIndex) => (
            <div
              key={bracket.round}
              className="border-l-4 border-purple-400 pl-4"
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  roundIndex === currentRound
                    ? "text-purple-500"
                    : "text-gray-600"
                }`}
              >
                {getRoundName(bracket.round, brackets.length)}
                {roundIndex === currentRound && (
                  <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    En cours
                  </span>
                )}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {bracket.matches.map((match, matchIndex) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isActive={
                      roundIndex === currentRound && matchIndex === currentMatch
                    }
                    isCompleted={match.completed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: {
    id: string;
    artist1: Artist;
    artist2: Artist;
    winner?: Artist;
    completed: boolean;
  };
  isActive: boolean;
  isCompleted: boolean;
}

function MatchCard({ match, isActive, isCompleted }: MatchCardProps) {
  const getCardClasses = () => {
    let classes = "border-2 rounded-lg p-3 transition-all duration-200";

    if (isCompleted) {
      // Si le match est terminé et qu'il y a un gagnant, vérifier s'il fait partie du chemin gagnant
      const hasChampionPath = match.winner && match.completed;
      if (hasChampionPath) {
        classes +=
          " border-yellow-500 bg-yellow-50 shadow-lg ring-2 ring-yellow-300";
      } else {
        classes += " border-green-500 bg-green-50";
      }
    } else if (isActive) {
      classes += " border-purple-500 bg-blue-50 shadow-lg";
    } else {
      classes += " border-gray-200 bg-gray-50";
    }

    return classes;
  };

  return (
    <div className={getCardClasses()}>
      {!match.artist1 || !match.artist1.name ? (
        <div className="text-center text-gray-500 text-sm py-4">
          En attente...
        </div>
      ) : (
        <div className="space-y-2">
          <ArtistMiniCard
            artist={match.artist1}
            isWinner={match.winner?.id === match.artist1.id}
            isCompleted={isCompleted}
          />
          <div className="text-center text-xs text-gray-400">VS</div>
          <ArtistMiniCard
            artist={match.artist2}
            isWinner={match.winner?.id === match.artist2.id}
            isCompleted={isCompleted}
          />
          {isCompleted && match.winner && (
            <div className="text-center pt-2">
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                🏆 {match.winner.name}
              </span>
            </div>
          )}
          {isActive && !isCompleted && (
            <div className="text-center pt-2">
              <span className="text-xs bg-purple-400 text-white px-2 py-1 rounded-full animate-pulse">
                🔥 En cours
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ArtistMiniCardProps {
  artist: Artist;
  isWinner?: boolean;
  isCompleted?: boolean;
}

function ArtistMiniCard({
  artist,
  isWinner = false,
  isCompleted = false,
}: ArtistMiniCardProps) {
  if (!artist || !artist.name) {
    return <div className="text-center text-gray-400 text-xs py-2">TBD</div>;
  }

  return (
    <div
      className={`flex items-center space-x-2 text-xs ${
        isCompleted
          ? isWinner
            ? "font-bold text-green-700"
            : "text-gray-500"
          : "text-gray-700"
      }`}
    >
      {artist.images && artist.images.length > 0 ? (
        <img
          src={artist.images[0].url}
          alt={artist.name}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs">🎵</span>
        </div>
      )}
      <span className="truncate flex-1">{artist.name}</span>
      {isWinner && <span>👑</span>}
    </div>
  );
}
