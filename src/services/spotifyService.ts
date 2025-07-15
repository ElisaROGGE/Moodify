import { generateAuthUrl } from "../utils/generateAuthUrl";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pckeUtils";

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number | null; width: number | null }[];
  external_urls: { spotify: string };
  owner: {
    display_name: string;
    external_urls: { spotify: string };
  };
  tracks: {
    href: string;
    total: number;
  };
}


export const redirectToSpotifyLogin = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
  ];

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const fetchSpotifyProfile = async (accessToken: string) => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération du profil Spotify");
  }

  const userData = await res.json();
  return userData;
}

export async function findPlaylistByMood(mood: string, token: string) {
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}%20playlist&type=playlist&limit=5`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if(res.status === 401){
    const authUrl = await generateAuthUrl();
    window.location.href = authUrl;
    
  }
  const data = await res.json();
  return data.playlists.items; // id, nom, cover, etc.
}




