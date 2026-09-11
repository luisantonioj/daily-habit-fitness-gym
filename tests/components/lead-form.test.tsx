import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadForm } from "@/components/lead-form/lead-form";

describe("LeadForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("submits a valid inquiry and announces success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, leadId: "lead-123" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<LeadForm />);
    await user.type(screen.getByLabelText(/name/i), "Alex Santos");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.selectOptions(screen.getByLabelText(/what do you want/i), "Get stronger");
    await user.click(screen.getByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: /send my interest/i }));

    expect(fetchMock).toHaveBeenCalledWith("/api/leads", expect.objectContaining({ method: "POST" }));
    expect(await screen.findByText("Your first step is logged.")).toBeInTheDocument();
  });

  it("shows server field errors without losing the form", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "Please check the highlighted fields.", fieldErrors: { email: ["Please enter a valid email address."] } }), { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<LeadForm />);
    await user.type(screen.getByLabelText(/name/i), "Alex Santos");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.selectOptions(screen.getByLabelText(/what do you want/i), "Get stronger");
    await user.click(screen.getByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: /send my interest/i }));

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alex Santos")).toBeInTheDocument();
  });
});
