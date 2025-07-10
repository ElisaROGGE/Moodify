import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Callback() {

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const verifier = localStorage.getItem("spotify_code_verifier");

    if (!code || !verifier) {
      console.error("Code ou verifier manquant");
      return;
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI!,
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
      code_verifier: verifier,
    });

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎉 Access token reçu :", data.access_token);
        localStorage.setItem("spotify_access_token", data.access_token);
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Erreur lors de l’échange du token :", err);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar authUrl={import.meta.env.VITE_SPOTIFY_AUTH_URL} />
      <h1 className="text-2xl font-bold">Authentification en cours...</h1>
    </div>
  )
}
