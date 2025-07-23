import type { Artist } from "../utils/tournamentUtils";

interface MatchInfoProps {
  roundName: string;
  matchNumber: number;
  totalMatches: number;
  lastWinner?: Artist;
  isTransitioning: boolean;
}

export default function MatchInfo({
  roundName,
  matchNumber,
  totalMatches,
  lastWinner,
  isTransitioning,
}: MatchInfoProps) {
  return (
    <div className="text-center mb-6">
      <div
        className={`transition-all duration-500 ${
          isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <h2 className="text-2xl font-bold text-white mb-2">{roundName}</h2>
        <p className="text-white/80 mb-4">
          Match {matchNumber}/{totalMatches}
        </p>

        {lastWinner && !isTransitioning && (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 mb-4 animate-pulse">
            <p className="text-green-200 text-sm">
              🎉 Dernier gagnant:{" "}
              <span className="font-semibold text-green-100">
                {lastWinner.name}
              </span>
            </p>
          </div>
        )}

        {isTransitioning && (
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <span className="text-blue-200 text-sm ml-2">
                Préparation du prochain duel...
              </span>
            </div>
          </div>
        )}

        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${((matchNumber - 1) / totalMatches) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
