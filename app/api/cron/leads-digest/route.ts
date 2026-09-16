import { NextRequest, NextResponse } from "next/server";
import { sendCoachDigest } from "@/lib/email/client";
import { getPendingDigestLeads, updateDigestStatus } from "@/lib/sheets/client";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getPendingDigestLeads();
    if (leads.length === 0) return NextResponse.json({ ok: true, count: 0, sent: false });

    try {
      await sendCoachDigest(leads);
    } catch (error) {
      console.error("Coach digest failed", error instanceof Error ? error.message : "Unknown email error");
      await Promise.allSettled(leads.map((lead) => updateDigestStatus(lead.rowNumber, "failed")));
      return NextResponse.json({ ok: false, error: "Digest delivery failed." }, { status: 500 });
    }

    const sentAt = new Date().toISOString();
    const updates = await Promise.allSettled(leads.map((lead) => updateDigestStatus(lead.rowNumber, "sent", sentAt)));
    const markedCount = updates.filter((update) => update.status === "fulfilled").length;
    if (markedCount !== leads.length) console.error("Some digest status updates failed", { total: leads.length, markedCount });

    return NextResponse.json({ ok: true, count: leads.length, markedCount, sent: true });
  } catch (error) {
    console.error("Coach digest preparation failed", error instanceof Error ? error.message : "Unknown digest error");
    return NextResponse.json({ ok: false, error: "Digest preparation failed." }, { status: 500 });
  }
}
