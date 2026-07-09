const { google } = require('googleapis');

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheetsClient() {
  const auth = getAuth();
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function readRange(sheetId, range) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  return res.data.values || [];
}

async function appendRow(sheetId, range, rowValues) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  });
  return res.data;
}

async function updateRange(sheetId, range, rowValues) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowValues] },
  });
  return res.data;
}

async function getFirstSheetTitle(sheetId) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title',
  });
  return res.data.sheets[0].properties.title;
}

module.exports = { readRange, appendRow, updateRange, getFirstSheetTitle };
