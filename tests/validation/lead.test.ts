import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation/lead";

const validLead = {
  name: "Alex Santos",
  email: "alex@example.com",
  phone: "09XX XXX XXXX",
  preferredContactMethod: "email" as const,
  fitnessGoal: "Build a consistent workout routine",
  message: "I am new to strength training.",
  consent: true as const,
  honeypot: "",
  source: "website",
};

describe("leadSchema", () => {
  it("accepts a valid lead and normalizes blank optional fields", () => {
    const result = leadSchema.parse({ ...validLead, phone: "", message: "" });

    expect(result.email).toBe("alex@example.com");
    expect(result.phone).toBeUndefined();
    expect(result.message).toBeUndefined();
    expect(result.source).toBe("website");
  });

  it("requires a valid email, fitness goal, and explicit consent", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      email: "not-an-email",
      fitnessGoal: "",
      consent: false,
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const fields = result.error.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["email", "fitnessGoal", "consent"]));
  });

  it("rejects a filled honeypot", () => {
    const result = leadSchema.safeParse({ ...validLead, honeypot: "bot value" });
    expect(result.success).toBe(false);
  });
});
