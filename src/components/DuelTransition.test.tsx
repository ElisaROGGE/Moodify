import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import DuelTransition from "./DuelTransition";

describe("Duel Transition Component", () => {
  it("renders transition component", () => {
    const { container } = render(
      <DuelTransition isTransitioning={false} direction="left">
        <div>Test Content</div>
      </DuelTransition>
    );

    expect(container.querySelector(".relative")).toBeInTheDocument();
    expect(container.querySelector(".transition-all")).toBeInTheDocument();
    
  })
  it("renders transition component with transitioning true", () => {
    const { container } = render(
      <DuelTransition isTransitioning={true} direction="left">
        <div>Test Content</div>
      </DuelTransition>
    );

    expect(container.querySelector(".relative")).toBeInTheDocument();
    expect(container.querySelector(".transition-all")).toBeInTheDocument();
    expect(container.querySelector(".-translate-x-full")).toBeInTheDocument();
  })
  it("renders transition component with transitioning true and direction right", () => {
    const { container } = render(
      <DuelTransition isTransitioning={true} direction="right">
        <div>Test Content</div>
      </DuelTransition>
    );

    expect(container.querySelector(".relative")).toBeInTheDocument();
    expect(container.querySelector(".transition-all")).toBeInTheDocument();
    expect(container.querySelector(".translate-x-full")).toBeInTheDocument();
  })
})