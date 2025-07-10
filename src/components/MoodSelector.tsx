import { moods } from "../utils/moodConfig";

export function MoodSelector({ onSelect }: { onSelect: (mood: string) => void }) {
  return (
    <div className="flex gap-4 justify-center">
      {moods.map((m) => (
        <button key={m.mood} onClick={() => onSelect(m.mood)} className="text-4xl cursor-pointer hover:scale-110 transition-transform">
          {m.emoji}
        </button>
      ))}
    </div>
  );
}
