import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/landing/site-header";

vi.mock("next/image", () => ({
  default: () => React.createElement("span", { "aria-hidden": true }),
}));

vi.mock("@/components/landing/coach-avatar", () => ({
  CoachAvatar: () => React.createElement("span", { "aria-hidden": true }),
}));

function setScrollPosition(scrollY: number, event: "scroll" | "pageshow" = "scroll") {
  act(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
    window.dispatchEvent(new Event(event));
  });
}

describe("SiteHeader scroll visibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.theme = "dark";
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  afterEach(() => cleanup());

  it.each([0, 24])("starts hidden and stays hidden at %i pixels", (scrollY) => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
    render(<SiteHeader />);

    const header = document.querySelector(".stitch-header")!;
    expect(header).not.toHaveClass("is-visible");
    expect(header).toHaveAttribute("aria-hidden", "true");
    expect(header).toHaveAttribute("inert");
  });

  it("reveals after 24 pixels and hides again at the top", () => {
    render(<SiteHeader />);
    const header = document.querySelector(".stitch-header")!;

    setScrollPosition(25);
    expect(header).toHaveClass("is-visible");
    expect(header).toHaveAttribute("aria-hidden", "false");
    expect(header).not.toHaveAttribute("inert");

    setScrollPosition(24);
    expect(header).not.toHaveClass("is-visible");
    expect(header).toHaveAttribute("inert");
  });

  it("checks the restored scroll position on pageshow", () => {
    render(<SiteHeader />);
    const header = document.querySelector(".stitch-header")!;

    setScrollPosition(180, "pageshow");
    expect(header).toHaveClass("is-visible");
  });

  it("closes an open mobile menu when scrolling back to the top", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    setScrollPosition(25);

    const menuToggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(menuToggle);
    expect(menuToggle).toHaveAttribute("aria-expanded", "true");
    expect(document.querySelector(".stitch-nav")).toHaveClass("is-open");

    setScrollPosition(0);
    expect(document.querySelector(".stitch-nav")).not.toHaveClass("is-open");
    expect(document.querySelector(".stitch-menu-toggle")).toHaveAttribute("aria-expanded", "false");
  });
});
