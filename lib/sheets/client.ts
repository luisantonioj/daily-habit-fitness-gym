import { google } from "googleapis";

const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";

export type LeadSheetRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type PendingDigestLead = {
  rowNumber: number;
  leadId: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  fitnessGoal: string;
  message: string;
  digestStatus: string;
  digestSentAt: string;
  staffStatus: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getSheetsClient() {
  const clientEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [sheetsScope],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendLeadRow(row: LeadSheetRow) {
  const sheets = getSheetsClient();
  const spreadsheetId = getRequiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const range = process.env.GOOGLE_SHEETS_LEADS_RANGE ?? "Leads!A:S";

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  const updatedRange = response.data.updates?.updatedRange;
  const rowMatch = updatedRange?.match(/![A-Z]+(\d+):/);
  return rowMatch ? Number(rowMatch[1]) : undefined;
}

function getLeadsRange() {
  return process.env.GOOGLE_SHEETS_LEADS_RANGE ?? "Leads!A:S";
}

async function updateSheetCells(range: string, values: string[][]) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getRequiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID"),
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

export async function updateLeadConfirmation(rowNumber: number, status: "sent" | "failed", sentAt = "") {
  await updateSheetCells(`Leads!N${rowNumber}:O${rowNumber}`, [[status, sentAt]]);
}

export async function getPendingDigestLeads(): Promise<PendingDigestLead[]> {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getRequiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID"),
    range: getLeadsRange(),
    majorDimension: "ROWS",
  });
  const rows = response.data.values ?? [];

  return rows.slice(1).flatMap((row, index) => {
    const [leadId, submittedAt, name, email, phone, preferredContactMethod, fitnessGoal, message, , , , , , , , digestStatus, digestSentAt, staffStatus] = row;
    if (!leadId || digestSentAt || staffStatus === "do-not-contact") return [];
    return [{
      rowNumber: index + 2,
      leadId,
      submittedAt: submittedAt ?? "",
      name: name ?? "",
      email: email ?? "",
      phone: phone ?? "",
      preferredContactMethod: preferredContactMethod ?? "",
      fitnessGoal: fitnessGoal ?? "",
      message: message ?? "",
      digestStatus: digestStatus ?? "pending",
      digestSentAt: digestSentAt ?? "",
      staffStatus: staffStatus ?? "new",
    } satisfies PendingDigestLead];
  });
}

export async function updateDigestStatus(rowNumber: number, status: "sent" | "failed", sentAt = "") {
  await updateSheetCells(`Leads!P${rowNumber}:Q${rowNumber}`, [[status, sentAt]]);
}
