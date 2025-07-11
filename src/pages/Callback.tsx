import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Callback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Debug des paramètres
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const verifier = localStorage.getItem("spotify_code_verifier");
        
        console.log("URL complète:", window.location.href);
        console.log("Code reçu:", code);
        console.log("Verifier stocké:", verifier);
        console.log("Tous les paramètres URL:", Object.fromEntries(urlParams));

        if (!code) {
          throw new Error("Code d'autorisation manquant dans l'URL");
        }

        if (!verifier) {
          throw new Error("Code verifier manquant dans le localStorage");
        }

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI!,
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
          code_verifier: verifier,
        });

        console.log("Body envoyé:", Object.fromEntries(body));

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.log("Erreur API:", errorData);
          throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        if (data.access_token) {
          console.log("🎉 Access token reçu");
          localStorage.setItem("spotify_access_token", data.access_token);
          localStorage.removeItem("spotify_code_verifier");
          window.location.href = "/";
        } else {
          throw new Error("Token non reçu");
        }
      } catch (err) {
        console.error("Erreur lors de l'échange du token :", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar authUrl="" />
      <main className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <h1 className="text-2xl font-bold">Authentification en cours...</h1>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur</h1>
            <p className="mb-4">{error}</p>
            <a href="/" className="text-blue-500 underline mt-4 block">
              Retour à l'accueil
            </a>
          </div>
        )}
      </main>
    </div>
  );
}