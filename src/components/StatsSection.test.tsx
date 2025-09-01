import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatsSection from "./StatsSection";

// Mock de requestAnimationFrame et cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

describe("StatsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock des fonctions d'animation
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;

    // Simuler le comportement de requestAnimationFrame
    mockRequestAnimationFrame.mockImplementation(
      (callback: FrameRequestCallback) => {
        // Simuler un timestamp et exécuter le callback immédiatement pour les tests
        setTimeout(() => callback(performance.now()), 0);
        return 1; // Mock ID
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays initial counters at 0", () => {
    render(<StatsSection />);

    const counters = screen.getAllByText(/^0\+?$/);
    expect(counters).toHaveLength(3);
  });

  it("sets exact target number when animation completes", async () => {
    let callbackCount = 0;

    mockRequestAnimationFrame.mockImplementation(
      (callback: FrameRequestCallback) => {
        callbackCount++;

        // Simuler l'animation complète au premier appel
        setTimeout(() => {
          const baseTime = performance.now();
          // Premier appel pour initialiser startTime
          callback(baseTime);
          // Deuxième appel avec progress > 1 (duration = 2000)
          callback(baseTime + 2500); // progress = 2500/2000 = 1.25 > 1
        }, 0);

        return callbackCount;
      }
    );

    render(<StatsSection />);

    // Attendre que les valeurs finales exactes soient définies
    await waitFor(
      () => {
        // Vérifier qu'on a bien les valeurs cibles exactes, pas une approximation
        const songCounter = screen.getByText("1 000 000+");
        expect(songCounter).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
