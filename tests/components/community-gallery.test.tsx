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
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const thumbnails = () => screen.getAllByRole("button", { name: /View photo/ });

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

describe("CommunityGallery viewer", () => {
  it("opens the chosen original, navigates both ways, and restores focus and scrolling", () => {
    render(<CommunityGallery />);
    const trigger = thumbnails()[1];
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Photo 2 of 38");
    expect(document.body.style.overflow).toBe("hidden");
    const original = screen.getByRole("link", { name: /Open original/ });
    expect(original).toHaveAttribute("target", "_blank");
    expect(new URL(dialog.querySelector("img")!.src).pathname).toBe(original.getAttribute("href"));
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(dialog).toHaveTextContent("Photo 1 of 38");
    fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(dialog).toHaveTextContent("Photo 38 of 38");
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(dialog).toHaveTextContent("Photo 1 of 38");
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(dialog).toHaveTextContent("Photo 2 of 38");
    fireEvent.click(screen.getByRole("button", { name: "Close photo viewer" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("status")).toHaveTextContent("Page 1 of 5");
  });
  it("handles loading errors, recovers on navigation, and dismisses on backdrop or cancel", () => {
    render(<CommunityGallery />);
    fireEvent.click(thumbnails()[0]);
    let dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Loading photo");
    fireEvent.error(dialog.querySelector("img")!);
    expect(dialog).toHaveTextContent("This photo could not load");
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(dialog).toHaveTextContent("Loading photo");
    fireEvent.load(dialog.querySelector("img")!);
    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(thumbnails()[0]);
    dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});

