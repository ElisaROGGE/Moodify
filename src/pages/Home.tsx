import { useEffect, useState } from "react";
import { MoodSelector } from "../components/MoodSelector";
import Navbar from "../components/Navbar";
import { fetchSpotifyProfile } from "../services/spotifyService";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pckeUtils";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export default function Home() {
  const [user, setUser] = useState(null);
  const [authUrl, setAuthUrl] = useState('');

   useEffect(() => {
    // Generate auth with PKCE
    const generateAuthUrl = async () => {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      
      const scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-public",
      ];

      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${scopes.join("%20")}&` +
        `code_challenge_method=S256&` +
        `code_challenge=${codeChallenge}`;
      
      setAuthUrl(authUrl);
    };

    generateAuthUrl();

    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;

    fetchSpotifyProfile(token)
      .then(setUser)
      .catch(console.error);
  }, []);
  console.log("User data:", user);
  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar authUrl={authUrl} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Quelle est ton humeur ?</h2>
        <MoodSelector onSelect={(mood: string) => { console.log("Selected mood:", mood); }} />
      </main>
    </div>
  );
}
