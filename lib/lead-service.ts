import { randomUUID } from "node:crypto";
import type { LeadInput } from "@/lib/validation/lead";
import { appendLeadRow, type LeadSheetRow } from "@/lib/sheets/client";

export type StoredLead = {
  leadId: string;
  submittedAt: string;
  rowNumber: number | undefined;
};

function toSheetRow(lead: LeadInput, leadId: string, submittedAt: string): LeadSheetRow {
  return [
    leadId,
    submittedAt,
    lead.name,
    lead.email,
    lead.phone ?? "",
    lead.preferredContactMethod,
    lead.fitnessGoal,
    lead.message ?? "",
    submittedAt,
    lead.source,
    lead.utmSource ?? "",
    lead.utmMedium ?? "",
    lead.utmCampaign ?? "",
    "pending",
    "",
    "pending",
    "",
    "new",
    "",
  ];
}

export async function storeLead(lead: LeadInput): Promise<StoredLead> {
  const leadId = randomUUID();
  const submittedAt = new Date().toISOString();
  const rowNumber = await appendLeadRow(toSheetRow(lead, leadId, submittedAt));
  return { leadId, submittedAt, rowNumber };
}
