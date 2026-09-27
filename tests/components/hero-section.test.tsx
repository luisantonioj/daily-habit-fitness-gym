import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSection } from "@/components/landing/hero-section";

const MOBILE_VIDEO = "/videos/daily-habit-video-mobile.mp4";
const DESKTOP_VIDEO = "/videos/daily-habit-video-web.mp4";

function mockViewport(width: number) {
  const listeners = new Set<EventListener>();
  const query = {
    matches: width >= 640,
    media: "(min-width: 640px)",
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: EventListener) => listeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: EventListener) => listeners.delete(listener)),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => query),
  });

  return (nextWidth: number) => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: nextWidth });
    Object.defineProperty(query, "matches", { configurable: true, value: nextWidth >= 640 });
    act(() => listeners.forEach((listener) => listener(new Event("change"))));
  };
}

describe("HeroSection", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each([
    [390, MOBILE_VIDEO],
    [639, MOBILE_VIDEO],
    [640, DESKTOP_VIDEO],
    [1024, DESKTOP_VIDEO],
  ])("selects only the matching video source at %i pixels", (width, expectedSource) => {
    mockViewport(width);
    render(<HeroSection />);

    const video = document.querySelector(".stitch-hero-video") as HTMLVideoElement;
    expect(video).toHaveAttribute("src", expectedSource);
    expect(video.querySelectorAll("source")).toHaveLength(0);
    expect(screen.getByRole("heading", { level: 1, name: "Daily Habit Fitness Gym" })).toHaveClass("sr-only");
  });

  it("switches and restarts the video when the viewport crosses the breakpoint", () => {
    const changeViewport = mockViewport(639);
    render(<HeroSection />);

    const video = document.querySelector(".stitch-hero-video") as HTMLVideoElement;
    expect(video).toHaveAttribute("src", MOBILE_VIDEO);

    changeViewport(640);
    expect(video).toHaveAttribute("src", DESKTOP_VIDEO);
    expect(video.load).toHaveBeenCalledTimes(2);
    expect(video.play).toHaveBeenCalledTimes(2);

    changeViewport(390);
    expect(video).toHaveAttribute("src", MOBILE_VIDEO);
    expect(video.load).toHaveBeenCalledTimes(3);
    expect(video.play).toHaveBeenCalledTimes(3);
  });

  it("plays muted inline on a loop without exposing video controls", () => {
    mockViewport(1280);
    render(<HeroSection />);

    const video = document.querySelector(".stitch-hero-video") as HTMLVideoElement;
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "auto");
    expect(video).not.toHaveAttribute("controls");
    expect(video.querySelector("button")).not.toBeInTheDocument();
    expect(video.play).toHaveBeenCalledOnce();
  });

  it("handles a browser rejecting autoplay without exposing controls", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new Error("autoplay denied"));
    mockViewport(390);
    render(<HeroSection />);

    await act(async () => Promise.resolve());
    expect(document.querySelector(".stitch-hero-video")).not.toHaveAttribute("controls");
  });
});
