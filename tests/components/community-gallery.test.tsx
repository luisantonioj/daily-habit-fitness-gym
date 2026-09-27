import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommunityGallery } from "@/components/landing/community-gallery";

let changeViewport: (mobile: boolean) => void;
beforeEach(() => {
  const listeners = new Set<() => void>();
  const query = { matches: false, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) };
  vi.stubGlobal("matchMedia", () => query);
  changeViewport = (mobile) => act(() => { query.matches = mobile; listeners.forEach((fn) => fn()); });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const thumbnails = () => screen.getAllByRole("link", { name: /View photo/ });

describe("CommunityGallery paging", () => {
  it("shows eight photos and wraps both ways without duplicating the last page", () => {
    render(<CommunityGallery />);
    expect(thumbnails()).toHaveLength(8);
    expect(screen.getByRole("status")).toHaveTextContent("Page 1 of 5");
    fireEvent.click(screen.getByRole("button", { name: "Previous gallery page" }));
    expect(thumbnails()).toHaveLength(6);
    expect(thumbnails()[0]).toHaveAccessibleName(/^View photo 33:/);
    fireEvent.click(screen.getByRole("button", { name: "Next gallery page" }));
    expect(thumbnails()[0]).toHaveAccessibleName(/^View photo 1:/);
  });
  it("retains the previously first-visible photo on viewport changes", () => {
    render(<CommunityGallery />);
    fireEvent.click(screen.getByRole("button", { name: "Next gallery page" }));
    changeViewport(true);
    expect(thumbnails()).toHaveLength(4);
    expect(thumbnails()[0]).toHaveAccessibleName(/^View photo 9:/);
    expect(screen.getByRole("status")).toHaveTextContent("Page 3 of 10");
    fireEvent.click(screen.getByRole("button", { name: "Next gallery page" }));
    changeViewport(false);
    expect(thumbnails().some((el) => el.getAttribute("aria-label")?.startsWith("View photo 13:"))).toBe(true);
  });
});
