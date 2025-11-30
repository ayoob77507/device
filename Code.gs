// Google Apps Script backend for Employee Management
// Put this in Code.gs and deploy as Web App (Execute as: Me, Who has access: Anyone with link)

const SHEET_ID = '1pyYZD3GwXQd-489Nl17Z_e_a7JYw40fa0KU_J0NRg2E/edit?gid=0#gid=0';
const EMP_SHEET = 'Employees';
const USER_SHEET = 'Users';

function doGet(e) {
      // Your existing logic to handle the request parameters (e.g., mode, user, pass)
      // For example:
      // var mode = e.parameter.mode;
      // var user = e.parameter.user;
      // var pass = e.parameter.pass;

      // ... process your request and generate a response ...
      var responseData = { message: "Login successful!", user: e.parameter.user }; // Example response

      // Create a TextOutput object
      var output = ContentService.createTextOutput(JSON.stringify(responseData));

      // Set the MIME type for JSON
      output.setMimeType(ContentService.MimeType.JSON);

      // IMPORTANT: Set the 'Access-Control-Allow-Origin' header
      // Replace 'https://ayoob77507.github.io' with the exact origin of your web page.
      // If you need to allow multiple origins, you would need more complex logic,
      // but for a single origin, this is sufficient.
      output.appendSetHeader('Access-Control-Allow-Origin', 'https://ayoob77507.github.io');

      return output;
    }


function doPost(e) {
  const output = handle(e);
  return HtmlService
    .createHtmlOutput(output)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setContentSecurityPolicy("default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
}

function handle(e) {
  const mode = e.parameter.mode;

  if (mode === "login")
    return loginUser(e.parameter.user, e.parameter.pass);

  if (mode === "read")
    return JSON.stringify(readDataRaw());

  if (mode === "delete")
    return deleteRecord(e.parameter.id);

  // POST modes
  if (e.postData) {
    const payload = JSON.parse(e.postData.contents);
    if (payload.mode === "add") return addRecord(payload);
    if (payload.mode === "update") return updateRecord(payload);
  }

  return "Invalid mode";
}


function openSheet(){
  return SpreadsheetApp.openById(SHEET_ID);
}

function readDataRaw() {
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();
  const headers = data.shift();
  return data.map(row => {
    const o = {};
    headers.forEach((h, i) => o[h] = row[i]);
    return o;
  });
}

function addRecord(obj){
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const headers = sh.getDataRange().getValues()[0];
  const row = headers.map(h => obj[h] || '');
  sh.appendRow(row);
  return ContentService.createTextOutput('Added');
}

function updateRecord(obj){
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  for(let i=1;i<data.length;i++){
    if(data[i][0] == obj[headers[0]]){
      // found row to update
      const newRow = headers.map(h=> obj[h] || '');
      sh.getRange(i+1,1,1,newRow.length).setValues([newRow]);
      return ContentService.createTextOutput('Updated');
    }
  }
  return ContentService.createTextOutput('Not found');
}

function deleteRecord(id){
  const ss = openSheet();
  const sh = ss.getSheetByName(EMP_SHEET);
  const data = sh.getDataRange().getValues();
  for(let i=1;i<data.length;i++){
    if(data[i][0] == id){ sh.deleteRow(i+1); return ContentService.createTextOutput('Deleted'); }
  }
  return ContentService.createTextOutput('Not found');
}

function loginUser(user, pass){
  const ss = openSheet();
  const sh = ss.getSheetByName(USER_SHEET);
  if(!sh) return ContentService.createTextOutput('fail');
  const rows = sh.getDataRange().getValues();
  for(let i=1;i<rows.length;i++){
    if(rows[i][0] == user && rows[i][1] == pass) return ContentService.createTextOutput('ok');
  }
  return ContentService.createTextOutput('fail');
}
