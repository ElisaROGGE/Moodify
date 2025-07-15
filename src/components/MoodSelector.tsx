import { toast } from "react-toastify";
import { findPlaylistByMood, type SpotifyPlaylist } from "../services/spotifyService";
import { moods } from "../utils/moodConfig";
import { useState } from "react";

export function MoodSelector({ accessToken }: { accessToken: string }) {
  const [tracks, setTracks] = useState<SpotifyPlaylist[]>([]);
  const handleMoodSelect = async (moodKey: string) => {
    const selectedMood = moods.find((m) => m.mood === moodKey);
    if (!selectedMood) return;

    try {
      const tracksFound = await findPlaylistByMood(moodKey, accessToken);
      setTracks(tracksFound);
      console.log("Tracks pour mood :", selectedMood.mood, tracksFound);
    } catch (err) {
      console.log(err);
      toast.error("Erreur lors de la récupération des recommandations");
      console.error(
        "Erreur lors de la récupération des recommandations :",
        err
      );
    }
  };
  console.log(tracks)
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {tracks.length > 0 && (
        <div className="flex flex-col items-center w-full max-w-6xl px-4">
          <div className="flex gap-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full max-w-6xl">
              {tracks
                .filter((t) => t !== null)
                .map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
                  >
                    <img
                      src={playlist.images?.[0]?.url}
                      alt={playlist.name}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
                      {playlist.description}
                    </p>
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                    >
                      Écouter sur Spotify
                    </a>
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={() => setTracks([])}
            className="w-full text-align-center cursor-pointer hover:underline mb-4"
          >
            ← Choisir une autre humeur
          </button>
        </div>
      )}
      <div>
        {tracks.length === 0 && (
          <div className="flex flex-col flex-wrap justify-center gap-4">
            <h2 className="text-2xl text-center font-bold mb-4">
              Quelle est ton humeur ?
            </h2>
            <div className="flex gap-4 items-center">
              {moods.map((m) => (
                <button
                  key={m.mood}
                  onClick={() => handleMoodSelect(m.mood)}
                  className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
