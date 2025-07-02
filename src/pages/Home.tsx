import Navbar from "../components/Navbar";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
console.log("Client ID:", clientId);
console.log("Redirect URI:", redirectUri);
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public"
];

const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}`;
console.log("Auth URL:", authUrl);
export default function Home() {
 return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar authUrl={authUrl} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Moodify 🎧</h1>
      </main>
    </div>
  );
}