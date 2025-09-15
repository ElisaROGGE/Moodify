import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";

// Mock the components used in Home
vi.mock("../components/StatsSection", () => ({
  default: () => <div data-testid="stats-section">Mocked StatsSection</div>,
}));

vi.mock("../components/AnimatedTitle", () => ({
  default: ({ text, className }: { text: string; className: string }) => (
    <h1 data-testid="animated-title" className={className}>
      {text}
    </h1>
  ),
}));

describe("Home Component", () => {
  it("renders the main hero section with title and subtitle", () => {
    render(<Home />);

    // Check AnimatedTitle is rendered with correct props
    const title = screen.getByTestId("animated-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Moodify");
    expect(title).toHaveClass("text-6xl", "font-bold", "text-white");

    // Check subtitle
    expect(
      screen.getByText("Découvrez votre musique selon votre humeur")
    ).toBeInTheDocument();
  });

});
