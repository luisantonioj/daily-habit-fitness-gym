import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  storeLead: vi.fn(),
  sendLeadConfirmation: vi.fn(),
  updateLeadConfirmation: vi.fn(),
}));

const { storeLead, sendLeadConfirmation, updateLeadConfirmation } = mocks;

vi.mock("@/lib/lead-service", () => ({ storeLead: mocks.storeLead }));
vi.mock("@/lib/email/client", () => ({ sendLeadConfirmation: mocks.sendLeadConfirmation }));
vi.mock("@/lib/sheets/client", () => ({ updateLeadConfirmation: mocks.updateLeadConfirmation }));

import { POST } from "@/app/api/leads/route";

const payload = {
  name: "Alex Santos",
  email: "alex@example.com",
  phone: "",
  preferredContactMethod: "email",
  fitnessGoal: "Build a consistent workout routine",
  message: "",
  consent: true,
  honeypot: "",
  source: "website",
};

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeLead.mockResolvedValue({ leadId: "lead-123", submittedAt: "2026-09-11T00:00:00.000Z", rowNumber: 2 });
    sendLeadConfirmation.mockResolvedValue({ id: "email-123" });
    updateLeadConfirmation.mockResolvedValue(undefined);
  });

  it("returns field errors and creates no side effects for invalid input", async () => {
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({ ...payload, email: "bad" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false, fieldErrors: { email: expect.any(Array) } });
    expect(storeLead).not.toHaveBeenCalled();
  });

  it("stores the lead before sending confirmation and updates status", async () => {
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, leadId: "lead-123" });
    expect(storeLead).toHaveBeenCalledOnce();
    expect(sendLeadConfirmation).toHaveBeenCalledOnce();
    expect(updateLeadConfirmation).toHaveBeenCalledWith(2, "sent", expect.any(String));
  });

  it("preserves a stored lead when confirmation delivery fails", async () => {
    sendLeadConfirmation.mockRejectedValue(new Error("provider unavailable"));

    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, leadId: "lead-123" });
    expect(updateLeadConfirmation).toHaveBeenCalledWith(2, "failed", "");
  });
});
