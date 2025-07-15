import React, { useEffect, useState } from "react";
import { fetchSpotifyProfile } from "../services/spotifyService";
import type { IUser } from "../services/userService";

interface SidebarProps {
  authUrl: string;
}

const Navbar: React.FC<SidebarProps> = ({ authUrl }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const token = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    if (!token) return;
    fetchSpotifyProfile(token).then(setUser).catch(console.error);
  }, [token]);

  return (
    <nav className="bg-moodifybg text-white flex items-center justify-between px-8 py-4 w-full">
      <div className="flex items-center gap-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Moodify Logo" className="w-10 h-10" />
          <span className="text-xl font-bold">Moodify</span>
        </a>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.display_name}</span>
        </div>
      ) : (
        <a
          href={authUrl}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Connexion
        </a>
      )}
    </nav>
  );
};

export default Navbar;
