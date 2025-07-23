import { useState, useEffect } from "react";

interface StatsCounterProps {
  targetNumber: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function StatsCounter({
  targetNumber,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(targetNumber * progress));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetNumber, duration]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-1">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white/70 text-sm uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <div className="mt-16 py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="md:grid md:grid-cols-3 flex flex-col gap-8 max-w-2xl mx-auto">
        <StatsCounter targetNumber={1000000} label="Chansons" suffix="+" />
        <StatsCounter targetNumber={50000} label="Artistes" suffix="+" />
        <StatsCounter targetNumber={10000} label="Playlists" suffix="+" />
      </div>
    </div>
  );
}
