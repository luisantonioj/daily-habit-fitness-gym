import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("ThemeToggle", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.theme = "dark";
  });

  it("switches themes and persists the selected mode", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", { name: /switch to light mode/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("daily-habit-theme")).toBe("light");
    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("restores a saved light theme after mounting", async () => {
    window.localStorage.setItem("daily-habit-theme", "light");
    render(<ThemeToggle />);

    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light"));
    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });
});
