/**
 * LumaShift – Google Apps Script Web App
 * Handles form submissions: logs to Google Sheets + sends email notification
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into the editor
 * 3. Set SPREADSHEET_ID and NOTIFICATION_EMAIL below
 * 4. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL → set as NEXT_PUBLIC_GOOGLE_SCRIPT_URL in .env
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_GOOGLE_SPREADSHEET_ID_HERE',   // Replace with your Sheet ID
  NOTIFICATION_EMAIL: 'lumashift@outlook.com',
  SHEETS: {
    contact: 'Contact Form',
    resource_unlock: 'Resource Unlock',
    quiz_result: 'Quiz Results',
  },
};

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType || 'contact';

    // Log to the appropriate sheet
    logToSheet(data, formType);

    // Send email notification
    sendEmailNotification(data, formType);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── SHEET LOGGING ────────────────────────────────────────────────────────────
function logToSheet(data, formType) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheetName = CONFIG.SHEETS[formType] || 'Other';

  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Add headers based on form type
    const headers = getHeaders(formType);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  const row = buildRow(data, formType);
  sheet.appendRow(row);
}

function getHeaders(formType) {
  const base = ['Timestamp', 'Name', 'Email'];
  if (formType === 'contact') {
    return [...base, 'Phone', 'Message', 'Source'];
  } else if (formType === 'resource_unlock') {
    return [...base, 'Career Goal', 'Source'];
  } else if (formType === 'quiz_result') {
    return [...base, 'Experience Level', 'Roles Interest', 'Confidence Score', 'Blockers', 'Recommended Services'];
  }
  return [...base, 'Message', 'Source'];
}

function buildRow(data, formType) {
  const ts = data.timestamp || new Date().toISOString();
  const base = [ts, data.name || '', data.email || ''];

  if (formType === 'contact') {
    return [...base, data.phone || '', data.message || '', data.source || ''];
  } else if (formType === 'resource_unlock') {
    return [...base, data.careerGoal || '', data.source || ''];
  } else if (formType === 'quiz_result') {
    return [
      ...base,
      data.experienceLevel || '',
      Array.isArray(data.roles) ? data.roles.join(', ') : (data.roles || ''),
      data.confidenceScore ?? '',
      Array.isArray(data.blockers) ? data.blockers.join(', ') : (data.blockers || ''),
      Array.isArray(data.recommendedServices) ? data.recommendedServices.join(', ') : (data.recommendedServices || ''),
    ];
  }
  return [...base, data.message || '', data.source || ''];
}

// ─── EMAIL NOTIFICATION ───────────────────────────────────────────────────────
function sendEmailNotification(data, formType) {
  const subject = getEmailSubject(formType, data);
  const body = getEmailBody(formType, data);

  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: subject,
    body: body,
  });
}

function getEmailSubject(formType, data) {
  const name = data.name || 'Unknown';
  if (formType === 'contact') return `[LumaShift] New Contact Form: ${name}`;
  if (formType === 'resource_unlock') return `[LumaShift] Resource Unlock Request: ${name}`;
  if (formType === 'quiz_result') return `[LumaShift] Quiz Completed: ${name}`;
  return `[LumaShift] New Form Submission: ${name}`;
}

function getEmailBody(formType, data) {
  const ts = data.timestamp ? new Date(data.timestamp).toLocaleString('en-MY') : 'N/A';

  if (formType === 'contact') {
    return [
      'NEW CONTACT FORM SUBMISSION',
      '─────────────────────────────',
      `Time:    ${ts}`,
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone || 'Not provided'}`,
      '',
      'Message:',
      data.message || '(empty)',
      '',
      '─────────────────────────────',
      'Reply directly to this email or reach out at lumashift@outlook.com',
    ].join('\n');
  }

  if (formType === 'resource_unlock') {
    return [
      'NEW RESOURCE UNLOCK REQUEST',
      '─────────────────────────────',
      `Time:         ${ts}`,
      `Name:         ${data.name}`,
      `Email:        ${data.email}`,
      `Career Goal:  ${data.careerGoal || 'Not specified'}`,
      '',
      '─────────────────────────────',
      'This person requested access to premium resources.',
      'Consider sending a follow-up email with the resource + a coaching offer.',
    ].join('\n');
  }

  if (formType === 'quiz_result') {
    return [
      'NEW QUIZ COMPLETION',
      '─────────────────────────────',
      `Time:               ${ts}`,
      `Name:               ${data.name}`,
      `Email:              ${data.email}`,
      `Experience:         ${data.experienceLevel || 'N/A'}`,
      `Confidence Score:   ${data.confidenceScore ?? 'N/A'} / 5`,
      `Roles Interest:     ${Array.isArray(data.roles) ? data.roles.join(', ') : (data.roles || 'N/A')}`,
      `Blockers:           ${Array.isArray(data.blockers) ? data.blockers.join(', ') : (data.blockers || 'N/A')}`,
      `Recommended:        ${Array.isArray(data.recommendedServices) ? data.recommendedServices.join(', ') : 'N/A'}`,
      '',
      '─────────────────────────────',
      'Consider a personalised follow-up email based on their confidence score and blockers.',
    ].join('\n');
  }

  return `New ${formType} form submission from ${data.name} (${data.email}) at ${ts}.`;
}

// ─── TEST FUNCTION (run manually to verify setup) ─────────────────────────────
function testSetup() {
  const testData = {
    formType: 'contact',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+60123456789',
    message: 'This is a test submission from the LumaShift setup test.',
    timestamp: new Date().toISOString(),
    source: 'Test',
  };

  logToSheet(testData, 'contact');
  sendEmailNotification(testData, 'contact');
  Logger.log('Test completed successfully.');
}
