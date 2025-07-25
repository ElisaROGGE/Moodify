import AnimatedTitle from "./AnimatedTitle";
import { expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

test("Show the title", async () => {
  render(<AnimatedTitle text="Hello" />);
  await waitFor(() => expect(screen.getByText("Hello")).toBeTruthy(), {
    timeout: 2000,
  });
});
