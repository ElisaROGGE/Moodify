import { useState, useEffect } from "react";

interface AnimatedTitleProps {
  text: string;
  className?: string;
}

export default function AnimatedTitle({
  text,
  className = "",
}: AnimatedTitleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return (
    <h1 className={`${className} relative`}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
      {currentIndex >= text.length && (
        <span className="absolute -top-2 -right-2 text-2xl animate-bounce">
          ✨
        </span>
      )}
    </h1>
  );
}
