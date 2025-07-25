import type { SpotifyPlaylist } from "../services/spotifyService";
import type { Artist } from "../utils/tournamentUtils";

export const mockArtist1: Artist = {
  id: "artist1",
  name: "Artist One",
  images: [{ url: "https://example.com/image1.jpg", height: 100, width: 100 }],
  popularity: 80,
  external_urls: { spotify: "https://spotify.com/artist1" },
  followers: { total: 1000000 },
  genres: ["pop"],
};

export const mockArtist2: Artist = {
  id: "artist2",
  name: "Artist Two",
  images: [{ url: "https://example.com/image2.jpg", height: 100, width: 100 }],
  popularity: 75,
  external_urls: { spotify: "https://spotify.com/artist2" },
  followers: { total: 500000 },
  genres: ["rock"],
};

export const mockSpotifyPlaylist = {
    id: "playlist1",
    name: "Top Hits",
    description: "A collection of top hits",
    images: [{ url: "https://example.com/playlist.jpg", height: null, width: null }],
    external_urls: { spotify: "https://spotify.com/playlist1" },
    owner: {
        display_name: "Moodify",
        external_urls: { spotify: "https://spotify.com/moodify" },
    },
    tracks: {
        href: "https://api.spotify.com/v1/playlists/playlist1/tracks",
        total: 50,
    },
}

export const mockPlaylists: SpotifyPlaylist[] = [
  {
    id: "playlist1",
    name: "Happy Vibes",
    description: "Feel good music for happy moments",
    images: [
      { url: "https://example.com/image1.jpg", height: 300, width: 300 },
    ],
    external_urls: { spotify: "https://spotify.com/playlist1" },
    owner: {
      display_name: "Spotify",
      external_urls: { spotify: "https://spotify.com/user" },
    },
    tracks: {
      href: "https://api.spotify.com/tracks",
      total: 50,
    },
  },
  {
    id: "playlist2",
    name: "Chill Out Zone",
    description: "Relaxing tunes for peaceful times",
    images: [
      { url: "https://example.com/image2.jpg", height: 300, width: 300 },
    ],
    external_urls: { spotify: "https://spotify.com/playlist2" },
    owner: {
      display_name: "Spotify",
      external_urls: { spotify: "https://spotify.com/user" },
    },
    tracks: {
      href: "https://api.spotify.com/tracks",
      total: 30,
    },
  },
];