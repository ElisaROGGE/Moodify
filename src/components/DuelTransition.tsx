import type { ReactNode } from "react";

interface DuelTransitionProps {
  children: ReactNode;
  isTransitioning: boolean;
  direction: "left" | "right";
}

export default function DuelTransition({
  children,
  isTransitioning,
  direction,
}: DuelTransitionProps) {
  return (
    <div className="relative w-full min-h-[400px] overflow-hidden">
      {/* Effet de slide avec animation plus fluide */}
      <div
        className={`
          w-full transition-all duration-700 ease-in-out transform
          ${
            isTransitioning
              ? direction === "left"
                ? "-translate-x-full opacity-0 scale-95"
                : "translate-x-full opacity-0 scale-95"
              : "translate-x-0 opacity-100 scale-100"
          }
        `}
        style={{
          filter: isTransitioning ? "blur(2px)" : "blur(0px)",
        }}
      >
        {children}
      </div>

      {/* Overlay pendant la transition */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
