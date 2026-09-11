import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getPendingDigestLeads: vi.fn(),
  updateDigestStatus: vi.fn(),
  sendCoachDigest: vi.fn(),
}));

const { getPendingDigestLeads, updateDigestStatus, sendCoachDigest } = mocks;

vi.mock("@/lib/sheets/client", () => ({ getPendingDigestLeads: mocks.getPendingDigestLeads, updateDigestStatus: mocks.updateDigestStatus }));
vi.mock("@/lib/email/client", () => ({ sendCoachDigest: mocks.sendCoachDigest }));

import { GET } from "@/app/api/cron/leads-digest/route";

const pendingLead = {
  rowNumber: 2,
  leadId: "lead-123",
  submittedAt: "2026-09-11T00:00:00.000Z",
  name: "Alex Santos",
  email: "alex@example.com",
  phone: "",
  preferredContactMethod: "email",
  fitnessGoal: "Build a consistent workout routine",
  message: "",
  digestStatus: "pending",
  digestSentAt: "",
  staffStatus: "new",
};

describe("GET /api/cron/leads-digest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    getPendingDigestLeads.mockResolvedValue([pendingLead]);
    sendCoachDigest.mockResolvedValue({ id: "digest-123" });
    updateDigestStatus.mockResolvedValue(undefined);
  });

  it("rejects requests without the cron secret", async () => {
    const response = await GET(new Request("http://localhost/api/cron/leads-digest") as never);
    expect(response.status).toBe(401);
    expect(getPendingDigestLeads).not.toHaveBeenCalled();
  });

  it("sends and marks pending leads", async () => {
    const request = new Request("http://localhost/api/cron/leads-digest", {
      headers: { authorization: "Bearer test-secret" },
    });
    const response = await GET(request as never);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, count: 1, markedCount: 1, sent: true });
    expect(sendCoachDigest).toHaveBeenCalledWith([pendingLead]);
    expect(updateDigestStatus).toHaveBeenCalledWith(2, "sent", expect.any(String));
  });

  it("leaves rows retryable when email delivery fails", async () => {
    sendCoachDigest.mockRejectedValue(new Error("provider unavailable"));
    const request = new Request("http://localhost/api/cron/leads-digest", {
      headers: { authorization: "Bearer test-secret" },
    });
    const response = await GET(request as never);

    expect(response.status).toBe(500);
    expect(updateDigestStatus).toHaveBeenCalledWith(2, "failed");
  });
});
