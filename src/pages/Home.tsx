import { useEffect, useState } from "react";
import { MoodSelector } from "../components/MoodSelector";
import Navbar from "../components/Navbar";
import { fetchSpotifyProfile } from "../services/spotifyService";
import { generateAuthUrl } from "../utils/generateAuthUrl";

// const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export default function Home() {
  const [user, setUser] = useState(null);
  const [authUrl, setAuthUrl] = useState('');
  const token = localStorage.getItem("spotify_access_token");

   useEffect(() => {
    async function fetchData() {
      // Generate auth with PKCE
      const url = await generateAuthUrl();
      setAuthUrl(url);

      if (!token) return;

      try {
        const userData = await fetchSpotifyProfile(token);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token]);
  console.log("User data:", user);
  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar authUrl={authUrl} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <MoodSelector accessToken={token ?? ""} />
      </main>
    </div>
  );
}
