Employee Management System — Corporate Blue (Final ZIP)
=======================================================

Files:
- index.html        -> Frontend (RTL Arabic) — Corporate Blue UI
- Code.gs           -> Google Apps Script backend (CRUD + Login)
- README.md         -> This file

Quick setup:
1. Open a new Google Spreadsheet.
2. Create two sheets named exactly: "Employees" and "Users".
   - Employees: first row should be headers. Recommended headers (in order):
     EmpID, Name, Gender, Address, Email, Contact, Organization, Department, Position, Website
   - Users: first row headers: Username, Password
     Add at least one user row for testing, e.g.: admin | 1234

3. In Apps Script (script.google.com) create a new project and:
   - Replace the default Code.gs with the provided Code.gs content.
   - Set the constant SHEET_ID to your spreadsheet ID (the long ID in the sheet URL).
   - Save.

4. Deploy as Web App:
   - Click "Deploy" -> "New deployment"
   - Choose "Web app"
   - Execute as: Me
   - Who has access: Anyone (or Anyone with link)
   - Deploy and copy the Web App URL.

5. Edit index.html:
   - Open index.html and replace the placeholder 'YOUR_WEB_APP_URL' with the Web App URL you copied.
     Example: const API_BASE = 'https://script.google.com/macros/s/XXXXXXXX/exec';

6. Open index.html in a browser (double-click the file) or host it on a static host.
   - Use the login credentials you added in the Users sheet.

Notes & Tips:
- The frontend is pure HTML/CSS/JS and calls the Apps Script Web App via fetch() for CRUD.
- If you plan to restrict access, consider implementing token-based checks or Google OAuth.
- For production, set "Who has access" to the appropriate level and consider publishing internally.

If you want, I can:
- Deploy the script for you (share the spreadsheet with me) and configure the Web App URL in the HTML.
- Add client-side validation, file uploads, or image avatars.
