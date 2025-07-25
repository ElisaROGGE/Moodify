import { render, screen } from "@testing-library/react";
import MatchInfo from "./MatchInfo";
import { mockArtist1 } from "../test/mocks";
import "@testing-library/jest-dom";

const roundName = "Round 1";
const matchNumber = 1;
const totalMatches = 8;
const lastWinner = mockArtist1;
const isTransitioning = false;

describe("MatchInfo Component", () => {
  it("renders without crashing", () => {
    render(
      <MatchInfo
        roundName={roundName}
        matchNumber={matchNumber}
        totalMatches={totalMatches}
        lastWinner={lastWinner}
        isTransitioning={isTransitioning}
      />
    );

    expect(screen.getByText(roundName)).toBeInTheDocument();
    expect(screen.getByText(`Match ${matchNumber}/${totalMatches}`)).toBeInTheDocument();
  });

  it("shows last winner when not transitioning", () => {
    render(
      <MatchInfo
        roundName={roundName}
        matchNumber={matchNumber}
        totalMatches={totalMatches}
        lastWinner={lastWinner}
        isTransitioning={false}
      />
    );

    expect(screen.getByText(`${lastWinner.name}`)).toBeInTheDocument();
  });

  it("shows transition message when transitioning", () => {
    render(
      <MatchInfo
        roundName={roundName}
        matchNumber={matchNumber}
        totalMatches={totalMatches}
        lastWinner={lastWinner}
        isTransitioning={true}
      />
    );

    expect(screen.getByText("Préparation du prochain duel...")).toBeInTheDocument();
  });
});
