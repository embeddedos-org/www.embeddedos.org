/**
 * Email utility for EmbeddedOS Research Foundation
 * Uses SMTP credentials from environment variables.
 * Falls back gracefully if SMTP is not configured.
 */
import nodemailer from "nodemailer";

// ── SMTP config ───────────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SMTP_HOST ?? "mail.embeddedos.org";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER ?? "careers@embeddedos.org";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = `EmbeddedOS Careers <${SMTP_USER}>`;

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

export interface ApplicationEmailData {
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  roleCategory: string;
  employmentType: string;
  workAuthorization: string;
  statement: string;
  availability?: string;
  heardFrom?: string;
}

/**
 * Send application notification to careers@embeddedos.org
 * and a confirmation email to the applicant.
 */
export async function sendApplicationEmails(
  data: ApplicationEmailData
): Promise<void> {
  if (!SMTP_PASS) {
    console.warn("[Email] SMTP_PASS not configured — skipping email send");
    return;
  }

  const transporter = createTransporter();

  // ── 1. Notification to careers team ────────────────────────────────────────
  const staffHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0B1D3A;color:#E2E8F0;margin:0;padding:0}
.wrapper{max-width:680px;margin:0 auto;background:#0F2545;border-radius:12px;overflow:hidden}
.header{background:linear-gradient(135deg,#1A3A6B 0%,#0B1D3A 100%);padding:32px 40px;border-bottom:2px solid #F97316}
.header h1{margin:0;font-size:22px;color:#F97316;font-weight:700}
.header p{margin:6px 0 0;color:#94A3B8;font-size:14px}
.body{padding:32px 40px}
.label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748B;margin-bottom:4px}
.value{font-size:15px;color:#E2E8F0;margin-bottom:18px}
.value a{color:#60A5FA;text-decoration:none}
.section{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#F97316;border-bottom:1px solid #1E3A5F;padding-bottom:8px;margin:28px 0 16px}
.statement{background:#0B1D3A;border-left:3px solid #F97316;padding:16px 20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.7;color:#CBD5E1;white-space:pre-wrap}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;background:#1E3A5F;color:#60A5FA}
.divider{border:none;border-top:1px solid #1E3A5F;margin:24px 0}
.footer{background:#0B1D3A;padding:20px 40px;text-align:center;font-size:12px;color:#475569}
.footer a{color:#60A5FA;text-decoration:none}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>📋 New Job Application Received</h1>
    <p>EmbeddedOS Research Foundation — Careers Team</p>
  </div>
  <div class="body">
    <div class="label">Applicant Name</div>
    <div class="value" style="font-size:18px;font-weight:700;color:#F1F5F9">${data.fullName}</div>
    <div class="label">Email Address</div>
    <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
    ${data.phone ? `<div class="label">Phone</div><div class="value">${data.phone}</div>` : ""}
    <hr class="divider">
    <div class="section">Position Details</div>
    <div class="label">Role Category</div>
    <div class="value"><span class="badge">${data.roleCategory}</span></div>
    <div class="label">Employment Type</div>
    <div class="value"><span class="badge">${data.employmentType}</span></div>
    <div class="label">Work Authorization</div>
    <div class="value"><span class="badge">${data.workAuthorization}</span></div>
    ${data.availability ? `<div class="label">Availability</div><div class="value">${data.availability}</div>` : ""}
    <hr class="divider">
    <div class="section">Professional Links</div>
    <div class="label">LinkedIn</div>
    <div class="value">${data.linkedin ? `<a href="${data.linkedin}">${data.linkedin}</a>` : '<span style="color:#475569">Not provided</span>'}</div>
    <div class="label">GitHub</div>
    <div class="value">${data.github ? `<a href="${data.github}">${data.github}</a>` : '<span style="color:#475569">Not provided</span>'}</div>
    ${data.portfolio ? `<div class="label">Portfolio</div><div class="value"><a href="${data.portfolio}">${data.portfolio}</a></div>` : ""}
    <hr class="divider">
    <div class="section">Statement of Interest</div>
    <div class="statement">${data.statement.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    ${data.heardFrom ? `<div class="label" style="margin-top:20px">How They Heard About Us</div><div class="value">${data.heardFrom}</div>` : ""}
    <hr class="divider">
    <div style="font-size:12px;color:#475569">Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "full", timeStyle: "short" })} ET</div>
  </div>
  <div class="footer">
    <p>EmbeddedOS Research Foundation · <a href="https://www.embeddedos.org">www.embeddedos.org</a></p>
    <p>Reply directly to this email to respond to the applicant.</p>
  </div>
</div>
</body></html>`;

  // ── 2. Confirmation email to applicant ──────────────────────────────────────
  const applicantHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0B1D3A;color:#E2E8F0;margin:0;padding:0}
.wrapper{max-width:640px;margin:0 auto;background:#0F2545;border-radius:12px;overflow:hidden}
.header{background:linear-gradient(135deg,#1A3A6B 0%,#0B1D3A 100%);padding:40px;text-align:center;border-bottom:2px solid #F97316}
.header h1{margin:0 0 8px;font-size:24px;color:#F1F5F9}
.header p{margin:0;color:#94A3B8;font-size:15px}
.body{padding:36px 40px}
.body p{font-size:15px;line-height:1.7;color:#CBD5E1;margin:0 0 16px}
.box{background:#0B1D3A;border:1px solid #1E3A5F;border-radius:10px;padding:20px 24px;margin:24px 0}
.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1E3A5F;font-size:14px}
.row:last-child{border-bottom:none}
.rl{color:#64748B;font-weight:600}
.rv{color:#E2E8F0;text-align:right}
.cta{text-align:center;margin:28px 0}
.cta a{background:#F97316;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block}
.footer{background:#0B1D3A;padding:20px 40px;text-align:center;font-size:12px;color:#475569}
.footer a{color:#60A5FA;text-decoration:none}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>✅ Application Received!</h1>
    <p>EmbeddedOS Research Foundation</p>
  </div>
  <div class="body">
    <p>Dear <strong style="color:#F1F5F9">${data.fullName}</strong>,</p>
    <p>Thank you for applying to the <strong style="color:#F97316">EmbeddedOS Research Foundation</strong>. We have received your application and our team will review it carefully.</p>
    <p>Here is a summary of what you submitted:</p>
    <div class="box">
      <div class="row"><span class="rl">Role Category</span><span class="rv">${data.roleCategory}</span></div>
      <div class="row"><span class="rl">Employment Type</span><span class="rv">${data.employmentType}</span></div>
      <div class="row"><span class="rl">Work Authorization</span><span class="rv">${data.workAuthorization}</span></div>
      ${data.availability ? `<div class="row"><span class="rl">Availability</span><span class="rv">${data.availability}</span></div>` : ""}
    </div>
    <p>Our team typically responds within <strong style="color:#F1F5F9">5–10 business days</strong>. If you have any questions, please reply to this email or reach us at <a href="mailto:careers@embeddedos.org" style="color:#60A5FA">careers@embeddedos.org</a>.</p>
    <p>We look forward to learning more about you and your interest in open-source embedded systems.</p>
    <div class="cta"><a href="https://www.embeddedos.org/careers">View Open Positions</a></div>
    <p style="color:#64748B;font-size:13px">Best regards,<br><strong style="color:#94A3B8">EmbeddedOS Careers Team</strong><br>EmbeddedOS Research Foundation</p>
  </div>
  <div class="footer">
    <p>EmbeddedOS Research Foundation · <a href="https://www.embeddedos.org">www.embeddedos.org</a></p>
    <p>Questions? Email <a href="mailto:careers@embeddedos.org">careers@embeddedos.org</a></p>
  </div>
</div>
</body></html>`;

  // Send both emails concurrently
  await Promise.all([
    transporter.sendMail({
      from: SMTP_FROM,
      to: "careers@embeddedos.org",
      replyTo: data.email,
      subject: `[Application] ${data.fullName} — ${data.roleCategory} (${data.employmentType})`,
      html: staffHtml,
      text: `New application from ${data.fullName} <${data.email}>\nRole: ${data.roleCategory}\nType: ${data.employmentType}\nAuth: ${data.workAuthorization}\n\nStatement:\n${data.statement}`,
    }),
    transporter.sendMail({
      from: SMTP_FROM,
      to: data.email,
      subject: `Application Received — EmbeddedOS Research Foundation`,
      html: applicantHtml,
      text: `Dear ${data.fullName},\n\nThank you for applying to the EmbeddedOS Research Foundation. We have received your application for ${data.roleCategory} (${data.employmentType}) and will review it within 5–10 business days.\n\nBest regards,\nEmbeddedOS Careers Team\ncareers@embeddedos.org`,
    }),
  ]);

  console.log(
    `[Email] ✓ Application emails sent for ${data.fullName} <${data.email}>`
  );
}
