# ZippyScale Quiz API (Apps Script)

Replaces Vercel quiz.js. Runs on Google Apps Script as a Web App.

## Setup

1. Go to https://script.google.com and create a new project
2. Name it "ZippyScale Quiz API"
3. Paste the contents of `Code.gs` into the editor
4. Go to Project Settings (gear icon) → Script Properties → Add:
   - `META_ACCESS_TOKEN` = your Meta CAPI token
   - `GHL_PIT` = pit-add82ec0-12f5-4e34-9e2f-e636dadce75c
   - `SHEETS_ID` = 1x33H0rto0yWQrw7TcnUgNrzR2Pu5S7_SStO3h2iMSXM
5. Click Deploy → New Deployment
6. Type: Web App
7. Execute as: Me
8. Who has access: Anyone
9. Click Deploy
10. Copy the Web App URL

## Test

```bash
curl -X GET "YOUR_WEB_APP_URL"
# Should return: {"status":"ok","service":"ZippyScale Quiz API"}

curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"9876543210","business_name":"TestCorp","source":"test"}'
```

## What it does

1. Receives form POST data
2. Scores the lead (same algorithm as Vercel version)
3. Fires Meta CAPI (server-side, token safe)
4. Pushes contact to GHL (upsert)
5. Appends row to Google Sheet
6. Returns JSON response
