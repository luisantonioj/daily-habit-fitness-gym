import { Resend } from "resend";
import type { LeadInput } from "@/lib/validation/lead";
import type { PendingDigestLead } from "@/lib/sheets/client";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getResendClient() {
  return new Resend(getRequiredEnv("RESEND_API_KEY"));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: process.env.LEADS_TIME_ZONE ?? "Asia/Manila",
  }).format(new Date(value));
}

export async function sendLeadConfirmation({
  leadId,
  submittedAt,
  lead,
}: {
  leadId: string;
  submittedAt: string;
  lead: LeadInput;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const result = await getResendClient().emails.send({
    from: getRequiredEnv("EMAIL_FROM"),
    to: [lead.email],
    subject: "We received your Daily Habit inquiry",
    text: `Hi ${lead.name},\n\nThanks for registering your interest in Daily Habit Fitness Gym. The coach will follow up with the latest details for your next step.\n\nSubmitted: ${formatDate(submittedAt)}\nReference: ${leadId}${siteUrl ? `\n\nVisit the website: ${siteUrl}` : ""}\n\nDaily Habit Fitness Gym`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111416;max-width:600px"><p style="color:#98bd1d;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Daily Habit Fitness Gym</p><h1 style="font-size:32px;line-height:1.05;letter-spacing:-1px">Your first step is logged.</h1><p>Hi ${escapeHtml(lead.name)},</p><p>Thanks for registering your interest. The coach will follow up with the latest details for your next step.</p><p style="background:#f3f0e9;padding:16px;border-radius:12px;font-size:14px"><strong>Submitted:</strong> ${formatDate(submittedAt)}<br /><strong>Reference:</strong> ${escapeHtml(leadId)}</p>${siteUrl ? `<p><a href="${escapeHtml(siteUrl)}" style="color:#111416;font-weight:700">Visit the website ↗</a></p>` : ""}<p>Daily Habit Fitness Gym</p></div>`,
  });

  if (result.error) throw new Error(result.error.message);
  return result.data;
}

function digestText(leads: PendingDigestLead[]) {
  return leads.map((lead) => [
    `${lead.name} — ${lead.email}`,
    `Goal: ${lead.fitnessGoal}`,
    lead.phone ? `Phone: ${lead.phone}` : "Phone: not provided",
    `Preferred contact: ${lead.preferredContactMethod}`,
    lead.message ? `Message: ${lead.message}` : "Message: none",
    `Submitted: ${formatDate(lead.submittedAt)}`,
    `Lead ID: ${lead.leadId}`,
  ].join("\n")).join("\n\n---\n\n");
}

function digestHtml(leads: PendingDigestLead[]) {
  const rows = leads.map((lead) => `<article style="padding:18px 0;border-bottom:1px solid #ddd9d0"><h2 style="margin:0 0 8px;font-size:18px">${escapeHtml(lead.name)}</h2><p style="margin:0 0 8px;color:#252a2d"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>${lead.phone ? ` · ${escapeHtml(lead.phone)}` : ""}</p><p style="margin:0 0 8px"><strong>Goal:</strong> ${escapeHtml(lead.fitnessGoal)}</p><p style="margin:0 0 8px"><strong>Preferred contact:</strong> ${escapeHtml(lead.preferredContactMethod)}</p>${lead.message ? `<p style="margin:0 0 8px"><strong>Message:</strong> ${escapeHtml(lead.message)}</p>` : ""}<p style="margin:0;color:#6b7072;font-size:12px">${formatDate(lead.submittedAt)} · ${escapeHtml(lead.leadId)}</p></article>`).join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111416;max-width:680px"><p style="color:#98bd1d;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Daily Habit Fitness Gym</p><h1 style="font-size:32px;line-height:1.05;letter-spacing:-1px">${leads.length} new ${leads.length === 1 ? "inquiry" : "inquiries"}</h1><p>These leads are ready for coach follow-up.</p>${rows}</div>`;
}

export async function sendCoachDigest(leads: PendingDigestLead[]) {
  const result = await getResendClient().emails.send({
    from: getRequiredEnv("EMAIL_FROM"),
    to: [getRequiredEnv("COACH_EMAIL")],
    subject: `Daily Habit lead digest — ${leads.length} new ${leads.length === 1 ? "inquiry" : "inquiries"}`,
    text: `Daily Habit Fitness Gym\n\n${leads.length} new inquiries:\n\n${digestText(leads)}`,
    html: digestHtml(leads),
  });

  if (result.error) throw new Error(result.error.message);
  return result.data;
}
