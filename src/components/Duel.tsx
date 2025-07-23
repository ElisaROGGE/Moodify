import { useState } from "react";
import type { Artist, Match } from "../utils/tournamentUtils";

interface DuelProps {
  match: Match;
  onWinnerSelected: (winner: Artist) => void;
  isActive: boolean;
}

export default function Duel({ match, onWinnerSelected, isActive }: DuelProps) {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  const handleWinnerClick = (artist: Artist) => {
    if (!isActive) return;

    setSelectedWinner(artist.id);

    // Petit délai pour l'effet visuel avant de notifier le parent
    setTimeout(() => {
      onWinnerSelected(artist);
      setSelectedWinner(null);
    }, 500);
  };
  if (
    !match.artist1 ||
    !match.artist2 ||
    !match.artist1.name ||
    !match.artist2.name
  ) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-gray-500 text-center">
          En attente des résultats précédents...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${
        isActive ? "ring-2 ring-purple-500" : ""
      }`}
    >
      {match.completed && match.winner ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            🎉 Gagnant: {match.winner.name}
          </h3>
          <div className="flex justify-center space-x-8">
            <ArtistCard
              artist={match.artist1}
              isWinner={match.winner.id === match.artist1.id}
              isCompleted={true}
            />
            <div className="flex items-center">
              <span className="text-2xl">VS</span>
            </div>
            <ArtistCard
              artist={match.artist2}
              isWinner={match.winner.id === match.artist2.id}
              isCompleted={true}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-400">
            {isActive ? "🔥 Duel en cours" : "Duel à venir"}
          </h3>
          <div className="flex md:flex-row flex-col items-center justify-center md:space-x-8">
            <ArtistCard
              artist={match.artist1}
              onClick={() => handleWinnerClick(match.artist1)}
              isClickable={isActive}
              isSelected={selectedWinner === match.artist1.id}
            />
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-400">VS</span>
            </div>
            <ArtistCard
              artist={match.artist2}
              onClick={() => handleWinnerClick(match.artist2)}
              isClickable={isActive}
              isSelected={selectedWinner === match.artist2.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
  isClickable?: boolean;
  isWinner?: boolean;
  isCompleted?: boolean;
  isSelected?: boolean;
}

function ArtistCard({
  artist,
  onClick,
  isClickable = false,
  isWinner = false,
  isCompleted = false,
  isSelected = false,
}: ArtistCardProps) {
  const getCardClasses = () => {
    let classes =
      "bg-gray-50 border-2 rounded-lg p-4 transition-all duration-200 w-48";

    if (isSelected) {
      classes +=
        " border-yellow-500 bg-yellow-50 transform scale-110 shadow-2xl ring-4 ring-yellow-300";
    } else if (isCompleted) {
      if (isWinner) {
        classes += " border-green-500 bg-green-50 transform scale-105";
      } else {
        classes += " border-gray-300 bg-gray-100 opacity-60";
      }
    } else if (isClickable) {
      classes +=
        " border-gray-300 hover:border-purple-500 hover:bg-blue-50 cursor-pointer hover:transform hover:scale-105";
    } else {
      classes += " border-gray-200";
    }

    return classes;
  };

  return (
    <div className={getCardClasses()} onClick={onClick}>
      <div className="text-center">
        {artist.images && artist.images.length > 0 ? (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">🎵</span>
          </div>
        )}
        <h4 className="font-semibold text-sm mb-1 truncate text-gray-500">
          {artist.name}
        </h4>
        <p className="text-xs text-gray-500 mb-1">
          Popularité: {artist.popularity}/100
        </p>
        <p className="text-xs text-gray-400">
          {artist.followers?.total
            ? `${Math.round(artist.followers.total / 1000)}k followers`
            : "Followers inconnus"}
        </p>
        {isWinner && (
          <div className="mt-2">
            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              🏆 Gagnant
            </span>
          </div>
        )}

        {isSelected && (
          <div className="mt-2">
            <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              ⭐ Sélectionné !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
