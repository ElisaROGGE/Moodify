import { MoodSelector } from "../components/MoodSelector";

export default function Mood() {
    const token = localStorage.getItem("spotify_access_token");
    return(
        <MoodSelector accessToken={token ?? ""} />
    )
}