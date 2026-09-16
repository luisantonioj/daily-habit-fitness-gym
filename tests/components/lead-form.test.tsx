import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LeadForm } from "@/components/lead-form/lead-form";

describe("LeadForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("submits a valid inquiry and announces success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, leadId: "lead-123" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<LeadForm enabled />);
    await user.type(screen.getByLabelText(/name/i), "Alex Santos");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.selectOptions(screen.getByLabelText(/primary fitness goal/i), "Get stronger");
    await user.click(screen.getByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: /book my intro session/i }));

    expect(fetchMock).toHaveBeenCalledWith("/api/leads", expect.objectContaining({ method: "POST" }));
    expect(await screen.findByText("Introductory Session Request Received!")).toBeInTheDocument();
  });

  it("shows server field errors without losing the form", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "Please check the highlighted fields.", fieldErrors: { email: ["Please enter a valid email address."] } }), { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<LeadForm enabled />);
    await user.type(screen.getByLabelText(/name/i), "Alex Santos");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.selectOptions(screen.getByLabelText(/primary fitness goal/i), "Get stronger");
    await user.click(screen.getByLabelText(/i agree/i));
    await user.click(screen.getByRole("button", { name: /book my intro session/i }));

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alex Santos")).toBeInTheDocument();
  });

  it("keeps the preview form visible without submitting when disabled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<LeadForm enabled={false} />);

    expect(screen.getByText("Registration opens soon. This preview is not accepting inquiries yet.")).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: /book my intro session/i });
    expect(submit).toBeDisabled();

    await user.click(submit);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
