import { useState } from 'react';

const moods = [
  { label: "Heureux·se", valence: 0.8, energy: 0.6 },
  { label: "Triste", valence: 0.2, energy: 0.3 },
  { label: "Motivé·e", valence: 0.7, energy: 0.9 },
  { label: "Chill", valence: 0.5, energy: 0.3 },
];

export default function Mood() {
  const [tracks, setTracks] = useState([]);
  const token = localStorage.getItem("spotify_token");

  const fetchPlaylist = async ({ valence, energy }) => {
    const url = `https://api.spotify.com/v1/recommendations?limit=10&target_valence=${valence}&target_energy=${energy}&seed_genres=pop`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTracks(data.tracks || []);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Choisis ton humeur :</h2>
      <div className="grid grid-cols-2 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className="bg-blue-500 text-white rounded px-3 py-2 hover:bg-blue-600"
            onClick={() => fetchPlaylist(mood)}
          >
            {mood.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center mb-3">
            <img src={track.album.images[0]?.url} alt="" className="w-12 h-12 rounded mr-3" />
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-500">{track.artists[0].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
