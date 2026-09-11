import { NextResponse } from "next/server";
import { storeLead } from "@/lib/lead-service";
import { getLeadFieldErrors, leadSchema } from "@/lib/validation/lead";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Please submit the form again." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors: getLeadFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: false, error: "Unable to submit this form." }, { status: 400 });
  }

  try {
    const storedLead = await storeLead(parsed.data);
    return NextResponse.json({ ok: true, leadId: storedLead.leadId });
  } catch (error) {
    console.error("Lead storage failed", error instanceof Error ? error.message : "Unknown storage error");
    return NextResponse.json(
      { ok: false, error: "We could not save your interest right now. Please try again." },
      { status: 500 },
    );
  }
}
