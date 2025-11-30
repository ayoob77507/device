// Google Apps Script backend for Employee Management
// Deploy as Web App: Execute as Me, Access = Anyone

const SHEET_ID = '1pyYZD3GwXQd-489Nl17Z_e_a7JYw40fa0KU_J0NRg2E';   // فقط الـ ID
const EMP_SHEET = 'Employees';
const USER_SHEET = 'Users';

// ==========================
//   ROUTING (WITH CORS FIX)
// ==========================

function doGet(e) {
  return createCORSResponse(handle(e));
}

function doPost(e) {
  return createCORSResponse(handle(e));
}

// ==========================
//      MAIN ROUTER
// ==========================

function handle(e) {
  const mode = e.parameter.mode || "";

  if (mode === "login")
    return loginUser(e.parameter.user, e.parameter.pass);

  if (mode === "read")
    return JSON.stringify(readDataRaw());

  if (mode === "delete")
    return deleteRecord(e.parameter.id);

  // POST modes
  if (e.postData && e.postData.contents) {
    const payload = JSON.parse(e.postData.contents);

    if (payload.mode === "add") return addRecord(payload);
    if (payload.mode === "update") return updateRecord(payload);
  }

  return "Invalid mode";
}

// ==========================
//     CORS FIX FUNCTION
// ==========================

function createCORSResponse(content) {
  return HtmlService
    .createHtmlOutput(content)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setContentSecurityPolicy(
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    );
}

// ==========================
//      HELPER FUNCTIONS
// ==========================

function openSheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

// READ ALL EMPLOYEES
function readDataRaw() {
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();
  const headers = data.shift();

  return data.map(row => {
    const o = {};
    headers.forEach((h, i) => (o[h] = row[i]));
    return o;
  });
}

// ADD NEW ROW
function addRecord(obj) {
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const headers = sh.getDataRange().getValues()[0];

  const row = headers.map(h => obj[h] || '');
  sh.appendRow(row);

  return "Added";
}

// UPDATE EXISTING ROW
function updateRecord(obj) {
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == obj[headers[0]]) {

      const newRow = headers.map(h => obj[h] || '');
      sh.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);

      return "Updated";
    }
  }
  return "Not found";
}

// DELETE ROW
function deleteRecord(id) {
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sh.deleteRow(i + 1);
      return "Deleted";
    }
  }
  return "Not found";
}

// LOGIN CHECK
function loginUser(user, pass) {
  const ss = openSheet();
  const sh = ss.getSheetByName(USER_SHEET);
  const rows = sh.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == user && rows[i][1] == pass)
      return "ok";
  }
  return "fail";
}
