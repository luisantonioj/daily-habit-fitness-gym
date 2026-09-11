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

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
