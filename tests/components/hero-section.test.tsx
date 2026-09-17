import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSection } from "@/components/landing/hero-section";

describe("HeroSection", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders the minimalist headline, subtitle, and single CTA button", () => {
    render(<HeroSection />);

    // Title
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build the Habit That Changes Everything."
    );

    // Subtitle
    expect(
      screen.getByText(
        "An approachable fitness community for beginners and everyday progress. No judgment—just consistent daily habits."
      )
    ).toBeInTheDocument();

    // Single CTA button linking to #experience-services
    const ctaButton = screen.getByRole("link", { name: /Explore Gym Services/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "#experience-services");

    // Removed elements should NOT be present
    expect(
      screen.queryByRole("link", { name: /Claim Your Free Introductory Session/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("500+ Strong")).not.toBeInTheDocument();
    expect(screen.queryByText("Zero Pressure")).not.toBeInTheDocument();
    expect(screen.queryByText("Floor Coaches")).not.toBeInTheDocument();
    expect(screen.queryByText("Coach Sarah")).not.toBeInTheDocument();
  });

  it("renders navigation arrows and cycles images on click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HeroSection />);

    const prevButton = screen.getByRole("button", { name: /Previous community photo/i });
    const nextButton = screen.getByRole("button", { name: /Next community photo/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Initial image in background
    const initialImg = document.querySelector(".stitch-hero-image") as HTMLImageElement;
    const initialSrc = initialImg.getAttribute("src");
    expect(initialSrc).toBeTruthy();

    // Click next
    await user.click(nextButton);
    const secondImg = document.querySelector(".stitch-hero-image") as HTMLImageElement;
    expect(secondImg.getAttribute("src")).not.toBe(initialSrc);

    // Click previous to go back
    await user.click(prevButton);
    const backImg = document.querySelector(".stitch-hero-image") as HTMLImageElement;
    expect(backImg.getAttribute("src")).toBe(initialSrc);
  });

  it("advances community photos automatically every 5 seconds", () => {
    render(<HeroSection />);

    const initialImg = document.querySelector(".stitch-hero-image") as HTMLImageElement;
    const initialSrc = initialImg.getAttribute("src");

    // Fast-forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const nextImg = document.querySelector(".stitch-hero-image") as HTMLImageElement;
    expect(nextImg.getAttribute("src")).not.toBe(initialSrc);
  });
});
